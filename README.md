# 🚂 RailTrack AI — SIH25022
## AI-Powered Railway Traffic Management Platform

[![CI/CD](https://github.com/your-org/rail-traffic-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/rail-traffic-platform/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)

> **Smart India Hackathon 2025 — Problem Statement SIH25022**  
> Ministry of Railways · AI-Powered Precise Train Traffic Control  

---

## 🎯 Problem Statement

SIH25022 challenges teams to build an AI-powered system for **precise train traffic control** that:
- Predicts and minimizes delays using machine learning
- Provides real-time network visualization and digital twin capabilities
- Enables intelligent resource allocation and route optimization
- Offers explainable AI predictions for operational decision-making

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│   Next.js 15 (App Router) + React 19 + TypeScript              │
│   TailwindCSS + shadcn/ui + Framer Motion + ECharts + MapLibre  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP / WebSocket / GraphQL
┌──────────────────────▼──────────────────────────────────────────┐
│                   API GATEWAY (Nginx)                           │
│   Rate Limiting · Load Balancing · SSL Termination · Caching    │
└──────┬───────────────────────┬────────────────────────┬─────────┘
       │                       │                        │
┌──────▼──────┐   ┌────────────▼────────┐   ┌──────────▼─────────┐
│  NestJS API │   │   FastAPI AI Service│   │   Static Assets     │
│  (Port 4000)│   │   (Port 8000)       │   │   (CDN-ready)       │
│             │   │                     │   └────────────────────-┘
│  - Auth     │   │  - RailCopilot      │
│  - Trains   │   │  - RAG Pipeline     │
│  - Stations │   │  - ML Models        │
│  - Alerts   │   │  - LangGraph Agent  │
│  - Analytics│   │  - MCP Clients      │
│  - Reports  │   │  - Streaming API    │
│  - WebSocket│   │                     │
└──────┬──────┘   └─────────┬───────────┘
       │                    │
┌──────▼────────────────────▼─────────────────────────────────────┐
│                      DATA LAYER                                 │
│   PostgreSQL 16  │  Redis 7  │  ChromaDB (Vector Store)         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Capabilities — RailCopilot Operations Copilot

| Capability | Model | Explainability |
|---|---|---|
| Delay Prediction | XGBoost | SHAP values |
| Congestion Forecasting | LSTM | Attention weights |
| Route Optimization | A* + OR-Tools | Step-by-step path |
| Maintenance Prediction | Random Forest | Feature importance |
| Incident Classification | BERT | Attention highlights |
| Anomaly Detection | Isolation Forest | Anomaly scores |
| Executive Summaries | Groq llama-3.3-70b | Chain-of-thought |
| Document Q&A (RAG) | LlamaIndex + ChromaDB | Source citations |
| Complex Operations | LangGraph ReAct Agent | Reasoning steps |

---

## 🔌 MCP Ecosystem

| Server | Purpose | Status |
|---|---|---|
| PostgreSQL MCP | Safe analytics queries | ✅ Integrated |
| Filesystem MCP | Railway SOPs & manuals | ✅ Integrated |
| Weather MCP | Open-Meteo API | ✅ Integrated |
| Maps/GIS MCP | Railway network geodata | ✅ Integrated |
| Documentation MCP | Railway manuals RAG | ✅ Integrated |
| OpenAPI MCP | API schema introspection | ✅ Integrated |
| GitHub MCP | Code & deployment context | 🔧 Configure |
| Docker MCP | Container diagnostics | 🔧 Configure |
| Kubernetes MCP | Cluster management | 🔧 Configure |
| Playwright MCP | Browser automation | ✅ Integrated |

---

## 📋 Features

### Operations Dashboard
- Real-time KPI widgets with animated counters
- Network health monitoring
- Delay distribution charts (ECharts)
- Hourly traffic flow visualization
- AI daily briefing from RailCopilot
- Zone performance snapshot

### Interactive Map
- MapLibre GL JS with Indian Railways GeoJSON network
- Live train position layer
- Congestion heatmap
- Weather overlay
- Station markers with health indicators
- Multi-layer controls

### Digital Twin
- Station platform occupancy visualization
- Signal state rendering (green/yellow/red aspects)
- Track section status (free/occupied/blocked)
- Delay propagation animation
- Historical playback (scrubable timeline)
- Weather overlay
- AI recommendations overlay

### Executive Dashboard *(Admin only)*
- National KPI overview
- All 18 Railway Zone performance comparison
- 90-day delay trend analysis
- Monthly performance comparison
- AI strategic recommendations
- One-click executive PDF report

### Predictive Maintenance
- Track health prediction (Random Forest)
- Signal failure prediction (XGBoost)
- Switch failure prediction (Gradient Boosting)
- Risk-scored asset dashboard
- Maintenance scheduling optimization
- XAI panel for every prediction

### RailCopilot AI Copilot
- Full-page and floating widget modes
- Groq llama-3.3-70b primary, Gemini 1.5 Pro fallback
- Page-context aware (knows current filters, KPIs, alerts)
- RAG-powered policy Q&A (4 indexed railway documents)
- Streaming responses
- Source citation with excerpts
- XAI breakdown on every prediction
- Conversation history (Redis TTL 24h)
- LangGraph multi-step agent for complex queries

### Admin Panel
- Role-Based Access Control (5 roles)
- User management (CRUD)
- Audit log with descriptive entries
- System health monitoring
- MCP ecosystem configuration
- AI provider settings (Groq/Gemini API keys)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker + Docker Compose
- Groq API Key ([get free at console.groq.com](https://console.groq.com))
- Gemini API Key ([get at aistudio.google.com](https://aistudio.google.com))

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/your-org/rail-traffic-platform.git
cd rail-traffic-platform

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY and GEMINI_API_KEY

# Start all services
docker compose up -d

# Seed database (first run)
docker compose exec api npx prisma db push
docker compose exec api npm run prisma:seed

# Access the platform
open http://localhost  # via Nginx
# OR directly:
open http://localhost:3000  # Frontend
open http://localhost:4000/api/docs  # API Swagger
open http://localhost:8000/docs  # AI Service docs
open http://localhost:3001  # Grafana dashboard
```

### Option 2: Local Development

```bash
# Install frontend dependencies
cd apps/web && npm install --legacy-peer-deps

# Install backend dependencies
cd apps/api && npm install

# Install AI service dependencies
cd apps/ai-service && pip install -r requirements.txt

# Start services (separate terminals):

# Terminal 1: Start PostgreSQL + Redis (Docker)
docker compose up postgres redis chromadb -d

# Terminal 2: NestJS API
cd apps/api
cp .env.example .env  # Configure DATABASE_URL etc.
npx prisma db push && npx ts-node prisma/seed.ts
npm run start:dev

# Terminal 3: FastAPI AI Service
cd apps/ai-service
cp .env.example .env  # Add GROQ_API_KEY + GEMINI_API_KEY
uvicorn main:app --reload --port 8000

# Terminal 4: Next.js Frontend
cd apps/web
cp .env.local.example .env.local
npm run dev

# Access: http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| Super Admin | superadmin@railtrack.gov.in | password | Full system access |
| Admin | admin@railtrack.gov.in | password | Admin + Executive Dashboard |
| Traffic Controller | tc@railtrack.gov.in | password | Operations + Digital Twin |
| Analyst | analyst@railtrack.gov.in | password | Analytics + Reports |
| Viewer | viewer@railtrack.gov.in | password | Read-only access |

---

## 📊 Data Strategy

### Real-Time Data Abstraction Layer

The platform uses a **provider adapter pattern** that separates data sources from business logic:

```typescript
interface ITrainDataProvider {
  getTrains(filters?: TrainFilters): Promise<Train[]>;
  getTrainById(id: string): Promise<Train | null>;
  subscribeToUpdates(callback: (train: Train) => void): () => void;
}

// Current: DemoDataAdapter (historical replay datasets)
// Available: NTESAdapter, CRISAdapter (requires Ministry authorization)
// Available: WebSocketStreamAdapter (live operational streams)
```

| Data Type | Current Source | Production Source |
|---|---|---|
| Train positions | Historical replay dataset | NTES/CRIS API (Ministry authorized) |
| Delay predictions | XGBoost on demo features | XGBoost trained on live CRIS data |
| Weather | Open-Meteo API (live, public) | IMD API + Open-Meteo |
| Station data | Static Indian Railways dataset | CRIS Station API |
| Maps/Network | OSM Railway GeoJSON | NATGRID / Survey of India |
| Railway policies | Indexed sample SOPs | RDSO Manuals (secure intranet) |

---

## 🏛️ Indian Railway Zones Covered

NR · CR · SR · ER · WR · SCR · NFR · SWR · ECR · ECoR · NCR · NWR · WCR · SECR · SER · NER · MR · ICF

---

## 🔒 Security

- **JWT** authentication with access + refresh token rotation
- **RBAC** with 5 hierarchical roles
- **Rate limiting**: 100 req/min (general), 20 req/min (auth), 30 req/min (AI)
- **Helmet.js** CSP, XSS, HSTS headers
- **Input validation** via Zod (frontend) + class-validator (backend)
- **Audit logging** for all write operations
- **OWASP Top 10** mitigations documented
- **Secrets**: environment variables (Vault-compatible)

---

## 🧪 Testing

```bash
# Frontend
cd apps/web
npm run type-check    # TypeScript strict
npm run lint          # ESLint
npm run build         # Production build validation

# Backend
cd apps/api
npm run test          # Jest unit tests
npm run test:e2e      # End-to-end API tests

# AI Service
cd apps/ai-service
pytest tests/ -v      # Python pytest
```

---

## 📁 Project Structure

```
rail-traffic-platform/
├── apps/
│   ├── web/                    # Next.js 15 frontend
│   │   ├── app/
│   │   │   ├── (marketing)/    # Landing page
│   │   │   ├── (app)/          # Authenticated app pages
│   │   │   └── login/          # Auth pages
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── layout/         # Sidebar, header, layouts
│   │   │   └── ai/             # RailCopilot, XAI panel
│   │   ├── lib/                # Utils, API client, demo data
│   │   └── store/              # Zustand state management
│   ├── api/                    # NestJS backend
│   │   ├── src/modules/        # Feature modules
│   │   ├── src/common/         # Guards, filters, pipes
│   │   └── prisma/             # Schema + seed
│   └── ai-service/             # FastAPI AI service
│       ├── app/services/       # LLM, RAG, ML, MCP
│       ├── app/routers/        # API endpoints
│       └── app/data/           # Sample railway documents
├── packages/
│   └── shared-types/           # Shared TypeScript types
├── infrastructure/
│   ├── docker/
│   ├── nginx/                  # Reverse proxy
│   ├── k8s/                    # Kubernetes manifests
│   └── monitoring/             # Prometheus + Grafana
├── docs/
│   ├── architecture/
│   ├── api/
│   └── deployment/
├── docker-compose.yml
└── .github/workflows/ci.yml    # GitHub Actions CI/CD
```

---

## 🎬 Judge Demo Flow

**Scenario**: Monday morning NE weather disruption causing cascading delays.

1. **Login** as Traffic Controller (tc@railtrack.gov.in)
2. **Dashboard** → See 12 trains delayed, 3 critical alerts, network health 78%
3. **Click RailCopilot** → floating orange button (bottom-right)
4. **Ask**: "Why is Route Delhi-Howrah congested?"
5. **AI responds** with dashboard KPI analysis + RAG SOP reference + XAI breakdown
6. **AI suggests**: Divert 12301 Rajdhani via Allahabad junction
7. **Reports** → Generate Executive Report → Export PDF
8. **Admin** → Switch role to Viewer → Demonstrate RBAC restriction
9. **Audit Log** → Show complete action trail
10. **Digital Twin** → Live signal states + delay propagation animation

**Demo duration**: ~8 minutes. Every step is fully functional.

---

## 📜 License

MIT License — Built for Smart India Hackathon 2025.

---

## 🙏 Acknowledgments

- Ministry of Railways, Government of India
- Smart India Hackathon 2025
- Indian Railways Centre for Advanced Maintenance Technology (CAMT)
- RDSO for technical standards reference
- OpenStreetMap contributors for railway network data
- Open-Meteo for weather API

---

*This platform is a demonstration system for SIH25022. It uses historical replay datasets and simulated operational data. Official Ministry of Railways API integration requires appropriate authorization from CRIS/NTES.*
