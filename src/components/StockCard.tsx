import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StockData } from '../types';
import { cn, formatCurrency, formatPercentage } from '../lib/utils';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface StockCardProps {
  stock: StockData;
  onSelect?: (stock: StockData) => void;
  selected?: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onSelect, selected }) => {
  const navigate = useNavigate();
  const isPositive = stock.change >= 0;

  const handleCardClick = () => {
    navigate(`/stock/${stock.symbol}`);
  };

  const handleSelectToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect(stock);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={cn(
        "p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-md cursor-pointer transition-all group relative",
        "hover:shadow-xl hover:shadow-indigo-500/10 hover:border-slate-700/80 hover:bg-slate-900/60",
        selected && "ring-1 ring-indigo-500/50 border-indigo-500/50 bg-slate-900 shadow-2xl shadow-indigo-500/10"
      )}
    >
      {/* Comparison Toggle */}
      {onSelect && (
        <button 
          onClick={handleSelectToggle}
          className={cn(
            "absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all z-20 border",
            selected 
              ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20" 
              : "bg-slate-950/50 border-slate-800 text-slate-500 hover:text-white"
          )}
        >
          <ArrowUpRight size={14} className={cn("transition-transform", selected && "rotate-45")} />
        </button>
      )}

      {!onSelect && (
         <div className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} className="text-slate-500" />
         </div>
      )}

      <div className="flex justify-between items-start mb-4 pr-10">
        <div>
          <h3 className="font-black text-lg md:text-xl leading-tight tracking-tight text-white font-mono">{stock.symbol}</h3>
          <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] font-mono">{stock.name}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest font-mono",
          isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
        )}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {formatPercentage(stock.changePercent)}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-2xl md:text-3xl font-black tracking-tighter text-white font-mono truncate">
            {formatCurrency(stock.currentPrice)}
          </div>
          <div className={cn(
            "text-xs font-bold flex items-center gap-1 mt-1 font-mono",
            isPositive ? "text-emerald-400" : "text-rose-400"
          )}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(stock.change).toFixed(2)}
          </div>
        </div>
        
        <div className="h-16 w-24 md:h-20 md:w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stock.history}>
              <defs>
                <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis hide domain={['auto', 'auto']} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                fillOpacity={1}
                fill={`url(#gradient-${stock.symbol})`}
                strokeWidth={2}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
