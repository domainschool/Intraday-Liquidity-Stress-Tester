# Vibe Coding Prompt Playbook: LiquiShock AI

---

## Tier 1: MVP 1 — Zero-Config Setup, Local State & Reactive UI

### Prompt 1.1: Project Scaffolding, Synthetic Data Schema & Ledger Engine

```text
Role & Context:
You are an expert Frontend Architect and Financial Systems Engineer building "LiquiShock AI" — a real-time intraday liquidity stress-testing dashboard for corporate treasurers and bank risk managers.

Goal:
Build a zero-config, single-page React application (using Next.js App Router or Vite + React, Tailwind CSS, and Lucide React icons) that models a bank's intraday multi-currency liquidity ledger using pure local state and static mock data. No external APIs or backend services required.

Requirements:
1. File Structure & Types:
   - Create a TypeScript file `types/liquidity.ts`:
     - Account: { id: string, name: string, type: 'CENTRAL_BANK' | 'NOSTRO_EUR' | 'NOSTRO_GBP' | 'NOSTRO_JPY', currency: string, openingBalance: number, daylightOverdraftLimit: number, currentBalance: number }
     - PaymentTransaction: { id: string, timestamp: string (HH:mm:ss format between 08:00:00 and 17:00:00), counterparty: string, direction: 'INFLOW' | 'OUTFLOW', currency: string, amount: number, amountUSD: number, category: 'CLS_FX' | 'FEDWIRE_WHOLESALE' | 'RETAIL_DEPOSIT' | 'MARGIN_CALL' | 'INTERBANK', status: 'SETTLED' | 'QUEUED' | 'HELD', priority: 'CRITICAL' | 'STANDARD' | 'DISCRETIONARY' }
     - StressParameters: { depositRunoffRate: number (0 to 100%), inflowLagMinutes: number (0 to 240), foreignExchangeFreeze: boolean }

2. Mock Data Generator (`data/mockLiquidityData.ts`):
   - Generate opening balances:
     - Federal Reserve Settlement Account: $500,000,000 opening cash, $250,000,000 Daylight Overdraft Line (Total buffer: $750M).
     - Deutsche Bank Frankfurt (Nostro EUR): €120,000,000 (Base FX: 1.08 USD/EUR).
     - Barclays London (Nostro GBP): £60,000,000 (Base FX: 1.28 USD/GBP).
     - MUFG Tokyo (Nostro JPY): ¥8,000,000,000 (Base FX: 0.0065 USD/JPY).
   - Generate a deterministic list of 60 payment transactions occurring between 08:00 and 17:00. Include heavy scheduled outflows at 09:30 (Payroll/Vendor), 11:45 (CLS FX Settlement), and large counterparty inflows scheduled for 13:00 and 14:30.

3. Base Page Layout (`app/page.tsx`):
   - Clean, high-density financial UI.
   - Header with bank profile: "Horizon Continental Bank — Intraday Treasury Desk".
   - Top metrics bar displaying 4 KPI summary cards:
     1. Consolidated Opening Liquidity (in USD).
     2. Current Net Position (in USD).
     3. Maximum Daylight Overdraft Buffer ($250M).
     4. Current BCBS 248 Throughput Status (% of daily payments settled).
   - Main layout split into two columns: Left (60% width) reserved for runway visualization and controls; Right (40% width) for the active payment queue table.

```

---

### Prompt 1.2: Reactive Stress-Testing Engine & Simulation Sliders

