import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { internalNotificationHtml, clientConfirmationHtml } from "@/lib/email-templates";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  const { name, email, phone, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const supabaseAdmin = createAdminClient();

  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("name, resend_api_key, contact_email, whatsapp")
    .eq("id", tenantId)
    .single();

  await supabaseAdmin.from("contact_messages").insert({
    tenant_id: tenantId,
    name,
    email,
    phone: phone || null,
    message,
    source: "contact_form",
  });

  if (!tenant?.resend_api_key || !tenant?.contact_email) {
    console.warn(`Resend no configurado para tenant ${tenantId}`);
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(tenant.resend_api_key);
  const contactEmail = tenant.contact_email as string;
  const from = `${tenant.name} <${contactEmail}>`;

  const tenantName = tenant.name as string;

  // Email a la inmobiliaria con los datos de la consulta
  const { error } = await resend.emails.send({
    from,
    to: [contactEmail],
    replyTo: email,
    subject: `Nueva consulta de ${name}`,
    html: internalNotificationHtml({
      tenantName,
      contactEmail,
      clientName: name,
      clientEmail: email,
      clientPhone: phone || undefined,
      message,
    }),
  });

  if (error) {
    console.error("[contact] Resend error (internal):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Email de confirmación al cliente
  const { error: confirmError } = await resend.emails.send({
    from,
    to: [email],
    subject: `Recibimos tu consulta — ${tenantName}`,
    html: clientConfirmationHtml({
      tenantName,
      contactEmail,
      clientName: name,
      message,
      whatsappUrl: getWhatsAppUrl(tenant.whatsapp ?? ""),
    }),
  });

  if (confirmError) {
    console.error("[contact] Resend error (confirmation):", confirmError);
    return NextResponse.json({ error: confirmError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
