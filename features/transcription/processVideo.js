export async function processYouTubeVideo(url) {
  const res = await fetch("https://api.lumoraapi.com/transcribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  console.log("API RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.error || "Error processing video");
  }

  // ✅ YA EL BACKEND DEVUELVE TODO
  return {
    transcript: data.transcript,
    summary: data.summary,
  };
}