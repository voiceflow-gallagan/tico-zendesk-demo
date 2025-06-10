# Tico Zendesk Cloudflare Worker

This project is a Cloudflare Worker that integrates with Zendesk and Voiceflow.

> **Need help to set up Zendesk webhooks and triggers?** See the step-by-step guide: [extra/zendesk/README.zendesk.md](extra/zendesk/README.zendesk.md)

> **Try the Voiceflow demo!** A ready-to-import Voiceflow project (`ZendeskEmailDemo.vf`) is available in `/extra/voiceflow`. Import it into your Voiceflow workspace, import some docs in the knowledge base and connect the Zendesk integration to test the full workflow.

---

## Alternative: n8n Workflow
If you prefer a no-code/low-code automation approach, you can use the provided n8n workflow instead of the Cloudflare Worker. The n8n workflow connects Zendesk and Voiceflow using a visual automation tool. See [extra/n8n/README.n8n.md](extra/n8n/README.n8n.md) for setup and details.

---

## Features
- Webhook endpoint for Zendesk (`/webhook`)
- Health check endpoint (`/health`)
- Root endpoint (`/`) returns name and version

## Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/)
- A Cloudflare account

## Wrangler & Cloudflare Setup

### 1. Install Wrangler
Wrangler is the official CLI for Cloudflare Workers.
```bash
npm install -g wrangler
```

### 2. Authenticate Wrangler
Before deploying, authenticate Wrangler with your Cloudflare account:
```bash
wrangler login
```
This will open a browser window for you to log in to your Cloudflare account.

### 3. Configure Your Worker
- Edit `wrangler.jsonc` if you want to change the Worker name or settings before deploying.
- The first deployment will create the Worker in your Cloudflare account.

### 4. Set Production Secrets
Secrets for production must be set using Wrangler. These are stored in Cloudflare and used when deployed:
```bash
wrangler secret put VALID_API_KEY
wrangler secret put VF_API_KEY
wrangler secret put VF_PROJECT_ID
wrangler secret put VF_VERSION_ID
```

> **Note:** `.dev.vars` is only for local development. Production secrets must be set with `wrangler secret put`.

### 5. Deploy to Cloudflare
After authentication and setting secrets, deploy your Worker:
```bash
npm run deploy
```
Or:
```bash
wrangler deploy
```
After deployment, the Worker's public URL will be shown in the terminal.

- You can also view and manage your Worker in the [Cloudflare dashboard](https://dash.cloudflare.com/).
- For custom domains, see [Cloudflare's documentation on routes](https://developers.cloudflare.com/workers/platform/routes/).

## Local Development

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd tico-zendesk-demo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Local development secrets
For local development, create a `.dev.vars` file in the project root (see `.dev.vars.example` for the format):
```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars and fill in your values
```

### 4. Start the development server
```bash
npm run dev
```
This will start the worker locally at [http://localhost:8787](http://localhost:8787).

## Endpoints
- `GET /` — Returns name and version
- `GET /health` — Health check
- `POST /webhook` — Zendesk webhook (requires `x-api-key` header)

## Contributing & Testing
- Fork and clone this repo
- Use `.dev.vars` for local secrets
- Use `curl` or Postman to test the webhook endpoint locally
- Use [ngrok](https://ngrok.com/) if you want to expose your local server to Zendesk

## Example `.dev.vars`
See `.dev.vars.example` in the repo for the required variables.



