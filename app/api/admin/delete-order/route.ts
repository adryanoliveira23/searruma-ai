import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID do pedido não fornecido" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
      return NextResponse.json(
        { success: false, error: "Erro ao excluir pedido." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pedido excluído com sucesso",
    });
  } catch (error: unknown) {
    console.error("Delete order API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
