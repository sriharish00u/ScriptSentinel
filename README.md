# ScriptSentinel 🛡️
### Algorithmic Compliance & Shadowban Detection Engine (2026 Edition)

> Stop losing reach, monetization, and ad accounts to unannounced platform algorithm changes. ScriptSentinel is a painkiller utility that scans scripts, captions, and landing pages against platform restrictions across **TikTok**, **YouTube**, **Meta (FB & IG Ads)**, and **Google Ads**, providing 1-click algo-safe rewrites.

---

## 🚀 Key Features

- **⚡ Real-Time Script & Ad Copy Scanner**: Sub-50ms tokenizer highlighting shadowban triggers with severity breakdown (*Critical*, *High*, *Moderate*).
- **🔄 1-Click Algo-Safe Swapper**: Replaces prohibited phrases with approved alternatives (e.g. `"weight loss"` $\rightarrow$ `"wellness journey"`, `"kill"` $\rightarrow$ `"unalive"`, `"crypto giveaway"` $\rightarrow$ `"community rewards"`).
- **🌐 Landing Page URL Auditor**: Scrapes public URLs, tests for mandatory legal disclosures (Privacy policy, Terms of service, Earnings/Health disclaimers), and flags fake urgency countdowns.
- **📈 Programmatic SEO (pSEO) Acquisition Engine**: Dynamic landing pages targeting long-tail panic searches (`/[platform]/banned-words/[slug]`, `/[platform]/policy/[industry]`) complete with JSON-LD FAQ Schema markup.
- **📚 2026 Platform Rulebook**: Comprehensive database of ad policies and speech moderation rules.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Lucide Icons, TypeScript
- **Backend**: Node.js, Express, Cheerio, Axios, Helmet, Morgan
- **Database**: MongoDB Atlas with Mongoose ODM
- **Deployment**:
  - **Backend**: Render Web Service (`render.yaml`)
  - **Frontend**: Vercel (`vercel --prod`)

---

## 🏁 Local Development

### 1. Backend Service
```bash
cd backend
npm install
npm run seed     # Seeds 25+ restricted terms & policies to MongoDB Atlas
npm run dev      # Runs on http://localhost:5000
npm test         # Runs Jest test suite
```

### 2. Frontend Web App
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:3000
npm run build    # Production build check
```

---

## 📡 REST API Endpoints

- `POST /api/v1/scan/text` - Scan text for platform triggers & generate safe rewrite
- `POST /api/v1/scan/url` - Scrape and audit landing page URL compliance
- `GET /api/v1/scan/terms` - Search and filter restricted terms database
- `GET /api/v1/policies` - Retrieve platform industry compliance guidelines
- `GET /api/v1/pseo/page/:slug` - Fetch programmatic SEO page payload & FAQ schema
- `GET /health` - Service health status

---

## 📄 License
MIT License. Built for content creators and performance marketers.
