import { processImageWithFal } from "./fal";

export async function processImageWithAI(imageInput: string) {
  console.log("--- AI Processing Redirected to Fal.ai ---");

  try {
    // We now use Fal.ai (Flux) instead of Gemini
    const resultImageUrl = await processImageWithFal(imageInput);
    return resultImageUrl;
  } catch (error) {
    console.error("Redirected AI Processing failed:", error);

    // Safety fallback to placeholder if Fal.ai fails
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("Falling back to placeholder due to error:", errorMessage);

    return `https://via.placeholder.com/1024x1024/4f46e5/ffffff?text=IA+Processada+Erro+${Date.now()}`;
  }
}
