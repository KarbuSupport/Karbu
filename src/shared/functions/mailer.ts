"use server";

import nodemailer from "nodemailer";

export async function sendMailAction(formData: {
    name: string;
    email: string;
    phone: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: string;
    serviceType: string;
    description: string;
}) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: Number(process.env.MAILER_PORT),
        secure: process.env.MAILER_SECURE === "true", // SSL,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
        },
    });

// 1️⃣ Correo interno para monitoreo
await transporter.sendMail({
  from: `"Karbu.com.mx" <${process.env.MAILER_MAIL_FROM}>`,
  to: `${process.env.MAILER_MAIL_FROM}`,
  subject: "Nueva Solicitud de Cotización",
  text: `
Nueva solicitud de cotización recibida:

Nombre: ${formData.name}
Email: ${formData.email}
Teléfono: ${formData.phone}
Marca: ${formData.vehicleBrand}
Modelo: ${formData.vehicleModel}
Año: ${formData.vehicleYear}
Servicio: ${formData.serviceType}
Descripción: ${formData.description}

Responder al cliente: ${formData.email}

-- 
Karbu.com.mx
Tu mecánico de confianza
ventas@karbu.com.mx
  `,
  html: `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f4;padding:24px 0;">
  <tr>
    <td align="center">
      <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;font-family:'Soberana Sans', 'Swis721 LtCn BT', Arial, sans-serif;">
        <!-- Header -->
        <tr>
          <td style="padding:18px 24px;border-bottom:2px solid #DE1F26;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left">
                  <img src="cid:logoKarbu" alt="Karbu.com.mx"  style="width:90px;display:block;margin:0;border:0;outline:none;text-decoration:none;" />
                </td>
                <td align="right" style="color:#DE1F26;font-weight:700;font-size:13px;text-transform:uppercase;">
                  Monitoreo interno
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:20px 24px 6px 24px;color:#434A4D;">
            <h2 style="margin:0 0 8px 0;font-size:20px;color:#DE1F26;">Nueva Solicitud de Cotización</h2>
            <p style="margin:0;font-size:14px;line-height:1.5;">
              Se ha recibido una nueva solicitud de cotización desde el sitio web. A continuación se muestran los datos del cliente:
            </p>
          </td>
        </tr>

        <!-- Datos -->
        <tr>
          <td style="padding:12px 24px 20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efefef;border-radius:6px;">
              <tr><td style="padding:14px;">
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#434A4D;">
                  <tr><td style="width:150px;font-weight:600;color:#DE1F26;">Nombre</td><td>${formData.name}</td></tr>
                  <tr style="background:#fafafa;"><td style="font-weight:600;color:#DE1F26;">Email</td><td><a href="mailto:${formData.email}" style="color:#434A4D;text-decoration:none;">${formData.email}</a></td></tr>
                  <tr><td style="font-weight:600;color:#DE1F26;">Teléfono</td><td>${formData.phone}</td></tr>
                  <tr style="background:#fafafa;"><td style="font-weight:600;color:#DE1F26;">Marca</td><td>${formData.vehicleBrand}</td></tr>
                  <tr><td style="font-weight:600;color:#DE1F26;">Modelo</td><td>${formData.vehicleModel}</td></tr>
                  <tr style="background:#fafafa;"><td style="font-weight:600;color:#DE1F26;">Año</td><td>${formData.vehicleYear}</td></tr>
                  <tr><td style="font-weight:600;color:#DE1F26;">Servicio</td><td>${formData.serviceType}</td></tr>
                  <tr style="background:#fafafa;"><td style="font-weight:600;color:#DE1F26;vertical-align:top;">Descripción</td><td style="white-space:pre-wrap;">${formData.description}</td></tr>
                </table>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Acciones -->
        <tr>
          <td style="padding:0 24px 18px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left" style="padding-top:8px;">
                  <a href="mailto:${formData.email}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#DE1F26;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
                    Responder al cliente
                  </a>
                </td>
                <td align="right" style="font-size:12px;color:#777;">
                  <em>Correo interno de monitoreo - No reenviar</em>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:18px 24px;background:#f7f7f7;border-top:1px solid #eee;color:#666;font-size:12px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left">
                  Karbu.com.mx · ventas@karbu.com.mx<br/>
                  Av. (dirección) · Guadalajara, Jalisco
                </td>
                <td align="right" style="color:#434A4D;font-weight:600;">
                  <span style="font-size:13px;color:#DE1F26;">Karbu.com.mx</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `,
  attachments: [
    {
      filename: "logo-karbu.png",
      path: "/karbu-logo.png", // ruta dentro de tu proyecto
      cid: "logoKarbu", // este ID se usa dentro del HTML
    },
  ],
});

