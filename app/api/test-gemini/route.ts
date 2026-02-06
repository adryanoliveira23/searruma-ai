import { NextResponse } from "next/server";
import { processImageWithAI } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 },
    );
  }

  try {
    console.log("--- Teste de Gemini Manual ---");

    // 1. Criar um pedido "vazio" ou mock
    const paymentId = "TEST-GEMINI-" + Date.now();
    const imageUrl =
      "https://via.placeholder.com/800x800?text=Foto+Original+Teste";

    const { data: order, error: insertError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          email: email,
          name: "Cliente Teste",
          photos: 1,
          amount: "10",
          status: "approved",
          payment_id: paymentId,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    console.log("Using email for test:", email);

    // 2. Chamar o processamento
    const resultImageUrl = await processImageWithAI(imageUrl);

    // 3. Enviar email de teste
    console.log("Triggering test email to:", email);
    const { sendWelcomeEmail } = await import("@/lib/mail");
    await sendWelcomeEmail(email, "Cliente Teste", 1);

    // 4. Atualizar o pedido
    await supabaseAdmin
      .from("orders")
      .update({
        result_url: resultImageUrl,
        status: "completed",
      })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      message: "Teste concluído! Verifique o dashboard com o email: " + email,
      orderId: order.id,
      resultImage: resultImageUrl,
    });
  } catch (error: any) {
    console.error("Erro no teste:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
