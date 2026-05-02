import React, { useState, useMemo, useEffect } from 'react';
import { NewsArticle } from '../types';
import { cn } from '../lib/utils';
import { Newspaper, ExternalLink, Calendar, Filter, TrendingUp, TrendingDown, Minus, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';

interface NewsFeedProps {
  articles: NewsArticle[];
  loading: boolean;
}

const NewsArticleItem: React.FC<{ article: NewsArticle, index: number }> = ({ article, index }) => {
  const [summary, setSummary] = useState(article.summary);
  const [isRefining, setIsRefining] = useState(false);
  const [isRefined, setIsRefined] = useState(false);

  useEffect(() => {
    const shouldRefine = article.summary.length < 80 || article.summary.endsWith('...');
    
    if (shouldRefine && !isRefined && !isRefining) {
      refine();
    }
  }, [article.summary]);

  const refine = async () => {
    setIsRefining(true);
    try {
      const refined = await geminiService.refineSummary(article.title, article.summary);
      setSummary(refined);
      setIsRefined(true);
    } catch (error) {
      console.error("Refinement failed:", error);
    } finally {
      setIsRefining(false);
    }
  };

  // Calculate sentiment color and label
  const getSentimentDetails = (score: number) => {
    if (score > 0.6) return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Strongly Bullish" };
    if (score > 0.1) return { color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/10", label: "Optimistic" };
    if (score < -0.6) return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Strongly Bearish" };
    if (score < -0.1) return { color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/10", label: "Cautious" };
    return { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", label: "Neutral" };
  };

  const sentiment = getSentimentDetails(article.sentimentScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group p-6 md:p-8 bg-slate-900/60 border border-slate-800 rounded-[2.5rem] md:rounded-[3rem] hover:border-indigo-500/50 hover:bg-slate-800/80 hover:shadow-2xl transition-all cursor-pointer overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink size={16} className="text-indigo-400" />
      </div>
      
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-xl shadow-lg",
            sentiment.bg, sentiment.border
          )}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", sentiment.color.replace('text', 'bg'))} />
            <span className={cn("text-[10px] font-black uppercase tracking-widest", sentiment.color)}>
              {sentiment.label}
            </span>
            <div className="w-20 h-1.5 bg-slate-800/50 rounded-full overflow-hidden flex items-center ml-2 border border-white/5">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  article.sentimentScore > 0 ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" : "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.6)]"
                )}
                style={{ 
                  width: `${Math.abs(article.sentimentScore) * 100}%`,
                  marginLeft: article.sentimentScore < 0 ? 'auto' : '0'
                }} 
              />
            </div>
            <span className="text-[10px] font-black text-white/50 font-mono ml-1">
              {(article.sentimentScore > 0 ? "+" : "")}{article.sentimentScore.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-800/40 border border-slate-700/30 rounded-full shadow-sm">
            <div className="p-1 bg-indigo-500/20 rounded-md">
              <TrendingUp size={12} className="text-indigo-400" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Impact <span className="text-white ml-1">{article.impactScale}</span><span className="text-slate-600">/10</span>
            </span>
          </div>

          {isRefined && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/15 border border-indigo-500/30 rounded-full shadow-lg shadow-indigo-500/5">
              <Sparkles size={12} className="text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Sync</span>
            </div>
          )}
        </div>
      </div>

      <h4 className="font-black text-lg md:text-xl leading-tight mb-5 text-white group-hover:text-indigo-300 transition-colors tracking-tight">
        {article.title}
      </h4>
      
      <div className="relative mb-8">
        <div className="absolute -left-4 top-0 w-1 h-full bg-indigo-500/30 rounded-full" />
        <p className={cn(
          "text-sm md:text-base text-slate-400 leading-relaxed font-medium transition-all duration-500 pl-2",
          isRefining ? "opacity-30 blur-[2px]" : "opacity-100 blur-0"
        )}>
          {summary}
        </p>
        {isRefining && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={24} className="text-indigo-500 animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-6">
        {article.entities && article.entities.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Key Vectors Identified</div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {article.entities.map((entity, i) => (
                <span key={i} className="text-[10px] font-black text-indigo-200 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 uppercase tracking-widest hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all shadow-sm">
                  {entity}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 mt-6 border-t border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-500 text-[12px] font-black uppercase shadow-inner">
              {article.source.charAt(0)}
            </div>
            <div>
              <span className="block text-[11px] font-black text-white uppercase tracking-widest">
                {article.source}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Verified Source</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/30">
              <Calendar size={14} className="text-slate-600" />
              {new Date(article.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const NewsFeed: React.FC<NewsFeedProps> = ({ articles, loading }) => {
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [minImpact, setMinImpact] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchSentiment = sentimentFilter === 'all' || article.sentiment === sentimentFilter;
      const matchImpact = article.impactScale >= minImpact;
      return matchSentiment && matchImpact;
    });
  }, [articles, sentimentFilter, minImpact]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse flex gap-5 p-5 rounded-3xl border border-slate-800 bg-slate-900/50">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Global Pulse</h3>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "p-2 rounded-xl transition-all border",
            showFilters ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
          )}
        >
          <Filter size={14} />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 mb-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Sentiment</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'positive', 'negative', 'neutral'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSentimentFilter(s as any)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        sentimentFilter === s 
                          ? "bg-indigo-600 border-indigo-500 text-white" 
                          : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Min Impact</label>
                  <span className="text-[10px] font-black text-indigo-400">{minImpact}+</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="1"
                  value={minImpact}
                  onChange={(e) => setMinImpact(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <NewsArticleItem key={article.id} article={article} index={index} />
          ))
        ) : (
          <div className="p-10 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">No matching signals found</p>
            <button 
              onClick={() => { setSentimentFilter('all'); setMinImpact(0); }}
              className="mt-4 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
