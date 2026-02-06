import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error approving order:", error);
      return NextResponse.json(
        { success: false, error: "Erro ao atualizar status do pedido." },
        { status: 500 },
      );
    }

    // Opcional: Aqui poderíamos disparar o e-mail de confirmação ou o processamento IA se desejado futuramente.
    // Por enquanto, apenas confirmamos o pagamento.

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error: unknown) {
    console.error("Approve payment API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
