import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req) {
  try {
    console.log("API KEY:", process.env.ASSEMBLY_API_KEY);

    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    const outputFile = `audio-${Date.now()}.mp3`;

    await execAsync(`yt-dlp -x --audio-format mp3 -o "${outputFile}" "${url}"`);

    console.log("Audio downloaded from yt-dlp");

    const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLY_API_KEY,
      },
      body: fs.createReadStream(outputFile),
      duplex: "half", // 👈 ESTA LÍNEA
    });

    const uploadData = await uploadRes.json();

    console.log("UPLOAD RESPONSE:", uploadData);

    // 1. Enviar URL a AssemblyAI

    function getYouTubeId(url) {
      const parsed = new URL(url);

      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }

      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.slice(1);
      }

      if (parsed.pathname.includes("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1];
      }

      return null;
    }

    const videoId = getYouTubeId(url);

    if (!videoId) {
      return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    const transcriptRes = await fetch(
      "https://api.assemblyai.com/v2/transcript",
      {
        method: "POST",
        headers: {
          authorization: process.env.ASSEMBLY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: uploadData.upload_url,
          speech_models: ["universal-2"],
        }),
      },
    );

    const transcriptData = await transcriptRes.json();

    console.log("TRANSCRIPT CREATE RESPONSE:", transcriptData);

    if (!transcriptData.id) {
      return Response.json(
        { error: transcriptData.error || "Failed to create transcript" },
        { status: 500 },
      );
    }

    const transcriptId = transcriptData.id;

    // 2. Esperar a que termine (polling simple)
    let completed = false;
    let finalData;

    while (!completed) {
      await new Promise((res) => setTimeout(res, 2000));

      const checkRes = await fetch(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: process.env.ASSEMBLY_API_KEY,
          },
        },
      );

      const checkData = await checkRes.json();

      console.log("FULL RESPONSE:", checkData);

      if (checkData.status === "completed") {
        completed = true;
        finalData = checkData;
      }

      if (checkData.status === "error") {
        throw new Error(checkData.error || "Transcription failed");
      }
    }

    return Response.json({
      transcript: finalData.text,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error processing video" }, { status: 500 });
  }
}
