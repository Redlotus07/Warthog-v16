interface IndicatorResult {
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number;
}

class TechnicalIndicators {
  calculateRSI(prices: number[], period: number = 14): IndicatorResult {
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? -c : 0);

    const avgGain = this.calculateSMA(gains, period);
    const avgLoss = this.calculateSMA(losses, period);
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return {
      value: rsi,
      signal: rsi > 70 ? 'SELL' : rsi < 30 ? 'BUY' : 'NEUTRAL',
      strength: Math.abs(50 - rsi) / 50
    };
  }

  calculateMACD(prices: number[]): IndicatorResult {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    const signal = this.calculateEMA([macd], 9);
    const histogram = macd - signal;

    return {
      value: macd,
      signal: histogram > 0 ? 'BUY' : histogram < 0 ? 'SELL' : 'NEUTRAL',
      strength: Math.abs(histogram) / Math.abs(macd)
    };
  }

  calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
    const sma = this.calculateSMA(prices, period);
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const std = Math.sqrt(variance);

    return {
      middle: sma,
      upper: sma + (stdDev * std),
      lower: sma - (stdDev * std),
      width: ((sma + (stdDev * std)) - (sma - (stdDev * std))) / sma
    };
  }

  private calculateSMA(values: number[], period: number): number {
    return values.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  }

  private calculateEMA(values: number[], period: number): number {
    const k = 2 / (period + 1);
    return values.reduce((ema, price) => price * k + ema * (1 - k), values[0]);
  }

  analyzeVolume(volumes: number[], prices: number[]): IndicatorResult {
    const volumeSMA = this.calculateSMA(volumes, 20);
    const currentVolume = volumes[volumes.length - 1];
    const volumeRatio = currentVolume / volumeSMA;
    
    const priceChange = prices[prices.length - 1] - prices[prices.length - 2];
    const signal = volumeRatio > 1.5 && priceChange > 0 ? 'BUY' 
                  : volumeRatio > 1.5 && priceChange < 0 ? 'SELL' 
                  : 'NEUTRAL';

    return {
      value: volumeRatio,
      signal,
      strength: Math.min(volumeRatio / 2, 1)
    };
  }
}

export const indicators = new TechnicalIndicators();