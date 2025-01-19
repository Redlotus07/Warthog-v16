import axios from 'axios';
import { mlService } from '../mlService.js';
import { performanceTracker } from '../performanceTracking.js';
import xml2js from 'xml2js';

class NewsService {
  constructor() {
    this.newsProviders = [
      {
        name: 'ForexFactory',
        url: process.env.FOREX_FACTORY_API_URL || 'https://www.forexfactory.com/feeds/news'
      },
      {
        name: 'Investing.com',
        url: process.env.INVESTING_COM_API_URL || 'https://www.investing.com/rss/news_1.rss'
      }
    ];
  }

  async getUpcomingEvents(timeframe = '24h') {
    const events = await Promise.all(
      this.newsProviders.map(provider => this.fetchEvents(provider))
    );

    return this.mergeAndSortEvents(events.flat());
  }

  async fetchEvents(provider) {
    try {
      const response = await axios.get(provider.url);
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);
      return this.extractEventsFromRSS(result, provider.name);
    } catch (error) {
      console.error(`Error fetching events from ${provider.name}:`, error);
      return [];
    }
  }

  extractEventsFromRSS(rssData, providerName) {
    const events = [];
    const items = rssData.rss.channel[0].item;

    items.forEach(item => {
      events.push({
        title: item.title[0],
        link: item.link[0],
        pubDate: new Date(item.pubDate[0]),
        description: item.description[0],
        provider: providerName,
        type: this.determineEventType(item.title[0]), // You can implement this function based on your needs
        importance: this.determineImportance(item.title[0]) // You can implement this function based on your needs
      });
    });

    return events;
  }

  determineEventType(title) {
    // Implement logic to determine event type based on title
    return 'NFP'; // Example placeholder
  }

  determineImportance(title) {
    // Implement logic to determine importance based on title
    return 'HIGH'; // Example placeholder
  }

  async analyzeNewsImpact(event) {
    const historicalImpact = await this.getHistoricalImpact(event.type);
    const marketCondition = await mlService.analyzeMarketCondition('ALL');
    
    return {
      expectedVolatility: this.calculateExpectedVolatility(historicalImpact),
      recommendedAction: this.getTradeRecommendation(event, marketCondition),
      riskAdjustment: this.calculateRiskAdjustment(event.importance)
    };
  }

  async monitorNFP() {
    return {
      nextRelease: await this.getNextNFPRelease(),
      historicalPerformance: await this.getNFPPerformanceStats(),
      tradingParameters: this.getNFPTradingParameters()
    };
  }

  getNFPTradingParameters() {
    return {
      timeWindow: {
        before: 30, // minutes before release
        after: 120  // minutes after release
      },
      volatilityMultiplier: 1.5,
      pairs: ['XAU/USD', 'EUR/USD', 'GBP/USD'],
      riskAdjustment: 0.75 // Reduce position size during NFP
    };
  }

  calculateExpectedVolatility(historicalImpact) {
    const avgImpact = historicalImpact.reduce((sum, impact) => sum + impact.volatility, 0) 
      / historicalImpact.length;
    
    return {
      expected: avgImpact,
      range: {
        min: avgImpact * 0.7,
        max: avgImpact * 1.3
      }
    };
  }

  getTradeRecommendation(event, marketCondition) {
    const impact = this.assessImpact(event);
    const volatility = marketCondition.volatility;
    
    if (impact.score > 8 && volatility < 0.3) {
      return {
        action: 'TRADE',
        strategy: 'NEWS_BREAKOUT',
        timeframe: '1H'
      };
 }
    
    return {
      action: 'HOLD',
      reason: 'Insufficient edge or high volatility'
    };
  }

  assessImpact(event) {
    const impactScores = {
      HIGH: 10,
      MEDIUM: 6,
      LOW: 3
    };

    return {
      score: impactScores[event.importance] || 0,
      affectedPairs: this.getAffectedPairs(event.type)
    };
  }

  getAffectedPairs(eventType) {
    const eventPairMap = {
      NFP: ['XAU/USD', 'EUR/USD', 'GBP/USD'],
      FOMC: ['XAU/USD', 'USD/JPY', 'EUR/USD'],
      ECB: ['EUR/USD', 'EUR/GBP', 'EUR/JPY']
    };

    return eventPairMap[eventType] || [];
  }
}

export const newsService = new NewsService();
