import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name, whatsapp, photos, price, imageUrl } = await req.json();

    if (!email || !name || !photos || !price) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 },
      );
    }

    // Debug: log env var presence
    console.log(
      "MP_ACCESS_TOKEN prefix:",
      process.env.MP_ACCESS_TOKEN?.substring(0, 10),
    );

    // Criar pagamento PIX no Mercado Pago
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": `${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
      },
      body: JSON.stringify({
        transaction_amount: Number(price),
        description: `SeArrumaAI - ${photos} fotos`,
        payment_method_id: "pix",
        payer: {
          email: email,
          first_name: name.split(" ")[0],
          last_name: name.split(" ").slice(1).join(" ") || "Cliente",
        },
        metadata: {
          email: email,
          name: name,
          whatsapp: whatsapp || "",
          photos: photos,
          price: price,
          imageUrl: imageUrl || "",
        },
        notification_url:
          process.env.MP_PRODUCTION_WEBHOOK_URL ||
          "https://fkmjxfcbuppampdbvbuo.supabase.co/functions/v1/mercadopago-webhook",
      }),
    });

    const payment = await response.json();
    console.log("Mercado Pago Response Status:", response.status);

    if (!response.ok) {
      console.error("Mercado Pago Error Details:", payment);
      throw new Error(payment.message || "Erro ao criar pagamento");
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      pix: {
        qrcode: payment.point_of_interaction.transaction_data.qr_code,
        qrcode_base64:
          payment.point_of_interaction.transaction_data.qr_code_base64,
        ticket_url: payment.point_of_interaction.transaction_data.ticket_url,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao criar pagamento";
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
