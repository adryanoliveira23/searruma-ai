const FAL_KEY =
  "bd5ca27e-6a4a-47a8-bd7c-ca0e32cfad6b:1c2057bf210ffa180aa4a19151e75f43";

async function test() {
  try {
    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt:
          "A beautiful high-resolution photo of a cat wearing a space suit, studio lighting.",
        sync_mode: true,
      }),
    });
    const data = await response.json();
    console.log("Response Code:", response.status);
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