```text
Role & Context:
You are continuing development of LiquiShock AI. We need to implement the core mathematical simulation engine that recalculates the bank's projected cash trajectory minute-by-minute based on real-time stress sliders.

Goal:
Implement reactive stress testing controls and an in-memory recalculation engine using React state.

Requirements:
1. Create `components/StressControlPanel.tsx`:
   - Sliders with visible tooltips, step increments, and badge value indicators:
     - "Deposit Runoff Accelerator": 0% to 100% (Increases the volume and velocity of outgoing RETAIL_DEPOSIT and FEDWIRE_WHOLESALE payments).
     - "Counterparty Settlement Lag": 0 to 240 minutes (Delays the arrival timestamp of all INFLOW transactions).
     - "FX Nostro Liquidity Freeze": Toggle switch (When ON, locks foreign Nostro balances at EUR, GBP, and JPY from being converted/swept to USD settlement accounts due to foreign market cut-off).
   - "Reset Baseline" button to clear all stress parameters back to zero.

2. Calculation Engine Hook (`hooks/useLiquiditySimulation.ts`):
   - Slice the trading day into 15-minute buckets from 08:00 to 17:00 (37 intervals).
   - Compute two trajectory curves:
     - Baseline Curve: Cumulative cash balance at each 15-minute mark under normal scheduled operations.
     - Stressed Curve: Cumulative cash balance at each 15-minute mark applying the stress parameters:
       * Stressed Outflows = Baseline Outflows * (1 + (depositRunoffRate / 100)).
       * Stressed Inflows = Inflows shifted forward in time by `inflowLagMinutes`.
       * Available Liquidity Floor = If FX Freeze is active, only Federal Reserve USD cash and overdraft cap are available; foreign Nostro balances are excluded from the settlement pool.
   - Output:
     - `timelineData`: Array of objects { time: '08:00', baselineBalance: number, stressedBalance: number, overdraftThreshold: number }
     - `timeToBreach`: Exact timestamp (or "NO BREACH") when `stressedBalance` drops below the -$250,000,000 Daylight Overdraft cap.
     - `peakIntradayDeficit`: The lowest dollar point reached during the day.

3. Mount the controls and calculation output into `app/page.tsx` with instantaneous updates as sliders move.

```

---

### Prompt 1.3: Real-Time Runway Chart & Daylight Overdraft Countdown

```text
Role & Context:
You are building the primary visual feedback module of LiquiShock AI. Corporate treasurers need an immediate, high-contrast visual display to know if their payment queue will cause a technical default today.

Goal:
Build the Intraday Liquidity Trajectory Chart and the "Runway Clock" component using pure CSS / SVG or HTML5 Canvas (zero external charting library dependencies for MVP 1).

Requirements:
1. Create `components/IntradayRunwayChart.tsx`:
   - Render a custom, responsive SVG line chart:
     - X-Axis: 08:00 to 17:00 with 1-hour marker ticks.
     - Y-Axis: Liquidity in Millions of USD (e.g., +$600M down to -$300M).
     - Draw a horizontal dashed red reference line at the Daylight Overdraft Cap (-$250M).
     - Draw a solid gray line for the Baseline Trajectory.
     - Draw a dynamic colored line for the Stressed Trajectory:
       * Emerald green when balance is > +$100M.
       * Amber when balance is between $0 and -$150M.
       * Bright crimson red when balance breaches -$250M.
     - Add an interactive hover tooltip that reveals the exact time, projected balance, and delta from baseline at that minute.

2. Create `components/RunwayCountdownClock.tsx`:
   - A prominent warning banner placed directly above the chart:
     - If `timeToBreach` is null: Display a green shield icon with text: "Liquidity Secure — 100% of payment obligations covered through 17:00 cut-off."
     - If `timeToBreach` is detected (e.g., "13:45"): Display a flashing amber/red warning card:
       * "CRITICAL LIQUIDITY BREACH IMMINENT"
       * Projected Breach Time: 13:45 EST
       * Estimated Time Remaining: e.g., "112 Minutes until Central Bank Daylight Cap is exceeded."
       * Projected Liquidity Shortfall at EOD: -$84.2M.

3. Connect all calculations directly to the state from Prompt 1.2 so that moving the Runoff slider instantly adjusts the SVG curve and triggers the breach alert.

```

---

### Prompt 1.4: Payment Queue Table with Interactive Throttling

