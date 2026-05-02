import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Target, Zap, Rocket, ChevronRight, X, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

const STEPS = [
  {
    title: "Intelligence First",
    description: "Axion AI uses neural networks to synthesize market data, providing you with high-conviction trade signals and trend predictions.",
    icon: Brain,
    color: "bg-indigo-600",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
  },
  {
    title: "Precision Goals",
    description: "Define your financial destiny. Whether it's retirement or a new home, our goal-tracking engine ensures your portfolio stays aligned with your aspirations.",
    icon: Target,
    color: "bg-emerald-600",
    image: "https://images.unsplash.com/photo-1579621970795-87faff2f9050?q=80&w=2670&auto=format&fit=crop"
  },
  {
    title: "Deep Scan Sequence",
    description: "Audit any asset in the Indian market. Get instant technical and fundamental narratives powered by the latest Gemini LLM models.",
    icon: Zap,
    color: "bg-amber-600",
    image: "https://images.unsplash.com/photo-1611974717482-4828526ee51c?q=80&w=2670&auto=format&fit=crop"
  }
];

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('axion_onboarding_seen');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('axion_onboarding_seen', 'true');
    setIsVisible(false);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        >
          <button 
            onClick={handleComplete}
            className="absolute top-8 right-8 z-20 p-2 bg-slate-950/50 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Graphical Side */}
          <div className="md:w-1/2 relative min-h-[300px] bg-slate-950">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentStep}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                src={step.image}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              <motion.div 
                key={`icon-${currentStep}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className={cn("p-8 rounded-[2.5rem] text-white shadow-2xl mb-8", step.color)}
              >
                <step.icon size={64} />
              </motion.div>
              <div className="flex gap-2">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      i === currentStep ? "w-12 bg-indigo-500" : "w-4 bg-slate-800"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  <Sparkles size={14} />
                  System Protocol 0{currentStep + 1}
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                  {step.title}
                </h2>
                <p className="text-slate-400 font-bold text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-8 flex items-center gap-4">
                <button 
                  onClick={nextStep}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:scale-105 transition-transform flex items-center justify-center gap-3"
                >
                  {currentStep === STEPS.length - 1 ? "Initialize Trading" : "Continue"}
                  <ChevronRight size={18} />
                </button>
                <button 
                  onClick={handleComplete}
                  className="px-8 py-5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-300 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Status</div>
                <div className="text-xs font-bold text-emerald-400 uppercase">Neural Stream Active</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
