export interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  peRatio?: number;
  eps?: number;
  dividendYield?: number;
  high52w?: number;
  low52w?: number;
  history: { time: string; price: number }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -1 to 1
  impactScale: number; // 1-10
  entities: string[];
  timestamp: string;
}

export interface PredictionResult {
  symbol: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  targetPrice: number;
  rationale: string;
}

export interface MarketMood {
  score: number; // 0-100 (0: Extreme Fear, 100: Extreme Greed)
  label: string;
  description: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'retirement' | 'house' | 'education' | 'car' | 'other';
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  value: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}
