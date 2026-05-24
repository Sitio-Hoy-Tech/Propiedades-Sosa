import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { name, email, phone, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const supabaseAdmin = createAdminClient();

  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("name, resend_api_key, contact_email")
    .eq("id", tenantId)
    .single();

  if (!tenant?.resend_api_key) {
    console.warn(`Resend no configurado para tenant ${tenantId}`);
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(tenant.resend_api_key);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    `noreply@${process.env.RESEND_FROM_DOMAIN}`;

  const internalEmail = tenant.contact_email || process.env.CONTACT_EMAIL;

  // Email a la inmobiliaria con los datos de la consulta
  if (internalEmail) {
    const { error } = await resend.emails.send({
      from: `${tenant.name} <${fromEmail}>`,
      to: [internalEmail],
      reply_to: email,
      subject: `Nueva consulta de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0a1a2e;">Nueva consulta desde el sitio web</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #d4a853;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error (internal):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Email de confirmación al cliente
  const { error: confirmError } = await resend.emails.send({
    from: `${tenant.name} <${fromEmail}>`,
    to: [email],
    subject: `Recibimos tu consulta — ${tenant.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0a1a2e;">Hola, ${name}!</h2>
        <p style="color: #555;">Recibimos tu mensaje y te responderemos a la brevedad. Este es un resumen de tu consulta:</p>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #d4a853; margin: 16px 0;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        <p style="color: #555;">También podés contactarnos directamente por WhatsApp si necesitás una respuesta más rápida.</p>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">${tenant.name}</p>
      </div>
    `,
  });

  if (confirmError) {
    console.error("[contact] Resend error (confirmation):", confirmError);
    return NextResponse.json({ error: confirmError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