```text
Role & Context:
Treasurers cannot just watch liquidity burn; they must take tactical action by holding or releasing discretionary wires to save the bank from defaulting on high-priority settlement obligations.

Goal:
Create an interactive transaction queue management table where treasurers can manually hold, release, or reprioritize queued outgoing payments, with immediate recalculation of the runway curve.

Requirements:
1. Create `components/PaymentQueueTable.tsx`:
   - Table showing the transaction log with columns:
     - Status Badge (Settled, Queued, Held)
     - Time
     - Counterparty / Clearing Network
     - Direction (Inflow / Outflow)
     - Amount (Currency & USD Normalized)
     - Category (CLS FX, Fedwire Wholesale, Margin Call, etc.)
     - Priority Badge (Critical, Standard, Discretionary)
     - Action Buttons: "Hold" / "Release" toggle.
   - Filter tabs: "All", "Outgoing Queued", "Held", "Critical CLS/Margin".
   - Search bar filtering by counterparty name or currency.

2. Interactive State Logic:
   - When a user clicks "Hold" on an outgoing transaction:
     - Its status switches to `HELD`.
     - The recalculation engine (`useLiquiditySimulation`) automatically removes that outflow from the stressed timeline.
     - The Runway Chart instantly reflects the newly saved cash balance, extending the time-to-breach.
   - When the user clicks "Release", the transaction re-enters the active queue at its original timestamp.

3. "Auto-Throttle Recommendations" Bar:
   - Add a banner above the table: "Recommended Action: Holding 3 Discretionary Interbank Wires ($45M total) will defer breach by 95 minutes."
   - Provide a "One-Click Safe Throttle" button that automatically sets all `DISCRETIONARY` outflows after 12:00 to `HELD`.

```

---

## Tier 2: MVP 2 — Live Async Data Streams, Skeletons & AI Synthesis

### Prompt 2.1: Live FX Pipeline, Asynchronous Currency Normalizer & Skeletons

```text
Role & Context:
We are advancing LiquiShock AI from static local data to live multi-currency ingestion. The application must fetch real-time foreign exchange spot rates from a free public endpoint, handle network latency gracefully with skeleton states, and dynamically convert Nostro balances to USD.

Goal:
Build a resilient client/server data fetching layer using Next.js Route Handlers and React Suspense/skeleton loaders.

Requirements:
1. Server Route Handler (`app/api/fx-rates/route.ts`):
   - Fetch live rates from Frankfurter API (`https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY`) or Open Exchange Rates.
   - Implement an in-memory 60-second cache (stale-while-revalidate pattern) to avoid rate limits.
   - Handle rate-limit errors and network failures gracefully by returning fallback institutional pegged rates: { EUR: 1.082, GBP: 1.285, JPY: 0.0066 }.
   - Return response format: { success: boolean, timestamp: string, rates: { EUR: number, GBP: number, JPY: number }, isFallback: boolean }.

2. Client-Side SWR/Hook (`hooks/useLiveRates.ts`):
   - Poll the API endpoint every 30 seconds.
   - Expose `{ rates, isLoading, isError, lastUpdated, refreshRates }`.
   - Track live delta badges (e.g., "EUR/USD +0.14% ▲") in the header.

3. Loading Skeleton States (`components/skeletons/DashboardSkeleton.tsx`):
   - Create shimmering pulse placeholders for:
     - The 4 top KPI cards.
     - The SVG runway chart.
     - The payment queue table rows.
   - Ensure zero layout shift (CLS) between the loading skeleton and hydrated live views.

4. Multi-Currency Normalization:
   - Wire the live rates directly into the Nostro balances and transaction stream so that any fluctuation in the Euro, British Pound, or Japanese Yen dynamically recalculates the consolidated USD liquidity buffer in real time.

```

---

### Prompt 2.2: AI Treasury Copilot via Secure LLM Integration

