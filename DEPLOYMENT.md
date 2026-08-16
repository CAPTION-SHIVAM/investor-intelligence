# Investor Intelligence — Production Deployment Playbook

This document provides a comprehensive, step-by-step guide to deploying the **Investor Intelligence** platform to live production infrastructure.

---

## 🏗️ Architecture Overview

The system consists of two primary services:
1. **Frontend (`/frontend`)**: Next.js 14 (App Router) client application with Tailwind CSS, dynamic charts, AI copilot drawer, and responsive dashboard.
2. **Backend (`/backend`)**: FastAPI high-performance Python ASGI backend powering the 6-Pillar IPO scoring engine, multi-cap stock screener, and portfolio analysis.

---

## 🚀 Deployment Options

Choose the deployment path that best fits your scale and budget:

| Method | Recommended For | Cost | Effort |
| :--- | :--- | :--- | :--- |
| **Option A: Cloud Serverless (Vercel + Render/Railway)** | Fast launch, startups, low maintenance | Free to $15/mo | 10 mins |
| **Option B: Single Cloud VPS (Docker + Nginx)** | Full control, single monthly cost, high performance | $5 to $20/mo | 20 mins |
| **Option C: AWS / Enterprise (ECS + CloudFront)** | Large scale, institutional compliance | $50+/mo | Advanced |

---

## 🌟 Option A: Fast Cloud Deployment (Recommended)

### Step 1: Deploy Backend to Render or Railway

#### Via Render:
1. Push your repository to GitHub / GitLab.
2. Log in to [Render.com](https://render.com) and click **New + Web Service**.
3. Connect your repository.
4. Set the following build and start configurations:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   ```env
   ALLOWED_ORIGINS=https://your-custom-domain.com,https://your-app.vercel.app
   ALLOW_ALL_ORIGINS=false
   ENV=production
   ```
6. Click **Deploy Web Service**. Render will generate a public URL (e.g. `https://investor-api.onrender.com`).

---

### Step 2: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Import your GitHub repository.
3. In **Root Directory**, click Edit and select `frontend`.
4. In **Environment Variables**, add:
   ```env
   NEXT_PUBLIC_API_URL=https://investor-api.onrender.com/api
   ```
5. Click **Deploy**. Vercel will build the production bundle and assign your live URL (e.g. `https://investor-intelligence.vercel.app`).

---

## 🐳 Option B: Self-Hosted Single VPS (Docker Compose + Nginx)

Ideal for hosting both frontend and backend on a single Ubuntu server (DigitalOcean Droplet, AWS EC2, or Hetzner).

### 1. Connect to your VPS via SSH
```bash
ssh root@your-server-ip
```

### 2. Install Docker & Docker Compose
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install -y docker-compose-plugin
```

### 3. Clone Repository & Setup Environment
```bash
git clone https://github.com/your-username/investor-intelligence.git
cd investor-intelligence
```

### 4. Create Production Environment File `.env`
```env
NEXT_PUBLIC_API_URL=/api
ALLOWED_ORIGINS=http://your-server-ip,https://yourdomain.com
ALLOW_ALL_ORIGINS=false
```

### 5. Launch Full Stack with Docker Compose
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Your platform is now live on `http://your-server-ip`!

---

## 🔒 SSL & Custom Domain Setup (HTTPS)

### Using Caddy (Fastest Automatic SSL)
```bash
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install caddy
```

Add to `/etc/caddy/Caddyfile`:
```caddy
yourdomain.com {
    reverse_proxy localhost:80
}
```
Reload Caddy:
```bash
systemctl reload caddy
```
Caddy will automatically generate and renew free Let's Encrypt SSL certificates.

---

## 💳 Payment Gateway & Monetization Setup

To monetize your Free vs. Pro tiers:

### Razorpay / Stripe Webhook Integration
1. Set up a Razorpay or Stripe merchant account.
2. In your backend `.env`, store your API keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxxx
   ```
3. Connect checkout button callbacks to record subscription status in `InvestorUser.plan` ('PRO').

---

## 🩺 Production Health Check Endpoints

- **Backend Health Check**: `GET https://your-api.domain.com/api/health`
  - Expected Response: `{"status": "ok", "service": "Investor Intelligence API"}`
- **FastAPI OpenAPI Documentation**: `GET https://your-api.domain.com/docs`
- **Frontend Live Check**: `GET https://yourdomain.com`

---

## 🛠️ Summary of Key Production Commands

| Action | Command |
| :--- | :--- |
| **Start Local Dev (Frontend)** | `npm --prefix frontend run dev` |
| **Start Local Dev (Backend)** | `uvicorn backend.app.main:app --reload --port 8000` |
| **Build Frontend Bundle** | `npm --prefix frontend run build` |
| **Run Production Docker Stack** | `docker compose -f docker-compose.prod.yml up -d --build` |
| **View Docker Logs** | `docker compose -f docker-compose.prod.yml logs -f` |
