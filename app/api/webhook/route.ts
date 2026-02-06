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

        // 1. Enviar email de boas-vindas (imediato)
        await sendWelcomeEmail(
          email,
          name || "Cliente",
          parseInt(photos || "3"),
        );

        // 2. Registrar no Supabase inicialmente
        let orderId;
        try {
          const { data: order, error: insertError } = await supabaseAdmin
            .from("orders")
            .insert([
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
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          orderId = order.id;
        } catch (dbError) {
          console.error("Error logging to Supabase:", dbError);
        }

        // 3. Processar Imagem com AI em background
        // Nota: Idealmente isso seria uma Edge Function ou Queue,
        // mas para este MVP faremos aqui mesmo ou via fetch interno.
        if (imageUrl && orderId) {
          try {
            console.log("Starting AI processing for order:", orderId);

            // Simular processamento (ou chamar Gemini)
            // Para produção, isso deveria ser assíncrono para o MP não dar timeout
            const { processImageWithAI } = await import("@/lib/gemini");
            const { sendResultEmail } = await import("@/lib/mail");

            // Transformar a imagem (passando a URL para o Gemini se ele suportar,
            // ou baixando e passando base64)
            const resultImageUrl = await processImageWithAI(imageUrl);

            // Atualizar pedido com o resultado
            await supabaseAdmin
              .from("orders")
              .update({
                result_url: resultImageUrl,
                status: "completed",
              })
              .eq("id", orderId);

            // Enviar email com o resultado
            await sendResultEmail(email, name || "Cliente", resultImageUrl);

            console.log(`AI processing completed for ${email}`);
          } catch (aiError) {
            console.error("Error in AI processing:", aiError);
          }
        }

        console.log(`Payment processed for ${email}`);
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
