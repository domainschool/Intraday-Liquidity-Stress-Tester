# Project Specifications: LiquiShock AI
## Real-Time Intraday Liquidity Stress Testing Cockpit

---

### 1. Executive Summary & Product Vision
**LiquiShock AI** is an enterprise-grade intraday liquidity stress-testing cockpit designed for bank corporate treasurers, heads of liquidity risk, and Asset-Liability Committee (ALCO) executives. Unlike traditional 30-day Basel III LCR calculators or retroactive end-of-day ledgers, LiquiShock AI operates on minute-by-minute intraday execution horizons, solving the acute **Intraday Timing Asymmetry** between instantaneous outgoing settlements (Fedwire, TARGET2, CLS PvP, Clearing House margin calls) and unpredictable incoming counterparty receipts.

The interface is crafted with a bespoke **soft, organic, and editorial aesthetic**—combining editorial typography (warm serif headings with modern, legible sans-serif body), muted earth-tone accents (sage green, terracotta, slate, warm ochre), large rounded containers (`rounded-2xl` / `rounded-3xl`), and soft, diffuse shadows on a warm off-white canvas (`#FAFAF9`).

---

### 2. User Inputs & Configurable Parameters
Users can configure and interact with the application through:
1. **Interactive Stress Sliders & Controls**:
   - **Deposit Runoff Accelerator (0% – 100%)**: Scales velocity and magnitude of outgoing wholesale and retail liquidity drains.
   - **Counterparty Inflow Lag (0 – 240 minutes)**: Shifts incoming wire settlement timestamps down the operating day timeline.
   - **Nostro FX Market Freeze (Toggle)**: Simulates foreign jurisdiction market cut-offs, trapping EUR, GBP, and JPY balances in offshore accounts and excluding them from immediate USD clearing availability.
   - **Intraday Margin Call Shock (Instant Injection)**: Triggers unexpected CCP collateral demands at peak liquidity hours.
2. **One-Click Historical & Crisis Scenario Presets**:
   - *2023 Digital Bank Run* (45% deposit runoff, 60-min inflow lag).
   - *CLS Settlement Outage* (10% runoff, 180-min foreign correspondent gridlock, FX frozen).
   - *Peak Margin Call Squeeze* (Multi-million intraday CCP margin calls at 11:00 AM EST).
3. **Queue Prioritization & Tactical Actions**:
   - Individual Wire **Hold / Release / Reprioritize** actions across scheduled transactions.
   - **One-Click Safe Throttle**: Automatically puts discretionary interbank transfers on hold to defer or prevent central bank overdraft breaches.
   - **Execute AI Remediation Plan**: Automatically applies optimal wire throttling and activates simulated emergency funding facilities (Fed Discount Window, FHLB advance, Intraday Repo).
4. **Configuration & Live Market Data Controls**:
   - Base Reporting Currency selector (USD default, EUR, GBP).
   - Live FX toggle (Frankfurter API integration with stale-while-revalidate fallback).
   - Custom API Key injection (Google Gemini / OpenAI) for live AI executive briefings.

---

### 3. Core Workflows & Financial Simulation Engine
1. **Consolidated Multi-Currency Nostro/Vostro Ledger**:
   - Aggregates opening balances: Federal Reserve USD reserves ($500M), uncommitted Daylight Overdraft buffer ($250M), Deutsche Bank EUR (€120M), Barclays GBP (£60M), MUFG JPY (¥8B).
   - Dynamically normalizes all multi-currency positions to Base USD in real time.
2. **Mathematical Intraday Net Cumulative Cashflow Engine**:
   - Slices the business day (08:00 to 17:00 EST) into granular 15-minute operational intervals (37 buckets) and minute-level interpolations.
   - Computes dual trajectories:
     $$\text{Balance}_{\text{stressed}}(t) = \text{Opening} + \sum_{k=0}^{t} \text{Inflows}_k(t - \Delta_{\text{lag}}) - \sum_{k=0}^{t} \text{Outflows}_k \cdot (1 + \delta_{\text{runoff}})$$
   - Determines exact **Time to Breach**, **Peak Intraday Liquidity Deficit**, and **Minimum Buffer Margin**.
3. **BCBS 248 Regulatory Analytics**:
   - Metric A: Daily Maximum Intraday Liquidity Usage.
   - Metric B: Available Intraday Liquidity at Start of Day.
   - Metric C: Total Gross Payments Sent and Received.
   - Metric D: Time-Specific Obligations Throughput (% settled by 11:00, 13:00, 17:00).
4. **AI Treasury Copilot & Remediation Generator**:
   - Generates structured executive briefings with risk severity classification (`NORMAL`, `ELEVATED`, `CRITICAL`), BCBS 248 compliance warnings, tactical step-by-step action plans, and emergency central bank borrowing matrices.
   - Direct execution bridge from AI recommendations into live ledger state.
