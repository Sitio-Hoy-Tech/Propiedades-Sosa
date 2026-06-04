import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

  const [{ data: tenant }, { data: smtpConfig }] = await Promise.all([
    supabaseAdmin
      .from("tenants")
      .select("name, smpt_user, smpt_pass, contact_email, whatsapp")
      .eq("id", tenantId)
      .single(),
    supabaseAdmin
      .from("platform_config")
      .select("host, port, ssl")
      .single(),
  ]);

  await supabaseAdmin.from("contact_messages").insert({
    tenant_id: tenantId,
    name,
    email,
    phone: phone || null,
    message,
    source: "contact_form",
  });

  if (!tenant?.smpt_user || !tenant?.smpt_pass || !tenant?.contact_email) {
    console.warn(`SMTP no configurado para tenant ${tenantId}`);
    return NextResponse.json({ ok: true });
  }

  if (!smtpConfig?.host || !smtpConfig?.port) {
    console.warn("SMTP platform_config no configurado");
    return NextResponse.json({ ok: true });
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.ssl ?? true,
    auth: {
      user: tenant.smpt_user,
      pass: tenant.smpt_pass,
    },
  });

  const contactEmail = tenant.contact_email as string;
  const tenantName = tenant.name as string;
  const from = `${tenantName} <${tenant.smpt_user}>`;

  try {
    await transporter.sendMail({
      from,
      to: contactEmail,
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
  } catch (err) {
    console.error("[contact] SMTP error (internal):", err);
    return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 });
  }

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `Recibimos tu consulta — ${tenantName}`,
      html: clientConfirmationHtml({
        tenantName,
        contactEmail,
        clientName: name,
        message,
        whatsappUrl: getWhatsAppUrl(tenant.whatsapp ?? ""),
      }),
    });
  } catch (err) {
    console.error("[contact] SMTP error (confirmation):", err);
    return NextResponse.json({ error: "Error al enviar el email de confirmación" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