```text
Role & Context:
You are an Enterprise AI Engineer integrating an LLM Copilot into LiquiShock AI. When a liquidity breach is projected, corporate treasurers do not have time to read raw logs; they require a structured executive briefing and an actionable remediation plan.

Goal:
Build a secure, server-side LLM route using the Google Gen AI SDK (`@google/genai` targeting `gemini-2.5-flash`) or OpenAI SDK (`gpt-4o`) configured via environment variables (`process.env.GEMINI_API_KEY` or `process.env.OPENAI_API_KEY`).

Requirements:
1. API Route (`app/api/treasury-copilot/route.ts`):
   - Accept POST payload:
     {
       currentNetCash: number,
       peakDeficit: number,
       timeToBreach: string | null,
       activeStress: { runoff: number, lagMinutes: number, fxFrozen: boolean },
       queuedOutflowsCount: number,
       heldOutflowsVolumeUSD: number,
       topCriticalObligations: Array<{ time: string, counterparty: string, amountUSD: number, category: string }>
     }
   - Construct a rigorous System Prompt:
     "You are an elite Bank Treasurer and Basel III/BCBS 248 Liquidity Risk Specialist. Analyze the provided intraday liquidity stress profile. Respond ONLY with a valid JSON object matching the specified schema."
   - Target JSON output schema:
     {
       "severity": "NORMAL" | "ELEVATED" | "CRITICAL",
       "executiveBriefing": "string (2-3 sentences explaining the exact operational risk)",
       "bcbs248ComplianceAlert": "string (impact on intraday throughput targets and daylight overdraft caps)",
       "tacticalActionPlan": [
         { "step": 1, "action": "string", "rationale": "string", "liquidityImpactUSD": number }
       ],
       "emergencyFundingOptions": [
         { "facility": "Fed Discount Window" | "FHLB Advance" | "Intraday Repo", "estimatedAvailabilityUSD": number, "operationalLeadTime": "string" }
       ]
     }

2. Client-Side AI Copilot Drawer (`components/TreasuryCopilotModal.tsx`):
   - Trigger button in the header: "Generate AI Risk Briefing" (highlighted with an alert badge whenever a breach is predicted).
   - Display a streaming or formatted briefing with clear visual hierarchy:
     - Executive Alert Banner (Crimson / Amber / Green).
     - BCBS 248 Regulatory Notice Box.
     - Ordered Step-by-Step Tactical Action Plan with "Execute Suggestion" action buttons.
     - Emergency Central Bank Funding Matrix.
   - Include copy-to-clipboard button formatted for instant distribution to the Asset-Liability Committee (ALCO).

```

---

### Prompt 2.3: Preset Crisis Scenarios & Automated Remediation Workflows

```text
Role & Context:
Treasury risk teams conduct fire drills based on historical market dislocations. We need one-click crisis presets that configure the system parameters and trigger the AI Copilot evaluation automatically.

Goal:
Add one-click crisis injection buttons and simulated automated remediation workflows.

Requirements:
1. Create `components/CrisisPresetsBar.tsx`:
   - Provide 3 rapid scenario buttons:
     1. "2023 Digital Deposit Run": Sets Runoff to 45%, Inflow Lag to 60 mins, FX Unfrozen. (Simulates mass digital wholesale deposit outflows).
     2. "CLS Settlement Outage": Sets Runoff to 10%, Inflow Lag to 180 mins, FX Frozen = true. (Simulates European correspondent banking clearing gridlock).
     3. "Margin Call Squeeze": Injects 3 instantaneous, multi-million dollar outgoing `MARGIN_CALL` transactions at 11:00 EST.
   - Clicking any scenario smoothly animates the sliders to their target positions, recalculates the entire ledger, and automatically opens the AI Copilot drawer with the updated briefing.

2. Create `components/AutomatedRemediationBanner.tsx`:
   - When the AI Copilot returns a Tactical Action Plan (e.g., "Hold $85M in discretionary interbank transfers and draw $100M from committed FHLB line"):
   - Provide an "Execute Remediation Plan" action button.
   - When clicked:
     - Automatically updates the payment queue status for the specified transactions.
     - Adds a simulated liquidity injection to the Federal Reserve cash ledger.
     - Shows a success toast: "Remediation Plan Applied: Daylight Overdraft breach resolved. New projected EOD buffer: +$64.8M."

```

---

## Tier 3: Scaling for Enterprises — Persistence, Auth, Recharts & Dark Mode

### Prompt 3.1: Supabase/PostgreSQL Database Schema, Migrations & Service Layer

