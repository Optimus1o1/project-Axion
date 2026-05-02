import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Bell, 
  Settings, 
  TrendingUp, 
  PieChart, 
  Wallet,
  Menu,
  Zap,
  Cpu,
  HelpCircle,
  Sparkles,
  Command
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SearchModal } from '../components/SearchModal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: TrendingUp, label: "Markets", path: "/markets" },
    { icon: PieChart, label: "Portfolio", path: "/portfolio" },
    { icon: Sparkles, label: "AI Insights", path: "/insights" },
    { icon: Wallet, label: "Budget Planner", path: "/budget" },
  ];

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Layering */}
      <div className="fixed inset-0 terminal-grid pointer-events-none opacity-40" />
      <div className="fixed inset-0 scanline" />
      
      {/* Sidebar Navigation - Desktop only */}
      <aside className={cn(
        "bg-slate-900/50 backdrop-blur-md border-r border-slate-800/50 flex-col transition-all duration-300 hidden md:flex z-50",
        isSidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-slate-800/50 h-24">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/90 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <Zap size={20} className="text-white fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase font-mono">AXION</span>
            </Link>
          ) : (
            <Link to="/" className="w-10 h-10 bg-indigo-500/90 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] mx-auto">
              <Zap size={20} className="text-white fill-current" />
            </Link>
          )}
        </div>

        <nav className="flex-1 p-6 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] group relative overflow-hidden",
                isActive 
                  ? "bg-indigo-600/10 text-white border border-indigo-500/30" 
                  : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-colors",
                location.pathname === item.path ? "text-indigo-400" : "group-hover:text-indigo-400"
              )} />
              {isSidebarOpen && <span>{item.label}</span>}
              {location.pathname === item.path && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-500 rounded-l shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <div className="flex items-center gap-4 px-4 py-2 border border-indigo-500/10 rounded-xl bg-indigo-500/5">
             <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Quantum Mesh Active</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-2xl border-t border-slate-800/50 px-4 py-3 flex items-center justify-between z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1.5 transition-all flex-1 px-1",
              isActive ? "text-indigo-400" : "text-slate-500"
            )}
          >
            <item.icon size={18} />
            <span className="text-[7px] font-black uppercase tracking-widest text-center">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Header */}
        <header className="bg-slate-950/40 backdrop-blur-xl px-4 md:px-12 py-3 md:py-6 flex items-center justify-between border-b border-slate-800/50 z-40 shrink-0 h-16 md:h-24">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 rounded-xl transition-all hidden md:block">
              <Menu size={18} className="text-slate-400" />
            </button>
            <div className="md:hidden flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Zap size={16} className="text-white fill-current" />
              </div>
            </div>
            <button 
              onClick={() => setSearchOpen(true)}
              className="relative flex-1 max-w-xl flex items-center group"
            >
              <div className="w-full bg-slate-900/40 border border-slate-800/50 rounded-lg md:rounded-2xl py-2 md:py-3.5 px-4 text-[10px] md:text-sm font-bold text-slate-500 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.05)] relative overflow-hidden">
                <Search size={14} className="md:size-[16px] group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300" />
                <span className="hidden sm:inline opacity-70 group-hover:opacity-100">Initiate quantum search sequence...</span>
                <span className="sm:hidden truncate opacity-70">Search assets...</span>
                
                <div className="hidden md:flex items-center gap-1.5 opacity-30 group-hover:opacity-80 transition-opacity px-2 py-0.5 bg-slate-950 rounded-md border border-slate-800 absolute right-3 md:right-5 top-1/2 -translate-y-1/2">
                  <Command size={10} />
                  <span className="text-[10px] font-black font-mono text-white/80">K</span>
                </div>
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8 px-2 md:px-6">
            <button className="relative p-2 text-slate-500 hover:text-white transition-colors group">
              <Bell size={18} className="group-hover:animate-pulse" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-slate-950 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </button>
            <Link to="/settings" className="flex items-center gap-2 md:gap-4 group hover:opacity-80 transition-all">
              <div className="text-right hidden md:block">
                <div className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">Aniket Nandi</div>
                <div className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] font-mono">PL-CORE</div>
              </div>
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://ui-avatars.com/api/?name=Aniket+Nandi&background=6366f1&color=fff&bold=true" 
                  alt="Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 scrollbar-hide relative pb-28 md:pb-12 h-full">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>

      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
