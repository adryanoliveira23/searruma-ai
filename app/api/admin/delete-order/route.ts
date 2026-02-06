import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { orderId, orderIds } = await req.json();

    if (
      !orderId &&
      (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0)
    ) {
      return NextResponse.json(
        { success: false, error: "ID(s) do pedido não fornecido(s)" },
        { status: 400 },
      );
    }

    let error;

    if (orderIds && orderIds.length > 0) {
      // Bulk delete
      const result = await supabaseAdmin
        .from("orders")
        .delete()
        .in("id", orderIds);
      error = result.error;
    } else {
      // Single delete
      const result = await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", orderId);
      error = result.error;
    }

    if (error) {
      console.error("Error deleting order(s):", error);
      return NextResponse.json(
        { success: false, error: "Erro ao excluir pedido(s)." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pedido(s) excluído(s) com sucesso",
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
