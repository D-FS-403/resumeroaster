import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [{ role: 'user', content: userMessage }],
        system: systemPrompt,
      });

      const textBlock = response.content.find((b) => b.type === 'text');
      return textBlock?.text || '';
    } catch (error: any) {
      console.error(`Claude API attempt ${attempt + 1} failed:`, error?.message);

      // Rate limited — wait and retry
      if (error?.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
        console.warn(`Rate limited, waiting ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      // Overloaded — retry
      if (error?.status === 529) {
        const delay = Math.min(2000 * Math.pow(2, attempt), 10000);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (attempt === maxRetries - 1) throw error;
    }
  }

  throw new Error('Claude API failed after retries');
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
