import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = "re_dL6gJdNA_CqME8XWyKUSCXKc4c223uZ8u";
const ADMIN_EMAIL = "maxinf@gmail.com";

serve(async (req) => {
  try {
    const payload = await req.json();
    const email = payload.record?.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "No email found in payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Enviar correo de bienvenida y descuento al suscriptor
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Azurita Play <onboarding@resend.dev>", // Nota: Utiliza el dominio verificado si ya configuraste uno en Resend
        to: email,
        subject: "¡Te damos la bienvenida a la familia Azurita Play! 🧸",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>¡Te damos la bienvenida a Azurita Play!</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F5EFEB; margin: 0; padding: 40px; color: #2A363E;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);">
              <!-- Encabezado con Fondo Azul -->
              <tr>
                <td style="background-color: #004B87; padding: 40px; text-align: center;">
                  <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">AZURITA PLAY</h1>
                  <p style="color: #EAF1EC; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Montessori Hecho en México</p>
                </td>
              </tr>
              <!-- Contenido Principal -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #004B87; margin-top: 0; font-size: 22px;">¡Gracias por unirte a nuestra lista de espera!</h2>
                  <p style="line-height: 1.6; font-size: 16px; color: #2A363E; margin-bottom: 30px;">
                    Estamos muy emocionados de tenerte con nosotros. En Azurita Play creamos juguetes de madera premium diseñados bajo la filosofía Montessori para nutrir el neurodesarrollo y conectar a las familias con sus raíces.
                  </p>
                  
                  <!-- Tarjeta de Descuento Terracota -->
                  <div style="background-color: #F9ECE8; border-radius: 12px; border: 2px dashed #C85A32; padding: 30px; text-align: center; margin-bottom: 30px;">
                    <p style="color: #C85A32; margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px;">Tu Cupón Exclusivo de 15%</p>
                    <h3 style="color: #C85A32; font-size: 36px; margin: 0; font-family: 'Courier New', Courier, monospace; font-weight: bold; letter-spacing: 3px;">AZURITAPLAY15</h3>
                    <p style="color: #5C6E79; margin: 10px 0 0 0; font-size: 12px;">Úsalo al finalizar tu primera compra una vez abramos nuestra tienda.</p>
                  </div>
                  
                  <p style="line-height: 1.6; font-size: 15px; color: #5C6E79; margin-bottom: 0;">
                    Te enviaremos un correo electrónico prioritario tan pronto como nuestras primeras cajas de juguetes Montessori estén disponibles para su envío a todo México.
                  </p>
                </td>
              </tr>
              <!-- Pie de página -->
              <tr>
                <td style="background-color: #F5EFEB; padding: 24px; text-align: center; border-top: 1px solid #E4DAD3;">
                  <p style="font-size: 12px; color: #5C6E79; margin: 0;">&copy; 2026 Azurita Play. Todos los derechos reservados.</p>
                  <p style="font-size: 11px; color: #8A9CA6; margin: 5px 0 0 0;">Si tienes alguna pregunta, respóndenos directamente a este correo.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      })
    });

    // 2. Enviar notificación al administrador (dueño)
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Alertas Azurita Play <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: "🔔 Nuevo registro en la lista de espera - Azurita Play",
        html: `
          <div style="font-family: sans-serif; padding: 24px; background-color: #F5EFEB; color: #2A363E; border-radius: 12px;">
            <h2 style="color: #004B87; margin-top: 0;">¡Nuevo registro recibido!</h2>
            <p>Se ha suscrito una nueva persona a la lista de espera de <strong>Azurita Play</strong>:</p>
            <table cellpadding="6" cellspacing="0" border="0" style="margin-top: 16px;">
              <tr>
                <td><strong>Correo Electrónico:</strong></td>
                <td><a href="mailto:${email}" style="color: #C85A32; font-weight: bold;">${email}</a></td>
              </tr>
              <tr>
                <td><strong>Fecha y Hora:</strong></td>
                <td>${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })} (Hora del Centro)</td>
              </tr>
            </table>
          </div>
        `
      })
    });

    const customerData = await customerEmailRes.json();
    const adminData = await adminEmailRes.json();

    return new Response(JSON.stringify({ customer: customerData, admin: adminData }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
