export async function POST(req) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return Response.json(
        { error: "No transcript provided" },
        { status: 400 },
      );
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
              content: `
You are a study assistant.

Transform transcripts into HIGH-QUALITY STUDY NOTES.

Rules:
- Use bullet points
- No long paragraphs
- Extract key concepts only

Structure:
- Key Concepts
- Important Facts
- Definitions
- Cause / Effect

Formatting rules:
- Use clear section titles
- Use "-" for bullet points
- Keep bullets short (1–2 lines max)
- Do not repeat information
- Do not include introductions or conclusions
`,
            },
            {
              role: "user",
              content: `
Create structured study notes from this transcript:

${transcript}
`,
            },
          ],
        }),
      },
    );

    const data = await openaiRes.json();

    const notes = data.choices?.[0]?.message?.content;

    return Response.json({ notes });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error generating notes" }, { status: 500 });
  }
}
