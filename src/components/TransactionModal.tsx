import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownRight, Wallet, Info, ShieldCheck, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { StockData } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockData;
  type: 'BUY' | 'SELL';
  initialQuantity?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, stock, type, initialQuantity }) => {
  const [quantity, setQuantity] = useState<string>(initialQuantity || '1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const parsedQuantity = parseFloat(quantity) || 0;
  const totalValue = parsedQuantity * stock.currentPrice;

  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity || '1');
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen, initialQuantity]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isProcessing]);

  const handleExecute = async () => {
    if (parsedQuantity <= 0) return;
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  const adjustQuantity = (amount: number) => {
    const current = parseFloat(quantity) || 0;
    const newVal = Math.max(0, current + amount);
    setQuantity(newVal.toString());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                   <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                   >
                     <ShieldCheck size={48} />
                   </motion.div>
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight">Order Executed</h3>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Transaction synchronized in neural ledger</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 w-full">
                  <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-slate-500">
                    <span>{type} Order</span>
                    <span>{stock.symbol}</span>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-white font-black text-xl">{quantity} Units</span>
                    <span className="text-indigo-400 font-black text-xl">{formatCurrency(totalValue)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      type === 'BUY' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    )}>
                      {type === 'BUY' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{type === 'BUY' ? 'Initiate Capture' : 'Liquidate Position'}</h3>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{stock.symbol} • Neural Execution</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2.5 bg-slate-800/50 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Quantity</label>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono">Available: 1,420.5</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => adjustQuantity(-1)}
                        disabled={parsedQuantity <= 0}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 hover:text-rose-400 hover:border-rose-500/50 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group shadow-lg"
                      >
                        <Minus size={20} className="group-hover:scale-110 transition-transform" />
                      </button>
                      <div className="relative flex-1 group/input">
                        <input 
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-3xl font-black text-white outline-none focus:border-indigo-500 transition-all font-mono text-center selection:bg-indigo-500/30"
                          placeholder="0.00"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase tracking-widest pointer-events-none hidden sm:block group-focus-within/input:text-indigo-500 transition-colors">Units</div>
                      </div>
                      <button 
                        onClick={() => adjustQuantity(1)}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95 group shadow-lg"
                      >
                        <Plus size={20} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 50, 100].map(val => (
                        <button
                          key={val}
                          onClick={() => setQuantity(val.toString())}
                          className="py-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-black text-slate-500 hover:text-white hover:border-slate-700 transition-all uppercase tracking-widest"
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 rounded-2xl p-6 space-y-4 border border-slate-800/50">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Execution Price</span>
                      <span className="text-sm font-black text-white font-mono">{formatCurrency(stock.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Total Value</span>
                      <span className="text-xl font-black text-indigo-400 font-mono">{formatCurrency(totalValue)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
                     <Info size={16} className="text-amber-500/50 shrink-0 mt-0.5" />
                     <p className="text-[9px] font-bold text-amber-500/60 leading-relaxed uppercase tracking-wider">
                        Slippage and network fees are calculated dynamically at time of block inclusion.
                     </p>
                  </div>

                  <div className="relative overflow-hidden">
                    <button 
                      onClick={handleExecute}
                      disabled={isProcessing || parsedQuantity <= 0}
                      className={cn(
                        "w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 relative z-10",
                        type === 'BUY' 
                          ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/10" 
                          : "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-500/10"
                      )}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Neural Sync in Progress...
                        </>
                      ) : (
                        <>
                          <Wallet size={16} />
                          Confirm {type === 'BUY' ? 'Purchase' : 'Sale'}
                        </>
                      )}
                    </button>
                    {isProcessing && (
                      <div className="absolute inset-0 bg-slate-900 rounded-2xl overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={cn(
                            "absolute inset-y-0 left-0 opacity-20",
                            type === 'BUY' ? "bg-emerald-400" : "bg-rose-400"
                          )}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="flex flex-col items-center gap-2">
                             <div className="flex items-center gap-3">
                               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Quantum Sync: {Math.floor(progress)}%</span>
                             </div>
                             <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${progress}%` }}
                                 className={cn(
                                   "h-full",
                                   type === 'BUY' ? "bg-emerald-500" : "bg-rose-500"
                                 )}
                               />
                             </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


