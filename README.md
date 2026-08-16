# InvestorIQ

InvestorIQ is a production-oriented investor intelligence platform built for the Indian market. It includes IPO research, investor behaviour analysis, research workspace, thesis tracking, document intelligence, portfolio analytics, and legal-safe financial education.

## What this project is
This project is a real SaaS-style application skeleton and production planning base for a fintech research platform. It is not a fake one-page demo.

## Why it was built
The goal is to create an MVP that gives users research tools and educational analytics without pretending to be a regulated investment adviser or making personalized buy/sell recommendations.

## Main features
- IPO Radar with transparent research scoring
- Investor Mistake Detector for historical trade analysis
- Research Workspace for company analysis
- Thesis Health tracking and assumption monitoring
- Document upload and AI-assisted research with citations
- Portfolio management and watchlists
- Alerts and notifications
- Billing with Razorpay
- Admin dashboard
- Security, privacy, and legal-safe design

## Stack
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Redis, Celery
- AI: model-provider abstraction with evidence-backed retrieval
- Observability: Sentry and structured logs
- Deployment: Docker + Vercel / Render / Railway / AWS style setup

## Architecture overview
See [ARCHITECTURE.md](ARCHITECTURE.md) for the complete system design.

## Local setup
1. Install Node.js 18+ and npm
2. Install Python 3.11+ or 3.12+
3. Install PostgreSQL 16 and Redis 7, or run Docker services
4. Copy `.env.example` to `.env`
5. Set `DEMO_MODE=true` for the initial local build
6. Install frontend dependencies
7. Install backend dependencies
8. Run database migrations
9. Seed demo data
10. Start backend
11. Start frontend

## Windows instructions
PowerShell examples:

```powershell
node -v
npm -v
python --version
python -m venv .venv
.\.venv\Scripts\Activate.ps1
npm install
```

## Project status
See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the current phase and remaining work.

## Important notes
- Demo data must always be clearly labelled.
- Live market data requires licensed providers.
- AI must cite sources and avoid fake financial claims.
- No personalized investment advice is included in the MVP.

## Legal guardrail
This project is educational and analytical in nature. It does not provide personalized investment advice or guaranteed returns.
