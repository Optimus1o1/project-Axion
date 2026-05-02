import { StockData, NewsArticle, FinancialGoal } from "../types";

export const MOCK_STOCKS: StockData[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    currentPrice: 2842.50,
    change: 45.20,
    changePercent: 1.62,
    marketCap: 1923450,
    volume: 5400000,
    peRatio: 26.4,
    eps: 107.50,
    dividendYield: 0.32,
    high52w: 3024.90,
    low52w: 2210.30,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${10 + i}:00`,
      price: 2800 + Math.random() * 80
    }))
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    currentPrice: 1425.10,
    change: -12.40,
    changePercent: -0.86,
    marketCap: 1080000,
    volume: 8200000,
    peRatio: 18.2,
    eps: 78.40,
    dividendYield: 1.33,
    high52w: 1757.50,
    low52w: 1363.45,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${10 + i}:00`,
      price: 1410 + Math.random() * 40
    }))
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    currentPrice: 3890.00,
    change: 15.00,
    changePercent: 0.39,
    marketCap: 1420000,
    volume: 1200000,
    peRatio: 31.5,
    eps: 123.60,
    dividendYield: 1.25,
    high52w: 4254.75,
    low52w: 3070.30,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${10 + i}:00`,
      price: 3850 + Math.random() * 100
    }))
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    currentPrice: 1640.25,
    change: 22.10,
    changePercent: 1.36,
    marketCap: 680000,
    volume: 3500000,
    peRatio: 24.8,
    eps: 66.15,
    dividendYield: 2.15,
    high52w: 1733.00,
    low52w: 1215.45,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${10 + i}:00`,
      price: 1600 + Math.random() * 60
    }))
  }
];

export const MOCK_INDICES: StockData[] = [
  {
    symbol: "NIFTY 50",
    name: "NSE Nifty 50 Index",
    currentPrice: 22453.80,
    change: 124.50,
    changePercent: 0.56,
    marketCap: 0,
    volume: 0,
    history: Array.from({ length: 30 }, (_, i) => ({
      time: `${9 + Math.floor(i/4)}:${(i%4)*15}`,
      price: 22300 + Math.random() * 200
    }))
  },
  {
    symbol: "SENSEX",
    name: "BSE SENSEX",
    currentPrice: 73903.15,
    change: 412.30,
    changePercent: 0.56,
    marketCap: 0,
    volume: 0,
    history: Array.from({ length: 30 }, (_, i) => ({
      time: `${9 + Math.floor(i/4)}:${(i%4)*15}`,
      price: 73500 + Math.random() * 600
    }))
  }
];

export const MOCK_NEWS: any[] = [
  { id: "1", title: "RBI keeps repo rate unchanged at 6.5%" },
  { id: "2", title: "Indian manufacturing PMI hits 16-year high" },
  { id: "3", title: "FIIs turn net buyers in Indian equity market" },
  { id: "4", title: "Reliance Retail to expand into deep-tech beauty segment" }
];

export const MOCK_GOALS: FinancialGoal[] = [
  {
    id: '1',
    name: 'Wealth Retirement',
    targetAmount: 5000000,
    currentAmount: 120500,
    deadline: '2045-12-31',
    category: 'retirement'
  },
  {
    id: '2',
    name: 'Luxury Penthouse',
    targetAmount: 2000000,
    currentAmount: 120500,
    deadline: '2030-06-30',
    category: 'house'
  },
  {
    id: '3',
    name: 'Education Fund',
    targetAmount: 100000,
    currentAmount: 120500,
    deadline: '2028-09-01',
    category: 'education'
  }
];
