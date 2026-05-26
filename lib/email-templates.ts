const NAVY = "#1C3557";
const GOLD = "#B8966E";
const CREAM = "#F8F5F0";
const DARK = "#0f2236";

function emailWrapper(content: string, tenantName: string, contactEmail: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${tenantName}</title>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

        <!-- HEADER -->
        <tr>
          <td align="center" style="background-color:${NAVY};padding:32px 48px;border-radius:4px 4px 0 0;">
            <p style="margin:0;font-size:11px;font-weight:700;color:${GOLD};letter-spacing:0.25em;text-transform:uppercase;">${tenantName}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:14px auto 0;">
              <tr><td width="40" height="2" style="background-color:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        ${content}

        <!-- FOOTER -->
        <tr>
          <td align="center" style="background-color:#ede8e1;padding:20px 48px;border-top:1px solid #ddd4c8;border-radius:0 0 4px 4px;">
            <p style="margin:0 0 3px;font-size:12px;font-weight:600;color:${NAVY};">${tenantName}</p>
            <p style="margin:0;font-size:11px;color:#8a7f74;">
              <a href="mailto:${contactEmail}" style="color:#8a7f74;text-decoration:none;">${contactEmail}</a>
              &nbsp;&middot;&nbsp;Baradero, Buenos Aires
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function internalNotificationHtml({
  tenantName,
  contactEmail,
  clientName,
  clientEmail,
  clientPhone,
  message,
}: {
  tenantName: string;
  contactEmail: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  message: string;
}): string {
  const phoneRow = clientPhone
    ? `<tr>
        <td width="90" valign="top" style="padding:11px 0;font-size:11px;font-weight:700;color:#8a7f74;letter-spacing:0.08em;text-transform:uppercase;">Teléfono</td>
        <td valign="top" style="padding:11px 0;font-size:14px;color:${DARK};">${clientPhone}</td>
       </tr>`
    : "";

  const body = `
  <tr>
    <td style="background-color:#ffffff;padding:36px 48px;">

      <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:${GOLD};letter-spacing:0.2em;text-transform:uppercase;">Nueva consulta</p>
      <h1 style="margin:0 0 24px;font-size:21px;font-weight:700;color:${NAVY};line-height:1.35;">Recibiste un mensaje<br/>desde tu sitio web.</h1>

      <!-- Datos del contacto -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #ede8e1;margin-bottom:24px;">
        <tr>
          <td width="90" valign="top" style="padding:11px 0;border-bottom:1px solid #ede8e1;font-size:11px;font-weight:700;color:#8a7f74;letter-spacing:0.08em;text-transform:uppercase;">Nombre</td>
          <td valign="top" style="padding:11px 0;border-bottom:1px solid #ede8e1;font-size:14px;color:${DARK};">${clientName}</td>
        </tr>
        <tr>
          <td width="90" valign="top" style="padding:11px 0;${clientPhone ? "border-bottom:1px solid #ede8e1;" : ""}font-size:11px;font-weight:700;color:#8a7f74;letter-spacing:0.08em;text-transform:uppercase;">Email</td>
          <td valign="top" style="padding:11px 0;${clientPhone ? "border-bottom:1px solid #ede8e1;" : ""}font-size:14px;"><a href="mailto:${clientEmail}" style="color:${GOLD};text-decoration:none;">${clientEmail}</a></td>
        </tr>
        ${phoneRow}
      </table>

      <!-- Mensaje -->
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:${GOLD};letter-spacing:0.2em;text-transform:uppercase;">Mensaje</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td width="3" style="background-color:${GOLD};font-size:0;line-height:0;">&nbsp;</td>
          <td style="background-color:${CREAM};padding:14px 18px;font-size:14px;color:#4a4035;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</td>
        </tr>
      </table>

      <!-- CTA -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:${NAVY};border-radius:3px;">
            <a href="mailto:${clientEmail}" style="display:inline-block;padding:11px 26px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.05em;">Responder a ${clientName}</a>
          </td>
        </tr>
      </table>

    </td>
  </tr>`;

  return emailWrapper(body, tenantName, contactEmail);
}

export function clientConfirmationHtml({
  tenantName,
  contactEmail,
  clientName,
  message,
  whatsappUrl,
}: {
  tenantName: string;
  contactEmail: string;
  clientName: string;
  message: string;
  whatsappUrl?: string;
}): string {
  const body = `
  <tr>
    <td style="background-color:#ffffff;padding:36px 48px;">

      <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:${GOLD};letter-spacing:0.2em;text-transform:uppercase;">Consulta recibida</p>
      <h1 style="margin:0 0 14px;font-size:21px;font-weight:700;color:${NAVY};line-height:1.35;">&#161;Hola, ${clientName}!</h1>
      <p style="margin:0 0 24px;font-size:14px;color:#6b6055;line-height:1.7;">Recibimos tu consulta y te responderemos a la brevedad.<br/>Este es el resumen de tu mensaje:</p>

      <!-- Mensaje -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td width="3" style="background-color:${GOLD};font-size:0;line-height:0;">&nbsp;</td>
          <td style="background-color:${CREAM};padding:14px 18px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#8a7f74;letter-spacing:0.12em;text-transform:uppercase;">Tu mensaje</p>
            <p style="margin:0;font-size:14px;color:#4a4035;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</p>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
        <tr><td height="1" style="background-color:#ede8e1;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>

      <p style="margin:0 0 14px;font-size:13px;color:#6b6055;">&#191;Neces&#237;t&#225;s una respuesta m&#225;s r&#225;pida? Escrib&#237;nos por WhatsApp.</p>

      <!-- WhatsApp CTA -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#25D366;border-radius:3px;">
            <a href="${whatsappUrl ?? ""}" style="display:inline-block;padding:11px 26px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.05em;">Abrir WhatsApp</a>
          </td>
        </tr>
      </table>

    </td>
  </tr>`;

  return emailWrapper(body, tenantName, contactEmail);
}
