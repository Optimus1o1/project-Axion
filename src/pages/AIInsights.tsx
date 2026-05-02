import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { MOCK_STOCKS, MOCK_NEWS } from '../services/mockDataService';
import { NewsArticle, StockData } from '../types';
import { Brain, Sparkles, Zap, Cpu, Search, Network, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsFeed } from '../components/NewsFeed';
import { cn } from '../lib/utils';

export default function AIInsights() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signals' | 'sector' | 'picks' | 'deep-scan'>('signals');
  const [tickerInput, setTickerInput] = useState('');
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    const results = await geminiService.analyzeNewsSentiment(MOCK_NEWS);
    setNews(results);
    setLoading(false);
  };

  const handleScan = async () => {
    if (!tickerInput) return;
    setScanning(true);
    setScanResults([]);
    
    try {
      const tickers = tickerInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const results = [];

      for (const ticker of tickers) {
        // Find stock in mock data to provide context, or just use the ticker
        const stockContext = MOCK_STOCKS.find(s => s.symbol.toUpperCase() === ticker.toUpperCase());
        const result = await geminiService.predictStockTrend(stockContext || {
          symbol: ticker.toUpperCase(),
          name: ticker.toUpperCase(),
          currentPrice: 0,
          change: 0,
          changePercent: 0,
          marketCap: 0,
          volume: 0,
          history: []
        });
        results.push({ ...result, symbol: ticker.toUpperCase() });
      }
      setScanResults(results);
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setScanning(false);
    }
  };

  const renderSignals = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10">
           <div className="flex items-center gap-4 mb-6 md:mb-10">
              <div className="p-3 md:p-4 bg-indigo-600 rounded-xl md:rounded-3xl shadow-2xl shadow-indigo-500/30 shrink-0">
                 <Brain size={24} className="text-white" />
              </div>
              <div>
                 <h3 className="text-lg md:text-2xl font-black text-white tracking-tight uppercase leading-tight">Neural Market Narrative</h3>
                 <p className="text-[10px] md:text-sm font-bold text-slate-500 mt-0.5">Real-time LLM synthesis of Indian indices</p>
              </div>
           </div>

           <div className="space-y-6 md:space-y-8">
              <div className="p-5 md:p-8 bg-slate-950 border border-slate-800 rounded-[1.2rem] md:rounded-[2rem] relative">
                 <div className="absolute top-6 md:top-8 right-6 md:right-8 text-indigo-500/10 font-serif text-5xl md:text-8xl leading-none">"</div>
                 <p className="text-sm md:text-xl text-slate-300 font-bold leading-relaxed pr-2 md:pr-10">
                    The Nifty 50 is showing strong structural support near the 22,000 mark. While the BFS sector remains volatile due to global inflation concerns, domestic consumption in India continues to hit multi-year highs. We detect a 'quiet accumulation' phase in mid-cap renewables.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <div className="p-5 md:p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Bullish Catalysts</h4>
                    <ul className="space-y-3">
                       {['Strong corporate earnings', 'FII net inflows', 'Infrastructure budget boost'].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-[11px] md:text-sm font-bold text-slate-400">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="p-5 md:p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl">
                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Risk Factors</h4>
                    <ul className="space-y-3">
                       {['Logistics cost inflation', 'Geopolitical tensions', 'Crude oil volatility'].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-[11px] md:text-sm font-bold text-slate-400">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div 
        onClick={() => setActiveTab('deep-scan')}
        className="bg-slate-900 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 flex items-center justify-between group cursor-pointer hover:bg-slate-850 transition-all"
      >
        <div className="flex items-center gap-4 md:gap-6">
           <div className="w-11 h-11 md:w-16 md:h-16 bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:border-indigo-500 transition-colors shrink-0">
              <Search size={18} className="text-slate-500 group-hover:text-indigo-400" />
           </div>
           <div>
              <h4 className="text-sm md:text-lg font-black text-white uppercase tracking-tight">AI Asset Scanner</h4>
              <p className="text-[8px] md:text-xs font-bold text-slate-500 mt-0.5 md:mt-1 uppercase tracking-widest line-clamp-1">Find high-alpha opportunities from 5000+ stocks</p>
           </div>
        </div>
        <div className="p-2 md:p-3 bg-slate-800 rounded-lg text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
           <Zap size={16} />
        </div>
      </div>

      {/* Trend Forecast Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-14 space-y-10 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-indigo-400" />
          <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.4em]">Trend Forecast Horizon</h3>
        </div>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800 -translate-y-1/2" />
          <div className="flex justify-between items-center relative z-10 overflow-x-auto scrollbar-hide pb-4">
            {[
              { date: 'MAY 02', event: 'Current Matrix', status: 'active', color: 'bg-indigo-500' },
              { date: 'MAY 15', event: 'Earnings Overlap', status: 'upcoming', color: 'bg-slate-700' },
              { date: 'JUN 01', event: 'Index Rebalance', status: 'upcoming', color: 'bg-slate-700' },
              { date: 'JUN 15', event: 'Neural Pivot', status: 'upcoming', color: 'bg-slate-700' }
            ].map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-4 min-w-[120px]">
                <div className="text-[9px] font-black text-slate-500 mb-2">{node.date}</div>
                <div className={cn(
                  "w-4 h-4 rounded-full border-4 border-slate-900 shadow-xl",
                  node.color
                )} />
                <div className="text-[10px] font-black text-white uppercase tracking-widest text-center max-w-[80px]">{node.event}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic text-center opacity-60">
          Projections are based on historical seasonal patterns and current neural sentiment drift.
        </p>
      </div>
    </div>
  );

  const renderSectorAnalysis = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="px-2 md:px-0">
           <h3 className="text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Momentum Tracking</h3>
           <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">Sector Influence Matrix</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {[
                { name: 'Nifty IT', performance: 2.1, status: 'Outperforming', color: 'bg-indigo-500' },
                { name: 'Nifty Bank', performance: -0.4, status: 'Consolidating', color: 'bg-blue-400' },
                { name: 'Nifty Energy', performance: 1.5, status: 'Strong Momentum', color: 'bg-orange-500' },
                { name: 'Nifty Auto', performance: 0.8, status: 'Steady Growth', color: 'bg-emerald-500' },
                { name: 'Nifty FMCG', performance: -1.2, status: 'Weak Accumulation', color: 'bg-rose-500' },
                { name: 'Nifty Pharma', performance: 0.3, status: 'Neutral Range', color: 'bg-purple-500' },
            ].map((sector, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] space-y-5 transition-all hover:border-slate-700/50 hover:bg-slate-900/60 group">
                    <div className="flex items-center justify-between">
                        <div className={cn("w-10 h-10 rounded-xl", sector.color + "/10 flex items-center justify-center")}>
                            <div className={cn("w-2.5 h-2.5 rounded-full", sector.color)} />
                        </div>
                        <div className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg",
                            sector.performance > 0 ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border border-rose-400/20"
                        )}>
                            {sector.performance > 0 ? '+' : ''}{sector.performance}%
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white mb-1 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{sector.name}</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{sector.status}</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950/50 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${60 + Math.random() * 30}%` }}
                            className={cn("h-full", sector.color)}
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-indigo-600 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden group border border-indigo-400/20">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,_rgba(255,255,255,0.05),_transparent)] pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto py-4 md:py-0">
                <div className="p-5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                  <Network size={32} className="text-white" />
                </div>
                <div>
                   <h3 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase leading-none">Sector Rotation Blueprint</h3>
                   <p className="text-xs md:text-base text-indigo-100 font-bold leading-relaxed mt-4">
                      Axion AI detects that capital is currently rotating out of <span className="text-white bg-indigo-500 px-2 rounded-md">Consumables</span> and into <span className="text-white bg-indigo-500 px-2 rounded-md">Deep-Tech Manufacturing</span>. This trend typically precedes a 3-month cycle in mid-cap industrials.
                   </p>
                </div>
                <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-950 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform">
                    Unlock Dynamic Prediction
                </button>
            </div>
        </div>
    </div>
  );

  const renderDeepScan = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-slate-900 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <div className="p-3 md:p-5 bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl text-indigo-400 shadow-2xl w-fit shrink-0">
                    <Search size={22} className="md:size-28" />
                </div>
                <div>
                    <h3 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Asset Deep Audit</h3>
                    <p className="text-[9px] md:text-xs font-black text-slate-500 mt-1 md:mt-2 uppercase tracking-[0.2em]">Neural fundamental & technical sequence</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12">
                <input 
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    placeholder="Enter ticker (e.g. RELIANCE...)" 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl px-6 md:px-8 py-3.5 md:py-5 text-sm md:text-lg font-black text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
                />
                <button 
                  onClick={handleScan}
                  disabled={scanning || !tickerInput}
                  className="w-full sm:w-auto px-10 py-3.5 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-3xl font-black uppercase tracking-widest text-[10px] md:text-[11px] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shrink-0"
                >
                    {scanning ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles size={16} />
                    )}
                    {scanning ? 'Scanning...' : 'Execute Sequence'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {scanResults.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-slate-950/50 border border-slate-800/80 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                            <div className="p-8 md:p-12 border-b border-slate-800/50 bg-indigo-500/[0.02]">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-4">
                                       <div className="p-3 bg-indigo-600 rounded-xl text-white">
                                          <FileText size={20} />
                                       </div>
                                       <div>
                                          <h4 className="text-lg font-black text-white uppercase tracking-tight">Executive Audit Summary</h4>
                                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generated by Axion Neural v4.2</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <button className="flex-1 md:flex-none px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                          Save Report
                                       </button>
                                       <button className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">
                                          Download PDF
                                       </button>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-5 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Alpha Probability</div>
                                        <div className="text-3xl font-black text-white">87<span className="text-sm text-slate-500">.4%</span></div>
                                        <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">High statistical significance detected in structural momentum patterns.</p>
                                    </div>
                                    <div className="p-5 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                                        <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Risk Exposure</div>
                                        <div className="text-3xl font-black text-white">Low<span className="text-sm text-slate-500"> / Med</span></div>
                                        <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">Diversified revenue streams mitigate primary sector-specific volatility.</p>
                                    </div>
                                    <div className="p-5 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                                        <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2">Horizon Target</div>
                                        <div className="text-3xl font-black text-white">Q3<span className="text-sm text-slate-500"> 2026</span></div>
                                        <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">Projected peak performance window based on historical cycle analysis.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto scrollbar-hide">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-900/30">
                                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Neural Confidence</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Trend</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Price Target</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Narrative</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {scanResults.map((result, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-900/50 transition-colors">
                                                <td className="px-6 py-6 font-black text-white text-base">{result.symbol}</td>
                                                <td className="px-6 py-6">
                                                   <div className="flex flex-col items-center gap-2">
                                                       <div className="w-full max-w-[100px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                           <div 
                                                               className="h-full bg-indigo-500" 
                                                               style={{ width: `${result.confidence}%` }}
                                                           />
                                                       </div>
                                                       <span className="text-[10px] font-black text-indigo-400">{result.confidence}%</span>
                                                   </div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <span className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                                        result.trend === 'bullish' ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                                                    )}>
                                                        {result.trend}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 font-black text-white text-center font-mono tracking-tight">₹{result.targetPrice.toLocaleString()}</td>
                                                <td className="px-6 py-6 text-[11px] text-slate-400 font-bold leading-relaxed max-w-sm">
                                                    {result.rationale}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                ) : scanning ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="p-6 md:p-8 border-2 border-dashed border-slate-800 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 h-48 md:h-64">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Fundamental Metrics</p>
                            <div className="w-full space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-3 bg-slate-800/50 rounded-full w-full animate-pulse" />)}
                            </div>
                        </div>
                        <div className="p-6 md:p-8 border-2 border-dashed border-slate-800 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 h-48 md:h-64">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Network Sentiment</p>
                            <div className="w-full space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-3 bg-slate-800/50 rounded-full w-full animate-pulse" />)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 md:py-20 border-2 border-dashed border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem]">
                        <Cpu size={32} className="mx-auto text-slate-800 mb-4 md:mb-6" />
                        <h4 className="text-slate-600 font-black uppercase tracking-widest text-[10px] md:text-xs">System ready for deep audit</h4>
                        <p className="text-slate-800 text-[9px] font-extrabold uppercase mt-1">Initiate scan sequence to reveal neural targets</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );

  const renderPicks = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-2 md:px-0">
        <h3 className="text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Algorithmic Alpha</h3>
        <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">Neural Portfolio Picks</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {[
          { symbol: 'RELIANCE', score: 94, reason: 'Bullish divergence on daily candle structure' },
          { symbol: 'TCS', score: 88, reason: 'AI sector rotation tailwinds detected via NLP' },
          { symbol: 'ZOMATO', score: 82, reason: 'High retail volume momentum threshold breach' },
          { symbol: 'HDFCBANK', score: 79, reason: 'Long-term structural accumulation at support' },
        ].map((pick, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all cursor-pointer">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-indigo-400 group-hover:border-indigo-500/50 transition-colors shrink-0">
                {pick.symbol[0]}
              </div>
              <div>
                <div className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{pick.symbol}</div>
                <div className="text-[11px] font-bold text-slate-400 mt-1 line-clamp-1 italic">"{pick.reason}"</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl md:text-2xl font-black text-white font-mono tracking-tight">{pick.score}</div>
              <div className="text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-widest">Neural Sc.</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 px-4 md:px-0 relative">
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-[20%] -right-20 w-80 h-80 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-indigo-500 rounded-full" />
            <h2 className="text-[10px] md:text-xs font-black tracking-[0.5em] text-indigo-400 uppercase">Intelligence v4.2</h2>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight uppercase leading-[0.9]">AI Insights</h1>
          <p className="text-slate-500 font-bold text-sm md:text-base max-w-xl">
            Real-time neural synthesis of global market narratives and sector-specific momentum signals.
          </p>
        </div>
        
        <div className="flex bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-1.5 rounded-2xl md:rounded-3xl overflow-x-auto scrollbar-hide shrink-0 max-w-full shadow-2xl">
          {[
            { id: 'signals', label: 'Signals', icon: Zap },
            { id: 'sector', label: 'Sectors', icon: Network },
            { id: 'picks', label: 'Picks', icon: Sparkles },
            { id: 'deep-scan', label: 'Deep Scan', icon: Cpu },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-100" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
              )}
            >
              <tab.icon size={16} className={cn("transition-transform", activeTab === tab.id ? "scale-110" : "")} />
              <span className="inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 md:gap-10">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-12 xl:col-span-8 space-y-8 md:space-y-12">
           {activeTab === 'signals' && renderSignals()}
           {activeTab === 'sector' && renderSectorAnalysis()}
           {activeTab === 'picks' && renderPicks()}
           {activeTab === 'deep-scan' && renderDeepScan()}
        </div>

        {/* Intelligence Sidebar */}
        <div className="col-span-12 xl:col-span-4 h-full">
           <div className="space-y-8 lg:sticky lg:top-32">
              <div className="px-6 py-8 bg-indigo-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] pointer-events-none" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Zap size={24} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight leading-none">Signal Stream</h3>
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mt-1 opacity-80">Real-time Global Sync</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[60px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                <NewsFeed articles={news} loading={loading} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
