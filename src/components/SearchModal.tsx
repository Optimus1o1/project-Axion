import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Sparkles, Cpu, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { marketDataService } from '../services/marketDataService';
import { StockData } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = marketDataService.getStocks().filter(s => 
        s.symbol.toLowerCase().includes(query.toLowerCase()) || 
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    onClose();
  };

  const recentSearches = ['RELIANCE', 'TCS', 'HDFCBANK'];

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800 flex items-center gap-4">
              <Search size={22} className="text-indigo-400" />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Neural search stocks, tokens, insights..." 
                className="flex-1 bg-transparent border-none outline-none text-lg font-black text-white placeholder:text-slate-600 font-mono tracking-tight"
              />
              <button 
                onClick={onClose}
                className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {query.length === 0 ? (
                <div className="space-y-6 p-2">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                       <History size={12} />
                       Recent Pulses
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recentSearches.map(s => (
                        <button 
                          key={s}
                          onClick={() => handleSelect(s)}
                          className="flex items-center justify-between p-4 bg-slate-950/50 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all group"
                        >
                          <span className="font-black text-white tracking-widest">{s}</span>
                          <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                       <Sparkles size={12} />
                       Neural Channels
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Market Heatmap', icon: TrendingUp, path: '/markets' },
                        { label: 'AI Deep Insights', icon: Cpu, path: '/insights' },
                      ].map(link => (
                        <button 
                          key={link.path}
                          onClick={() => { navigate(link.path); onClose(); }}
                          className="w-full flex items-center gap-4 p-4 bg-slate-950/30 hover:bg-slate-800/50 rounded-2xl transition-all text-slate-400 hover:text-white"
                        >
                          <link.icon size={18} />
                          <span className="text-[11px] font-black uppercase tracking-widest">{link.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.length > 0 ? (
                    results.map(stock => (
                      <button 
                        key={stock.symbol}
                        onClick={() => handleSelect(stock.symbol)}
                        className="w-full flex items-center justify-between p-5 bg-slate-950/50 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-sm text-indigo-400 tracking-tighter">
                            {stock.symbol[0]}
                          </div>
                          <div className="text-left">
                            <h5 className="font-black text-white leading-none tracking-tight">{stock.symbol}</h5>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="text-sm font-black text-white font-mono tracking-tight">₹{stock.currentPrice.toLocaleString()}</div>
                           <div className={cn(
                             "text-[10px] font-black uppercase mt-0.5",
                             stock.change >= 0 ? "text-emerald-500" : "text-rose-500"
                           )}>
                             {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                           </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-600 font-mono">
                       <p className="text-sm font-black uppercase tracking-widest italic opacity-50">Zero neural matches found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-slate-800 rounded-md text-[8px] font-bold text-slate-400 border border-slate-700">ESC</kbd>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Close</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-slate-800 rounded-md text-[8px] font-bold text-slate-400 border border-slate-700">↵</kbd>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Select</span>
                  </div>
               </div>
               <div className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em]">Neural Index v4.2</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
