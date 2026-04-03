import { createOpenAI } from '@ai-sdk/openai';

const provider = createOpenAI({
  baseURL: process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://enough.spirittree.dev',
    'X-Title': 'Enough Gauge',
  },
});

export const defaultModel = provider(process.env.AI_MODEL || 'anthropic/claude-haiku-4-5');
export { provider };
