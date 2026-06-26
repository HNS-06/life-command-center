import React, { useState, Suspense, lazy } from 'react';
import { Page } from './types';
import { TopBar, BottomNav } from './components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './context/AppContext';
import { Sparkles, X, Send, Bot } from 'lucide-react';

// Lazy‑load heavy pages for production bundles
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Tasks = lazy(() => import('./pages/Tasks').then(m => ({ default: m.Tasks })));
const DataInsights = lazy(() => import('./pages/Data').then(m => ({ default: m.DataInsights })));
const Docs = lazy(() => import('./pages/Docs').then(m => ({ default: m.Docs })));
const Habits = lazy(() => import('./pages/Habits').then(m => ({ default: m.Habits })));
const SearchPage = lazy(() => import('./pages/Search').then(m => ({ default: m.SearchPage })));
const NotificationsPage = lazy(() => import('./pages/Notifications').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./pages/Profile').then(m => ({ default: m.ProfilePage })));
const SyncedPage = lazy(() => import('./pages/Synced').then(m => ({ default: m.SyncedPage })));


function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  
  const { queryAICore, isLoadingAI } = useApp();
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'core'; text: string }[]>([
    { sender: 'core', text: 'Synaptic link active, Commander. Query the database, request task planning, or optimize habits.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Logic to determine if we show the main shell (Top/Bottom nav)
  const isPlainPage = [Page.LANDING, Page.LOGIN, Page.SYNCED].includes(currentPage);

  const getPageTitle = (page: Page) => {
    switch (page) {
      case Page.HOME: return 'Command Center';
      case Page.BILLS: return 'Finance Ops';
      case Page.TASKS: return 'Mission Log';
      case Page.DATA: return 'Insights';
      case Page.DOCS: return 'Secure Vault';
      case Page.HABITS: return 'Habit Forge';
      case Page.SEARCH: return 'Global Search';
      case Page.NOTIFICATIONS: return 'Alert Cluster';
      case Page.PROFILE: return 'Operative Info';
      default: return 'System';
    }
  };

  const handleNavigate = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isLoadingAI) return;
    const text = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');

    try {
      const reply = await queryAICore(text);
      setChatMessages(prev => [...prev, { sender: 'core', text: reply }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { sender: 'core', text: `Tactical system failure: ${err.message}` }]);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.LANDING:
        return <Landing onInitialize={() => setCurrentPage(Page.LOGIN)} />;
      case Page.LOGIN:
        return <Login onLogin={() => {
          setIsAuthenticated(true);
          setCurrentPage(Page.HOME);
        }} />;
      case Page.HOME:
      case Page.BILLS:
        return <Home onNavigate={handleNavigate} />;
      case Page.TASKS:
        return <Tasks onNavigate={handleNavigate} />;
      case Page.DATA:
        return <DataInsights onNavigate={handleNavigate} />;
      case Page.DOCS:
        return <Docs onNavigate={handleNavigate} />;
      case Page.HABITS:
        return <Habits onNavigate={handleNavigate} />;
      case Page.SEARCH:
        return <SearchPage onNavigate={handleNavigate} />;
      case Page.NOTIFICATIONS:
        return <NotificationsPage onNavigate={handleNavigate} />;
      case Page.PROFILE:
        return <ProfilePage onNavigate={handleNavigate} onLogout={() => {
          setIsAuthenticated(false);
          setCurrentPage(Page.LANDING);
        }} />;
      case Page.SYNCED:
        return <SyncedPage onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary/30 antialiased overflow-x-hidden">
      {!isPlainPage && (
        <TopBar 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          title={getPageTitle(currentPage)} 
        />
      )}

      <main className={`${!isPlainPage ? 'px-6 md:px-10 pt-10' : ''} max-w-4xl mx-auto`}>
          <Suspense fallback={<div className="text-center py-12">Loading…</div>}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </Suspense>
          </main>

      {!isPlainPage && (
        <BottomNav 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
        />
      )}

      {/* Floating AI Core Trigger */}
      {!isPlainPage && (
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-36 left-10 w-16 h-16 bg-primary text-black rounded-full shadow-[0_0_20px_rgba(102,252,241,0.4)] flex items-center justify-center active:scale-95 transition-all z-40 border border-primary/20 hover:scale-105"
          title="Synaptic Link"
        >
          <Sparkles className="w-8 h-8 animate-pulse" />
        </button>
      )}

      {/* AI Synaptic Link Side Drawer */}
      <AnimatePresence>
        {isAIChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIChatOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface/95 backdrop-blur-xl border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Bot className="text-primary w-6 h-6" />
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">AI Tactical Core</h3>
                    <p className="text-[10px] font-mono tracking-widest text-primary uppercase">Synaptic Link Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAIChatOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Message Scroll */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm font-medium ${
                        msg.sender === 'user'
                          ? 'bg-primary text-black font-semibold rounded-tr-none'
                          : 'bg-white/[0.04] border border-white/5 text-on-surface-variant rounded-tl-none font-mono text-xs whitespace-pre-wrap leading-relaxed'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoadingAI && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] border border-white/5 text-primary text-xs rounded-2xl rounded-tl-none px-5 py-3 font-mono animate-pulse">
                      Synthesizing intelligence...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <div className="p-6 border-t border-white/10 bg-white/[0.02] flex gap-3">
                <input
                  type="text"
                  placeholder="Transmit order or query..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-on-surface placeholder:opacity-30"
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim() || isLoadingAI}
                  className="bg-primary text-black w-12 h-12 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-background overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}

export default App;
