# Virtual Set Preview Generator

A React mini app for generating AI-powered virtual TV studio set previews. Clients submit creative briefs and receive generated previews showing how virtual sets would look in a physical studio setup.

## Features

- **Multi-step brief form** — Show type, mood, colors, elements, references
- **Credit system** — Track usage with deductible credits
- **Dark theme UI** — Modern, professional interface
- **3 camera angles** — Wide, Left, Right perspectives
- **n8n integration** — Webhook-ready for backend processing

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** n8n workflows
- **AI Generation:** WaveSpeedAI (image-to-video)
- **Compositing:** Creatomate
- **Hosting:** Vercel / Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/sanvesta/virtual-set-preview.git
cd virtual-set-preview

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Environment Variables

Create `.env.local`:

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n.cloud/webhook
```

## Project Structure

```
virtual-set-preview/
├── src/
│   ├── components/
│   │   ├── BriefForm.jsx
│   │   ├── ProcessingView.jsx
│   │   ├── ResultsView.jsx
│   │   └── RevisionPanel.jsx
│   ├── hooks/
│   │   └── useGeneration.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── README.md
```

## n8n Webhook Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook/brief-submit` | POST | Submit brief, start generation |
| `/webhook/job-status/:id` | GET | Check job progress |
| `/webhook/job-result/:id` | GET | Get output URLs |

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Cloudflare Pages

1. Connect GitHub repo to Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`

## Roadmap

- [x] Multi-step brief form
- [x] Dark theme UI
- [x] Credit system
- [ ] n8n webhook integration
- [ ] Video demo reel generation
- [ ] Telegram payments
- [ ] Gaussian splatting 3D viewer

## License

MIT
