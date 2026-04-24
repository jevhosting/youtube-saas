export async function POST(req) {
  try {
    const { transcript } = await req.json();

    console.log("Transcript length:", transcript?.length);
    if (!transcript || transcript.length < 50) {
      return Response.json({ error: "Transcript too short" }, { status: 400 });
    }

    if (transcript.length > 15000) {
      return Response.json(
        {
          error: "Video too long. Please use videos under ~20 minutes.",
        },
        { status: 400 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

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
              content:
                "You are an expert academic assistant designed to help students deeply understand educational content. Transform transcripts into structured study material that is clear, organized, and easy to learn from. Do not just summarize — explain, structure, and teach the content",
            },
            {
              role: "user",
              content: `You are an expert academic assistant designed to help students deeply understand educational content.

Your task is to transform the following transcript into high-quality study material — not just a summary.

Requirements:

1. STRUCTURE:
- Organize the content into clear sections with meaningful titles
- Use headings when topics change
- Maintain a logical flow of ideas

2. EXPLANATION:
- Explain concepts clearly and simply, as if teaching a student
- Expand slightly when needed to improve understanding (but stay concise)
- Define important terms when they appear

3. FORMAT:
- Use section titles wrapped in ** (e.g., **Concept Explanation**)
- Use bullet points (-) for key ideas
- Use short paragraphs for explanations
- Avoid long walls of text

FORMAT RULES:
- Keep bullet lines short (max 1–2 lines)
- Do not mix bullets and paragraphs in the same idea block
- Use one paragraph BEFORE bullets when introducing a section

Balance explanation and structure:
- Use short paragraphs to explain ideas when needed
- Do NOT convert everything into bullet points
- Only use bullet points for lists or key items

PRECISION:
- Prefer quoting or paraphrasing closely from the transcript
- Do not generalize beyond what is said

4. STUDY VALUE:
- Highlight key takeaways
- Emphasize important ideas that a student should remember
- If appropriate, include brief examples or clarifications

5. ADAPTATION:
- If the transcript is short → keep it clean and concise
- If the transcript is long → break it into multiple sections

6. TONE:
- Clear, educational, and easy to understand
- Avoid fluff or unnecessary repetition

IMPORTANT:
Do NOT just summarize — transform the content into structured study notes that help learning and retention.

CRITICAL:
Only use information from the transcript.
Do NOT add external knowledge or assumptions.
Do NOT expand beyond what is explicitly mentioned.

Use ONLY "-" for bullet points (do not mix symbols like •)
Do not add examples or context not present in the transcript.

If a concept is unclear or incomplete in the transcript, present it as-is without adding new information.

Transcript:\n\n${transcript}`,
            },
          ],
        }),
      },
    );
    clearTimeout(timeout);

    let data;

try {
  data = await openaiRes.json();
} catch (e) {
  console.error("Invalid JSON from OpenAI");
  return Response.json(
    { error: "Invalid AI response" },
    { status: 500 }
  );
}

    if (!openaiRes.ok) {
      console.error("OpenAI error:", data);
      return Response.json({ error: "AI processing failed" }, { status: 500 });
    }

    const summary =
      data.choices?.[0]?.message?.content || "No summary generated.";

    return Response.json({ summary });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error generating summary" },
      { status: 500 },
    );
  }
}