```text
Role & Context:
You are a Lead Database Architect scaling LiquiShock AI for tier-2 banks and large enterprise corporate treasuries. We need a robust relational schema with PostgreSQL / Supabase, Row Level Security (RLS), and audit trail tracking for regulatory compliance.

Goal:
Generate the SQL migration scripts and the TypeScript database client layer for persistence.

Requirements:
1. Supabase SQL Migration (`supabase/migrations/20260927_init_liquidity_schema.sql`):
   - Enable `uuid-ossp` extension.
   - Table `institutions`:
     - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     - `name` TEXT NOT NULL,
     - `lei_code` TEXT UNIQUE NOT NULL (Legal Entity Identifier),
     - `created_at` TIMESTAMPTZ DEFAULT NOW()
   - Table `accounts`:
     - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     - `institution_id` UUID REFERENCES institutions(id) ON DELETE CASCADE,
     - `account_name` TEXT NOT NULL,
     - `account_type` TEXT CHECK (account_type IN ('CENTRAL_BANK', 'NOSTRO', 'CLEARING_HOUSE')),
     - `currency` VARCHAR(3) NOT NULL,
     - `opening_balance` NUMERIC(18, 2) NOT NULL,
     - `daylight_overdraft_limit` NUMERIC(18, 2) DEFAULT 0.00
   - Table `payment_transactions`:
     - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     - `institution_id` UUID REFERENCES institutions(id) ON DELETE CASCADE,
     - `timestamp` TIME NOT NULL,
     - `counterparty` TEXT NOT NULL,
     - `direction` TEXT CHECK (direction IN ('INFLOW', 'OUTFLOW')),
     - `currency` VARCHAR(3) NOT NULL,
     - `amount` NUMERIC(18, 2) NOT NULL,
     - `category` TEXT NOT NULL,
     - `status` TEXT CHECK (status IN ('SETTLED', 'QUEUED', 'HELD')) DEFAULT 'QUEUED',
     - `priority` TEXT CHECK (priority IN ('CRITICAL', 'STANDARD', 'DISCRETIONARY'))
   - Table `stress_simulation_audits`:
     - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     - `institution_id` UUID REFERENCES institutions(id),
     - `executed_by_user_id` UUID NOT NULL,
     - `runoff_percentage` NUMERIC(5, 2),
     - `inflow_lag_minutes` INT,
     - `fx_frozen` BOOLEAN,
     - `breach_projected` BOOLEAN,
     - `projected_breach_time` TIME,
     - `peak_deficit_usd` NUMERIC(18, 2),
     - `ai_briefing_json` JSONB,
     - `created_at` TIMESTAMPTZ DEFAULT NOW()

2. Row Level Security (RLS) Policies:
   - Enable RLS on all tables.
   - Add institutional isolation policies: Users can only select/update records where `institution_id = auth.jwt() ->> 'institution_id'`.

3. Client Database Service (`lib/db/liquidityService.ts`):
   - Implement typed helper functions using `@supabase/supabase-js`:
     - `fetchInstitutionAccounts(institutionId: string)`
     - `fetchDailyTransactions(institutionId: string, date: string)`
     - `updateTransactionStatus(transactionId: string, status: 'QUEUED' | 'HELD')`
     - `logSimulationAudit(auditData: SimulationAuditInsert)`

```

---

### Prompt 3.2: Middleware Route Guards, RBAC & Regulatory Audit Logging

