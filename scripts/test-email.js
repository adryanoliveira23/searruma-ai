import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import nodemailer from "nodemailer";

async function testEmail(targetEmail) {
  const recipient = targetEmail || process.argv[2] || process.env.GMAIL_USER;
  console.log("--- Testando Configuração de Email ---");
  console.log("Enviando de:", process.env.GMAIL_USER);
  console.log("Enviando para:", recipient);
  console.log(
    "Senha (tamanho):",
    process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0,
  );

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("ERRO: Credenciais faltando no .env.local");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    console.log(`Tentando enviar email de teste para ${recipient}...`);
    const info = await transporter.sendMail({
      from: `"Teste SeArrumaAI" <${process.env.GMAIL_USER}>`,
      to: recipient,
      subject: "🚀 Teste de Conexão de Email",
      text: `Se você recebeu este email em ${recipient}, sua configuração está funcionando corretamente!`,
      html: `<b>Se você recebeu este email em ${recipient}, sua configuração está funcionando corretamente!</b>`,
    });

    console.log("✅ SUCESSO! Email enviado:", info.messageId);
    console.log("Verifique sua caixa de entrada.");
  } catch (error) {
    console.error("❌ ERRO ao enviar email:");
    console.error(error.message);

    if (error.message.includes("Invalid login")) {
      console.error(
        "\nDICA: Esse erro geralmente significa que a senha está incorreta ou você não usou uma 'App Password'.",
      );
      console.error(
        "Siga os passos que você enviou para gerar uma nova senha de 16 caracteres.",
      );
    }
  }
}

testEmail();
