import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { paymentId, receiptUrl } = await req.json();

    if (!paymentId || !receiptUrl) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        receipt_url: receiptUrl,
        // Mantemos o status como pending ou algo que indique que o comprovante foi enviado
        // O usuário quer que o admin confirme
      })
      .eq("payment_id", paymentId)
      .select()
      .single();

    if (error) {
      // Se a coluna receipt_url não existir, tentamos salvar em outro lugar ou retornamos o erro
      console.error("Error updating order with receipt:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Erro ao atualizar pedido. Verifique se a coluna 'receipt_url' existe.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error: unknown) {
    console.error("Upload receipt API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
