import React, { useState, useEffect } from 'react';
import { PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Wallet, History, ShieldCheck, Activity, BarChart3, TrendingUp, Sparkles, Target, Flag, Calendar, Plus, Trophy } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { marketDataService } from '../services/marketDataService';
import { MOCK_GOALS } from '../services/mockDataService';
import { StockData, FinancialGoal, Transaction } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', symbol: 'RELIANCE', type: 'BUY', quantity: 3, price: 2816.65, value: 8450, date: '2026-04-24', status: 'completed' },
  { id: '2', symbol: 'TCS', type: 'BUY', quantity: 3.5, price: 3485.70, value: 12200, date: '2026-04-18', status: 'completed' },
  { id: '3', symbol: 'HDFC', type: 'SELL', quantity: 2.5, price: 1640.00, value: 4100, date: '2026-04-12', status: 'completed' },
  { id: '4', symbol: 'ZOMATO', type: 'BUY', quantity: 100, price: 185.20, value: 18520, date: '2026-04-05', status: 'completed' },
  { id: '5', symbol: 'INFY', type: 'SELL', quantity: 10, price: 1420.50, value: 14205, date: '2026-03-28', status: 'completed' },
];

const INITIAL_HOLDINGS = [
  { symbol: 'RELIANCE', name: 'Reliance', quantity: 15.5, color: '#6366f1' },
  { symbol: 'HDFC', name: 'HDFC Bank', quantity: 20.0, color: '#ec4899' },
  { symbol: 'TCS', name: 'TCS', quantity: 8.2, color: '#10b981' },
];

const CASH_BALANCE = 15000;

