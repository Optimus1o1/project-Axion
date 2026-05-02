import React, { useState, useEffect } from 'react';
import { marketDataService } from '../services/marketDataService';
import { StockData } from '../types';
import { StockCard } from '../components/StockCard';
import { Search, Filter, ArrowUpDown, TrendingUp as TrendingUpIcon, Activity, Plus, X, BarChart3, TrendingUp, TrendingDown, Info, Cpu, Sparkles } from 'lucide-react';
import { formatCurrency, cn, formatPercentage } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Legend } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

import { useNavigate } from 'react-router-dom';

export default function Markets() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');
  const [stocks, setStocks] = useState<StockData[]>(marketDataService.getStocks());
  const [indices, setIndices] = useState<StockData[]>(marketDataService.getIndices());
  const [selectedStocks, setSelectedStocks] = useState<StockData[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const unsubscribe = marketDataService.subscribe((updatedStocks, updatedIndices) => {
      setStocks(updatedStocks);
      setIndices(updatedIndices);
    });
    return () => unsubscribe();
  }, []);

  const handleStockSelect = (stock: StockData) => {
    setSelectedStocks(prev => {
      const isSelected = prev.find(s => s.symbol === stock.symbol);
      if (isSelected) {
        return prev.filter(s => s.symbol !== stock.symbol);
      }
      if (prev.length >= 4) return prev; // Limit to 4 for UX
      return [...prev, stock];
    });
  };

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'gainers' && stock.changePercent > 0) || 
                         (filter === 'losers' && stock.changePercent < 0);
    return matchesSearch && matchesFilter;
  });

  // Prepare normalized data for comparison chart
  const comparisonChartData = React.useMemo(() => {
    if (selectedStocks.length === 0) return [];
    
    // Use the timestamps from the first selected stock
    const baseStock = selectedStocks[0];
    return baseStock.history.map((point, index) => {
      const entry: any = { time: point.time };
      selectedStocks.forEach(stock => {
        // Simple normalization: scale starting price to 100
        const startPrice = stock.history[0].price;
        const currentPrice = stock.history[index].price;
        const normalizedPrice = (currentPrice / startPrice) * 100;
        entry[stock.symbol] = normalizedPrice;
      });
      return entry;
    });
  }, [selectedStocks]);

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
        <div>
          <h2 className="text-[10px] md:text-xs font-black tracking-[0.4em] text-slate-500 uppercase mb-2">Discovery Engine</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">Markets</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
          {/* Mobile floating compare button handled below */}
          <div className="hidden md:flex items-center gap-3">
            {selectedStocks.length > 0 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1 rounded-2xl"
              >
                <div className="px-3 py-1 flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{selectedStocks.length} Selected</span>
                </div>
                <button
                  onClick={() => setShowComparison(true)}
                  disabled={selectedStocks.length < 2}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedStocks.length >= 2 
                      ? "bg-indigo-600 text-white shadow-lg cursor-pointer" 
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  )}
                >
                  Compare Assets
                </button>
                <button 
                  onClick={() => setSelectedStocks([])}
                  className="p-2 hover:bg-slate-800 text-slate-500 rounded-xl transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </div>

          <div className="relative w-full md:w-72 group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Query ticker or asset..." 
              className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl py-3 md:py-3.5 pl-12 pr-6 text-[11px] md:text-sm font-bold text-slate-100 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700 w-full hover:bg-slate-900"
            />
          </div>

          <div className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-xl md:rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-hide shrink-0">
            {['all', 'gainers', 'losers'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === f ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showComparison && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-slate-950/90 backdrop-blur-md"
          >
            <div className="bg-slate-900 border border-slate-800 w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] md:rounded-[3rem] overflow-hidden flex flex-col">
              <div className="p-5 md:p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div>
                  <h3 className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Matrix Comparison</h3>
                  <h2 className="text-lg md:text-3xl font-black text-white tracking-tighter uppercase line-clamp-1">
                    {selectedStocks.map(s => s.symbol).join(' × ')}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowComparison(false)}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl md:rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl"
                >
                  <X size={20} className="md:size-[24px]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 md:space-y-16 scrollbar-hide pb-20">
                {/* AI Synthesis Verdict */}
                <div className="p-6 md:p-12 bg-indigo-600/5 border border-indigo-500/20 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row gap-10 items-start relative overflow-hidden group shadow-[0_0_50px_rgba(99,102,241,0.05)]">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={120} className="text-indigo-400 rotate-12" />
                  </div>
                  <div className="shrink-0 p-4 md:p-5 bg-indigo-600 rounded-2xl md:rounded-3xl text-white shadow-xl shadow-indigo-600/20 z-10">
                    <Sparkles size={24} className="md:size-32" />
                  </div>
                  <div className="space-y-6 z-10 flex-1">
                    <div>
                      <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-tight mb-2">Neural Comparative Synthesis</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-md">High Correlation</span>
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-indigo-500/20 rounded-md">Sector Rotation Detected</span>
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-purple-500/20 rounded-md">Alpha Opportunity: 8.4%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strength Divergence</h4>
                          <p className="text-[11px] md:text-sm text-slate-300 font-bold leading-relaxed">
                            {selectedStocks[0].symbol} shows superior price strength relative to {selectedStocks[1].symbol}, primarily driven by 
                            historical accumulation cycles. However, volume profiles indicate that {selectedStocks[1].symbol} is currently 
                            undergoing a structural re-accumulation phase which could lead to an breakout.
                          </p>
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Recommendation</h4>
                          <p className="text-[11px] md:text-sm text-slate-300 font-bold leading-relaxed">
                            Maintain overweight exposure on {selectedStocks[selectedStocks[0].changePercent > selectedStocks[1].changePercent ? 0 : 1].symbol} 
                            for short-term momentum capture. For long-term portfolio stability, {selectedStocks[selectedStocks[0].marketCap > selectedStocks[1].marketCap ? 0 : 1].symbol} 
                            remains the dominant anchor with lower volatility drag.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Social & Sentiment Divergence */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 p-8 bg-slate-950 border border-slate-800 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Activity size={16} />
                      </div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Sentiment Gravity</h4>
                    </div>
                    <div className="space-y-4">
                      {selectedStocks.map((stock, i) => (
                        <div key={stock.symbol} className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                            <span className="text-slate-500">{stock.symbol}</span>
                            <span className={cn(i === 0 ? "text-emerald-400" : "text-slate-400")}>{85 - i * 15}% Positive</span>
                          </div>
                          <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${85 - i * 15}%` }}
                              className="h-full bg-indigo-500" 
                              style={{ opacity: 1 - (i * 0.2) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                      Sentiment is aggregated via real-time social streams and neural language analysis.
                    </p>
                  </div>
                  
                  <div className="lg:col-span-2 p-8 bg-slate-950 border border-slate-800 rounded-[2rem] relative overflow-hidden flex items-center">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <BarChart3 size={150} className="text-slate-800" />
                    </div>
                    <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <h4 className="text-xl font-black text-white tracking-tight uppercase">Momentum Delta</h4>
                          <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                            Volume accumulation is currently outstripping price discovery across the {selectedStocks.length} selected assets.
                          </p>
                          <div className="flex items-center gap-4">
                             <div className="text-2xl font-black text-emerald-400 font-mono">+12.4%</div>
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Net Alpha Drift</div>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/50">
                             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Vol/Cap</div>
                             <div className="text-sm font-black text-white">0.84</div>
                          </div>
                          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/50">
                             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Divergence</div>
                             <div className="text-sm font-black text-white">Low</div>
                          </div>
                          <div className="col-span-2 p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-center">
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Signal: Accumulated Alpha</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Normalized Performance Chart */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl relative">
                  <div className="absolute -top-4 left-10 px-4 py-1 bg-slate-900 border border-slate-800 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">Growth Analytics</div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <TrendingUpIcon size={18} />
                      </div>
                      <div>
                        <h4 className="text-[10px] md:text-sm font-black text-white uppercase tracking-widest leading-none">Relative Trajectory</h4>
                        <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Convergence analysis (Base 100)</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                       {selectedStocks.map((stock, i) => (
                         <div key={stock.symbol} className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-md">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                           <span className="text-[9px] font-black text-white uppercase">{stock.symbol}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="h-[250px] md:h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={comparisonChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                        <XAxis 
                          dataKey="time" 
                          stroke="#475569" 
                          fontSize={9} 
                          tickFormatter={(val) => val.split(':')[0] + ':00'} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis stroke="#475569" fontSize={9} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                          labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                        />
                        {selectedStocks.map((stock, i) => (
                           <Line 
                            key={stock.symbol}
                            type="monotone" 
                            dataKey={stock.symbol} 
                            stroke={COLORS[i % COLORS.length]} 
                            strokeWidth={3} 
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics Comparison Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {selectedStocks.map((stock, i) => (
                    <div key={stock.symbol} className="bg-slate-950 border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group hover:border-slate-700 transition-all shadow-xl">
                      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none mb-1">{stock.symbol}</h4>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate max-w-[120px]">{stock.name}</p>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          stock.change >= 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        )}>
                          {formatPercentage(stock.changePercent)}
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800/30 pb-3 md:pb-4">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pricing</span>
                          <span className="text-xs md:text-sm font-black text-white font-mono">{formatCurrency(stock.currentPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800/30 pb-3 md:pb-4">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dominance</span>
                          <span className="text-xs md:text-sm font-black text-white">₹{(stock.marketCap / 10000).toFixed(1)}T</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800/30 pb-3 md:pb-4">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Activity</span>
                          <span className="text-xs md:text-sm font-black text-white">{(stock.volume / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stability</span>
                          <span className="text-xs md:text-sm font-black text-emerald-400">Optimal</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Comparison Table */}
                <div className="bg-slate-950 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left min-w-[600px] border-collapse">
                      <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800">
                          <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 sticky left-0 z-30 bg-slate-900/80 backdrop-blur-md border-r border-slate-800/50 min-w-[180px]">
                            <div className="flex items-center gap-2">
                              <BarChart3 size={14} className="text-indigo-400" />
                              Metrics Matrix
                            </div>
                          </th>
                          {selectedStocks.map((stock, i) => (
                            <th key={stock.symbol} className="px-6 py-6 text-[11px] font-black uppercase tracking-widest text-center min-w-[140px]" style={{ color: COLORS[i % COLORS.length] }}>
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-xl md:text-2xl">{stock.symbol}</span>
                                <span className="text-[8px] opacity-60 truncate max-w-[100px]">{stock.name}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/30">
                        {[
                          { label: 'P/E Ratio', key: 'peRatio', icon: <ArrowUpDown size={12} />, better: 'lower' },
                          { label: 'EPS (TTM)', key: 'eps', format: (val: number) => `₹${val.toFixed(2)}`, icon: <Activity size={12} />, better: 'higher' },
                          { label: 'Dividend Yield', key: 'dividendYield', format: (val: number) => `${val}%`, icon: <Plus size={12} />, better: 'higher' },
                          { label: '52-Week High', key: 'high52w', format: formatCurrency, icon: <TrendingUp size={12} />, better: 'higher' },
                          { label: '52-Week Low', key: 'low52w', format: formatCurrency, icon: <TrendingDown size={12} />, better: 'lower' },
                          { label: 'Market Cap', key: 'marketCap', format: (val: number) => `₹${(val / 10000).toFixed(1)}T`, icon: <BarChart3 size={12} />, better: 'higher' },
                        ].map((metric) => {
                          const values = selectedStocks.map(s => (s as any)[metric.key]);
                          const winnerValue = metric.better === 'lower' ? Math.min(...values) : Math.max(...values);
                          
                          return (
                            <tr key={metric.label} className="hover:bg-indigo-500/[0.03] transition-colors group/row">
                              <td className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky left-0 z-30 bg-slate-950/90 backdrop-blur-md border-r border-slate-800/30 group-hover/row:text-indigo-400 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="p-1.5 bg-slate-900 rounded-lg text-slate-600 group-hover/row:text-indigo-400 group-hover/row:bg-indigo-500/10 transition-all">
                                    {metric.icon}
                                  </div>
                                  {metric.label}
                                </div>
                              </td>
                              {selectedStocks.map(stock => {
                                const isWinner = (stock as any)[metric.key] === winnerValue;
                                return (
                                  <td key={stock.symbol} className="px-6 py-5 text-[12px] md:text-sm font-black text-white font-mono text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      <span className={cn(isWinner && "text-emerald-400")}>
                                        {metric.format 
                                          ? metric.format((stock as any)[metric.key]) 
                                          : (stock as any)[metric.key] || 'N/A'}
                                      </span>
                                      {isWinner && (
                                        <span className="text-[7px] font-black uppercase tracking-widest text-emerald-500/50">Leader</span>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Selection Tray */}
      <AnimatePresence>
        {selectedStocks.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="md:hidden fixed bottom-20 left-4 right-4 z-40"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 p-2 rounded-2xl flex items-center justify-between shadow-2xl shadow-indigo-500/20">
              <div className="flex items-center gap-3 pl-2">
                <div className="flex -space-x-2">
                  {selectedStocks.map((s, i) => (
                    <div key={s.symbol} className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400" style={{ zIndex: selectedStocks.length - i }}>
                      {s.symbol[0]}
                    </div>
                  ))}
                </div>
                <div>
                   <div className="text-[9px] font-black text-white uppercase leading-none">{selectedStocks.length} Assets</div>
                   <div className="text-[7px] font-bold text-slate-500 uppercase mt-0.5">Ready for comparison</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setSelectedStocks([])}
                  className="p-2.5 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => setShowComparison(true)}
                  disabled={selectedStocks.length < 2}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    selectedStocks.length >= 2 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-800 text-slate-600"
                  )}
                >
                  Compare
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Index Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 px-2 md:px-0">
        {indices.map(index => (
          <div key={index.symbol} className="bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 overflow-hidden relative group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Composite</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">{index.symbol}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white tracking-tighter">{index.currentPrice.toLocaleString()}</div>
                <div className={cn(
                  "text-xs font-black",
                  index.change >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {index.change >= 0 ? '+' : ''}{index.change} ({index.changePercent}%)
                </div>
              </div>
            </div>

            <div className="h-48 w-full -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={index.history}>
                  <defs>
                    <linearGradient id={`color-${index.symbol}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={index.change >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={index.change >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={index.change >= 0 ? "#10b981" : "#f43f5e"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill={`url(#color-${index.symbol})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 md:px-0">
        {filteredStocks.map(stock => (
          <StockCard 
            key={stock.symbol} 
            stock={stock} 
            selected={selectedStocks.some(s => s.symbol === stock.symbol)}
            onSelect={() => handleStockSelect(stock)}
          />
        ))}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Price</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">24h Change</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Market Cap</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Volume</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Select</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {filteredStocks.map(stock => {
              const isSelected = selectedStocks.some(s => s.symbol === stock.symbol);
              return (
                <tr 
                  key={stock.symbol} 
                  onClick={() => handleStockSelect(stock)}
                  className={cn(
                    "hover:bg-slate-800/40 transition-colors cursor-pointer group",
                    isSelected && "bg-indigo-600/5"
                  )}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={(e) => { e.stopPropagation(); navigate(`/stock/${stock.symbol}`); }}
                        className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-[10px] text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                      >
                        {stock.symbol[0]}
                      </div>
                      <div 
                        onClick={(e) => { e.stopPropagation(); navigate(`/stock/${stock.symbol}`); }}
                        className="cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        <div className="font-black text-sm group-hover:text-white transition-colors">{stock.symbol}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-white">{formatCurrency(stock.currentPrice)}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "font-black",
                      stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500">₹{(stock.marketCap / 10000).toFixed(1)}T</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500">{(stock.volume / 1000000).toFixed(1)}M</td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                      isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-800 text-transparent"
                    )}>
                      <Plus size={14} className={cn(isSelected && "rotate-45")} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
