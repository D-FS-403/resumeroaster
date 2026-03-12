const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const GEMINI_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

export async function callGemini(
  systemPrompt: string,
  userMessage: string,
  maxRetries = 3
): Promise<string> {
  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (text) return text;
          throw new Error('Empty response from Gemini');
        }

        // Rate limited — exponential backoff
        if (response.status === 429) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
          console.warn(`Model ${model} rate limited (attempt ${attempt + 1}), waiting ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        // Other errors — try next model
        const errorBody = await response.text();
        console.warn(`Model ${model} returned ${response.status}: ${errorBody}`);
        break;
      } catch (err) {
        console.error(`Model ${model} attempt ${attempt + 1} failed:`, err);
        if (attempt === maxRetries - 1) break;
      }
    }
  }

  throw new Error('All Gemini models failed. Please try again.');
}

export function stripMarkdown(jsonString: string): string {
  let cleaned = jsonString.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/```$/i, '');
  return cleaned;
}

export function parseJSON<T>(text: string): T {
  const cleaned = stripMarkdown(text);
  return JSON.parse(cleaned) as T;
}
