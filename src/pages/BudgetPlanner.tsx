import React, { useState, useEffect } from 'react';
import { Wallet, Sparkles, TrendingUp, Filter, ArrowRight, Zap, Target, PieChart, ShieldCheck, Rocket } from 'lucide-react';
import { marketDataService } from '../services/marketDataService';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { StockData } from '../types';

export default function BudgetPlanner() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(1000);
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [stocks, setStocks] = useState<StockData[]>(marketDataService.getStocks());

  useEffect(() => {
    const unsubscribe = marketDataService.subscribe((updatedStocks, _updatedIndices) => {
      setStocks(updatedStocks);
    });
    return () => unsubscribe();
  }, []);

  const affordableStocks = stocks.filter(s => s.currentPrice <= budget);

  const getStrategyDescription = () => {
    switch (riskLevel) {
      case 'conservative':
        return {
          title: "Wealth Preservation",
          description: "Focus on dividend-paying blue-chip stocks and large caps with low volatility. Your capital safety is priority #1.",
          icon: ShieldCheck,
          color: "text-emerald-400"
        };
      case 'balanced':
        return {
          title: "Balanced Growth",
          description: "A mix of stable large caps and high-growth mid caps. Aim for steady accumulation while capturing market outperformance.",
          icon: TrendingUp,
          color: "text-indigo-400"
        };
      case 'aggressive':
        return {
          title: "Alpha Pursuit",
          description: "High-conviction bets on small caps and momentum stocks. Expect higher volatility for potentially explosive multi-bagger returns.",
          icon: Rocket,
          color: "text-rose-400"
        };
    }
  };

  const strategy = getStrategyDescription();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
        <div>
          <h2 className="text-[10px] md:text-xs font-black tracking-[0.4em] text-slate-500 uppercase mb-2">Capital Allocation</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">Budget Planner</h1>
        </div>
        
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl overflow-x-auto scrollbar-hide">
          {['conservative', 'balanced', 'aggressive'].map((level) => (
            <button
              key={level}
              onClick={() => setRiskLevel(level as any)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                riskLevel === level ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="col-span-12">
            <div className="bg-indigo-600 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 border border-indigo-400/30">
                <div className="absolute bottom-0 right-0 p-10 opacity-10 rotate-12 scale-150 hidden md:block"><Wallet size={240} /></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="space-y-6 md:space-y-10">
                        <div>
                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-indigo-200 mb-6">Financial Capacity</h3>
                            <div className="text-5xl md:text-8xl font-black tracking-tighter mb-4 leading-none">{formatCurrency(budget)}</div>
                            <p className="text-indigo-100 font-bold text-base md:text-lg opacity-80 max-w-sm">Scan the ecosystem for assets aligned with your current liquidity profile.</p>
                        </div>
                        <div className="space-y-4">
                            <input 
                                type="range" min="100" max="10000" step="100"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="w-full h-4 bg-indigo-400/50 rounded-full appearance-none cursor-pointer accent-white"
                            />
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                <span>₹100</span>
                                <span>Dynamic Fluid Scale</span>
                                <span>₹10,000+</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/20 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className={cn("p-4 md:p-5 bg-white rounded-2xl md:rounded-[1.5rem] shadow-xl", strategy.color)}>
                                <strategy.icon size={28} className="md:size-32" />
                            </div>
                            <div>
                                <h4 className="text-xl md:text-2xl font-black tracking-tight uppercase leading-none">{strategy.title}</h4>
                                <div className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1", strategy.color)}>{riskLevel} PROFILE ACTIVE</div>
                            </div>
                        </div>
                        <p className="text-sm md:text-base leading-relaxed font-bold text-indigo-50 opacity-90">
                            {strategy.description}
                        </p>
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Recommended Allocation</div>
                            <div className="text-sm font-black uppercase">SIP / Lumpsum</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tactical Suggestions */}
        <div className="col-span-12 lg:col-span-8 space-y-6 md:space-y-8">
            <div className="flex items-center justify-between px-2 md:px-4">
                <div className="flex items-center gap-3">
                    <PieChart size={18} className="text-indigo-400" />
                    <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-500">Live Scanned Opportunities</h3>
                </div>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                    {affordableStocks.length} Assets in Range
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {affordableStocks.map(s => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={s.symbol} 
                            onClick={() => navigate(`/stock/${s.symbol}`)}
                            className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex justify-between items-center group transition-all hover:bg-slate-850 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer"
                        >
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs text-indigo-400 group-hover:border-indigo-500/50 transition-colors">
                                    {s.symbol[0]}
                                </div>
                                <div>
                                    <div className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.symbol}</div>
                                    <div className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none mb-1 md:mb-2">{formatCurrency(s.currentPrice)}</div>
                                    <div className={cn(
                                        "text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1",
                                        s.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                                    )}>
                                        {s.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                                        {s.changePercent >= 0 ? '+' : ''}{s.changePercent}%
                                    </div>
                                </div>
                            </div>
                            <button className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 transition-all">
                                <Zap size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6 md:space-y-8">
             <div className="bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 h-full">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-2xl shadow-indigo-500/30">
                        <Target size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight">Alpha Engine</h4>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Momentum Discovery</span>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity">
                            <Sparkles size={48} className="text-indigo-400" />
                        </div>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed italic mb-4">
                            "Neural network scanning exchange for liquidity pockets and technical breakout patterns..."
                        </p>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-1/2 h-full bg-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'INFY (Mini)', price: '₹140.2', score: 92, status: 'Accumulate' },
                            { name: 'TCS (Fraction)', price: '₹220.5', score: 85, status: 'Hold' },
                            { name: 'REL Growth', price: '₹410.0', score: 78, status: 'Watch' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-slate-950/50 border border-slate-800/50 rounded-3xl group cursor-pointer hover:border-indigo-500 transition-all hover:bg-slate-800/40">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase mb-0.5">{item.name}</div>
                                        <div className="font-black text-white">{item.price}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[11px] font-black text-white">{item.score}%</div>
                                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{item.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Risk Disclosure</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed lowercase">
                            simulated strategy for educational purposes. trading in Indian markets involves capital risk. always maintain exit liquidity.
                        </p>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
