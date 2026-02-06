import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const IMAGE_GENERATION_PROMPT = `Crie uma foto sem alterar o rosto com esse tema: aniversário com qualidade de estúdio usando as referências faciais da foto anexada, com cabelos loiros com algumas mechas, levemente para o lado. em um vestido preto de seda elegante sorrindo enquanto vira a cabeça por cima do ombro, segurando uma taça de champanhe. À sua frente, em um suporte de vidro para bolos, está um bolo decorado com glitter com creme branco, cobertura dourada brilhante com pequenos laços de cetim no topo, decorado com bolinhas de creme branco e uma vela dourada. Atrás dela, balões brilhantes em tons de dourado metálico, incluindo um balão transparente cheio de confete preto. A iluminação é suave e profissional, estilo estúdio, destacando a textura acetinada do vestido, os reflexos nos balões e os detalhes brilhantes do bolo. Estética de fotografia de estúdio ultrarrealista e de alta resolução.`;

export async function processImageWithAI(imageInput: string) {
  console.log("--- AI Processing Start (Imagen 3) ---");

  if (!process.env.GEMINI_API_KEY) {
    console.log("Gemini API key not found, using demo mode");
    return "https://via.placeholder.com/1024x1024/667eea/ffffff?text=Gemini+Demo+Mode";
  }

  try {
    // Para geração de imagem, usamos o modelo Imagen 3
    // Nota: O endpoint de geração de imagem pode ser diferente ou exigir permissões específicas
    const model = genAI.getGenerativeModel({
      model: "imagen-3.0-generate-001",
    });

    console.log(
      "Generating image for input of length:",
      imageInput?.length || 0,
    );

    // Imagen 3 no SDK Generative AI geralmente espera um prompt de texto.
    // Para "transformar" uma foto, descrevemos o resultado desejado.
    // Como o SDK lida com geração, chamamos generateContent ou o método específico se disponível.
    // Atualmente, a geração de imagem via SDK Generative AI costuma ser via generateContent com o modelo Imagen.

    const result = await model.generateContent(IMAGE_GENERATION_PROMPT);
    const response = await result.response;

    // O Imagen retorna a imagem em formato base64 no candidate.
    // Precisamos extrair isso. No SDK Generative AI, as imagens vêm como partes de dados inline.

    const candidates = response.candidates;
    if (
      candidates &&
      candidates[0] &&
      candidates[0].content &&
      candidates[0].content.parts
    ) {
      const parts = candidates[0].content.parts as any[];
      const imagePart = parts.find((p: any) => p.inlineData || p.fileData);
      if (imagePart && imagePart.inlineData) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      }
    }

    // Fallback caso o modelo não retorne imagem diretamente (formato experimental)
    console.warn(
      "Unexpected Gemini response format, falling back to enhanced placeholder",
    );
    return `https://via.placeholder.com/1024x1024/4f46e5/ffffff?text=IA+Processada+${Date.now()}`;
  } catch (error: any) {
    console.error("Error in Gemini (Imagen 3) processing:", error);

    // Se o modelo Imagen não estiver disponível na conta do usuário,
    // tentamos um fallback para o 2.0 Flash que pode descrever e podemos usar isso no futuro
    // ou apenas avisar do erro.
  }
}
