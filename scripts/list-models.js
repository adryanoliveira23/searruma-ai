import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function listModels() {
  try {
    console.log("--- Listando Modelos Disponíveis ---");
    // O SDK Node.js não tem um método listModels direto no genAI,
    // geralmente é via REST ou um helper interno.
    // Vamos tentar dar um fetch manual no endpoint de modelos.
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();

    if (data.models) {
      console.log("Modelos encontrados:");
      data.models.forEach((m) => {
        if (
          m.name.includes("imagen") ||
          m.name.includes("flash") ||
          m.supportedGenerationMethods.includes("generateContent")
        ) {
          console.log(
            `- ${m.name} (Métodos: ${m.supportedGenerationMethods.join(", ")})`,
          );
        }
      });
    } else {
      console.log(
        "Nenhum modelo listado ou erro na resposta:",
        JSON.stringify(data),
      );
    }
  } catch (error) {
    console.error("Erro ao listar modelos:", error.message);
  }
}

listModels();
