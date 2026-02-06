async function test() {
  try {
    const prompt = encodeURIComponent(
      "A beautiful high-resolution photo of a woman in a black silk dress, studio lighting.",
    );
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&model=flux&seed=42`;

    const response = await fetch(url);
    console.log("Response Code:", response.status);
    console.log("Image URL:", url);
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
