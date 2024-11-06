import { v4 as uuidv4 } from 'uuid';
import useStore from '../store/useStore';
import { strategyService } from './strategyService';
import { riskManagementService } from './riskManagementService';
import { newsService } from './newsService';

export interface MarketData {
  price: number;
  timestamp: number;
  volume: number;
  high: number;
  low: number;
}

class TradingService {
  private ws: WebSocket | null = null;
  private marketData: Map<string, MarketData> = new Map();
  private subscribers: Map<string, Set<(data: MarketData) => void>> = new Map();
  private botInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    this.initializeWebSocket();
  }

  startBot() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    const store = useStore.getState();
    
    this.botInterval = setInterval(async () => {
      if (!this.isRunning) return;

      for (const pair of store.settings.tradingPairs) {
        try {
          await this.analyzePairAndTrade(pair);
        } catch (error) {
          console.error(`Error analyzing ${pair}:`, error);
        }
      }
    }, 60000); // Check every minute
  }

  stopBot() {
    this.isRunning = false;
    if (this.botInterval) {
      clearInterval(this.botInterval);
      this.botInterval = null;
    }
  }

  private async analyzePairAndTrade(pair: string) {
    const store = useStore.getState();
    if (!store.isActive) return;

    const marketData = this.getMarketData(pair);
    if (!marketData) return;

    // Check for high-impact news
    const newsEvents = newsService.getEventsByPair(pair);
    if (newsEvents.some(e => e.impact === 'HIGH')) {
      console.log(`Skipping ${pair} due to high-impact news event`);
      return;
    }

    // Get trading signals
    const strategy = await strategyService.analyzeMarket(pair, [marketData]);
    if (strategy.signal === 'NEUTRAL') return;

    // Validate trade
    const validation = await riskManagementService.validateTrade({
      pair,
      type: strategy.signal === 'BUY' ? 'LONG' : 'SHORT',
      size: this.calculatePositionSize(marketData.price, strategy.stopLoss),
      entryPrice: marketData.price,
      stopLoss: strategy.stopLoss,
      takeProfit: strategy.takeProfit
    });

    if (!validation.valid) {
      console.log(`Trade validation failed for ${pair}:`, validation.reason);
      return;
    }

    // Place trade
    await this.placeTrade({
      pair,
      type: strategy.signal === 'BUY' ? 'LONG' : 'SHORT',
      size: this.calculatePositionSize(marketData.price, strategy.stopLoss),
      stopLoss: strategy.stopLoss,
      takeProfit: strategy.takeProfit
    });
  }

  private calculatePositionSize(currentPrice: number, stopLoss: number): number {
    const store = useStore.getState();
    return riskManagementService.calculatePositionSize(
      store.balance,
      store.settings.riskPerTrade,
      currentPrice,
      stopLoss
    );
  }

  private initializeWebSocket() {
    // Implementation remains the same
  }

  private handleMarketData(data: any) {
    // Implementation remains the same
  }

  private notifySubscribers(pair: string, data: MarketData) {
    // Implementation remains the same
  }

  subscribeToPrice(pair: string, callback: (data: MarketData) => void) {
    // Implementation remains the same
  }

  unsubscribeFromPrice(pair: string, callback: (data: MarketData) => void) {
    // Implementation remains the same
  }

  async placeTrade(params: {
    pair: string;
    type: 'LONG' | 'SHORT';
    size: number;
    stopLoss: number;
    takeProfit: number;
  }) {
    // Implementation remains the same
  }

  async closeTrade(tradeId: string) {
    // Implementation remains the same
  }

  getMarketData(pair: string): MarketData | undefined {
    return this.marketData.get(pair);
  }
}

export const tradingService = new TradingService();