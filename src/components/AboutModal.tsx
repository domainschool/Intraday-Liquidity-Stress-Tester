import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Workflow, 
  Users, 
  DollarSign, 
  GraduationCap, 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Activity,
  Layers,
  Lock,
  Landmark,
  Scale
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 
  | 'problem' 
  | 'domain' 
  | 'architecture' 
  | 'stakeholders' 
  | 'valuation' 
  | 'resume' 
  | 'prompts' 
  | 'enhancements';

interface PromptItem {
  id: string;
  tier: string;
  title: string;
  description: string;
  content: string;
}

const PROMPT_PLAYBOOK: PromptItem[] = [
  {
    id: 'p1-1',
    tier: 'Tier 1.1: MVP Scaffolding',
    title: 'Project Scaffolding, Synthetic Data Schema & Ledger Engine',
    description: 'Initializes the React + TypeScript application, defining multi-currency Nostro accounts and the scheduled 60+ transaction queue.',
    content: `Role & Context:
You are an expert Frontend Architect and Financial Systems Engineer building "LiquiShock AI" — a real-time intraday liquidity stress-testing dashboard for corporate treasurers and bank risk managers.

Goal:
Build a zero-config, single-page React application (using Vite + React, Tailwind CSS, and Lucide React icons) that models a bank's intraday multi-currency liquidity ledger using pure local state and static mock data. No external APIs or backend services required.

Requirements:
1. File Structure & Types:
   - Create a TypeScript file types/liquidity.ts:
     - Account: { id: string, name: string, type: 'CENTRAL_BANK' | 'NOSTRO_EUR' | 'NOSTRO_GBP' | 'NOSTRO_JPY', currency: string, openingBalance: number, daylightOverdraftLimit: number, currentBalance: number }
     - PaymentTransaction: { id: string, timestamp: string (HH:mm:ss format between 08:00:00 and 17:00:00), counterparty: string, direction: 'INFLOW' | 'OUTFLOW', currency: string, amount: number, amountUSD: number, category: 'CLS_FX' | 'FEDWIRE_WHOLESALE' | 'RETAIL_DEPOSIT' | 'MARGIN_CALL' | 'INTERBANK', status: 'SETTLED' | 'QUEUED' | 'HELD', priority: 'CRITICAL' | 'STANDARD' | 'DISCRETIONARY' }
     - StressParameters: { depositRunoffRate: number (0 to 100%), inflowLagMinutes: number (0 to 240), foreignExchangeFreeze: boolean }

2. Mock Data Generator (data/mockLiquidityData.ts):
   - Federal Reserve Settlement Account: $500,000,000 opening cash, $250,000,000 Daylight Overdraft Line.
   - Deutsche Bank Frankfurt (Nostro EUR): €120,000,000 (Base FX: 1.082 USD/EUR).
   - Barclays London (Nostro GBP): £60,000,000 (Base FX: 1.285 USD/GBP).
   - MUFG Tokyo (Nostro JPY): ¥8,000,000,000 (Base FX: 0.0066 USD/JPY).
   - 60 deterministic payment transactions occurring between 08:00 and 17:00.`
  },
  {
    id: 'p1-2',
    tier: 'Tier 1.2: Simulation Engine',
    title: 'Reactive Stress-Testing Engine & Simulation Sliders',
    description: 'Implements in-memory mathematical calculation across 15-minute intraday buckets with runoff multipliers and inflow lag shifts.',
    content: `Role & Context:
Implement the core mathematical simulation engine that recalculates the bank's projected cash trajectory minute-by-minute based on real-time stress sliders.

Goal:
Implement reactive stress testing controls and an in-memory recalculation engine using React state.

Requirements:
1. Create components/StressControlPanel.tsx:
   - "Deposit Runoff Accelerator": 0% to 100% (Increases volume/velocity of outgoing payments).
   - "Counterparty Settlement Lag": 0 to 240 minutes (Delays arrival of INFLOW transactions).
   - "FX Nostro Liquidity Freeze": Toggle switch (Locks foreign Nostro balances from USD settlement pool).

2. Calculation Engine Hook (hooks/useLiquiditySimulation.ts):
   - Slice the trading day into 15-minute buckets from 08:00 to 17:00 (37 intervals).
   - Compute Baseline Curve vs Stressed Curve:
     * Stressed Outflows = Baseline Outflows * (1 + (depositRunoffRate / 100)).
     * Stressed Inflows = Inflows shifted forward in time by inflowLagMinutes.
   - Outputs: timelineData, timeToBreach, peakIntradayDeficit.`
  },
  {
    id: 'p1-3',
    tier: 'Tier 1.3: Data Visualization',
    title: 'Real-Time Runway Chart & Daylight Overdraft Countdown',
    description: 'Builds the custom responsive SVG trajectory visualization with baseline, stressed curve, and -$250M overdraft cap.',
    content: `Goal:
Build the Intraday Liquidity Trajectory Chart and the Runway Clock warning banner using pure SVG.

Requirements:
1. Create components/IntradayRunwayChart.tsx:
   - X-Axis: 08:00 to 17:00 with 1-hour marker ticks.
   - Y-Axis: Liquidity in Millions of USD (+$800M down to -$300M).
   - Reference line at -$250M (Federal Reserve Daylight Overdraft Cap).
   - Stressed trajectory with dynamic color: emerald (>+$100M), amber ($0 to -$150M), crimson (< -$250M).
   - Interactive hover cursor and tooltip.

2. Create components/RunwayCountdownClock.tsx:
   - If timeToBreach is detected: Display flashing alert with projected breach time and runway remaining in minutes.
   - If secure: Display green posture badge.`
  },
  {
    id: 'p1-4',
    tier: 'Tier 1.4: Payment Throttling',
    title: 'Payment Queue Table with Interactive Throttling',
    description: 'Enables treasurers to hold or release specific wire obligations to extend liquidity runway and prevent gridlock.',
    content: `Goal:
Create an interactive transaction queue management table where treasurers can manually hold, release, or reprioritize queued outgoing payments.

Requirements:
1. Create components/PaymentQueueTable.tsx:
   - Table columns: Status, Time, Counterparty, Direction, Category, Priority, Amount USD, Action (Hold/Release).
   - Filter tabs: "All", "Outgoing Queued", "Held", "Critical CLS/Margin", "Discretionary".
2. Interactive State Logic:
   - Clicking "Hold" changes transaction status to HELD and removes outflow from stressed timeline.
   - Add "One-Click Safe Throttle" button to hold all discretionary interbank wires.`
  },
  {
    id: 'p2-1',
    tier: 'Tier 2.1: Live FX Pipeline',
    title: 'Live FX Pipeline & Multi-Currency Normalizer',
    description: 'Asynchronously fetches live spot rates from Frankfurter API with fallback to deterministic institutional rates.',
    content: `Goal:
Integrate live foreign exchange rates into the Nostro consolidation engine.

Requirements:
1. Fetch live rates from Frankfurter API (https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY).
2. Fallback gracefully to pegged institutional rates if API is unavailable or offline: { EUR: 1.082, GBP: 1.285, JPY: 0.0066 }.
3. Dynamically convert all foreign Nostro balances and multi-currency transactions to Base USD.`
  },
  {
    id: 'p2-2',
    tier: 'Tier 2.2: AI Treasury Copilot',
    title: 'AI Treasury Copilot & Structured ALCO Briefings',
    description: 'Leverages LLM integration to generate structured executive risk briefings and tactical emergency funding action plans.',
    content: `Goal:
Integrate an LLM Copilot producing JSON-structured executive briefings for the Asset-Liability Committee (ALCO).

System Prompt:
"You are an elite Bank Treasurer and BCBS 248 Liquidity Risk Specialist. Analyze the provided intraday liquidity stress profile. Respond with structured JSON containing severity, executiveBriefing, bcbs248ComplianceAlert, tacticalActionPlan, and emergencyFundingOptions."`
  },
  {
    id: 'p3-1',
    tier: 'Tier 3.1: Regulatory Compliance',
    title: 'BCBS 248 Compliance Summary & Audit Pack Export',
    description: 'Generates official Basel III BCBS 248 metrics (Max intraday usage, start-of-day available liquidity, and throughput quotas).',
    content: `Goal:
Calculate and export official BCBS 248 intraday metrics:
- Metric A: Daily Maximum Intraday Liquidity Usage.
- Metric B: Available Intraday Liquidity at Start of Day.
- Metric C: Total Gross Payments Sent and Received.
- Metric D: Time-Specific Obligations Throughput (% settled by 11:00, 13:00, 17:00).`
  }
];

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('problem');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>('p1-1');

  if (!isOpen) return null;

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const navItems: { id: TabType; number: string; title: string; icon: React.ReactNode }[] = [
    { id: 'problem', number: '1', title: 'Problem & Core Concept', icon: <Activity className="w-4 h-4" /> },
    { id: 'domain', number: '2', title: 'Required Domain Knowledge', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'architecture', number: '3', title: 'Data Flow & Architecture', icon: <Workflow className="w-4 h-4" /> },
    { id: 'stakeholders', number: '4', title: 'Stakeholders & Personas', icon: <Users className="w-4 h-4" /> },
    { id: 'valuation', number: '5', title: 'Commercial Valuation', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'resume', number: '6', title: 'College & Resume Strategy', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'prompts', number: '7', title: 'AI Vibe-Coding Prompts', icon: <Code2 className="w-4 h-4" /> },
    { id: 'enhancements', number: '8', title: 'Further Enhancements', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-canvas border border-charcoal-200/90 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-soft-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-charcoal-200/80 bg-surface/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-charcoal-800 text-canvas flex items-center justify-center shadow-soft-xs">
              <HelpCircle className="w-5 h-5 text-sage-300" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-serif font-semibold text-charcoal-900 tracking-tight">
                LiquiShock AI — Learning Deck & Systems Architecture
              </h2>
              <p className="text-xs text-charcoal-500">
                Comprehensive domain guide, financial engineering mechanics, and implementation playbook
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas hover:bg-surface border border-charcoal-200 flex items-center justify-center text-charcoal-500 hover:text-charcoal-900 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split Nav + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Sidebar */}
          <nav className="w-full md:w-64 border-r border-charcoal-200/80 bg-surface/50 p-3 md:p-4 overflow-y-auto shrink-0 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-charcoal-800 text-canvas shadow-soft-xs font-semibold'
                      : 'text-charcoal-600 hover:bg-surface hover:text-charcoal-900'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono shrink-0 ${
                    isActive ? 'bg-charcoal-700 text-sage-300' : 'bg-charcoal-200/70 text-charcoal-700'
                  }`}>
                    {item.number}
                  </span>
                  <span className="truncate">{item.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Content Panel */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-canvas space-y-6">
            
            {/* TAB 1: Problem & Core Concept */}
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <Activity className="w-4 h-4" />
                    <span>Executive Problem Statement</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    The Business Problem: Intraday Liquidity Timing Asymmetry
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2 leading-relaxed">
                    Most financial institutions operate under the illusion of solvency while remaining dangerously exposed to intraday illiquidity. While balance-sheet solvency examines whether assets exceed liabilities at end-of-day, <strong>intraday liquidity is an execution race against the clock</strong>.
                  </p>
                </div>

                {/* Interactive Problem Flow Diagram */}
                <div className="rounded-2xl bg-surface/80 border border-charcoal-200/80 p-5 space-y-3 shadow-soft-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    The Failure Propagation Flow:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-3.5 rounded-xl bg-terracotta-50/80 border border-terracotta-200/80">
                      <span className="text-[10px] font-mono font-semibold text-terracotta-700 uppercase block mb-1">Trigger</span>
                      <strong className="text-terracotta-900 block text-xs">Wholesale Outflow Spike</strong>
                      <span className="text-[11px] text-terracotta-700 mt-1 block">Deposits leave instantly via API/Fedwire</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-ochre-50/80 border border-ochre-200/80">
                      <span className="text-[10px] font-mono font-semibold text-ochre-700 uppercase block mb-1">Asymmetry</span>
                      <strong className="text-ochre-900 block text-xs">Inflow Settlement Delay</strong>
                      <span className="text-[11px] text-ochre-700 mt-1 block">Counterparty wire delayed by 2–4 hours</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-terracotta-100/80 border border-terracotta-300/80">
                      <span className="text-[10px] font-mono font-semibold text-terracotta-800 uppercase block mb-1">Breach</span>
                      <strong className="text-terracotta-900 block text-xs">Daylight Cap Breached</strong>
                      <span className="text-[11px] text-terracotta-800 mt-1 block">Central bank -$250M line exhausted</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-charcoal-800 text-canvas">
                      <span className="text-[10px] font-mono font-semibold text-sage-300 uppercase block mb-1">Catastrophe</span>
                      <strong className="text-canvas block text-xs">Queue Gridlock & Default</strong>
                      <span className="text-[11px] text-charcoal-300 mt-1 block">Outgoing wires freeze; clearing fines</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-charcoal-700 leading-relaxed">
                  <h4 className="font-serif font-semibold text-charcoal-900 text-base">
                    The Modern Reality: SVB & Digital Bank Runs
                  </h4>
                  <p>
                    On March 10, 2023, Silicon Valley Bank lost <strong>$42 billion in 10 hours</strong>—over $1 million per second. Treasurers do not default at 5:00 PM when accounting ledgers close; they default at <strong>1:15 PM</strong> when their Federal Reserve settlement account drops below overdraft limits and incoming wires are delayed.
                  </p>
                  <p>
                    <strong>The Solution:</strong> LiquiShock AI provides real-time minute-by-minute trajectory forecasting, dynamic counterparty stress modeling, and actionable wire throttling so treasury teams can prevent central bank breaches before they occur.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Required Domain Knowledge */}
            {activeTab === 'domain' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Financial Plumbing & Institutional Concepts</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    Required Domain Knowledge & Key Terms
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2">
                    To master and build this system, students must understand the core institutional mechanics of global payments and banking regulation:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/70 space-y-1.5 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900">
                      <Scale className="w-4 h-4 text-sage-600" />
                      <span>BCBS 248 Regulatory Framework</span>
                    </div>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      Basel Committee mandate requiring banks to monitor intraday metrics: (1) Daily maximum intraday liquidity usage, (2) Available start-of-day liquidity, (3) Total gross payments sent/received, and (4) Throughput quotas (e.g. settling 60% of payments by 1:00 PM).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/70 space-y-1.5 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900">
                      <Activity className="w-4 h-4 text-terracotta-600" />
                      <span>RTGS vs. DNS Settlement Pipes</span>
                    </div>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      <strong>RTGS (Real-Time Gross Settlement)</strong> like Fedwire and TARGET2 clears transactions individually and irrevocably. If your cash runs out, outgoing wires halt. <strong>DNS (Deferred Net Settlement)</strong> like CHIPS and ACH batches transactions and nets them periodically.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/70 space-y-1.5 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900">
                      <Landmark className="w-4 h-4 text-ochre-600" />
                      <span>Nostro vs. Vostro Accounts</span>
                    </div>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      <strong>Nostro ("Ours")</strong> is our bank's account held at a foreign correspondent bank (e.g. EUR at Deutsche Bank). <strong>Vostro ("Yours")</strong> is their account with us. When foreign time zones close, offshore Nostro liquidity becomes "trapped" and cannot fund US RTGS queues.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/70 space-y-1.5 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900">
                      <Lock className="w-4 h-4 text-slate-600" />
                      <span>CLS (Continuous Linked Settlement) & PvP</span>
                    </div>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      Eliminates FX settlement risk via Payment-versus-Payment (PvP). Both currency legs settle simultaneously. Missing a hard CLS 11:45 EST window triggers syndicate clearing fines and credit downgrade warnings.
                    </p>
                  </div>
                </div>

                {/* Mathematical Engine Formula */}
                <div className="p-5 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                    The Mathematical Intraday Engine Formula:
                  </h4>
                  <div className="p-3.5 rounded-xl bg-canvas border border-charcoal-200 font-mono text-xs text-charcoal-900 overflow-x-auto">
                    ProjectedBalance(t) = OpeningCash + ∑ Inflows_k(t - Lag) - ∑ Outflows_k · (1 + RunoffRate)
                  </div>
                  <p className="text-xs text-charcoal-500">
                    Where a breach occurs whenever <code className="font-mono text-terracotta-700 font-semibold">ProjectedBalance(t) &lt; -DaylightOverdraftLimit (-$250M)</code>.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Architecture & Data Flow */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <Workflow className="w-4 h-4" />
                    <span>Engineering Architecture</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    System Architecture & State Flow
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2">
                    LiquiShock AI combines an in-memory streaming calculation engine with pure reactive state management and resilient external market data fallbacks:
                  </p>
                </div>

                {/* Visual Architecture Boxes */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2">
                    <span className="text-[10px] font-sans font-semibold text-charcoal-500 uppercase tracking-wider block">
                      1. Ingestion Layer
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-200 text-charcoal-800">
                        [Fed Reserve USD Account] ($500M Cash + $250M Cap)
                      </div>
                      <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-200 text-charcoal-800">
                        [Multi-CCY Nostro Balances] (EUR €120M, GBP £60M, JPY ¥8B)
                      </div>
                      <div className="p-2.5 rounded-xl bg-canvas border border-charcoal-200 text-charcoal-800">
                        [Frankfurter FX Feed] (Live Spot Rates + pegged fallback)
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center text-charcoal-400">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200 space-y-2">
                    <span className="text-[10px] font-sans font-semibold text-sage-800 uppercase tracking-wider block">
                      2. Reactive Simulation Hook (`useLiquiditySimulation.ts`)
                    </span>
                    <div className="text-charcoal-700 text-xs font-sans leading-relaxed">
                      Slices 08:00–17:00 operating day into 37 15-minute buckets &bull; Applies parametric deposit runoff & inflow time-shifts &bull; Computes cumulative cash curves and exact breach minutes in &lt;10ms.
                    </div>
                  </div>

                  <div className="flex justify-center text-charcoal-400">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2">
                    <span className="text-[10px] font-sans font-semibold text-charcoal-500 uppercase tracking-wider block">
                      3. Control Tower Cockpit UI
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-charcoal-800">
                      <div className="p-2 rounded-xl bg-canvas border border-charcoal-200">
                        Runway Countdown Meter
                      </div>
                      <div className="p-2 rounded-xl bg-canvas border border-charcoal-200">
                        Responsive SVG Curve
                      </div>
                      <div className="p-2 rounded-xl bg-canvas border border-charcoal-200">
                        Interactive Queue Throttle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Stakeholders & Personas */}
            {activeTab === 'stakeholders' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Target Audience & User Journeys</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    Stakeholders & User Personas
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2">
                    Who uses LiquiShock AI inside tier-1 banks, corporate treasuries, and regulatory agencies:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-charcoal-800 text-canvas flex items-center justify-center font-serif font-bold text-sm">
                        HT
                      </div>
                      <div>
                        <strong className="text-charcoal-900 text-sm block font-serif">Head of Treasury / Assistant Treasurer</strong>
                        <span className="text-charcoal-500">Corporate & Regional Bank Treasury</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed pt-1">
                      <strong>Goal:</strong> Optimize cash buffer efficiency without idling expensive capital, ensure daylight overdraft lines are never breached, and maintain multi-currency Nostro sweep balance across Frankfurt, London, and Tokyo.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-terracotta-700 text-canvas flex items-center justify-center font-serif font-bold text-sm">
                        SO
                      </div>
                      <div>
                        <strong className="text-charcoal-900 text-sm block font-serif">Intraday Settlement & Money Market Trader</strong>
                        <span className="text-charcoal-500">Trading Desk & Payments Operations</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed pt-1">
                      <strong>Goal:</strong> Monitor active Fedwire/TARGET2 queues, execute tactical wire holds on discretionary interbank payments during liquidity squeezes, and guarantee on-time settlement of critical CLS PvP commitments.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sage-700 text-canvas flex items-center justify-center font-serif font-bold text-sm">
                        CR
                      </div>
                      <div>
                        <strong className="text-charcoal-900 text-sm block font-serif">Chief Risk Officer & ALCO Members</strong>
                        <span className="text-charcoal-500">Asset-Liability Management Committee</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed pt-1">
                      <strong>Goal:</strong> Run historical crisis simulations (e.g. 2023 Digital Bank Run), verify compliance with BCBS 248 throughput rules, and review executive remediation recommendations.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-700 text-canvas flex items-center justify-center font-serif font-bold text-sm">
                        BE
                      </div>
                      <div>
                        <strong className="text-charcoal-900 text-sm block font-serif">Bank Examiners & Central Bank Regulators</strong>
                        <span className="text-charcoal-500">Federal Reserve, ECB, Bank of England</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed pt-1">
                      <strong>Goal:</strong> Audit intraday liquidity risk management practices, assess daylight overdraft compliance records, and verify the institution has automated queue contingency controls.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Commercial Valuation */}
            {activeTab === 'valuation' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <DollarSign className="w-4 h-4" />
                    <span>Enterprise Software Economics</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    Commercial Valuation & Consulting Cost Breakdown
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2">
                    How much would a tier-1 financial consulting firm (McKinsey, Accenture, Oliver Wyman, EY) charge to design, build, and deploy this system for a regional bank:
                  </p>
                </div>

                <div className="rounded-2xl bg-surface border border-charcoal-200/80 overflow-hidden shadow-soft-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-charcoal-100 text-charcoal-700 font-semibold border-b border-charcoal-200">
                      <tr>
                        <th className="p-3.5">Consulting Phase</th>
                        <th className="p-3.5">Deliverables & Scope</th>
                        <th className="p-3.5">Timeline</th>
                        <th className="p-3.5 text-right">Estimated Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                      <tr>
                        <td className="p-3.5 font-semibold text-charcoal-900">Phase 1: Discovery & Regulatory Gap Analysis</td>
                        <td className="p-3.5 text-charcoal-600">BCBS 248 assessment, Nostro mapping, daylight overdraft credit limits calibration</td>
                        <td className="p-3.5 font-mono">4–6 weeks</td>
                        <td className="p-3.5 text-right font-mono font-semibold text-charcoal-900">$140,000 – $180,000</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-charcoal-900">Phase 2: Mathematical Engine & Frontend Cockpit</td>
                        <td className="p-3.5 text-charcoal-600">In-memory cashflow engine, trajectory curves, scenario injection, payment queue throttle UI</td>
                        <td className="p-3.5 font-mono">8–12 weeks</td>
                        <td className="p-3.5 text-right font-mono font-semibold text-charcoal-900">$320,000 – $450,000</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-charcoal-900">Phase 3: Core Banking & SWIFT/Fedwire Integration</td>
                        <td className="p-3.5 text-charcoal-600">ISO 20022 message parsers (pacs.008, pacs.009), real-time FX gateway, webhook feeds</td>
                        <td className="p-3.5 font-mono">8–10 weeks</td>
                        <td className="p-3.5 text-right font-mono font-semibold text-charcoal-900">$220,000 – $340,000</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-charcoal-900">Phase 4: ALCO Model Validation & Regulatory Sign-Off</td>
                        <td className="p-3.5 text-charcoal-600">Independent risk verification, backtesting against historical bank runs, examiner audit trails</td>
                        <td className="p-3.5 font-mono">4–6 weeks</td>
                        <td className="p-3.5 text-right font-mono font-semibold text-charcoal-900">$120,000 – $190,000</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-charcoal-800 text-canvas font-semibold">
                      <tr>
                        <td colSpan={3} className="p-3.5 text-sm font-serif">
                          Total Enterprise Engagement Value
                        </td>
                        <td className="p-3.5 text-right font-mono text-sm text-sage-300">
                          $800,000 – $1,160,000
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <p className="text-xs text-charcoal-500 leading-relaxed italic">
                  By constructing this full-stack application with modular TypeScript architecture, reactive simulation math, and domain-accurate financial plumbing, you have built software that matches enterprise treasury software solutions.
                </p>
              </div>
            )}

            {/* TAB 6: Resume & College Strategy */}
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    <span>Career & Portfolio Strategy</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    College Application & Resume Differentiation
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2">
                    How this project sets you apart from thousands of candidates who only build generic to-do apps or weather widgets:
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <h4 className="font-serif font-semibold text-charcoal-900 text-sm">
                      Targeted Resume Bullet Points
                    </h4>
                    <ul className="space-y-2 text-charcoal-700 list-disc list-inside">
                      <li>
                        <strong>Engineered Real-Time Intraday Liquidity Risk Cockpit:</strong> Modeled Basel III (BCBS 248) regulatory throughput metrics and Fedwire RTGS settlement queues across 37 15-minute operational intervals.
                      </li>
                      <li>
                        <strong>Architected In-Memory Parametric Stress Engine:</strong> Built dynamic shock simulator recalculating net cumulative cashflow trajectories, daylight overdraft limits, and time-to-breach in sub-10ms using strict TypeScript and React.
                      </li>
                      <li>
                        <strong>Implemented Multi-Currency Nostro Consolidation:</strong> Normalized global positions across USD, EUR, GBP, and JPY with resilient public FX rate ingestion and automatic fallback caching.
                      </li>
                      <li>
                        <strong>Designed Tactical Payment Queue Throttling:</strong> Created interactive execution controls to programmatically hold non-essential interbank wires, saving $45M+ in daylight liquidity reserves during simulated bank runs.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 space-y-2">
                    <h4 className="font-serif font-semibold text-sage-900 text-sm">
                      Interview Talking Points for Quant / FinTech / SWE Roles
                    </h4>
                    <p className="text-charcoal-700 leading-relaxed">
                      "I didn't just build a CRUD dashboard; I addressed the acute <em>Intraday Timing Asymmetry</em> in commercial banking. I studied the mechanics of the 2023 SVB run and designed an active execution cockpit that simulates how delays in incoming wires can trigger technical defaults on central bank daylight overdraft caps."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: AI Vibe-Coding Prompts */}
            {activeTab === 'prompts' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <Code2 className="w-4 h-4" />
                    <span>Vibe Coding Prompt Runway</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    Series of Prompts Used to Build This App
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2">
                    Click any prompt below to review or copy the exact engineering instructions used to generate this entire product:
                  </p>
                </div>

                <div className="space-y-3">
                  {PROMPT_PLAYBOOK.map((p) => {
                    const isExpanded = expandedPromptId === p.id;
                    const isCopied = copiedPromptId === p.id;

                    return (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-charcoal-200/80 bg-surface/70 overflow-hidden transition-all shadow-soft-xs"
                      >
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface transition-colors"
                          onClick={() => setExpandedPromptId(isExpanded ? null : p.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-charcoal-800 text-canvas">
                              {p.tier}
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-charcoal-900 font-serif">
                                {p.title}
                              </h4>
                              <p className="text-xs text-charcoal-500 hidden sm:block">
                                {p.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPrompt(p.id, p.content);
                              }}
                              className="p-1.5 rounded-xl bg-canvas hover:bg-surface border border-charcoal-200 text-charcoal-600 hover:text-charcoal-900 transition-colors flex items-center gap-1 text-xs"
                              title="Copy prompt text"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-sage-600" />
                                  <span className="text-sage-700 font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button className="text-charcoal-400 p-1">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 border-t border-charcoal-200 bg-charcoal-900 text-charcoal-100 font-mono text-xs overflow-x-auto leading-relaxed selection:bg-sage-600">
                            <pre className="whitespace-pre-wrap">{p.content}</pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 8: Further Enhancements */}
            {activeTab === 'enhancements' && (
              <div className="space-y-6">
                <div className="border-b border-charcoal-100 pb-4">
                  <div className="flex items-center gap-2 text-sage-700 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Future Product Roadmap</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mt-1">
                    Further Enhancements & Enterprise Expansion
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-2">
                    High-impact features to scale LiquiShock AI into a full-scale institutional treasury platform:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-charcoal-900 font-semibold">
                      <Layers className="w-4 h-4 text-sage-600" />
                      <span>ISO 20022 Direct SWIFT Ingestion</span>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed">
                      Parse raw XML formats (pacs.008 customer credit transfers, pacs.009 financial institution transfers, and camt.053 intraday bank-to-customer statements) directly into the state engine.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-charcoal-900 font-semibold">
                      <Activity className="w-4 h-4 text-terracotta-600" />
                      <span>Monte Carlo Stochastic Inflow Arrival</span>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed">
                      Run 10,000 probabilistic simulations of counterparty settlement delays using Poisson arrival distributions to output confidence bands on peak daylight overdraft exposure.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-charcoal-900 font-semibold">
                      <Landmark className="w-4 h-4 text-ochre-600" />
                      <span>Smart Collateral Optimization (HQLA)</span>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed">
                      Automated algorithm calculating the cheapest collateral mix (US Treasuries vs MBS) to pledge to the Federal Reserve Discount Window or FHLB to instantly unlock emergency liquidity.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2 shadow-soft-xs">
                    <div className="flex items-center gap-2 text-charcoal-900 font-semibold">
                      <Lock className="w-4 h-4 text-slate-600" />
                      <span>Multi-Tenant RBAC & PostgreSQL Audit Log</span>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed">
                      Enterprise role separation (Treasurer Admin vs Risk Analyst vs Auditor) with cryptographically immutable simulation audit logs persisted to PostgreSQL/Supabase.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-charcoal-200/80 bg-surface/80 flex items-center justify-between text-xs text-charcoal-500">
          <span>LiquiShock AI &bull; Interactive Educational Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-900 text-canvas font-medium transition-colors"
          >
            Close Learning Deck
          </button>
        </div>
      </div>
    </div>
  );
};