const RISK_METRICS = [
  { 
    label: 'Alpha (Neural Core)', 
    value: '4.2%', 
    description: 'The "Edge" metric. This represents your portfolio\'s ability to beat the market benchmark (Nifty 50) after adjusting for risk. A positive 4.2% means you are generating extra value beyond pure market beta.', 
    icon: Sparkles, 
    color: 'text-indigo-400' 
  },
  { 
    label: 'Beta (Volatility Sync)', 
    value: '1.12', 
    description: 'System sensitivity. A Beta of 1.12 means your assets are 12% more volatile than the index. While higher volatility increases potential rewards, it also expands the threat radius during market corrections.', 
    icon: Activity, 
    color: 'text-emerald-400' 
  },
  { 
    label: 'Sharpe (Efficiency)', 
    value: '1.85', 
    description: 'The efficiency engine. This ratio evaluates if your returns are due to smart choices or just excessive risk. 1.85 indicates high risk-adjusted efficiency; you are getting significant return for every unit of "neural stress".', 
    icon: BarChart3, 
    color: 'text-amber-400' 
  },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockData[]>(marketDataService.getStocks());
  const [goals, setGoals] = useState<FinancialGoal[]>(MOCK_GOALS);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });

  useEffect(() => {
    const unsubscribe = marketDataService.subscribe((updatedStocks) => {
      setStocks(updatedStocks);
    });
    return () => unsubscribe();
  }, []);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) return;

    const goal: FinancialGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name,
      targetAmount: Number(newGoal.target),
      currentAmount: totalValue,
      deadline: newGoal.deadline,
      category: 'other'
    };

    setGoals([...goals, goal]);
    setShowGoalForm(false);
    setNewGoal({ name: '', target: '', deadline: '' });
  };

  const portfolioAssets = INITIAL_HOLDINGS.map(holding => {
    const stock = stocks.find(s => s.symbol === holding.symbol);
    const currentPrice = stock?.currentPrice || 0;
    return {
      ...holding,
      value: currentPrice * holding.quantity,
      price: currentPrice
    };
  });

  const totalValue = portfolioAssets.reduce((acc, item) => acc + item.value, 0) + CASH_BALANCE;
  
  // Update goals with actual current value (if we assume full portfolio contributes to goals for simplicity)
  const updatedGoals = goals.map(goal => ({
    ...goal,
    currentAmount: totalValue // In a real app, specific assets would be linked to goals
  }));

  const chartData = [
    ...portfolioAssets.map(a => ({ name: a.name, value: a.value, color: a.color })),
    { name: 'Cash', value: CASH_BALANCE, color: '#f59e0b' }
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
        <div>
          <h2 className="text-[10px] md:text-xs font-black tracking-[0.4em] text-slate-500 uppercase mb-2">Internal Assets</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none font-mono">Portfolio</h1>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 p-4 rounded-[1.5rem] md:rounded-3xl">
          <div className="p-3 bg-indigo-500/90 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Wallet size={20} className="md:size-24 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Net Worth</div>
            <div className="text-2xl md:text-3xl font-black text-white tracking-tighter font-mono">{formatCurrency(totalValue)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        {/* Risk & Performance Analytics Row */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {RISK_METRICS.map((metric, i) => (
            <div key={i} className="precise-border bg-slate-900/40 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl group-hover:border-indigo-500/50 transition-colors">
                  <metric.icon size={18} className={metric.color} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{metric.label}</div>
                  <div className="text-2xl md:text-3xl font-black text-white tracking-tighter font-mono">{metric.value}</div>
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed border-t border-slate-800/30 pt-4 group-hover:text-slate-400 transition-colors">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Stats */}
        <div className="col-span-12 lg:col-span-8 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="precise-border bg-slate-900/40 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Allocation.map</h3>
              <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8">
                {chartData.map(item => (
                  <div key={item.name} className="flex items-center gap-3 p-3 bg-slate-950/30 rounded-2xl border border-slate-800/30">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-white truncate">{item.name}</div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">{((item.value / totalValue) * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-600/90 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between relative overflow-hidden group min-h-[300px] shadow-[0_0_40px_rgba(99,102,241,0.1)] border border-indigo-400/20">
              <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={120} /></div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 mb-8 font-mono">Performance.exe</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-1">PROFIT_LOG</div>
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tighter font-mono">
                      {formatCurrency(totalValue * 0.12)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-white font-bold text-sm bg-black/20 w-fit px-3 py-1 rounded-full border border-white/10">
                      <ArrowUpRight size={14} />
                      <span className="font-mono">12.4%</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/20">
                    <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-4">RISK_FACTOR</div>
                    <div className="flex gap-1.5">
                       {Array.from({ length: 5 }).map((_, i) => (
                         <div key={i} className={cn(
                           "flex-1 h-1.5 rounded-full overflow-hidden bg-white/10",
                         )}>
                            <div className={cn("h-full bg-white", i < 3 ? "w-full" : "w-0")} />
                         </div>
                       ))}
                    </div>
                    <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-2 font-mono">MD_RISK_03</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="precise-border bg-slate-900/50 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Transaction Logs</h3>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 border border-slate-800/50 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black text-slate-400 font-mono">SYNCED</span>
                 </div>
                 <History size={16} className="text-slate-600" />
               </div>
             </div>
             
             <div className="overflow-hidden">
               <div className="space-y-4">
                 {MOCK_TRANSACTIONS.map((tx) => (
                   <motion.div 
                     key={tx.id} 
                     whileHover={{ x: 4 }}
                     onClick={() => navigate(`/stock/${tx.symbol}`)}
                     className="flex items-center justify-between p-4 md:p-5 bg-slate-950/30 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800/30 group hover:border-indigo-500/30 transition-all cursor-pointer"
                   >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-[9px] md:text-[10px] border font-mono",
                          tx.type === 'BUY' 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" 
                            : "bg-rose-500/10 text-rose-400 border-rose-500/10"
                        )}>
                          {tx.type}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <div className="font-black text-sm md:text-base text-white tracking-tight font-mono">{tx.symbol}</div>
                             <div className="px-1.5 py-0.5 bg-slate-800 rounded text-[8px] font-black text-slate-400 font-mono">×{tx.quantity}</div>
                          </div>
                          <div className="text-[9px] md:text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5 font-mono">
                             {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {formatCurrency(tx.price)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="font-black text-sm md:text-base text-white tracking-tighter font-mono">{formatCurrency(tx.value)}</div>
                         <div className={cn(
                           "text-[9px] font-black uppercase tracking-widest mt-0.5 font-mono",
                           tx.status === 'completed' ? "text-emerald-500" : "text-amber-500"
                         )}>{tx.status}</div>
                      </div>
                   </motion.div>
                 ))}
               </div>
               
               <button className="w-full mt-8 py-4 border border-slate-800 rounded-[1.5rem] text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-slate-300 transition-all">
                  Load Historical Archives
               </button>
             </div>
          </div>
        </div>

        {/* Sidebar Mini-bento */}
        <div className="col-span-12 lg:col-span-4 space-y-6 md:space-y-8">
           {/* Financial Goals Section */}
           <div className="precise-border bg-slate-900/40 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono">Goals_db</h3>
                 <button 
                  onClick={() => setShowGoalForm(!showGoalForm)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    showGoalForm ? "bg-slate-800 text-slate-300 rotate-45" : "bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20"
                  )}
                 >
                    <Plus size={16} />
                 </button>
              </div>

              {showGoalForm && (
                <form onSubmit={handleAddGoal} className="space-y-4 p-5 bg-slate-950/80 border border-slate-800 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-4">
                    <input 
                      required
                      placeholder="Goal Identifier"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-black text-white outline-none focus:border-indigo-500 transition-all uppercase tracking-widest placeholder:text-slate-600"
                      value={newGoal.name}
                      onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        required
                        type="number"
                        placeholder="Target"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-black text-white outline-none focus:border-indigo-500 transition-all font-mono"
                        value={newGoal.target}
                        onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                      />
                      <input 
                        required
                        type="date"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-black text-white outline-none focus:border-indigo-500 transition-all dark:[color-scheme:dark] font-mono"
                        value={newGoal.deadline}
                        onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all"
                  >
                    Establish Branch
                  </button>
                </form>
              )}

              <div className="space-y-6">
                 {updatedGoals.map((goal) => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    return (
                       <div key={goal.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                   <Target size={14} />
                                </div>
                                <div className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">{goal.name}</div>
                             </div>
                             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono">{progress.toFixed(0)}%</div>
                          </div>
                          
                          <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-indigo-500 transition-all duration-1000" 
                                style={{ width: `${progress}%` }}
                             />
                          </div>
                          
                          <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-[0.1em] font-mono">
                             <span>TGT: {formatCurrency(goal.targetAmount)}</span>
                             <div className="flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>

              <div className="pt-6 border-t border-slate-800/50">
                 <div className="p-4 bg-indigo-600/5 border border-indigo-600/10 rounded-2xl flex items-center gap-4">
                    <Trophy size={20} className="text-secondary opacity-50 shrink-0" />
                    <div>
                       <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active_Objective</div>
                       <div className="text-[10px] font-bold text-slate-400 mt-0.5">Retirement projection online.</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="precise-border bg-slate-900/30 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono">Heatmap.vis</h3>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {chartData.map(item => {
                  const isStock = INITIAL_HOLDINGS.some(h => h.name === item.name);
                  const symbol = INITIAL_HOLDINGS.find(h => h.name === item.name)?.symbol;
                  
                  return (
                    <div 
                      key={item.name} 
                      onClick={() => isStock && symbol && navigate(`/stock/${symbol}`)}
                      className={cn(
                        "p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl group transition-all",
                        isStock ? "cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/50" : "cursor-default"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] font-black text-slate-500 truncate uppercase tracking-widest">{item.name}</div>
                        {isStock && <ArrowUpRight size={10} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />}
                      </div>
                      <div className="text-base font-black text-white font-mono">{formatCurrency(item.value)}</div>
                    </div>
                  );
                })}
              </div>
           </div>
           
           <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 text-center flex flex-col items-center justify-center group cursor-pointer hover:border-indigo-500 transition-colors">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:border-indigo-400 transition-all">
                <ArrowUpRight size={24} className="text-slate-500 group-hover:text-white" />
              </div>
              <h4 className="font-black text-white uppercase tracking-widest mb-1">Add Assets</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed px-4">Link your Zerodha, Groww or Upstox account directly.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
