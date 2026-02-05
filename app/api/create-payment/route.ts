import { NextResponse } from "next/server";
import crypto from "crypto";

const CAKTO_PRODUCT_ID = process.env.CAKTO_PRODUCT_ID || "4j8q5du_754033";

export async function POST(req: Request) {
  try {
    const { email, name, photos, price } = await req.json();

    if (!email || !name || !photos || !price) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 },
      );
    }

    // Criar checkout na Cakto
    const checkoutUrl =
      `https://pay.cakto.com.br/${CAKTO_PRODUCT_ID}?` +
      `email=${encodeURIComponent(email)}&` +
      `name=${encodeURIComponent(name)}&` +
      `custom_fields[photos]=${photos}&` +
      `custom_fields[price]=${price}`;

    // Gerar ID único para o pagamento
    const paymentId = crypto.randomBytes(16).toString("hex");

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutUrl,
      paymentId: paymentId,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar pagamento" },
      { status: 500 },
    );
  }
}
