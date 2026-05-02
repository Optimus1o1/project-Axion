import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';

interface MoodMeterProps {
  score: number;
}

export const MoodMeter: React.FC<MoodMeterProps> = ({ score }) => {
  const getMoodLabel = (s: number) => {
    if (s < 20) return { text: "Extreme Fear", color: "bg-rose-600", emoji: "😨" };
    if (s < 40) return { text: "Fear", color: "bg-orange-500", emoji: "😟" };
    if (s < 60) return { text: "Neutral", color: "bg-slate-500", emoji: "😐" };
    if (s < 80) return { text: "Greed", color: "bg-emerald-500", emoji: "🤑" };
    return { text: "Extreme Greed", color: "bg-indigo-600", emoji: "🚀" };
  };

  const mood = getMoodLabel(score);

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 text-white p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
      <div className="relative z-10 text-center">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Market Sentiment</h3>
          <Info size={14} className="text-slate-600 cursor-pointer hover:text-indigo-400 transition-colors" />
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-56 h-28 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-56 border-[16px] border-slate-900/50 rounded-full" />
            <div 
              className={cn("absolute top-0 left-0 w-full h-56 border-[16px] rounded-full border-t-transparent border-l-transparent border-r-transparent", mood.color)}
              style={{
                clipPath: `inset(0 0 50% 0)`,
                transform: `rotate(${(score * 1.8) - 90}deg)`,
                transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-slate-900 z-20 shadow-xl" />
          </div>

          <div className="space-y-1">
            <div className="text-5xl font-black tracking-tighter text-white">{score}</div>
            <div className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block shadow-lg", mood.color)}>
              {mood.text} {mood.emoji}
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-[200px] mx-auto">
          Neural analysis of global indices & NSE volatility.
        </p>
      </div>
      
      {/* Decorative radial background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none transition-opacity group-hover:opacity-50">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1)_0%,transparent_60%)]" />
      </div>
    </div>
  );
};
