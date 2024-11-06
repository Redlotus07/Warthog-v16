import useStore from '../store/useStore';

interface RiskParameters {
  maxPositionSize: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  maxRiskAmount: number;
  leverageAllowed: boolean;
  maxLeverage: number;
}

class RiskManagementService {
  calculatePositionSize(
    accountBalance: number,
    riskPerTrade: number,
    entryPrice: number,
    stopLossPrice: number
  ): number {
    const riskAmount = accountBalance * (riskPerTrade / 100);
    const priceDifference = Math.abs(entryPrice - stopLossPrice);
    return riskAmount / priceDifference;
  }

  async validateTrade(params: {
    pair: string;
    type: 'LONG' | 'SHORT';
    size: number;
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
  }): Promise<{ valid: boolean; reason?: string }> {
    const store = useStore.getState();
    const { size, entryPrice, stopLoss, takeProfit, type } = params;

    // Check maximum open trades
    const openTrades = store.trades.filter(t => t.status === 'OPEN');
    if (openTrades.length >= store.settings.maxOpenTrades) {
      return {
        valid: false,
        reason: 'Maximum number of open trades reached'
      };
    }

    // Calculate risk amount
    const riskAmount = Math.abs(entryPrice - stopLoss) * size;
    const riskPercentage = (riskAmount / store.balance) * 100;

    if (riskPercentage > store.settings.riskPerTrade) {
      return {
        valid: false,
        reason: `Risk per trade (${riskPercentage.toFixed(2)}%) exceeds maximum allowed (${store.settings.riskPerTrade}%)`
      };
    }

    // Check reward-to-risk ratio
    const rewardAmount = Math.abs(takeProfit - entryPrice) * size;
    const riskRewardRatio = rewardAmount / riskAmount;

    if (riskRewardRatio < 1.5) {
      return {
        valid: false,
        reason: 'Risk-to-reward ratio is below minimum threshold of 1.5'
      };
    }

    // Check for sufficient margin
    const requiredMargin = size * entryPrice * 0.1; // Assuming 10x leverage
    if (requiredMargin > store.freeMargin) {
      return {
        valid: false,
        reason: 'Insufficient free margin for trade'
      };
    }

    // Check drawdown limit
    const currentDrawdown = this.calculateCurrentDrawdown(store.trades);
    if (currentDrawdown > store.settings.maxDrawdown) {
      return {
        valid: false,
        reason: `Current drawdown (${currentDrawdown.toFixed(2)}%) exceeds maximum allowed (${store.settings.maxDrawdown}%)`
      };
    }

    return { valid: true };
  }

  private calculateCurrentDrawdown(trades: any[]): number {
    const peakBalance = Math.max(...trades.map(t => t.balance));
    const currentBalance = trades[trades.length - 1]?.balance || 0;
    return ((peakBalance - currentBalance) / peakBalance) * 100;
  }

  calculateExitLevels(
    entryPrice: number,
    type: 'LONG' | 'SHORT',
    atr: number
  ): { stopLoss: number; takeProfit: number } {
    const multiplier = type === 'LONG' ? 1 : -1;
    return {
      stopLoss: entryPrice - (multiplier * atr * 1.5),
      takeProfit: entryPrice + (multiplier * atr * 2.5)
    };
  }

  adjustPositionForVolatility(
    baseSize: number,
    volatility: number,
    averageVolatility: number
  ): number {
    const volatilityRatio = volatility / averageVolatility;
    if (volatilityRatio > 1.5) {
      return baseSize * 0.5; // Reduce position size in high volatility
    }
    if (volatilityRatio < 0.5) {
      return baseSize * 1.2; // Increase position size in low volatility
    }
    return baseSize;
  }

  getMaxLeverage(pair: string): number {
    const leverageMap: { [key: string]: number } = {
      'BTC/USD': 20,
      'ETH/USD': 20,
      'XAU/USD': 10,
      'XAG/USD': 10
    };
    return leverageMap[pair] || 10;
  }
}

export const riskManagementService = new RiskManagementService();