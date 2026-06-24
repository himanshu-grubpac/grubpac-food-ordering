# grubpac-food-ordering

Voice-powered food ordering demo for **GrubPac Kitchen**. Customers log in, order via natural conversation (Deepgram Voice Agent), checkout, and track delivery — all in the browser.

## Features

- Customer login with validation
- **Deepgram Voice Agent** — natural conversation to order food
- AI understands phrases like "I want a cheese burger" and adds to cart automatically
- Function calling: add/remove items, search menu, view cart, checkout
- Live conversation transcript with assistant replies
- Responsive menu with search and category filters
- Sticky shopping cart with GST calculation (5%)
- Checkout with UPI, Credit Card, and Cash on Delivery
- Order success screen with animated confirmation
- Live order tracking with simulated delivery timeline
- Dark and light mode support
- Glassmorphism enterprise UI

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Framer Motion
- Lucide React Icons
- Deepgram SDK + `@deepgram/agents`
- Google Gemini (via Deepgram Agent think provider)
- Deepgram Aura TTS (via Deepgram Agent speak provider)
- React Context API
- Mock JSON data (no backend)

## Prerequisites

- Node.js 18+
- npm
- A [Deepgram API key](https://console.deepgram.com/) (free tier available)

## Setup

1. Clone or open this project.

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env.local
```

4. Add your Deepgram API key to `.env.local`:

```env
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

Optional server-side key (for `/api/deepgram/token` grant flow):

```env
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

The Voice Agent connects from the browser using `NEXT_PUBLIC_DEEPGRAM_API_KEY`. Do not commit `.env.local`.

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000).

## Application Flow

1. **Login** (`/`) — Enter name and mobile number, then click **Login**.
2. **Voice Dashboard** (`/order`) — Use the microphone or UI to browse menu and manage cart.
3. **Checkout** (`/checkout`) — Review order, select payment method, place order.
4. **Track Order** (`/track`) — Watch live simulated status from confirmed to delivered.
5. **Success** (`/success`) — Optional confirmation screen with order summary and link to tracking.

## Voice Agent

The order page uses **Deepgram Voice Agent** with:

- **Listen:** Flux speech-to-text
- **Think:** Google Gemini 3.1 Flash Lite (managed via Deepgram)
- **Speak:** Aura 2 Odysseus TTS

Say things naturally, for example:

- "Hey, I wanted to order a cheese burger"
- "Add two margherita pizzas"
- "What's in my cart?"
- "Place my order"

The agent calls app functions to update the cart and navigate to checkout.

## Voice Commands (legacy parser)

The rule-based parser in `commandParser.ts` is kept as reference; the live UI uses the Voice Agent.

## Project Structure

```
src/
├── app/                 # App Router pages
├── components/          # UI and feature components
├── context/             # Customer and cart state
├── hooks/               # Voice assistant and route guards
├── lib/                 # Utilities and voice services
├── data/                # Mock menu JSON
└── types/               # TypeScript definitions
```

## Security Note

Never commit `.env.local`. For production, set environment variables in your hosting provider (see Vercel below).

## Deploy on Vercel

This app is a standard **Next.js 16** project and deploys to [Vercel](https://vercel.com) with zero extra config.

1. Push this repo to GitHub (`himanshu-grubpac/grubpac-food-ordering`).
2. In Vercel: **Add New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `npm run build` (default).
5. Add **Environment Variables** (Production + Preview):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_DEEPGRAM_API_KEY` | Yes | Deepgram API key for Voice Agent (browser WebSocket) |
| `DEEPGRAM_API_KEY` | No | Server-side key for `/api/deepgram/token` grant (optional) |

6. Deploy. Voice ordering requires **HTTPS** — Vercel provides this automatically.

**Note:** The microphone only works over HTTPS (or `localhost`). After deploy, allow mic permission when prompted on `/order`.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## License

Demo application for evaluation purposes.
