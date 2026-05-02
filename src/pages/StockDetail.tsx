import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Info,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShoppingBag,
  Send,
  Plus,
  Minus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { marketDataService } from '../services/marketDataService';
import { geminiService } from '../services/geminiService';
import { StockData, PredictionResult } from '../types';
import { formatCurrency, formatPercentage, cn } from '../lib/utils';
import { TransactionModal } from '../components/TransactionModal';

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transactionType, setTransactionType] = useState<'BUY' | 'SELL' | null>(null);
  const [preQuantity, setPreQuantity] = useState<string>('1');

  useEffect(() => {
    if (!symbol) return;
    
    const currentStock = marketDataService.getStockBySymbol(symbol);
    if (!currentStock) {
      navigate('/');
      return;
    }
    setStock(currentStock);

    const unsubscribe = marketDataService.subscribe((stocks) => {
      const updated = stocks.find(s => s.symbol === symbol);
      if (updated) setStock(updated);
    });

    return () => unsubscribe();
  }, [symbol, navigate]);

  const handleRunAnalysis = async () => {
    if (!stock) return;
    setIsAnalyzing(true);
    try {
      const result = await geminiService.predictStockTrend(stock);
      setPrediction(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!stock) return null;

  const isPositive = stock.change >= 0;

  // Prepare chart data with forecast if prediction exists
  const combinedData = React.useMemo(() => {
    const history = stock.history.map(point => ({
      ...point,
      price: point.price,
      predictedPrice: null,
      isPrediction: false
    }));

    if (!prediction) return history;

    const lastPoint = history[history.length - 1];
    const forecastPoints = 8; // More points for a smoother curve
    const priceDiff = (prediction.targetPrice - lastPoint.price) / forecastPoints;

    const forecastData = Array.from({ length: forecastPoints }).map((_, i) => ({
      time: `+${(i + 1) * 15}m`,
      price: null, // Don't show in historical series
      predictedPrice: lastPoint.price + (priceDiff * (i + 1)),
      isPrediction: true
    }));

    // Connect the prediction to the last historical point
    const forecastStart = {
      ...lastPoint,
      price: lastPoint.price, // Keep history value
      predictedPrice: lastPoint.price, // Start prediction here
      isPrediction: true
    };

    // Remove the last point from history to replace it with the forecastStart junction
    const historyBase = history.slice(0, -1);

    return {
      data: [...historyBase, forecastStart, ...forecastData],
      forecastStartTime: forecastStart.time
    };
  }, [stock.history, prediction]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Get the value from either series that is active
      const value = payload.find((p: any) => p.value !== null && p.value !== undefined)?.value;
      
      return (
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-2xl backdrop-blur-xl border-white/5 ring-1 ring-white/10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-6">
              {data.isPrediction ? (
                <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <Sparkles size={12} className="text-emerald-400" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.1em]">Neural Projection</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <Activity size={12} className="text-indigo-400" />
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.1em]">Historical Core</span>
                </div>
              )}
              <span className="text-[10px] font-black text-slate-500 font-mono tracking-widest">{label}</span>
            </div>
            
            <div className="flex flex-col">
              <div className="text-3xl font-black text-white font-mono tracking-tighter">
                {formatCurrency(value)}
              </div>
              {data.isPrediction && prediction && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap size={10} className="text-emerald-400" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">Forecast Rationale</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic max-w-[220px]">
                    "{prediction.rationale.split('.')[0]}."
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between px-2 md:px-0">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl group-hover:border-slate-700">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Terminal</span>
        </button>
        <div className="flex items-center gap-2">
           <div className={cn(
             "w-2 h-2 rounded-full animate-pulse",
             geminiService.isThrottled() ? "bg-amber-500" : "bg-emerald-500"
           )} />
           <span className={cn(
             "text-[10px] font-black uppercase tracking-widest font-mono",
             geminiService.isThrottled() ? "text-amber-500" : "text-slate-500"
           )}>
             Neural Link: {geminiService.isThrottled() ? 'Fallback Mode' : 'Feed Active'}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 md:gap-14 px-2 md:px-0">
        {/* Left Column: Stock Info & Main Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          <div className="bg-slate-900/40 backdrop-blur-md precise-border rounded-[2.5rem] p-8 md:p-14 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-mono">{stock.symbol}</h1>
                  <div className={cn(
                     "px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border",
                     isPositive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  )}>
                    {isPositive ? <TrendingUp size={14} className="inline mr-1" /> : <TrendingDown size={14} className="inline mr-1" />}
                    {formatPercentage(stock.changePercent)}
                  </div>
                </div>
                <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest ml-1">{stock.name}</p>
              </div>
              
              <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
                <div className="text-left md:text-right">
                  <div className="text-4xl md:text-6xl font-black text-white tracking-tighter font-mono">{formatCurrency(stock.currentPrice)}</div>
                  <div className={cn(
                    "text-sm font-bold flex items-center md:justify-end gap-1 mt-2 font-mono",
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {formatCurrency(Math.abs(stock.change))} Today
                  </div>
                </div>
                
                {/* Mobile action buttons */}
                <div className="flex md:hidden flex-col gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPreQuantity(prev => Math.max(0, (parseFloat(prev) || 0) - 1).toString())}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500"
                    >
                      <Minus size={18} />
                    </button>
                    <input 
                      type="number"
                      value={preQuantity}
                      onChange={(e) => setPreQuantity(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl py-4 px-4 text-xl font-black text-white text-center outline-none focus:border-indigo-500"
                    />
                    <button 
                      onClick={() => setPreQuantity(prev => ((parseFloat(prev) || 0) + 1).toString())}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setTransactionType('BUY')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-5 font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                      <ShoppingBag size={18} /> Purchase
                    </button>
                    <button 
                      onClick={() => setTransactionType('SELL')}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl py-5 font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-rose-500/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                      <Send size={18} className="rotate-[-45deg]" /> Liquidate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full mt-4 md:mt-0 relative">
              {prediction && (
                <div className="absolute top-0 right-0 z-10 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                   <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">Neural Signal Overlay Active</span>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData.data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => val}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {prediction && (
                    <ReferenceLine 
                      x={combinedData.forecastStartTime} 
                      stroke="#10b981" 
                      strokeDasharray="3 3"
                      label={{ position: 'top', value: 'FORECAST START', fill: '#10b981', fontSize: 8, fontWeight: 900 }}
                    />
                  )}

                  {/* Historical Area */}
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2, fill: '#6366f1' }}
                    isAnimationActive={!prediction}
                  />
                  {/* Forecast Area */}
                  {prediction && (
                    <Area 
                      type="monotone" 
                      dataKey="predictedPrice" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      fillOpacity={1} 
                      fill="url(#colorForecast)" 
                      activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2, fill: '#10b981' }}
                      isAnimationActive={true}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="precise-border bg-slate-900/40 rounded-[2rem] p-8 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Metadata Scan</h3>
              <div className="space-y-4">
                {[
                  { label: "Market Cap", value: `₹${(stock.marketCap / 10000).toFixed(1)}T` },
                  { label: "Volume", value: `${(stock.volume / 1000000).toFixed(2)}M` },
                  { label: "Avg Volume", value: "4.2M" },
                  { label: "High (52w)", value: formatCurrency(stock.high52w || stock.currentPrice * 1.2) },
                  { label: "Low (52w)", value: formatCurrency(stock.low52w || stock.currentPrice * 0.8) },
                  { label: "Beta", value: "1.15" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs font-black text-white font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="precise-border bg-slate-900/40 rounded-[2rem] p-8 flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-500">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Asset Health</h3>
                  <div className="p-1 px-2 bg-indigo-500/10 rounded-md">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Optimized</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center py-4 relative">
                   <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-24 h-24 bg-indigo-500 rounded-full" />
                   </div>
                   <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                         <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                         <motion.circle 
                          initial={{ strokeDashoffset: 263.8 }}
                          animate={{ strokeDashoffset: 263.8 * (1 - 0.88) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="text-indigo-500" 
                          strokeWidth="8" 
                          strokeDasharray="263.8" 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="42" 
                          cx="50" 
                          cy="50" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-1">
                         <motion.span 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-4xl font-black text-white tracking-tighter"
                         >88</motion.span>
                         <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Rating</span>
                      </div>
                   </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                  Bullish divergence detected in fractal wave patterns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Predictions */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group shadow-2xl shadow-indigo-600/20 border border-indigo-400/20">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={80} /></div>
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-8">AI Neural Prediction</h3>
                 
                 {!prediction ? (
                   <div className="space-y-6">
                      <p className="text-sm font-bold text-indigo-100 leading-relaxed">
                        Execute a deep neural scan to predict short-term price movements and market sentiment for {stock.symbol}.
                      </p>
                      <button 
                        onClick={handleRunAnalysis}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                         {isAnalyzing ? (
                           <>
                             <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                             Processing Matrix...
                           </>
                         ) : (
                           <>
                             <Zap size={16} fill="currentColor" />
                             Execute Neural Scan
                           </>
                         )}
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-8">
                      <div className="flex items-center justify-between bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                         <div className="space-y-1">
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Trend Vector</span>
                            <div className={cn(
                              "text-xl font-black uppercase tracking-tight",
                              prediction.trend === 'bullish' ? "text-emerald-400" : prediction.trend === 'bearish' ? "text-rose-400" : "text-amber-400"
                            )}>{prediction.trend}</div>
                         </div>
                         <div className="text-right space-y-1">
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Confidence</span>
                            <div className="text-xl font-black text-white font-mono">{(prediction.confidence * 100).toFixed(0)}%</div>
                         </div>
                      </div>

                      <div>
                         <div className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-2">Neural Rationale</div>
                         <p className="text-sm font-bold text-indigo-100 leading-relaxed bg-black/10 p-4 rounded-xl border border-white/5">
                           {prediction.rationale}
                         </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                         <div>
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Target Price</span>
                            <div className="text-2xl font-black text-white font-mono">{formatCurrency(prediction.targetPrice)}</div>
                         </div>
                         <button onClick={() => setPrediction(null)} className="text-[10px] font-black text-indigo-300 uppercase tracking-widest hover:text-white transition-colors">
                            Refeed Data
                         </button>
                      </div>
                   </div>
                 )}
              </div>
           </div>

            <div className="precise-border bg-slate-900/40 rounded-[2rem] p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Execution Hub</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Market Open</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setPreQuantity(prev => Math.max(0, (parseFloat(prev) || 0) - 1).toString())}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="relative flex-1">
                    <input 
                      type="number"
                      value={preQuantity}
                      onChange={(e) => setPreQuantity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-black text-white text-center outline-none focus:border-indigo-500 transition-all"
                      placeholder="Qty"
                    />
                  </div>
                  <button 
                    onClick={() => setPreQuantity(prev => ((parseFloat(prev) || 0) + 1).toString())}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTransactionType('BUY')}
                    className="flex flex-col items-center justify-center gap-4 p-7 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] group hover:bg-emerald-600 transition-all duration-500 shadow-2xl shadow-emerald-500/0 hover:shadow-emerald-500/20 active:scale-95"
                  >
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl group-hover:bg-white group-hover:text-emerald-600 transition-all duration-500 group-hover:rotate-12">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-black text-white uppercase tracking-[0.2em] text-center">Capture</span>
                      <div className="flex items-center gap-1.5 mt-1 justify-center">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                        <span className="text-[7px] font-black text-emerald-400 group-hover:text-white/80 uppercase tracking-widest">Instant</span>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setTransactionType('SELL')}
                    className="flex flex-col items-center justify-center gap-4 p-7 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] group hover:bg-rose-600 transition-all duration-500 shadow-2xl shadow-rose-500/0 hover:shadow-rose-500/20 active:scale-95"
                  >
                    <div className="p-4 bg-rose-500 text-white rounded-2xl group-hover:bg-white group-hover:text-rose-600 transition-all duration-500 group-hover:-rotate-12">
                      <Send size={24} className="rotate-[-45deg]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-black text-white uppercase tracking-[0.2em] text-center">Liquidate</span>
                      <div className="flex items-center gap-1.5 mt-1 justify-center">
                        <span className="w-1 h-1 bg-rose-400 rounded-full" />
                        <span className="text-[7px] font-black text-rose-400 group-hover:text-white/80 uppercase tracking-widest">T+0 Sync</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-950/40 rounded-2xl p-5 border border-slate-800/50 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                       <div className="p-2 bg-indigo-500/10 rounded-lg">
                          <Wallet size={14} className="text-indigo-400" />
                       </div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Balance</span>
                    </div>
                    <span className="text-xs font-black text-white font-mono uppercase tracking-tighter">₹1,42,050.00</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-indigo-500/50" />
                 </div>
              </div>
           </div>

           <div className="precise-border bg-slate-900/40 rounded-[2rem] p-8 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Risk Engine Scan</h3>
              <div className="space-y-6">
                 {[
                   { label: "Alpha Coefficient", value: "+3.2%", status: "Superior", percentage: 85, color: "bg-emerald-500" },
                   { label: "Sharpe Ratio", value: "1.92", status: "Optimal", percentage: 72, color: "bg-indigo-500" },
                   { label: "Market Volatility", value: "Low", status: "Stable", percentage: 25, color: "bg-sky-400" },
                   { label: "Structural Risk", value: "-4.5%", status: "Safe", percentage: 15, color: "bg-rose-500" }
                 ].map((metric) => (
                   <div key={metric.label}>
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{metric.label}</span>
                         <span className="text-xs font-black text-white font-mono">{metric.value}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 w-3/4 rounded-full" />
                      </div>
                      <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1 text-right">{metric.status}</div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Disclaimer Control</h4>
                <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                  Neural predictions are probabilistic estimates based on technical scan patterns. Invest responsibly.
                </p>
              </div>
           </div>
        </div>
      </div>
      {transactionType && stock && (
        <TransactionModal 
          isOpen={!!transactionType}
          onClose={() => setTransactionType(null)}
          stock={stock}
          type={transactionType}
          initialQuantity={preQuantity}
        />
      )}
    </div>
  );
}
