/**
 * ==============================================================================
 * 📓 TRADING JOURNAL DATA STORAGE & ANALYTICS ENGINE
 * ==============================================================================
 */

export type TradeDirection = 'BUY' | 'SELL';
export type TradeAssetType = 'IPO Allotment' | 'Equity / Cash' | 'F&O Options' | 'Swing Trade';
export type TradeStatus = 'CLOSED' | 'OPEN';
export type TradePsychology = 'Disciplined Plan Execution' | 'FOMO Entry' | 'Patient Dip Buy' | 'Panic Sell' | 'Revenge Trade';

export type JournalTrade = {
  id: string;
  symbol: string;
  name: string;
  assetType: TradeAssetType;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryDate: string;
  exitDate?: string;
  status: TradeStatus;
  setupStrategy: string;
  psychologyTag: TradePsychology;
  pnl?: number;
  pnlPct?: number;
  notes: string;
  tags: string[];
};

const JOURNAL_STORAGE_KEY = 'investoriq_trading_journal';

export const INITIAL_DEFAULT_TRADES: JournalTrade[] = [
  {
    id: 'trade-001',
    symbol: 'SWIGGY',
    name: 'Swiggy Limited',
    assetType: 'IPO Allotment',
    direction: 'BUY',
    entryPrice: 390,
    exitPrice: 448,
    quantity: 76,
    entryDate: '2026-08-10',
    exitDate: '2026-08-14',
    status: 'CLOSED',
    setupStrategy: 'IPO Listing Day Breakout',
    psychologyTag: 'Disciplined Plan Execution',
    pnl: 4408,
    pnlPct: 14.87,
    notes: 'Sold 2 lots on day 1 listing strength as dark store metrics proved strong in Q1.',
    tags: ['IPO', 'Listing Gains', 'Quick Commerce'],
  },
  {
    id: 'trade-002',
    symbol: 'ZOMATO',
    name: 'Zomato Limited',
    assetType: 'Swing Trade',
    direction: 'BUY',
    entryPrice: 242,
    exitPrice: 284,
    quantity: 200,
    entryDate: '2026-07-20',
    exitDate: '2026-08-05',
    status: 'CLOSED',
    setupStrategy: 'Blinkit Expansion Momentum',
    psychologyTag: 'Patient Dip Buy',
    pnl: 8400,
    pnlPct: 17.35,
    notes: 'Bought at 20 EMA daily pullback. Trailed stoploss to target resistance.',
    tags: ['Swing', 'Momentum', 'Tech Leader'],
  },
  {
    id: 'trade-003',
    symbol: 'HYUNDAI',
    name: 'Hyundai Motor India',
    assetType: 'IPO Allotment',
    direction: 'BUY',
    entryPrice: 1960,
    exitPrice: 1890,
    quantity: 14,
    entryDate: '2026-07-15',
    exitDate: '2026-07-22',
    status: 'CLOSED',
    setupStrategy: 'OFS High Valuation Play',
    psychologyTag: 'Disciplined Plan Execution',
    pnl: -980,
    pnlPct: -3.57,
    notes: 'Strict stop loss respected. Parent royalty payout pressure limited near-term upside.',
    tags: ['Auto', 'Stop Loss Respected'],
  },
  {
    id: 'trade-004',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    assetType: 'Equity / Cash',
    direction: 'BUY',
    entryPrice: 4120,
    exitPrice: 4450,
    quantity: 25,
    entryDate: '2026-06-10',
    exitDate: '2026-07-28',
    status: 'CLOSED',
    setupStrategy: 'Quarterly Earnings Breakout',
    psychologyTag: 'Patient Dip Buy',
    pnl: 8250,
    pnlPct: 8.01,
    notes: 'High dividend compounder play post large BFSI deal win announcements.',
    tags: ['IT Leader', 'Dividend', 'Large Cap'],
  },
  {
    id: 'trade-005',
    symbol: 'ATHER',
    name: 'Ather Energy Limited',
    assetType: 'IPO Allotment',
    direction: 'BUY',
    entryPrice: 340,
    quantity: 90,
    entryDate: '2026-08-15',
    status: 'OPEN',
    setupStrategy: 'EV Scooter Market Share Gain',
    psychologyTag: 'Disciplined Plan Execution',
    notes: 'Holding through upcoming production ramp-up in Maharashtra plant.',
    tags: ['IPO', 'EV', 'Growth'],
  },
];

