import React, { useState } from 'react';
import { User, Bell, Shield, Wallet, Monitor, Globe, ChevronRight, Zap, Info, LogOut, Plus, Trash2, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'User Profile', icon: User },
  { id: 'notifications', label: 'Notification Protocols', icon: Bell },
  { id: 'security', label: 'Neural Security', icon: Shield },
  { id: 'billing', label: 'Capital & Subs', icon: Wallet },
  { id: 'display', label: 'Interface Interface', icon: Monitor },
  { id: 'about', label: 'System Origin', icon: Info },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState('indigo');

  const [priceAlerts, setPriceAlerts] = useState([
    { id: '1', symbol: 'RELIANCE', condition: 'Price Above', value: '₹3,000', active: true },
    { id: '2', symbol: 'TCS', condition: 'Change >', value: '5%', active: true },
  ]);

  const [newAlert, setNewAlert] = useState({ symbol: '', condition: 'Price Above', value: '' });

  const addAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return;
    setPriceAlerts([
      ...priceAlerts,
      { ...newAlert, id: Date.now().toString(), active: true }
    ]);
    setNewAlert({ symbol: '', condition: 'Price Above', value: '' });
  };

  const removeAlert = (id: string) => {
    setPriceAlerts(priceAlerts.filter(a => a.id !== id));
  };

  const ACCENT_COLORS = [
    { id: 'indigo', color: 'bg-indigo-600', label: 'Neural Indigo' },
    { id: 'emerald', color: 'bg-emerald-600', label: 'Profit Emerald' },
    { id: 'rose', color: 'bg-rose-600', label: 'Risk Rose' },
    { id: 'amber', color: 'bg-amber-600', label: 'Caution Amber' },
    { id: 'cyan', color: 'bg-cyan-600', label: 'Data Cyan' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
        <div>
          <h2 className="text-xs font-black tracking-[0.4em] text-slate-500 uppercase mb-2">Core Configuration</h2>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">System Settings</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center gap-3">
            <Zap size={18} className="text-indigo-400" />
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Neural Link Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 md:gap-12">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-2 overflow-x-auto lg:overflow-visible flex lg:flex-col pb-4 lg:pb-0 scrollbar-hide">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex-shrink-0 lg:flex-shrink-1 lg:w-full flex items-center justify-between p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] transition-all group mr-3 lg:mr-0",
                activeSection === section.id 
                  ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20" 
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className={cn(
                  "p-2 lg:p-3 rounded-xl transition-colors",
                  activeSection === section.id ? "bg-white/20" : "bg-slate-950 text-slate-500 group-hover:text-indigo-400"
                )}>
                  <section.icon size={18} />
                </div>
                <span className="text-[10px] lg:text-sm font-black uppercase tracking-widest whitespace-nowrap">{section.label}</span>
              </div>
              <ChevronRight size={18} className={cn(
                "hidden lg:block transition-transform",
                activeSection === section.id ? "rotate-90" : "opacity-0 group-hover:opacity-100"
              )} />
            </button>
          ))}

          <div className="hidden lg:block pt-8 mt-8 border-t border-slate-800">
            <button className="w-full flex items-center gap-4 p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all">
                <div className="p-3 bg-rose-500/20 rounded-xl">
                  <LogOut size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Terminate Session</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-8 md:space-y-12"
          >
            {activeSection === 'profile' && (
              <div className="space-y-8 md:space-y-10">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-800 p-1 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop" 
                      className="w-full h-full rounded-full object-cover"
                      alt="Profile"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Aniket Nandi</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-1">Tier: Neural Architect (Pro)</p>
                    <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Display Name</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                      defaultValue="Aniket Nandi"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Identifier</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                      defaultValue="aniket.nandi@protocol.io"
                      disabled
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Linked Market Access</h4>
                   <div className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center rounded-xl">
                          <Globe className="text-emerald-400" size={24} />
                        </div>
                        <div>
                          <p className="font-black text-white text-sm uppercase">NSE/BSE Real-time Bridge</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Status: Continuous Stream</p>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Disconnect</button>
                   </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-12">
                 <div className="space-y-6 md:space-y-8">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Alert Protocols</h3>
                    <div className="space-y-3 md:space-y-4">
                        {[
                          { label: "Price Anomaly Alerts", desc: "Notify when assets deviate > 5% within 10 minutes", active: true },
                          { label: "Neural Signal Broadcast", desc: "Receive high-conviction AI trade suggestions", active: true },
                          { label: "Portfolio Boundary Alerts", desc: "Alert when goals are underfunded or achieved", active: false },
                          { label: "Market Sentiment Shifts", desc: "Instant update on sudden narrative swings", active: true }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-6 md:p-8 bg-slate-950 border border-slate-800 rounded-[1.5rem] md:rounded-[2rem] hover:border-indigo-500/30 transition-all">
                            <div className="space-y-1 pr-4">
                              <p className="font-black text-white text-base md:text-lg leading-none uppercase tracking-tight">{item.label}</p>
                              <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.desc}</p>
                            </div>
                            <div className={cn(
                              "w-10 h-5 md:w-12 md:h-6 rounded-full relative transition-colors cursor-pointer shrink-0",
                              item.active ? "bg-indigo-600" : "bg-slate-800"
                            )}>
                              <div className={cn(
                                "absolute top-0.5 md:top-1 w-4 h-4 rounded-full bg-white transition-all",
                                item.active ? "right-1" : "left-1"
                              )} />
                            </div>
                          </div>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-8 border-t border-slate-800 pt-12">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Price Watches</h3>
                       <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                          {priceAlerts.length} Active Watches
                       </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 md:p-8 space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Symbol</label>
                             <input 
                               value={newAlert.symbol}
                               onChange={e => setNewAlert({...newAlert, symbol: e.target.value.toUpperCase()})}
                               placeholder="TICKER"
                               className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm uppercase"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Condition</label>
                             <select 
                               value={newAlert.condition}
                               onChange={e => setNewAlert({...newAlert, condition: e.target.value})}
                               className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm"
                             >
                                <option>Price Above</option>
                                <option>Price Below</option>
                                <option>Change {'>'}</option>
                                <option>Volume Spike</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Target Value</label>
                             <div className="flex gap-2">
                                <input 
                                  value={newAlert.value}
                                  onChange={e => setNewAlert({...newAlert, value: e.target.value})}
                                  placeholder="Value"
                                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm"
                                />
                                <button 
                                  onClick={addAlert}
                                  className="aspect-square bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                   <Plus size={20} />
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <AnimatePresence mode="popLayout">
                          {priceAlerts.map((alert) => (
                            <motion.div 
                              key={alert.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all group"
                            >
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-indigo-400 border border-slate-800">
                                     {alert.symbol.substring(0, 2)}
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2">
                                        <span className="font-black text-white text-base leading-none tracking-tight">{alert.symbol}</span>
                                        <ArrowUpRight size={14} className="text-emerald-400" />
                                     </div>
                                     <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{alert.condition}</span>
                                        <span className="text-[10px] font-black text-indigo-400">{alert.value}</span>
                                     </div>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => removeAlert(alert.id)}
                                 className="p-3 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                               >
                                  <Trash2 size={18} />
                               </button>
                            </motion.div>
                          ))}
                       </AnimatePresence>
                       
                       {priceAlerts.length === 0 && (
                         <div className="py-12 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center">
                            <Bell className="text-slate-700 mb-3" size={32} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active price watches detected</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {activeSection === 'display' && (
              <div className="space-y-12">
                 <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Neural Atmosphere</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { id: 'dark', label: 'Dark Protocol', desc: 'Optimized for low-light neural processing', preview: 'bg-slate-950' },
                         { id: 'light', label: 'Daylight Matrix', desc: 'Enhanced clarity for high-brightness zones', preview: 'bg-slate-100' },
                       ].map((t) => (
                         <button
                           key={t.id}
                           onClick={() => setTheme(t.id as any)}
                           className={cn(
                             "p-6 rounded-[2rem] border-2 text-left transition-all group",
                             theme === t.id 
                               ? "bg-indigo-600/10 border-indigo-500 shadow-xl shadow-indigo-500/5" 
                               : "bg-slate-950 border-slate-800 hover:border-slate-700"
                           )}
                         >
                            <div className={cn("w-full h-24 rounded-xl mb-4 border border-white/5", t.preview)} />
                            <p className="font-black text-white uppercase tracking-tight">{t.label}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t.desc}</p>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6 border-t border-slate-800 pt-12">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Primary Pulse (Accent Color)</h3>
                    <div className="flex flex-wrap gap-4">
                      {ACCENT_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setAccentColor(color.id)}
                          className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all",
                            accentColor === color.id
                              ? "bg-white/5 border-white/20"
                              : "bg-slate-950 border-slate-800 hover:border-slate-700"
                          )}
                        >
                           <div className={cn("w-4 h-4 rounded-full", color.color)} />
                           <span className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             accentColor === color.id ? "text-white" : "text-slate-500"
                           )}>{color.label}</span>
                        </button>
                      ))}
                    </div>
                 </div>
              </div>
            )}

            {activeSection !== 'profile' && activeSection !== 'notifications' && activeSection !== 'display' && (
              <div className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4 border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                 <div className="p-4 md:p-6 bg-slate-950 rounded-2xl md:rounded-3xl text-slate-700">
                    <Zap size={32} className="md:size-48" />
                 </div>
                 <h3 className="text-lg md:text-xl font-black text-slate-500 uppercase tracking-widest">{activeSection} Module Pending</h3>
                 <p className="text-[10px] md:text-xs text-slate-700 font-bold uppercase tracking-widest">This configuration segment is scheduled for neural deployment in v2.4</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
