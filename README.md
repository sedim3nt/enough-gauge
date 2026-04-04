# Enough Gauge

How much is enough? A financial reflection tool that challenges your relationship with money.

**Live:** [enough.spirittree.dev](https://enough.spirittree.dev)
**Stack:** Next.js, TailwindCSS, OpenRouter
**Status:** Active

## What This Is

The Enough Gauge is a personal finance tool with a philosophical twist. Enter your monthly expenses, savings target, giving goal, and current balance — then get a visual gauge showing where you stand relative to "enough." Not enough by Wall Street standards, but enough by yours.

The AI philosopher reflects on your specific numbers through the lens of Henry George (land value, unearned increment), Buckminster Fuller (ephemeralization, doing more with less), and Buddhist economics (right livelihood, sufficiency). It's the anti-FIRE calculator.

## Features

- 📊 **Visual Gauge** — real-time "enough" meter based on your financial inputs
- 🔧 **Setup Flow** — guided configuration for expenses, savings, giving, and balance
- 🧠 **The Philosopher** — AI reflection on what "enough" means for you specifically
- 💾 **Local Storage** — all data stored in browser, no account needed
- 📱 **Responsive** — clean, minimal design

## AI Integration

**The Philosopher** — powered by OpenRouter, writes 3 paragraphs reflecting on your financial inputs through Henry George, Buckminster Fuller, and Buddhist economics. Warm, specific to your numbers, and thought-provoking. Ends with one unexpected question that reframes your relationship with enough. Rate-limited to 10 requests per hour.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **Database:** None (localStorage)
- **AI:** OpenRouter (via Vercel AI SDK)
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` / `OPENROUTER_API_KEY` | OpenRouter API key for The Philosopher |
| `AI_BASE_URL` | AI provider base URL (defaults to OpenRouter) |

## Part of SpiritTree

This project is part of the [SpiritTree](https://spirittree.dev) ecosystem — an autonomous AI operation building tools for the agent economy and displaced workers.

## License

MIT
