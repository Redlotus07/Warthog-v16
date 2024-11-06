import { indicators } from './indicators';
import { mlService } from './mlService';
import { newsService } from './newsService';
import { MarketData } from './tradingService';

interface StrategyResult {
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  reasons: string[];
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
}

class StrategyService {
  async analyzeMarket(pair: string, marketData: MarketData[]): Promise<StrategyResult> {
    const prices = marketData.map(d => d.price);
    const volumes = marketData.map(d => d.volume);

    // Technical Analysis
    const rsi = indicators.calculateRSI(prices);
    const macd = indicators.calculateMACD(prices);
    const bb = indicators.calculateBollingerBands(prices);
    const volume = indicators.analyzeVolume(volumes, prices);

    // ML Analysis
    const mlPrediction = await mlService.analyzePair(pair);

    // News Analysis
    const newsEvents = newsService.getEventsByPair(pair);
    const hasHighImpactNews = newsEvents.some(e => e.impact === 'HIGH');

    // Combine signals
    const signals = this.combineSignals({
      rsi,
      macd,
      volume,
      mlPrediction,
      currentPrice: prices[prices.length - 1],
      bb
    });

    // Risk management
    const { stopLoss, takeProfit } = this.calculateExitPoints(
      signals.signal,
      prices[prices.length - 1],
      bb
    );

    return {
      ...signals,
      stopLoss,
      takeProfit,
      timeframe: hasHighImpactNews ? '1h' : '4h',
      reasons: this.generateReasons({
        rsi,
        macd,
        volume,
        mlPrediction,
        hasHighImpactNews
      })
    };
  }

  private combineSignals(data: any): { signal: 'BUY' | 'SELL' | 'NEUTRAL'; confidence: number } {
    let buySignals = 0;
    let sellSignals = 0;
    let totalWeight = 0;

    // RSI (weight: 2)
    if (data.rsi.signal === 'BUY') buySignals += 2 * data.rsi.strength;
    if (data.rsi.signal === 'SELL') sellSignals += 2 * data.rsi.strength;
    totalWeight += 2;

    // MACD (weight: 2)
    if (data.macd.signal === 'BUY') buySignals += 2 * data.macd.strength;
    if (data.macd.signal === 'SELL') sellSignals += 2 * data.macd.strength;
    totalWeight += 2;

    // Volume (weight: 1)
    if (data.volume.signal === 'BUY') buySignals += data.volume.strength;
    if (data.volume.signal === 'SELL') sellSignals += data.volume.strength;
    totalWeight += 1;

    // ML Prediction (weight: 3)
    if (data.mlPrediction.direction === 'LONG') buySignals += 3 * data.mlPrediction.confidence;
    if (data.mlPrediction.direction === 'SHORT') sellSignals += 3 * data.mlPrediction.confidence;
    totalWeight += 3;

    // Bollinger Bands (weight: 2)
    const bbSignal = this.getBollingerSignal(data.currentPrice, data.bb);
    if (bbSignal === 'BUY') buySignals += 2;
    if (bbSignal === 'SELL') sellSignals += 2;
    totalWeight += 2;

    const buyStrength = buySignals / totalWeight;
    const sellStrength = sellSignals / totalWeight;

    if (buyStrength > sellStrength && buyStrength > 0.6) {
      return { signal: 'BUY', confidence: buyStrength };
    }
    if (sellStrength > buyStrength && sellStrength > 0.6) {
      return { signal: 'SELL', confidence: sellStrength };
    }
    return { signal: 'NEUTRAL', confidence: Math.max(buyStrength, sellStrength) };
  }

  private getBollingerSignal(price: number, bb: any): 'BUY' | 'SELL' | 'NEUTRAL' {
    if (price < bb.lower) return 'BUY';
    if (price > bb.upper) return 'SELL';
    return 'NEUTRAL';
  }

  private calculateExitPoints(signal: string, currentPrice: number, bb: any) {
    const volatility = (bb.upper - bb.lower) / bb.middle;
    const atr = volatility * currentPrice;

    if (signal === 'BUY') {
      return {
        stopLoss: currentPrice - (atr * 1.5),
        takeProfit: currentPrice + (atr * 2.5)
      };
    }

    if (signal === 'SELL') {
      return {
        stopLoss: currentPrice + (atr * 1.5),
        takeProfit: currentPrice - (atr * 2.5)
      };
    }

    return {
      stopLoss: 0,
      takeProfit: 0
    };
  }

  private generateReasons(data: any): string[] {
    const reasons: string[] = [];

    if (data.rsi.signal !== 'NEUTRAL') {
      reasons.push(`RSI indicates ${data.rsi.signal} (${data.rsi.value.toFixed(2)})`);
    }

    if (data.macd.signal !== 'NEUTRAL') {
      reasons.push(`MACD signals ${data.macd.signal}`);
    }

    if (data.volume.signal !== 'NEUTRAL') {
      reasons.push(`Volume analysis suggests ${data.volume.signal}`);
    }

    if (data.mlPrediction.confidence > 0.7) {
      reasons.push(`ML model predicts ${data.mlPrediction.direction} with ${(data.mlPrediction.confidence * 100).toFixed(1)}% confidence`);
    }

    if (data.hasHighImpactNews) {
      reasons.push('High impact news events detected - using shorter timeframe');
    }

    return reasons;
  }
}

export const strategyService = new StrategyService();