import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name, photos, price } = await req.json();

    if (!email || !name || !photos || !price) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 },
      );
    }

    // Criar preferência no Mercado Pago
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              title: `SeArrumaAI - ${photos} fotos`,
              quantity: 1,
              unit_price: Number(price),
              currency_id: "BRL",
            },
          ],
          payer: {
            email: email,
            name: name,
          },
          metadata: {
            email: email,
            name: name,
            photos: photos,
            price: price,
          },
          notification_url:
            "https://amufvgzrxeipylqmcfvx.supabase.co/functions/v1/mercadopago-webhook",
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failure`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=pending`,
          },
          auto_return: "approved",
        }),
      },
    );

    const preference = await response.json();

    if (!response.ok) {
      console.error("Mercado Pago Error:", preference);
      throw new Error(preference.message || "Erro ao criar preferência");
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: preference.init_point,
      paymentId: preference.id,
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