5. **Regulatory Compliance Pack Export**:
   - Export official BCBS 248 audit metrics to CSV.
   - Print-ready formatted executive ALCO briefing with charts, held transaction justification logs, and sign-off blocks.

---

### 4. Technical Architecture, Tools & Libraries
- **Framework & Runtime**: Vite + React 18 + TypeScript (Strict Mode, zero `any` types).
- **Styling & Design System**: Tailwind CSS configured with custom editorial color palette tokens, `@tailwindcss/typography`, custom soft diffuse shadow tokens, and Google Fonts (`Newsreader` serif for headings, `Plus Jakarta Sans` for body).
- **Icons & UI Components**: Lucide React (`lucide-react`), custom accessible modal/drawer primitives, custom slider and badge components.
- **Data Visualization**: Recharts (with custom soft theme curves, custom tooltips, reference breach thresholds, and brush range zooming) + lightweight SVG fallback.
- **External Market Data**: Frankfurter Spot FX API (`https://api.frankfurter.app`) with automatic failover to deterministic institutional rates.
- **AI Synthesis Engine**: `@google/genai` (Gemini 2.5 Flash) with fallback rule-based deterministic synthesis engine when offline or no API key is provided.
- **Package Manager**: **`pnpm`** exclusively.
- **Deployment Tooling**: `gh-pages` with automated base path routing for GitHub Pages.

---

### 5. Expected System Outputs
- **Daylight Runway Countdown Meter**: High-contrast, editorial badge indicating safe runway time (e.g., *"112 Minutes until Central Bank Daylight Cap is exceeded"* or *"Liquidity Secure"*).
- **Interactive Trajectory Curve**: Visual chart displaying Baseline vs. Stressed cumulative balance vs. the -$250M Central Bank Daylight Overdraft limit line.
- **Live KPI Dashboard**: 4 key indicators (Consolidated Opening Liquidity, Current Net Position, Daylight Overdraft Buffer, BCBS 248 Throughput).
- **Dynamic Payment Queue Table**: Filterable, searchable grid with real-time status indicators, priority badges, and instant Hold/Release buttons.
- **AI Risk Briefing Drawer**: Formatted ALCO-ready markdown briefing with step-by-step actionable recommendations.
- **BCBS 248 Compliance Summary & Export**: On-screen regulatory scorecard and exportable CSV/Print report.

---

### 6. Data Storage & State Architecture
- **In-Memory Reactive Ledger**: Pure reactive state engine using custom React hooks (`useLiquiditySimulation`, `useLiveRates`, `usePaymentQueue`).
- **Browser LocalStorage**: Persists user scenario adjustments, manual wire holds, custom API keys, and simulation audit logs across sessions.
- **Deterministic High-Fidelity Mock Database**: Rich dataset of 60+ institutional payment transactions (CLS FX, Fedwire Wholesale, Margin Calls, Corporate Deposits, Interbank transfers).

---

### 7. Deployment Strategy
- **Client-Side SPA**: Optimized static production bundle deployed via GitHub Pages (`gh-pages`) with configurable `base` path in `vite.config.ts`.
- **Environment Handling**: `.env` and `.env.example` supporting optional `VITE_GEMINI_API_KEY` for client-direct AI calls with offline fallback.

---

### 8. Definition of "Done"
1. Zero TypeScript compilation errors (`tsc --noEmit` clean).
2. Flawless execution of real-time stress testing sliders with zero UI lag.
3. Accurate mathematical modeling of BCBS 248 throughput and intraday cash curves.
4. Seamless manual payment throttling (Hold/Release) with instant chart recalculation.
5. Functional live FX rate updates with offline resilience.
6. Responsive AI Treasury Briefing with one-click remediation plan execution.
7. Strict adherence to the soft, organic editorial design system (warm off-white `#FAFAF9`, warm serif headings, deep charcoal text, sage/terracotta/slate accents, `rounded-2xl`/`3xl` shapes, and diffuse shadows).

---

### 9. Phased Implementation Roadmap
- **Phase 1 (MVP Foundation)**: Project setup with `pnpm`, Vite, TypeScript, Tailwind editorial design system, typography, synthetic multi-currency accounts and transaction dataset, core calculation engine (`useLiquiditySimulation`), KPI cards, SVG/Recharts runway chart, stress sliders, and payment queue table with hold/release actions.
- **Phase 2 (Async FX, Crisis Presets & AI Copilot)**: Live Frankfurter FX rates integration, 3 crisis scenario presets, AI Treasury Copilot with automated remediation workflow.
- **Phase 3 (Enterprise Polish & BCBS 248 Audit Pack)**: Regulatory scorecard, CSV dataset export, print-ready executive ALCO briefing view, and GitHub Pages deployment configuration.