export function getJournalTrades(): JournalTrade[] {
  if (typeof window === 'undefined') {
    return INITIAL_DEFAULT_TRADES;
  }

  try {
    const raw = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_TRADES));
      return INITIAL_DEFAULT_TRADES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEFAULT_TRADES;
  } catch {
    return INITIAL_DEFAULT_TRADES;
  }
}

export function saveJournalTrade(tradeData: Omit<JournalTrade, 'id'> & { id?: string }): JournalTrade {
  const currentTrades = getJournalTrades();
  const id = tradeData.id || `trade-${Date.now().toString().slice(-6)}`;

  // Calculate P&L if closed
  let pnl = tradeData.pnl;
  let pnlPct = tradeData.pnlPct;

  if (tradeData.status === 'CLOSED' && tradeData.exitPrice && tradeData.entryPrice && tradeData.quantity) {
    if (tradeData.direction === 'BUY') {
      pnl = Math.round((tradeData.exitPrice - tradeData.entryPrice) * tradeData.quantity);
      pnlPct = Math.round(((tradeData.exitPrice - tradeData.entryPrice) / tradeData.entryPrice) * 10000) / 100;
    } else {
      pnl = Math.round((tradeData.entryPrice - tradeData.exitPrice) * tradeData.quantity);
      pnlPct = Math.round(((tradeData.entryPrice - tradeData.exitPrice) / tradeData.entryPrice) * 10000) / 100;
    }
  }

  const newTrade: JournalTrade = {
    ...tradeData,
    id,
    pnl,
    pnlPct,
  };

  const updated = tradeData.id
    ? currentTrades.map((t) => (t.id === tradeData.id ? newTrade : t))
    : [newTrade, ...currentTrades];

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  }

  return newTrade;
}

export function deleteJournalTrade(id: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const currentTrades = getJournalTrades();
    const filtered = currentTrades.filter((t) => t.id !== id);
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function calculateJournalMetrics(trades: JournalTrade[]) {
  const closedTrades = trades.filter((t) => t.status === 'CLOSED' && t.pnl !== undefined);
  const totalClosed = closedTrades.length;

  const winningTrades = closedTrades.filter((t) => (t.pnl || 0) > 0);
  const losingTrades = closedTrades.filter((t) => (t.pnl || 0) < 0);

  const totalWinAmount = winningTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const totalLossAmount = Math.abs(losingTrades.reduce((acc, t) => acc + (t.pnl || 0), 0));
  const netPnl = totalWinAmount - totalLossAmount;

  const winRate = totalClosed > 0 ? Math.round((winningTrades.length / totalClosed) * 100) : 0;
  const profitFactor = totalLossAmount > 0 ? Math.round((totalWinAmount / totalLossAmount) * 100) / 100 : totalWinAmount > 0 ? 99 : 0;

  const avgWin = winningTrades.length > 0 ? Math.round(totalWinAmount / winningTrades.length) : 0;
  const avgLoss = losingTrades.length > 0 ? Math.round(totalLossAmount / losingTrades.length) : 0;
  const riskRewardRatio = avgLoss > 0 ? `1:${(avgWin / avgLoss).toFixed(1)}` : '1:2.5';

  return {
    totalTrades: trades.length,
    totalClosed,
    openTradesCount: trades.filter((t) => t.status === 'OPEN').length,
    netPnl,
    winRate,
    profitFactor,
    avgWin,
    avgLoss,
    riskRewardRatio,
    winningCount: winningTrades.length,
    losingCount: losingTrades.length,
  };
}
