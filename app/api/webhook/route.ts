import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Mercado Pago Webhook received:", body);

    // Mercado Pago envia notificações de diferentes tipos.
    // Estamos interessados em 'payment'.
    const { type, data, action } = body;

    if (
      type === "payment" &&
      (action === "payment.created" || action === "payment.updated")
    ) {
      const paymentId = data.id;

      // Buscar detalhes do pagamento no Mercado Pago para segurança
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        },
      );

      if (!mpResponse.ok) {
        console.error("Failed to fetch payment details from MP");
        return NextResponse.json(
          { error: "Failed to verify payment" },
          { status: 500 },
        );
      }

      const paymentData = await mpResponse.json();
      const { status, metadata } = paymentData;

      console.log(`Payment ${paymentId} status: ${status}`);

      if (status === "approved") {
        const { email, name, photos, price, imageUrl } = metadata;

        if (!email) {
          console.error("No email found in payment metadata");
          return NextResponse.json({ received: true });
        }

        // Enviar email de boas-vindas
        await sendWelcomeEmail(
          email,
          name || "Cliente",
          parseInt(photos || "3"),
        );

        // Registrar no Supabase
        try {
          await supabaseAdmin.from("orders").insert([
            {
              email: email,
              name: name || "Cliente",
              photos: parseInt(photos || "3"),
              amount: price || "0",
              status: "approved",
              payment_id: paymentId,
              image_url: imageUrl || null,
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (dbError) {
          console.error("Error logging to Supabase:", dbError);
        }

        console.log(`Payment approved and processed for ${email}`);
      }
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
