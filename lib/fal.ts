export async function processImageWithFal(imageInput: string) {
  console.log("--- AI Processing Start (Fal.ai / Flux) ---");

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    throw new Error("FAL_KEY is not defined in environment variables");
  }

  const IMAGE_GENERATION_PROMPT = `Photo of a professional woman with blonde hair and some highlights, slightly to the side, wearing an elegant silk black dress, smiling while turning her head over her shoulder, holding a glass of champagne. In front of her, on a glass cake stand, is a glitter-decorated cake with white cream, shiny gold frosting with small satin bows on top, decorated with white cream balls and a gold candle. Behind her, shiny balloons in shades of metallic gold, including a transparent balloon filled with black confetti. The lighting is soft and professional, studio style, highlighting the satin texture of the dress, the reflections on the balloons, and the shiny details of the cake. Ultra-realistic, high-resolution studio photography aesthetic. Maintain facial features from the provided reference photo.`;

  try {
    // Flux Schnell is fast and high quality
    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: IMAGE_GENERATION_PROMPT,
        image_url: imageInput.startsWith("http") ? imageInput : imageInput,
        sync_mode: true,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Fal.ai API Error:", data);
      throw new Error(data.detail || data.error || "Fal.ai processing failed");
    }

    if (data.images && data.images.length > 0) {
      console.log("Fal.ai Generation Success!");
      return data.images[0].url;
    }

    throw new Error("No images returned from Fal.ai");
  } catch (error) {
    console.error("Error in Fal.ai processing:", error);
    throw error;
  }
}
