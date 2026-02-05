import { NextResponse } from "next/server";
import { processImageWithAI } from "@/lib/gemini";
import { sendResultEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { image, email, name } = await req.json();

    if (!image || !email) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 },
      );
    }

    // Processar imagem com AI
    const resultImageUrl = await processImageWithAI(image);

    // Enviar email com resultado
    await sendResultEmail(email, name || "Cliente", resultImageUrl);

    return NextResponse.json({
      success: true,
      resultImage: resultImageUrl,
    });
  } catch (error: any) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar imagem: " + error.message },
      { status: 500 },
    );
  }
}
