# LiquiShock AI — Intraday Liquidity Stress Testing Cockpit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![BCBS 248](https://img.shields.io/badge/Compliance-BCBS%20248-green.svg)](https://www.bis.org/publ/bcbs248.htm)

**LiquiShock AI** is a real-time intraday liquidity stress-testing and execution cockpit designed for corporate treasurers, heads of liquidity risk, and Asset-Liability Committee (ALCO) members in commercial banking.

---

## 🏦 The Core Business Problem

Traditional liquidity risk management relies on end-of-day ledgers and Basel III’s 30-day Liquidity Coverage Ratio (LCR). However, as evidenced during the 2023 Silicon Valley Bank run ($42B withdrawn in 10 hours), institutions fail due to **Intraday Timing Asymmetry**:
* **Outflows are instantaneous:** Scheduled Fedwire, TARGET2, and CLS settlement orders clear individually in real-time.
* **Inflows are uncertain and batched:** Counterparty credits and customer deposits arrive with unpredictable delays.
* **The Daylight Risk:** When intraday cash drops below the central bank Daylight Overdraft Cap (-$250M), outgoing payment queues freeze, triggering counterparty default penalties and clearing gridlock.

---

## ✨ Key Features

1. **Intraday Net Cumulative Cashflow Engine**:
   - Slices the 08:00 to 17:00 EST operating day into 15-minute buckets.
   - Calculates baseline vs. stressed cumulative cash balance trajectories.
   - Identifies exact **Time to Breach**, **Runway Minutes Remaining**, and **Peak Intraday Deficits**.

2. **Parametric Stress Testing & Crisis Presets**:
   - **Deposit Runoff Accelerator (0% – 100%)**: Amplifies the volume and velocity of outgoing wholesale and retail payments.
   - **Counterparty Inflow Lag (0 – 240 mins)**: Shifts incoming settlement timestamps forward in time.
   - **Nostro FX Market Freeze**: Locks foreign Nostro accounts (EUR, GBP, JPY) due to regional time-zone cut-offs.
   - **One-Click Presets**: *2023 Digital Deposit Run*, *CLS Settlement Gridlock*, and *Margin Call Squeeze*.

3. **Multi-Currency Nostro Consolidation**:
   - Live consolidation across Federal Reserve USD, Deutsche Bank EUR, Barclays GBP, and MUFG Bank JPY.
   - Automatic normalization to Base USD reporting currency.

4. **Active Payment Queue & Settlement Throttle**:
   - Real-time transaction grid (37+ institutional wires across Fedwire, TARGET2, CHAPS, CLS, and CHIPS).
   - Individual **Hold / Release** toggles with instantaneous curve recalculation.
   - **One-Click Safe Throttle**: Automatically holds non-essential discretionary interbank transfers to preserve daylight credit reserves.

5. **BCBS 248 Compliance Scorecard**:
   - Metric A: Daily Maximum Intraday Liquidity Usage.
   - Metric B: Available Intraday Liquidity at Start of Day.
   - Metric C: Total Gross Payments Sent and Received.
   - Metric D: Time-Specific Obligations Throughput (% settled by 11:00, 13:00, 17:00).

6. **Interactive Learning Deck & Systems Architecture**:
   - 8-chapter educational guide covering financial plumbing, high-level architecture, stakeholder personas, commercial valuation ($800k–$1.16M consulting breakdown), resume differentiation, and vibe coding prompt playbook with one-click copy buttons.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- `pnpm` (v9+)

### Installation
```bash
# Clone repository
git clone https://github.com/domainschool/Intraday-Liquidity-Stress-Tester.git
cd Intraday-Liquidity-Stress-Tester

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Build for Production
```bash
pnpm run build
```

### Deploy to GitHub Pages
```bash
pnpm run deploy
```

---

## 🎨 Design Philosophy
Crafted with a bespoke **soft, organic, and editorial aesthetic**:
- Background: Warm off-white (`#FAFAF9` / `#F5F5F4`)
- Typography: Clean serif headings (*Newsreader*) + legible sans-serif body (*Plus Jakarta Sans*)
- Accents: Muted earth tones (sage green, terracotta, slate, warm ochre)
- Geometry: Large `rounded-2xl` and `rounded-3xl` containers with diffuse ambient shadows

---

## 📜 License
MIT License. Built for educational and professional liquidity risk engineering.
