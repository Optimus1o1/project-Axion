import React, { useState, useEffect } from 'react';
import { MOCK_NEWS } from '../services/mockDataService';
import { marketDataService } from '../services/marketDataService';
import { geminiService } from '../services/geminiService';
import { StockData, NewsArticle, PredictionResult } from '../types';
import { StockCard } from '../components/StockCard';
import { PredictionPanel } from '../components/PredictionPanel';
import { NewsFeed } from '../components/NewsFeed';
import { MoodMeter } from '../components/MoodMeter';
import { 
  TrendingUp, 
  Sparkles,
  Wallet,
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';

export default function Dashboard() {
  const [stocks, setStocks] = useState<StockData[]>(marketDataService.getStocks());
  const [selectedStock, setSelectedStock] = useState<StockData | null>(marketDataService.getStocks()[0]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [mood, setMood] = useState<number>(64);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [isBeginnerMode, setBeginnerMode] = useState(false);
  const [budget, setBudget] = useState<number>(5000);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = marketDataService.subscribe((updatedStocks, _updatedIndices) => {
      setStocks(updatedStocks);
      // Update the selected stock data if it's in the list
      if (selectedStock) {
        const updated = updatedStocks.find(s => s.symbol === selectedStock.symbol);
        if (updated) setSelectedStock(updated);
      }
    });

    fetchNews();
    fetchMood();

    return () => unsubscribe();
  }, [selectedStock?.symbol]);

  useEffect(() => {
    // Prediction is stable per stock choice, but we could re-run it if price moves significantly
    // For now, only fetch on initial selection or explicit change
    if (selectedStock && !prediction) {
      fetchPrediction(selectedStock);
    }
  }, [selectedStock?.symbol]);

  const fetchNews = async () => {
    setLoadingNews(true);
    const results = await geminiService.analyzeNewsSentiment(MOCK_NEWS);
    setNews(results);
    setLoadingNews(false);
  };

  const fetchMood = async () => {
    const score = await geminiService.getMarketMood();
    setMood(score);
  };

  const fetchPrediction = async (stock: StockData) => {
    setLoadingPrediction(true);
    const result = await geminiService.predictStockTrend(stock);
    setPrediction(result);
    setLoadingPrediction(false);
  };

  const filteredBudgetStocks = stocks.filter(s => s.currentPrice <= budget);

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 md:space-y-20 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2 md:px-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase leading-none">Command Center</h1>
          <p className="text-[10px] md:text-sm font-bold text-slate-500 mt-2 uppercase tracking-[0.3em]">Quantum market monitoring active</p>
        </div>
      </div>

      {/* Neural Status Pulse - New Feature */}
      <div className="flex items-center justify-between px-2 md:px-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full animate-ping absolute inset-0",
              geminiService.isThrottled() ? "bg-amber-500" : "bg-emerald-500"
            )} />
            <div className={cn(
              "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.5)]",
              geminiService.isThrottled() ? "bg-amber-500 shadow-amber-500/50" : "bg-emerald-500 shadow-emerald-500/50"
            )} />
          </div>
          <span className={cn(
            "text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] font-mono",
            geminiService.isThrottled() ? "text-amber-400" : "text-emerald-500"
          )}>
            Neural Link: {geminiService.isThrottled() ? 'Fallback Mode' : 'Active'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
           <div className="flex items-center gap-2">
             <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">Sentiment %</div>
             <div className="w-16 md:w-24 h-1 bg-slate-800 rounded-full overflow-hidden flex">
               <div className="h-full bg-rose-500" style={{ width: '30%' }} />
               <div className="h-full bg-slate-700" style={{ width: '10%' }} />
               <div className="h-full bg-emerald-500" style={{ width: '60%' }} />
             </div>
           </div>
        </div>
      </div>

      {isBeginnerMode && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-indigo-600 rounded-3xl p-6 md:p-8 flex items-start gap-4 shadow-2xl shadow-indigo-500/20 border border-indigo-400/30"
        >
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shrink-0">
            <HelpCircle size={24} className="text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-lg md:text-xl text-white tracking-tight mb-1 uppercase">Education Layer Active</h4>
            <p className="text-xs md:text-sm text-indigo-100 leading-relaxed font-bold max-w-4xl opacity-80 line-clamp-3 md:line-clamp-none">
              The Pulse & Mood systems are neural AI models. <span className="text-white">Greed</span> signals often imply overvaluation, while <span className="text-white">Fear</span> suggests panic selling. Axion is currently detecting high liquidity in Indian tech sectors.
            </p>
          </div>
          <button onClick={() => setBeginnerMode(false)} className="ml-auto p-2 hover:bg-white/10 rounded-full transition-colors shrink-0">
            <X size={20} className="text-white" />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-12 gap-6 md:gap-8 min-h-[1000px]">
        
        {/* FEATURED: Market Watch (Large Top Left) */}
        <div className="col-span-12 lg:col-span-8 precise-border bg-slate-900/40 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between group transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-[10px] md:text-xs font-black tracking-[0.4em] text-slate-500 uppercase mb-2">Live Exchange</h2>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none uppercase font-mono">Terminal</h1>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Nifty 50 Open</span>
              <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest font-mono">v2.0_ALPHA</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {stocks.map((stock, i) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <StockCard 
                  stock={stock} 
                  selected={selectedStock?.symbol === stock.symbol}
                  onSelect={setSelectedStock}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-3 bg-white text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-white/5 hover:scale-105 transition-transform">Report.log</button>
              <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:border-slate-600 transition-colors">Compare</button>
            </div>
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic font-mono">
              Signal sync complete.
            </div>
          </div>
        </div>

        {/* TALL: Market Mood (Top Right Sidebar) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 md:gap-8">
          <MoodMeter score={mood} />
          
          {/* BUDGET: Wide Bento Item */}
          <div className="bg-indigo-600 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl shadow-indigo-600/30 flex flex-col justify-between h-full group overflow-hidden relative min-h-[300px]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-6">Capital Allocation</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-black uppercase opacity-60">Entry Limit</span>
                     <span className="text-3xl font-black tracking-tighter font-mono">{formatCurrency(budget)}</span>
                  </div>
                  <input 
                    type="range" min="100" max="5000" step="100" 
                    value={budget} 
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-indigo-400/50 rounded-full appearance-none cursor-pointer accent-white"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {filteredBudgetStocks.slice(0, 3).map(s => (
                    <div key={s.symbol} onClick={() => setSelectedStock(s)} className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-[9px] font-black cursor-pointer hover:bg-white/20 transition-all font-mono">
                       {s.symbol}: {formatCurrency(s.currentPrice)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="relative z-10 text-[9px] font-black uppercase tracking-widest mt-8 flex items-center gap-2 font-mono">
              Scan for <ArrowRight size={14} className="text-indigo-200" /> Small Cap
            </p>
          </div>
        </div>

        {/* AI CORE: (Lower Left Large) */}
        <div className="col-span-12 lg:col-span-8">
          <PredictionPanel 
            prediction={prediction} 
            loading={loadingPrediction} 
          />
        </div>

        {/* INTELLIGENCE: (Lower Right Sidebar) */}
        <div className="col-span-12 lg:col-span-4 precise-border bg-slate-900/30 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10">
          <NewsFeed articles={news} loading={loadingNews} />
        </div>

      </div>
    </div>
  );
}
