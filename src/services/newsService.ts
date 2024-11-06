interface NewsEvent {
  id: string;
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
  pairs: string[];
  forecast?: number;
  previous?: number;
}

class NewsService {
  private events: NewsEvent[] = [];
  private subscribers: Set<(events: NewsEvent[]) => void> = new Set();

  constructor() {
    this.startPolling();
  }

  private async fetchNews() {
    // In a real implementation, this would fetch from a financial news API
    const mockNews: NewsEvent[] = [
      {
        id: '1',
        title: 'FOMC Meeting Minutes',
        impact: 'HIGH',
        date: new Date(Date.now() + 3600000).toISOString(),
        pairs: ['XAU/USD', 'BTC/USD'],
        forecast: 5.25,
        previous: 5.0,
      },
      {
        id: '2',
        title: 'NFP Report',
        impact: 'HIGH',
        date: new Date(Date.now() + 7200000).toISOString(),
        pairs: ['XAU/USD', 'USD/JPY'],
        forecast: 200000,
        previous: 187000,
      },
    ];

    this.events = mockNews;
    this.notifySubscribers();
  }

  private startPolling() {
    this.fetchNews();
    setInterval(() => this.fetchNews(), 300000); // Poll every 5 minutes
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.events));
  }

  subscribe(callback: (events: NewsEvent[]) => void) {
    this.subscribers.add(callback);
    callback(this.events);
  }

  unsubscribe(callback: (events: NewsEvent[]) => void) {
    this.subscribers.delete(callback);
  }

  getUpcomingEvents(timeframe: number = 3600000): NewsEvent[] {
    const now = Date.now();
    return this.events.filter(
      (event) => new Date(event.date).getTime() - now <= timeframe
    );
  }

  getEventsByPair(pair: string): NewsEvent[] {
    return this.events.filter((event) => event.pairs.includes(pair));
  }
}

export const newsService = new NewsService();