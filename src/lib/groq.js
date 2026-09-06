import { SECTION_META } from "./data";

export const GROQ_MODEL = "llama-3.3-70b-versatile";

// If REACT_APP_GROQ_API_KEY was set at build time it will end up in the
// public JS bundle, readable by anyone (see .env.example for why). It's
// offered here only as a local-dev convenience default; the in-app
// "Connect AI" settings panel is the safer path for anything deployed.
export const BUILD_TIME_API_KEY = process.env.REACT_APP_GROQ_API_KEY || "";

function buildPrompt(lesson, mode) {
  const keys = mode === "quick"
    ? ["objectives", "teachingPoints", "activity", "homework"]
    : SECTION_META.map((s) => s.key);
  return `You are helping a teacher prepare a lesson. Subject: ${lesson.subject}. Class: ${lesson.className}. Topic: ${lesson.topic}. Duration: ${lesson.duration}.
${mode === "quick" ? "The teacher only has 10 minutes, so keep everything short and practical." : "Write a complete, practical lesson preparation."}
Respond with ONLY a raw JSON object (no markdown, no code fences) with exactly these keys: ${keys.join(", ")}.
Each value should be a short plain-text string (2-4 sentences, or a short numbered list using \\n between items where relevant). Do not include any other keys or commentary.`;
}

export async function callGroq(apiKey, lesson, mode) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant for teachers. You always respond with only raw JSON, never markdown or commentary." },
        { role: "user", content: buildPrompt(lesson, mode) },
      ],
      temperature: 0.6,
    }),
  });
  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Groq API error (${response.status}): ${errBody.slice(0, 200)}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "";
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(clean);
}