```text
Role & Context:
Financial institutions require strict role-based access control (RBAC) and immutable audit trails for every simulation and queue modification to satisfy regulatory auditors (OCC, Fed, ECB).

Goal:
Implement Next.js middleware guards, session handling, and automated audit logging for all user actions.

Requirements:
1. User Roles & Permissions (`types/auth.ts`):
   - Define roles:
     - `TREASURER_ADMIN`: Full access to run stress models, modify queue statuses (Hold/Release), and execute emergency facilities.
     - `RISK_ANALYST`: Can adjust stress sliders and view AI briefings; cannot hold/release payments.
     - `AUDITOR`: Read-only access to historical simulations and compliance audit logs.

2. Next.js Middleware (`middleware.ts`):
   - Intercept requests to `/dashboard`, `/admin`, and `/api/transactions/*`.
   - Verify active session via JWT/Supabase Auth.
   - Enforce role verification: If a `RISK_ANALYST` or `AUDITOR` attempts a POST/PATCH request to `/api/transactions/throttle`, reject with HTTP 403 Forbidden.

3. Compliance Audit Logger (`lib/logger/auditLogger.ts`):
   - Every time a user:
     1. Runs a stress test scenario exceeding a $50M deficit.
     2. Modifies a transaction status to `HELD` or `QUEUED`.
     3. Requests an AI executive briefing.
   - Automatically persist an immutable audit record to the `stress_simulation_audits` table capturing: User ID, Timestamp, IP Address, Action Performed, and Snapshot of Ledger State.

4. Audit Trail View (`app/dashboard/audit-logs/page.tsx`):
   - A searchable, filterable table for compliance teams displaying all historical stress tests, who initiated them, and what tactical remediation was taken.

```

---

### Prompt 3.3: Production Data Visualization with Recharts & Theme Architecture

```text
Role & Context:
Replace the MVP SVG chart with an enterprise-grade, high-performance charting architecture using Recharts. The dashboard must support dual light/dark themes suited for 24/7 trading floor desks and executive boardrooms.

Goal:
Build an interactive Recharts trajectory view and integrate a unified Dark Mode theme toggle.

Requirements:
1. Enterprise Recharts Implementation (`components/charts/EnterpriseRunwayChart.tsx`):
   - Use `ResponsiveContainer`, `ComposedChart`, `Area`, `Line`, `XAxis`, `YAxis`, `ReferenceLine`, `Tooltip`, and `Brush`.
   - Features:
     - Baseline Trajectory (Subtle dashed stroke).
     - Stressed Trajectory (Thick line with gradient Area fill underneath: green to crimson).
     - Reference line at `0.00` (Neutral balance line).
     - Prominent thick reference line at Daylight Overdraft threshold (-$250M) with label: "Fedwire Daylight Overdraft Cap".
     - Custom Tooltip displaying: Time, Net Balance, Inflow Volume in Bucket, Outflow Volume in Bucket, and Central Bank Capacity Remaining.
     - Include a range-selector `Brush` component at the bottom allowing the user to zoom into specific critical hours (e.g., 11:00 to 14:00 CLS/Fedwire window).

2. Theme Architecture (Tailwind + `next-themes`):
   - Install and configure `next-themes`.
   - Build a `ThemeToggle.tsx` component in the navigation bar.
   - Dark Mode Palette (Trading Desk Default):
     - Background: Deep slate/zinc `#090D16` and `#111827`.
     - Cards: `#1E293B` with border `#334155`.
     - Accents: Neon emerald `#10B981`, amber `#F59E0B`, crimson `#EF4444`, and electric cyan `#06B6D4`.
   - Light Mode Palette (Executive Boardroom):
     - Background: Crisp slate `#F8FAFC`.
     - Cards: Pure white `#FFFFFF` with soft shadows and border `#E2E8F0`.
   - Ensure the Recharts SVG strokes, grids, and tooltips dynamically update their hex colors when the theme switches without requiring a page reload.

```

---

### Prompt 3.4: BCBS 248 Regulatory Compliance Pack Export (PDF/CSV)

```text
Role & Context:
At the close of a stress test or business day, treasurers must produce formal documentation for the Risk Committee and central bank regulators proving compliance with BCBS 248 metrics.

Goal:
Build a one-click regulatory export engine generating formatted CSV data and print-ready PDF compliance reports.

Requirements:
1. Export Engine (`lib/export/complianceReport.ts`):
   - Calculate official BCBS 248 intraday metrics:
     1. Metric A: Daily Maximum Intraday Liquidity Usage.
     2. Metric B: Available Intraday Liquidity at Start of Day (USD + foreign Nostro converted).
     3. Metric C: Total Gross Payments Sent and Received.
     4. Metric D: Time-Specific Obligations Throughput (% settled before 11:00, 13:00, 17:00).
   - CSV Exporter: Outputs raw minute-by-minute simulated cash positions and queue statuses for import into bank enterprise risk engines.

2. Print-Ready PDF / Executive View (`app/dashboard/report/page.tsx`):
   - Uses Tailwind `@media print` styles or `@react-pdf/renderer`:
     - Bank Header, LEI Code, Timestamp of stress test, and Operator ID.
     - Formal Executive Summary table of BCBS 248 metrics.
     - High-resolution snapshot of the Runway Chart under the applied stress scenario.
     - Complete log of all `HELD` transactions with written justifications for regulatory inspectors.
     - AI Risk Copilot sign-off block with signature lines for Chief Risk Officer (CRO) and Head of Treasury.

3. Mount an "Export Regulatory Audit Pack" dropdown in the main dashboard navigation offering: "Download CSV Dataset" and "Export Official BCBS 248 PDF".

```