// 2️⃣ Correo para el cliente
await transporter.sendMail({
  from: `"Karbu.com.mx" <${process.env.MAILER_MAIL_FROM}>`,
  to: formData.email,
  subject: "Hemos recibido tu solicitud de cotización",
  text: `
Hola ${formData.name},

Recibimos tu solicitud de cotización y pronto nos pondremos en contacto contigo.

Resumen de tu solicitud:
Teléfono: ${formData.phone}
Marca: ${formData.vehicleBrand}
Modelo: ${formData.vehicleModel}
Año: ${formData.vehicleYear}
Servicio: ${formData.serviceType}
Descripción: ${formData.description}

¡Gracias por confiar en Karbu.com.mx!

--
Karbu.com.mx
Tu mecánico de confianza
ventas@karbu.com.mx
  `,
  html: `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f5f5;padding:24px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;font-family:'Soberana Sans', 'Swis721 LtCn BT', Arial, sans-serif;">
        <!-- Header -->
        <tr>
          <td style="padding:18px 24px;border-bottom:1px solid #eee;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left">
                  <img src="cid:logoKarbu" alt="Karbu.com.mx"  style="width:90px;display:block;margin:0;border:0;outline:none;text-decoration:none;" />
                </td>
                <td align="right" style="color:#434A4D;font-size:13px;">
                  <strong style="color:#DE1F26;">Karbu.com.mx</strong><br/>
                  TU MECÁNICO DE CONFIANZA
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cuerpo -->
        <tr>
          <td style="padding:20px 24px;color:#434A4D;">
            <h2 style="margin:0 0 8px 0;font-size:20px;color:#DE1F26;">¡Hola ${formData.name}!</h2>
            <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">
              Hemos recibido tu solicitud de cotización y pronto uno de nuestros asesores se pondrá en contacto contigo.
            </p>
            <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;">
              Aquí tienes un resumen de los datos que nos compartiste:
            </p>
          </td>
        </tr>

        <!-- Resumen -->
        <tr>
          <td style="padding:0 24px 20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efefef;border-radius:6px;">
              <tr><td style="padding:14px;">
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#434A4D;">
                  <tr><td style="width:140px;font-weight:600;color:#DE1F26;">Teléfono</td><td>${formData.phone}</td></tr>
                  <tr style="background:#fafafa;"><td style="font-weight:600;color:#DE1F26;">Marca</td><td>${formData.vehicleBrand}</td></tr>
                  <tr><td style="font-weight:600;color:#DE1F26;">Modelo</td><td>${formData.vehicleModel}</td></tr>
                  <tr style="background:#fafafa;"><td style="font-weight:600;color:#DE1F26;">Año</td><td>${formData.vehicleYear}</td></tr>
                  <tr><td style="font-weight:600;color:#DE1F26;">Servicio</td><td>${formData.serviceType}</td></tr>
                  <tr style="background:#fafafa;"><td style="font-weight:600;color:#DE1F26;vertical-align:top;">Descripción</td><td style="white-space:pre-wrap;">${formData.description}</td></tr>
                </table>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Mensaje de agradecimiento -->
        <tr>
          <td style="padding:0 24px 20px 24px;">
            <p style="margin:0;font-size:14px;line-height:1.6;">
              ¡Gracias por confiar en <strong style="color:#DE1F26;">Karbu.com.mx</strong>! Estamos comprometidos con ofrecerte el mejor servicio automotriz.
            </p>
            <p style="margin:8px 0 0 0;font-size:14px;line-height:1.6;">
              Si deseas modificar o agregar información a tu solicitud, puedes responder directamente a este correo.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:18px 24px;background:#f7f7f7;border-top:1px solid #eee;color:#666;font-size:12px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left">
                  Karbu.com.mx · ventas@karbu.com.mx<br/>
                  Av. (dirección) · Guadalajara, Jalisco
                </td>
                <td align="right" style="color:#434A4D;font-weight:600;">
                  <span style="font-size:13px;color:#DE1F26;">Karbu.com.mx</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `,
  attachments: [
    {
      filename: "logo-karbu.png",
      path: "/karbu-logo.png", // ruta dentro de tu proyecto
      cid: "logoKarbu", // este ID se usa dentro del HTML
    },
  ],
});


    // console.log("Correos enviados ✅");
    return true;
}
