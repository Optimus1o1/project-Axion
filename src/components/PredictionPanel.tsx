import React from 'react';
import { PredictionResult } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { Brain, Target, ShieldAlert, Sparkles, TrendingUp, TrendingDown, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface PredictionPanelProps {
  prediction: PredictionResult | null;
  loading: boolean;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ prediction, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md p-12 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center gap-6 text-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 bg-indigo-500/20 rounded-full border border-indigo-500/30"
        >
          <Brain size={48} className="text-indigo-400" />
        </motion.div>
        <div className="space-y-1">
          <p className="font-black text-xl text-white tracking-tight">Neural Core Processing</p>
          <p className="text-sm text-slate-400 font-medium">Analyzing sector trends & volatility indices...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-slate-800/30 p-12 rounded-3xl border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center text-center gap-4">
        <div className="p-3 bg-slate-900 rounded-2xl">
          <Sparkles size={32} className="text-slate-600" />
        </div>
        <p className="text-base font-bold text-slate-500">Pick a stock to activate AI analytics</p>
      </div>
    );
  }

  const isBullish = prediction.trend === 'bullish';
  const isBearish = prediction.trend === 'bearish';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800 border border-slate-700 rounded-[2rem] md:rounded-3xl overflow-hidden shadow-2xl relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
      
      <div className="p-5 md:p-6 border-b border-slate-700/50 bg-slate-900/40 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <Brain size={18} className="md:size-20 text-white" />
          </div>
          <div>
            <h3 className="font-black text-sm md:text-base text-white tracking-tight leading-none">Axion Intelligence</h3>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Prediction Engine V3.2</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-slate-950 border border-slate-700 text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">
          Confidence: {(prediction.confidence * 100).toFixed(0)}%
        </div>
      </div>

      <div className="p-6 md:p-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl transition-all duration-500",
                isBullish ? "bg-emerald-600 shadow-emerald-600/30" : isBearish ? "bg-rose-600 shadow-rose-600/30" : "bg-slate-700 shadow-slate-700/30"
              )}>
                {isBullish ? <TrendingUp size={24} className="md:size-32 text-white" /> : isBearish ? <TrendingDown size={24} className="md:size-32 text-white" /> : <ArrowRight size={24} className="md:size-32 text-white" />}
              </div>
              <div>
                <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Signal</div>
                <div className={cn("text-2xl md:text-3xl font-black uppercase tracking-tighter", isBullish ? "text-emerald-400" : isBearish ? "text-rose-400" : "text-slate-400")}>
                  {prediction.trend}
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6 bg-slate-950/50 border border-slate-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Target size={14} className="md:size-16" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">AI Target Price</span>
              </div>
              <div className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                {formatCurrency(prediction.targetPrice)}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-500">
              <Sparkles size={14} className="md:size-16 text-indigo-400" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Logic Synthesis</span>
            </div>
            
            <div className="space-y-4 relative">
              {prediction.rationale.split('.').filter(p => p.trim().length > 3).map((point, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={idx} 
                  className="flex gap-4 group"
                >
                  <div className="mt-1.5 shrink-0 flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)] group-hover:bg-white transition-colors" />
                    {idx !== prediction.rationale.split('.').filter(p => p.trim().length > 3).length - 1 && (
                      <div className="w-[1px] h-full min-h-[20px] bg-slate-700" />
                    )}
                  </div>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed font-bold group-hover:text-white transition-colors">
                    {point.trim() + (point.trim().endsWith('.') ? '' : '.')}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700/50">
               <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-700/50 rounded-xl">
                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Pattern Verified</span>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 flex items-start gap-3 p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
            <ShieldAlert size={20} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              AI signals are speculative. Axion uses historical volatility & NLP of regional news to estimate trends. Not financial advice.
            </p>
          </div>
          <button 
            onClick={() => navigate(`/stock/${prediction.symbol}`)}
            className="w-full sm:w-auto px-6 py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 shrink-0 shadow-xl"
          >
            Deep Scan
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
