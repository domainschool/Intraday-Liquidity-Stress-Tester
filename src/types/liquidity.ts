export type AccountType = 'CENTRAL_BANK' | 'NOSTRO_EUR' | 'NOSTRO_GBP' | 'NOSTRO_JPY';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  openingBalance: number;
  daylightOverdraftLimit: number; // positive number representing available cap
  currentBalance: number;
  fxRateToBaseUSD: number; // rate to convert 1 foreign unit to USD
  institutionLocation: string;
}

export type PaymentDirection = 'INFLOW' | 'OUTFLOW';

export type PaymentCategory = 
  | 'CLS_FX' 
  | 'FEDWIRE_WHOLESALE' 
  | 'RETAIL_DEPOSIT' 
  | 'MARGIN_CALL' 
  | 'INTERBANK'
  | 'TREASURY_SWAP';

export type PaymentStatus = 'SETTLED' | 'QUEUED' | 'HELD';

export type PaymentPriority = 'CRITICAL' | 'STANDARD' | 'DISCRETIONARY';

export interface PaymentTransaction {
  id: string;
  timestamp: string; // HH:mm:ss format
  scheduledMinute: number; // minutes from 00:00 (e.g., 08:00 = 480, 17:00 = 1020)
  counterparty: string;
  direction: PaymentDirection;
  currency: string;
  amount: number;
  amountUSD: number;
  category: PaymentCategory;
  status: PaymentStatus;
  priority: PaymentPriority;
  description?: string;
  network?: 'Fedwire' | 'TARGET2' | 'CHAPS' | 'CLS' | 'CHIPS' | 'BOJ-NET';
}

export interface StressParameters {
  depositRunoffRate: number; // 0% to 100%
  inflowLagMinutes: number; // 0 to 240 minutes
  foreignExchangeFreeze: boolean; // Locks foreign Nostro from USD settlement pool
  instantMarginCallUSD?: number; // Optional unexpected CCP margin call
}

export interface TimelinePoint {
  time: string; // "08:00", "08:15", ...
  minuteOfDay: number;
  baselineInflows: number;
  baselineOutflows: number;
  baselineBalance: number;
  stressedInflows: number;
  stressedOutflows: number;
  stressedBalance: number;
  overdraftThreshold: number; // negative number representing overdraft cap, e.g. -250,000,000
  bufferRemaining: number;
  isBreached: boolean;
}

export interface BCBS248Metrics {
  metricA_maxIntradayUsageUSD: number; // peak net negative cash position
  metricB_availableStartDayLiquidityUSD: number; // opening cash + overdraft + eligible Nostro
  metricC_totalGrossSentUSD: number;
  metricC_totalGrossReceivedUSD: number;
  metricD_settledBy1100Pct: number;
  metricD_settledBy1300Pct: number;
  metricD_settledBy1700Pct: number;
}

export interface SimulationResult {
  timeline: TimelinePoint[];
  timeToBreach: string | null; // e.g. "13:45" or null if safe
  minutesToBreach: number | null;
  peakIntradayDeficitUSD: number; // lowest balance reached during the day
  peakDeficitTime: string;
  projectedEodBalanceUSD: number;
  baselineEodBalanceUSD: number;
  totalHeldOutflowUSD: number;
  totalActiveOutflowsUSD: number;
  totalActiveInflowsUSD: number;
  isBreached: boolean;
  bcbsMetrics: BCBS248Metrics;
}
