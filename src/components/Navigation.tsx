import React from 'react';
import { 
  Home, 
  CreditCard, 
  ListTodo, 
  FileText, 
  Zap, 
  LineChart, 
  Bell, 
  User, 
  Settings,
  Search
} from 'lucide-react';
import { Page } from '../types';
import { useApp } from '../context/AppContext';

interface TopBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ currentPage, onNavigate, title }) => {
  const { notifications, operativeName } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-background/90 backdrop-blur-md sticky top-0 border-b border-white/10 z-50 h-24 flex items-center">
      <div className="flex justify-between items-center px-8 md:px-12 w-full">
        <div className="flex items-center gap-6">
          <div 
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] flex items-center justify-center cursor-pointer"
            onClick={() => onNavigate(Page.PROFILE)}
          >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <User size={20} className="text-on-surface" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-0.5">Nexus Command • {operativeName}</span>
            <h1 className="text-3xl font-black italic serif leading-none text-on-surface">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold tracking-widest uppercase opacity-60 hidden md:flex">
          <span className="cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate(Page.HOME)}>Overview</span>
          <span className="text-white opacity-100">Live Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={`p-2.5 rounded-full border border-white/5 transition-all duration-300 relative ${currentPage === Page.NOTIFICATIONS ? 'bg-primary text-black' : 'text-on-surface-variant hover:border-white/20'}`}
            onClick={() => onNavigate(Page.NOTIFICATIONS)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white font-mono text-[9px] font-black rounded-full flex items-center justify-center border-2 border-background animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          <button 
            className={`p-2.5 rounded-full border border-white/5 transition-all duration-300 ${currentPage === Page.DATA ? 'bg-primary text-black' : 'text-on-surface-variant hover:border-white/20'}`}
            onClick={() => onNavigate(Page.DATA)}
          >
            <LineChart size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { page: Page.HOME, icon: Home, label: 'Deck' },
    { page: Page.BILLS, icon: CreditCard, label: 'Capital' },
    { page: Page.SEARCH, icon: Search, label: 'Query' },
    { page: Page.DOCS, icon: FileText, label: 'Vault' },
    { page: Page.HABITS, icon: Zap, label: 'Momentum' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 px-4 py-8 bg-background border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-500 min-w-[72px] active:scale-90 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-on-surface-variant/40 hover:text-on-surface'
              }`}
            >
              <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
              <span className={`text-[9px] font-bold uppercase mt-2 tracking-[0.2em] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="mt-1 w-1 h-1 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 text-[8px] font-bold tracking-widest rail-text uppercase hidden md:block">
        Systems Stable v.4.2
      </div>
    </nav>
  );
};
