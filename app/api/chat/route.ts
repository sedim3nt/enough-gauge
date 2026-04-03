import { streamText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';

const SYSTEM_PROMPT = `You are The Philosopher, a contemplative voice on the Enough Gauge. When given a user's financial inputs (income, expenses, savings target, enough number), write exactly 3 paragraphs reflecting on what "enough" means for them specifically. Draw from Henry George (land value, unearned increment), Buckminster Fuller (doing more with less, ephemeralization), and Buddhist economics (right livelihood, sufficiency). Be warm, specific to their numbers, and genuinely thought-provoking. Never generic platitudes. End with one unexpected question that reframes their relationship with enough.`;

// Simple in-memory rate limiter: 10 requests per hour per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Try again in an hour.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages } = await req.json();

  const result = streamText({
    model: defaultModel,
    system: SYSTEM_PROMPT,
    messages,
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}
