import { YoutubeTranscript } from "youtube-transcript";

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    // 🔥 extraer video ID
    const videoId = new URL(url).searchParams.get("v");

    if (!videoId) {
      return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // 🔥 obtener transcript
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

    const transcript = transcriptData
      .map((t) => t.text)
      .join(" ");

    return Response.json({ transcript });

  } catch (error) {
    console.error("Transcript error:", error);

    return Response.json(
      { error: "Transcript not available for this video" },
      { status: 400 }
    );
  }
}