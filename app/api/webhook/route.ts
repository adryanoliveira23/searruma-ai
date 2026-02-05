import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendWelcomeEmail } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/supabase-admin";

const CAKTO_WEBHOOK_SECRET =
  process.env.CAKTO_WEBHOOK_SECRET || "7cc2963d-cf0c-45a9-a573-578fc0efac65";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-cakto-signature");
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);

    // Verificar assinatura do webhook
    const expectedSignature = crypto
      .createHmac("sha256", CAKTO_WEBHOOK_SECRET)
      .update(bodyText)
      .digest("hex");

    if (signature && signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { event, data } = body;

    console.log("Webhook received:", event);

    if (event === "payment.approved") {
      const { customer_email, customer_name, custom_fields } = data;

      // Enviar email de boas-vindas
      await sendWelcomeEmail(
        customer_email,
        customer_name,
        parseInt(custom_fields?.photos || "3"),
      );

      // Opcional: Registrar no Supabase
      try {
        await supabaseAdmin.from("orders").insert([
          {
            email: customer_email,
            name: customer_name,
            photos: parseInt(custom_fields?.photos || "3"),
            amount: custom_fields?.price || "0",
            status: "approved",
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (dbError) {
        console.error("Error logging to Supabase:", dbError);
        // Não falha o webhook se o banco falhar
      }

      console.log(`Payment approved for ${customer_email}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 },
    );
  }
}
