import { StockData } from '../types';
import { MOCK_STOCKS, MOCK_INDICES } from './mockDataService';

type MarketUpdateCallback = (stocks: StockData[], indices: StockData[]) => void;

class MarketDataService {
  private stocks: StockData[] = [...MOCK_STOCKS];
  private indices: StockData[] = [...MOCK_INDICES];
  private listeners: Set<MarketUpdateCallback> = new Set();
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.startSimulation();
  }

  public getStocks(): StockData[] {
    return this.stocks;
  }

  public getIndices(): StockData[] {
    return this.indices;
  }

  public getStockBySymbol(symbol: string): StockData | undefined {
    return this.stocks.find(s => s.symbol === symbol);
  }

  public subscribe(callback: MarketUpdateCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private startSimulation() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      // Simulate Stocks
      this.stocks = this.stocks.map(stock => this.simulateMovement(stock));
      
      // Simulate Indices
      this.indices = this.indices.map(index => this.simulateMovement(index));

      this.notifyListeners();
    }, 3000);
  }

  private simulateMovement(asset: StockData): StockData {
    const changePercent = (Math.random() - 0.5) * 0.4;
    const newPrice = asset.currentPrice * (1 + changePercent / 100);
    const basePrice = asset.currentPrice - asset.change;
    const newChange = newPrice - basePrice;
    const newChangePercent = (newChange / basePrice) * 100;

    return {
      ...asset,
      currentPrice: Number(newPrice.toFixed(2)),
      change: Number(newChange.toFixed(2)),
      changePercent: Number(newChangePercent.toFixed(2)),
      history: [...asset.history.slice(1), { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), price: newPrice }]
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.stocks, this.indices));
  }

  public stopSimulation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const marketDataService = new MarketDataService();
