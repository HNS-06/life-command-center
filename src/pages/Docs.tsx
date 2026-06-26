import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
    Search, 
    MoreVertical, 
    Shield, 
    FileText, 
    ContactRound, 
    Activity, 
    Home, 
    Wallet, 
    Car, 
    Plus, 
    Lock, 
    X,
    Eye,
    Trash2,
    Sparkles
} from 'lucide-react';
import { Page, Doc } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface DocsProps {
  onNavigate: (page: Page) => void;
}

const DocIcon = ({ name, color = 'primary' }: { name: string, color?: string }) => {
  const className = `text-${color} w-8 h-8`;
  switch (name) {
    case 'contact-round': return <ContactRound className={className} />;
    case 'activity': return <Activity className={className} />;
    case 'home': return <Home className={className} />;
    case 'wallet': return <Wallet className={className} />;
    case 'car': return <Car className={className} />;
    default: return <FileText className={className} />;
  }
};

export const Docs: React.FC<DocsProps> = ({ onNavigate }) => {
  const { docs, addDoc, deleteDoc, summarizeDocument, isLoadingAI } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // AI summary state
  const [currentSummary, setCurrentSummary] = useState('');
  const [summaryDocName, setSummaryDocName] = useState('');

  // Form State
  const [newDoc, setNewDoc] = useState({
    name: '',
    category: 'IDs',
    status: 'AES-256 Encrypted',
    statusType: 'success' as 'error' | 'success' | 'warning' | 'info',
    icon: 'contact-round'
  });

  const filters = ['All', 'IDs', 'Finance', 'Medical', 'Real Estate', 'Assets'];

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name) return;

    addDoc({
      name: newDoc.name,
      category: newDoc.category,
      status: newDoc.status || 'AES-256 Encrypted',
      statusType: newDoc.statusType,
      icon: newDoc.icon
    });

    setNewDoc({
      name: '',
      category: 'IDs',
      status: 'AES-256 Encrypted',
      statusType: 'success',
      icon: 'contact-round'
    });
    setIsAddModalOpen(false);
  };

  const handleSummarize = async (doc: Doc) => {
    setActiveMenuId(null);
    setSummaryDocName(doc.name);
    setCurrentSummary('Establishing neural tunnel and decrypting database blocks...');
    setIsSummaryModalOpen(true);
    
    try {
      const summary = await summarizeDocument(doc.name, doc.category);
      setCurrentSummary(summary);
    } catch (err: any) {
      setCurrentSummary(`Synaptic failure during decryption: ${err.message}`);
    }
  };

  // Filter docs
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'IDs') return matchesSearch && (doc.category.includes('ID') || doc.icon === 'contact-round');
    return matchesSearch && doc.category.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="space-y-12 pb-40">
      {/* Search and Filters */}
      <div className="space-y-8">
        <div className="relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-on-surface-variant w-6 h-6 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Query secure vault..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-8 pl-20 pr-8 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 backdrop-blur-md transition-all serif italic text-2xl placeholder:opacity-20 font-medium"
          />
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-4 -mx-6 px-6">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-10 py-4 rounded-full border font-bold text-[10px] uppercase tracking-[0.4em] transition-all ${
                activeFilter === filter 
                  ? 'bg-on-surface text-background border-on-surface shadow-2xl' 
                  : 'bg-white/[0.03] text-on-surface-variant border-white/5 hover:border-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDocs.map((doc) => (
          <GlassCard 
            key={doc.id} 
            className="relative overflow-hidden group border-white/5 p-10 rounded-[2.5rem] accent-glow"
          >
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                className="p-3 rounded-full hover:bg-white/5 text-on-surface-variant/40 group-hover:text-on-surface transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {activeMenuId === doc.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-2xl shadow-xl z-20 overflow-hidden font-sans"
                    >
                      <button 
                        onClick={() => handleSummarize(doc)}
                        className="w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider hover:bg-white/5 flex items-center gap-3 text-primary"
                      >
                        <Sparkles size={14} />
                        AI Summary
                      </button>
                      <button 
                        onClick={() => {
                          deleteDoc(doc.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-5 py-4 text-left text-xs font-bold uppercase tracking-wider hover:bg-error/10 flex items-center gap-3 text-error border-t border-white/5"
                      >
                        <Trash2 size={14} />
                        Purge Entry
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-10 border border-white/10 bg-white/[0.03] group-hover:bg-primary transition-all duration-500`}>
              <DocIcon name={doc.icon} color="on-surface" />
            </div>

            <h3 className="text-3xl serif italic text-on-surface mb-2 leading-tight">{doc.name}</h3>
            <p className="text-sm font-medium text-on-surface-variant/40 mb-10 tracking-wide">{doc.category} • Updated {doc.updatedAt}</p>
            
            <div className="flex gap-3">
              <div className={`flex-1 flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${
                  doc.statusType === 'error' ? 'bg-error/10 border-error/20 text-error' : 
                  doc.statusType === 'success' ? 'bg-primary/5 border-primary/20 text-primary' : 
                  doc.statusType === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-white/[0.03] border-white/10 text-on-surface-variant/60'
              }`}>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] truncate">{doc.status}</span>
              </div>
              <button 
                onClick={() => handleSummarize(doc)}
                className="w-14 h-14 bg-white/5 border border-white/10 hover:border-primary hover:bg-primary hover:text-black rounded-2xl flex items-center justify-center text-on-surface-variant transition-colors"
                title="AI Summary"
              >
                <Sparkles size={18} />
              </button>
            </div>
          </GlassCard>
        ))}

        {/* Add New Action */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="border-4 border-dashed border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center hover:bg-white/[0.03] hover:border-primary/40 transition-all group min-h-[300px]"
        >
          <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-primary transition-all">
            <Plus className="text-on-surface-variant/20 group-hover:text-primary transition-colors w-10 h-10" />
          </div>
          <p className="text-[12px] font-black uppercase text-on-surface-variant/20 group-hover:text-primary tracking-[0.4em] transition-colors">Add to Vault</p>
        </button>
      </div>

      {/* FAB - Add Doc */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-36 right-10 w-20 h-20 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 accent-glow border-4 border-background hover:scale-105"
      >
        <Shield size={36} fill="black" strokeWidth={1} />
      </button>

      {/* Add Document Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden accent-glow"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Cryptographic Vault</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">Encrypt Document</h3>
              </div>

              <form onSubmit={handleCreateDoc} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Credential Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="e.g. Premium Health Plan, Mortgage Deed"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Icon Node</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newDoc.icon}
                      onChange={(e) => setNewDoc({ ...newDoc, icon: e.target.value })}
                    >
                      <option value="contact-round">Identity Card</option>
                      <option value="activity">Medical / Health</option>
                      <option value="home">Property / Real Estate</option>
                      <option value="wallet">Wallet / Tax</option>
                      <option value="car">Vehicle</option>
                      <option value="file-text">Standard Document</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Category Vector</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newDoc.category}
                      onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    >
                      <option value="ID Section">IDs</option>
                      <option value="Medical">Medical</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Finance">Finance</option>
                      <option value="Assets">Assets</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">AES Registry Status</label>
                    <input 
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="e.g. Secured, Expires in 15d"
                      value={newDoc.status}
                      onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Alert Severity</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newDoc.statusType}
                      onChange={(e) => setNewDoc({ ...newDoc, statusType: e.target.value as any })}
                    >
                      <option value="success">Normal (Secured)</option>
                      <option value="info">Info (AES-256)</option>
                      <option value="warning">Warning (Medium risk)</option>
                      <option value="error">Critical (Action required)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  Initiate Lock
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Document Summary Modal */}
      <AnimatePresence>
        {isSummaryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[85vh] no-scrollbar accent-glow"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsSummaryModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Decrypted Telemetry</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">{summaryDocName}</h3>
                <p className="text-[10px] font-mono tracking-widest text-primary uppercase mt-1">AI Core Synthesizer Analysis</p>
              </div>

              <div className="prose prose-invert max-w-none text-on-surface-variant font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[45vh] overflow-y-auto pr-2 no-scrollbar border border-white/5 p-6 rounded-2xl bg-white/[0.01]">
                {currentSummary}
              </div>
              
              <button 
                onClick={() => setIsSummaryModalOpen(false)}
                className="w-full py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-8"
              >
                Re-Lock Telemetry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
