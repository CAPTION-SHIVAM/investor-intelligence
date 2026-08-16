# InvestorIQ Architecture

## 1. Product goal
InvestorIQ is a fintech research platform for the Indian market. It helps users understand IPO quality, portfolio behavior, company research, thesis tracking, and document analysis without acting as a personalized buy/sell adviser.

The system is designed to:
- provide research analytics and educational explanations
- store user-created theses and assumptions
- analyze trade history in a privacy-conscious way
- support AI-assisted document analysis with citations
- work in demo mode without paid APIs
- switch to licensed market data providers when credentials are added

## 2. Architecture summary

### Frontend
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui component patterns
- Recharts for charting and dashboard widgets

### Backend
- FastAPI
- SQLAlchemy ORM
- Pydantic v2 validation
- PostgreSQL via async SQLAlchemy
- Redis + Celery for background jobs and alerts
- Alembic for schema migrations

### AI and document intelligence
- OpenAI-compatible or model-provider adapter pattern
- Document ingestion pipeline with PDF/TXT/DOCX/CSV/XLSX support
- Vector storage via PostgreSQL pgvector extension
- Retrieval + citation service before generating responses

### Data and provider abstraction
- `MarketDataProvider` interface
- `MockMarketDataProvider` for local/demo mode
- `LicensedMarketDataProvider` for production integration
- All providers must be swapped behind a common service interface

### Security and compliance
- Password hashing via secure library
- Role-based authorization
- Rate limiting
- Input validation
- Audit logs
- Privacy-first data handling
- Legal disclaimers across UI and API

## 3. Monorepo layout

- `frontend/` — Next.js application, UI, app pages, components, hooks
- `backend/` — FastAPI backend, API routes, business services, models, providers
- `database/` — migrations, SQL seed scripts, ERD notes
- `docs/` — product, legal, privacy, deployment, and API docs
- `scripts/` — setup, DB bootstrap, and deployment helpers
- `infra/` — Terraform / Docker / deployment config placeholders
- `tests/` — E2E and cross-service validation

## 4. Key principles

### 1. Deterministic business logic
Features like IPO scoring, thesis health, and trading analytics are implemented in backend code, not invented by LLMs.

### 2. Evidence-first AI
AI can summarize and explain, but must use retrieved evidence and cite source documents when claiming factual detail.

### 3. Demo-safe operation
The app works in demo mode with seeded data and clear labels such as “Demo data — connect a licensed data provider for live market data.”

### 4. Legal-safe positioning
The platform is educational and analytical. It does not offer personalized recommendations or guaranteed returns.

## 5. Core product modules
- IPO Reality Score
- Investor Mistake Detector
- Research Workspace
- Thesis tracking
- Portfolio analytics
- Alerting and document intelligence
- Subscription and billing via Razorpay
- Admin console

## 6. Data flow
1. User signs in
2. Frontend calls backend API
3. Backend validates request and authorization
4. Service layer performs calculations or retrieves data
5. Data provider or DB returns the requested information
6. AI layer retrieves evidence when needed
7. UI renders structured results with loading, empty, and error states

## 7. Package and environment choices
Selected versions are intentionally conservative and stable for a beginner-friendly monorepo:
- Node.js: 18 LTS or newer
- npm: current stable with workspace support
- Python: 3.11 or 3.12
- PostgreSQL: 16
- Redis: 7
- Next.js: 15.x
- React: 19.x
- TypeScript: 5.x
- Tailwind CSS: 3.x
- FastAPI: 0.115.x
- SQLAlchemy: 2.x
- Pydantic: 2.x
- Celery: 5.x
- Alembic: 1.14.x

## 8. Phase plan
- PHASE 0: project planning and architecture
- PHASE 1: repository scaffolding and tooling
- PHASE 2: database and migrations
- PHASE 3: backend foundation
- PHASE 4: frontend foundation
- PHASE 5: authentication
- PHASE 6: dashboard
- PHASE 7: company and stock system
- PHASE 8: IPO Radar
- PHASE 9: IPO scoring engine
- PHASE 10: research workspace
- PHASE 11: thesis system
- PHASE 12: document upload
- PHASE 13: RAG and AI assistant
- PHASE 14: portfolio
- PHASE 15: trade import and investor analysis
- PHASE 16: alerts and notifications
- PHASE 17: billing and subscriptions
- PHASE 18: admin
- PHASE 19: security
- PHASE 20: tests and E2E
- PHASE 21: Docker
- PHASE 22: deployment
- PHASE 23: final audit

## 9. Why this structure matters
This structure keeps business logic separate from UI, keeps database concerns isolated, gives a clear place for AI services, and makes it easier to replace external data providers without rewriting the app.

## 10. Beginner note
If you are new to architecture, think of it like this:
- frontend = what users see
- backend = business rules and calculations
- database = permanent data storage
- AI = explanation and research assistance
- providers = external sources like market data or document storage
- docs = explanation, privacy, and legal safeguards

The project is intentionally built to be realistic and modular rather than a single-file demo.
