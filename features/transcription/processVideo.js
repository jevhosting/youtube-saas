export async function processYouTubeVideo(url) {
  const res = await fetch("https://157.230.60.238:3000/transcribe", {
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

  // 🔥 summary
  const summaryRes = await fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transcript: data.transcript,
    }),
  });

  const summaryData = await summaryRes.json();

  return {
    transcript: data.transcript,
    summary: summaryData.summary,
  };
}