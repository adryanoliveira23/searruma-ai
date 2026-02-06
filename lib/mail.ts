import nodemailer from "nodemailer";

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendWelcomeEmail(
  email: string,
  name: string,
  photos: number,
) {
  const mailOptions = {
    from: `"SeArrumaAI" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "🎉 Bem-vindo ao SeArrumaAI!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .credits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .credits-number { font-size: 48px; font-weight: bold; color: #6366f1; }
        </style>
      </head>
      <body>
        <div class="header"><h1>✨ Bem-vindo ao SeArrumaAI!</h1></div>
        <div class="content">
          <p>Olá <strong>${name}</strong>,</p>
          <p>Obrigado por escolher o SeArrumaAI! Estamos muito felizes em tê-lo conosco. 🎉</p>
          <div class="credits">
            <div class="credits-number">${photos}</div>
            <p><strong>${photos === 1 ? "crédito disponível" : "créditos disponíveis"}</strong></p>
          </div>
          <p>Você já pode começar a criar suas fotos incríveis com qualidade de estúdio!</p>
          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard" class="button">Acessar Dashboard 🚀</a>
          </center>
          <p>Abraços,<br><strong>Equipe SeArrumaAI</strong></p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await gmailTransporter.sendMail(mailOptions);
    console.log(
      `✅ Welcome email sent to ${email}. MessageId: ${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return false;
  }
}

export async function sendResultEmail(
  email: string,
  name: string,
  imageUrl: string,
) {
  const mailOptions = {
    from: `"SeArrumaAI" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "🎉 Sua Foto Está Pronta!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .image-container { text-align: center; margin: 30px 0; }
          .image-container img { max-width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header"><h1>🎉 Sua Foto Está Pronta!</h1></div>
        <div class="content">
          <p>Olá <strong>${name}</strong>,</p>
          <p>Sua foto foi processada com sucesso! Confira o resultado incrível:</p>
          <div class="image-container"><img src="${imageUrl}" alt="Sua foto processada"></div>
          <center>
            <a href="${imageUrl}" class="button" download>Baixar Foto em Alta Resolução 📥</a>
          </center>
          <p>Abraços,<br><strong>Equipe SeArrumaAI</strong></p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await gmailTransporter.sendMail(mailOptions);
    console.log(
      `✅ Result email sent to ${email}. MessageId: ${info.messageId}`,
    );
    return true;
  } catch (error) {
    console.error("❌ Error sending result email:", error);
    return false;
  }
}
