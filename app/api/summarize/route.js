export async function POST(req) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return Response.json({ error: "No transcript provided" }, { status: 400 });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an academic assistant. Summarize content clearly for students.",
          },
          {
            role: "user",
            content: `Summarize this transcript into clear study notes:\n\n${transcript}`,
          },
        ],
      }),
    });

    const data = await openaiRes.json();

    const summary = data.choices?.[0]?.message?.content;

    return Response.json({ summary });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error generating summary" }, { status: 500 });
  }
}