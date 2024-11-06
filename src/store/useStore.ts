import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Trade {
  id: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit?: number;
  size: number;
  profit?: number;
  status: 'OPEN' | 'CLOSED';
  stopLoss: number;
  takeProfit: number;
  timestamp: number;
  strategy: {
    name: string;
    signals: Array<{
      indicator: string;
      value: number;
      timestamp: number;
    }>;
  };
}

interface BotState {
  isActive: boolean;
  trades: Trade[];
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  activePairs: string[];
  settings: {
    riskPerTrade: number;
    maxDrawdown: number;
    maxOpenTrades: number;
    useML: boolean;
    useNewsTrading: boolean;
    tradingPairs: string[];
  };
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  closeTrade: (id: string, exitPrice: number) => void;
  updateBalance: (newBalance: number) => void;
  updateSettings: (settings: Partial<BotState['settings']>) => void;
  toggleBot: () => void;
}

const useStore = create<BotState>()(
  persist(
    (set) => ({
      isActive: false,
      trades: [],
      balance: 10000,
      equity: 10000,
      margin: 0,
      freeMargin: 10000,
      marginLevel: 100,
      activePairs: ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'],
      settings: {
        riskPerTrade: 1,
        maxDrawdown: 5,
        maxOpenTrades: 3,
        useML: true,
        useNewsTrading: true,
        tradingPairs: ['BTC/USD', 'XAU/USD'],
      },

      addTrade: (trade) =>
        set((state) => ({
          trades: [...state.trades, trade],
          margin: state.margin + trade.size * 0.1,
          freeMargin: state.freeMargin - trade.size * 0.1,
        })),

      updateTrade: (id, updates) =>
        set((state) => ({
          trades: state.trades.map((trade) =>
            trade.id === id ? { ...trade, ...updates } : trade
          ),
        })),

      closeTrade: (id, exitPrice) =>
        set((state) => {
          const trade = state.trades.find((t) => t.id === id);
          if (!trade) return state;

          const profit = (exitPrice - trade.entry) * trade.size * (trade.type === 'LONG' ? 1 : -1);
          const updatedTrades = state.trades.map((t) =>
            t.id === id
              ? {
                  ...t,
                  exit: exitPrice,
                  profit,
                  status: 'CLOSED' as const,
                }
              : t
          );

          return {
            trades: updatedTrades,
            balance: state.balance + profit,
            equity: state.equity + profit,
            margin: state.margin - trade.size * 0.1,
            freeMargin: state.freeMargin + trade.size * 0.1 + profit,
          };
        }),

      updateBalance: (newBalance) =>
        set((state) => ({
          balance: newBalance,
          equity: newBalance + state.trades.reduce((sum, trade) => sum + (trade.profit || 0), 0),
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),

      toggleBot: () =>
        set((state) => ({
          isActive: !state.isActive,
        })),
    }),
    {
      name: 'warthog-storage',
    }
  )
);

export default useStore;