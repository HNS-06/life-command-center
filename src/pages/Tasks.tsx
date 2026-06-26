import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { CheckCircle2, Clock, Zap, ChevronRight, Plus, ListTodo, Lock as LockIcon, Link as LinkIcon, X, Bell } from 'lucide-react';
import { Page, Task, Subtask } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface TasksProps {
  onNavigate: (page: Page) => void;
}

export const Tasks: React.FC<TasksProps> = ({ onNavigate }) => {
  const { 
    tasks, 
    toggleTask, 
    toggleSubtask, 
    addSubtask, 
    addDependency, 
    setReminder, 
    addTask 
  } = useApp();

  const [filter, setFilter] = useState('All');
  const [isLinking, setIsLinking] = useState(false);
  const [linkingTaskId, setLinkingTaskId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
  
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderTaskId, setReminderTaskId] = useState<string | null>(null);
  const [reminderConfig, setReminderConfig] = useState({ date: '', time: '' });
  const [sortBy, setSortBy] = useState<'Date' | 'Priority' | 'Creation'>('Priority');
  
  // Add Task Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    duration: '30 Mins',
    energy: 'medium' as 'high' | 'medium' | 'low',
    priority: 'standard' as 'critical' | 'quick' | 'standard',
    category: 'Strategy',
    dueDate: '',
    subtasksInput: '',
    dependencies: [] as string[]
  });

  const chips = ['All', 'High Energy', 'Quick Wins', 'Focus Mode'];
  const sortOptions = ['Priority', 'Date', 'Creation'];
  
  const isTaskCompleted = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.completion === 100 : false;
  };

  const areDependenciesMet = (task: Task) => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    return task.dependencies.every(depId => isTaskCompleted(depId));
  };

  const handleToggleAttempt = (task: Task) => {
    if (task.completion === 100) {
      toggleTask(task.id);
    } else {
      setTaskToComplete(task);
      setIsConfirming(true);
    }
  };

  const confirmCompletion = () => {
    if (taskToComplete) {
      toggleTask(taskToComplete.id);
      setIsConfirming(false);
      setTaskToComplete(null);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    // Parse subtasks
    const subtasksList: Subtask[] = newTask.subtasksInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(title => ({
        id: Math.random().toString(36).substr(2, 9),
        title,
        completed: false
      }));

    addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      duration: newTask.duration,
      energy: newTask.energy,
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate || undefined,
      subtasks: subtasksList.length > 0 ? subtasksList : undefined,
      dependencies: newTask.dependencies.length > 0 ? newTask.dependencies : undefined
    });

    // Reset Form
    setNewTask({
      title: '',
      description: '',
      duration: '30 Mins',
      energy: 'medium',
      priority: 'standard',
      category: 'Strategy',
      dueDate: '',
      subtasksInput: '',
      dependencies: []
    });
    setIsAddModalOpen(false);
  };

  const toggleFormDependency = (depId: string) => {
    setNewTask(prev => {
      const exists = prev.dependencies.includes(depId);
      return {
        ...prev,
        dependencies: exists 
          ? prev.dependencies.filter(id => id !== depId) 
          : [...prev.dependencies, depId]
      };
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'High Energy') return task.energy === 'high';
    if (filter === 'Quick Wins') return task.priority === 'quick';
    if (filter === 'Focus Mode') return task.priority === 'critical' || task.energy === 'high';
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Priority') {
      const order = { 'critical': 0, 'quick': 1, 'standard': 2 };
      return (order[a.priority] || 0) - (order[b.priority] || 0);
    }
    if (sortBy === 'Date') {
      const dateA = a.dueDate || '9999-12-31';
      const dateB = b.dueDate || '9999-12-31';
      return dateA.localeCompare(dateB);
    }
    if (sortBy === 'Creation') {
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    }
    return 0;
  });

  return (
    <div className="space-y-12 pb-40">
      {/* Hero Status */}
      <section className="space-y-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4">Neural Load Status</span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-6xl font-black italic serif text-on-surface leading-[0.9]">
              Strategic <br/><span className="text-primary">Objectives</span>
            </h2>
          </div>
          <p className="text-on-surface-variant font-medium leading-relaxed opacity-60 max-w-sm mt-6 text-sm">Strategic multi-threaded execution required. Optimize priorities for peak cognitive window.</p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => setFilter(chip)}
                className={`px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] transition-all whitespace-nowrap border ${
                  filter === chip 
                    ? 'bg-on-surface text-background border-on-surface' 
                    : 'bg-white/[0.03] text-on-surface-variant border-white/5 hover:border-white/20'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 px-2">
            <span className="text-[9px] font-black uppercase text-on-surface-variant/40 tracking-[0.3em]">Sort Vector:</span>
            <div className="flex gap-4">
              {sortOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt as any)}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
                    sortBy === opt ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Task Stack */}
      <div className="space-y-12">
        {/* Featured Task */}
        {filteredTasks.length > 0 && (
          <div className="space-y-4">
            <GlassCard className={`p-12 rounded-[3rem] border-white/5 group relative overflow-hidden transition-all duration-700 ${!areDependenciesMet(filteredTasks[0]) ? 'opacity-40 grayscale' : 'accent-glow'}`}>
              {!areDependenciesMet(filteredTasks[0]) && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                  <LockIcon size={48} className="text-primary mb-4" />
                  <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white">Prerequisites Required</span>
                </div>
              )}
              <div className="absolute top-0 right-0 p-8 flex gap-3">
                <button 
                  onClick={() => setExpandedTaskId(expandedTaskId === filteredTasks[0].id ? null : filteredTasks[0].id)}
                  className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all ${expandedTaskId === filteredTasks[0].id ? 'bg-primary text-black' : 'hover:bg-primary hover:text-black'}`}
                >
                  <ListTodo size={16} />
                </button>
                <button 
                  onClick={() => {
                    setReminderTaskId(filteredTasks[0].id);
                    setReminderConfig({ 
                      date: filteredTasks[0].reminder?.date || '', 
                      time: filteredTasks[0].reminder?.time || '' 
                    });
                    setIsReminderModalOpen(true);
                  }}
                  className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all ${filteredTasks[0].reminder?.active ? 'text-primary' : 'hover:bg-primary hover:text-black'}`}
                >
                  <Bell size={16} className={filteredTasks[0].reminder?.active ? 'fill-primary' : ''} />
                </button>
                <button 
                  onClick={() => {
                    setIsLinking(true);
                    setLinkingTaskId(filteredTasks[0].id);
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                >
                  <LinkIcon size={16} />
                </button>
                {filteredTasks[0].completion === 100 ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                )}
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="space-y-8 flex-1">
                  <span className="text-[10px] font-black text-error uppercase tracking-[0.4em]">Critical Sector</span>
                  <h3 className="text-4xl serif italic leading-[1.1] text-on-surface max-w-md">{filteredTasks[0].title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    {filteredTasks[0].reminder?.active && (
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        <Bell size={12} className="fill-primary" />
                        <span>Reminder: {filteredTasks[0].reminder.date} @ {filteredTasks[0].reminder.time}</span>
                      </div>
                    )}
                    {filteredTasks[0].dependencies && filteredTasks[0].dependencies.length > 0 && (
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                        <LinkIcon size={12} />
                        <span>Linked to {filteredTasks[0].dependencies.length} node(s)</span>
                      </div>
                    )}
                    {filteredTasks[0].subtasks && filteredTasks[0].subtasks.length > 0 && (
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        <ListTodo size={12} className="text-primary" />
                        <span>Subtask Integrity: {filteredTasks[0].subtasks.filter(st => st.completed).length}/{filteredTasks[0].subtasks.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-3 text-on-surface font-bold text-[11px] uppercase tracking-widest">
                      <Zap size={18} className="text-primary" />
                      <span>{filteredTasks[0].energy} Energy</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface font-bold text-[11px] uppercase tracking-widest">
                      <Clock size={18} className="text-on-surface-variant/40" />
                      <span>{filteredTasks[0].duration || '20 Mins'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-w-xs">
                    <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                       <div 
                        className="bg-primary h-full shadow-[0_0_20px_#38bdf8] transition-all duration-1000"
                        style={{ width: `${filteredTasks[0].completion}%` }}
                       ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-on-surface-variant/40 tracking-[0.3em]">
                       <span>Progressive Thread</span>
                       <span className="text-on-surface">{filteredTasks[0].completion}%</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleToggleAttempt(filteredTasks[0])}
                  disabled={!areDependenciesMet(filteredTasks[0])}
                  className={`w-24 h-24 flex items-center justify-center rounded-full transition-all duration-500 active:scale-90 shadow-2xl ${
                    filteredTasks[0].completion === 100 
                      ? 'bg-primary text-black shadow-[0_0_30px_rgba(56,189,248,0.6)]' 
                      : 'bg-on-surface text-background hover:bg-primary hover:text-black'
                  } disabled:opacity-20 disabled:cursor-not-allowed`}
                >
                  <AnimatePresence mode="wait">
                    {filteredTasks[0].completion === 100 ? (
                      <motion.div
                        key="featured-complete"
                        initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <CheckCircle2 size={40} strokeWidth={2} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="featured-incomplete"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <CheckCircle2 size={40} strokeWidth={1} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </GlassCard>

            <AnimatePresence>
              {expandedTaskId === filteredTasks[0].id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden px-12"
                >
                  <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 space-y-10 accent-glow">
                    <div className="flex items-center justify-between">
                       <h5 className="text-[12px] font-black uppercase text-primary tracking-[0.5em]">Granular Breakdown</h5>
                       <button 
                        onClick={() => setExpandedTaskId(null)}
                        className="text-[10px] font-black uppercase text-on-surface-variant/40 hover:text-primary transition-colors tracking-widest"
                       >
                        Close Breakdown
                       </button>
                    </div>

                    <div className="space-y-6">
                        {filteredTasks[0].subtasks?.map(st => (
                          <div key={st.id} className="flex items-center gap-6 group/st">
                             <button 
                                onClick={() => toggleSubtask(filteredTasks[0].id, st.id)}
                                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${
                                  st.completed ? 'bg-primary border-primary text-black shadow-[0_0_15px_#38bdf8]' : 'bg-white/5 border-white/10 text-transparent group-hover/st:border-primary/50'
                                }`}
                             >
                                <CheckCircle2 size={20} />
                             </button>
                             <span className={`text-xl serif italic transition-all ${st.completed ? 'text-on-surface-variant/40 line-through' : 'text-on-surface'}`}>
                               {st.title}
                             </span>
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-6 pt-6 items-center">
                        <input 
                          type="text"
                          placeholder="Inject Subtask Objective..."
                          className="bg-white/[0.03] border border-white/10 rounded-2xl px-10 py-6 flex-1 text-on-surface text-lg serif italic focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:opacity-20"
                          value={newSubtaskTitle}
                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addSubtask(filteredTasks[0].id, newSubtaskTitle);
                              setNewSubtaskTitle("");
                            }
                          }}
                        />
                        <button 
                          onClick={() => {
                            addSubtask(filteredTasks[0].id, newSubtaskTitle);
                            setNewSubtaskTitle("");
                          }}
                          className="bg-primary text-black w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-all"
                        >
                          <Plus size={32} />
                        </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* List Section */}
        <div className="grid gap-6">
          <div className="flex items-center gap-2 text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] mb-2 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-on-surface/20" />
            Queued Operations
          </div>
          <div className="grid gap-4">
            {filteredTasks.slice(1).map((task) => {
              const met = areDependenciesMet(task);
              const isComp = task.completion === 100;
              const isExpanded = expandedTaskId === task.id;
              
              return (
                <motion.div 
                  key={task.id} 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <GlassCard 
                    className={`p-8 rounded-[2rem] flex items-center gap-8 border border-white/5 transition-all duration-500 group relative ${!met ? 'opacity-40' : isComp ? 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : 'hover:border-white/20'}`}
                  >
                    {!met && (
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-primary opacity-60">
                        <LockIcon size={20} />
                      </div>
                    )}
                    <button 
                      onClick={() => handleToggleAttempt(task)}
                      disabled={!met}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 transition-all duration-500 ${
                        isComp ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'group-hover:bg-primary/20 text-on-surface'
                      } disabled:opacity-50`}
                    >
                      <AnimatePresence mode="wait">
                        {isComp ? (
                          <motion.div
                            key="st-complete"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 45 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <CheckCircle2 size={24} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="st-incomplete"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                          >
                            <Zap size={22} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                    <div className="flex-1 cursor-pointer" onClick={() => met && setExpandedTaskId(isExpanded ? null : task.id)}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] block">{task.category}</span>
                        {task.dependencies && task.dependencies.length > 0 && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                            <LinkIcon size={8} />
                            <span>Linked</span>
                          </div>
                        )}
                      </div>
                      <h4 className={`text-xl serif italic leading-none transition-all ${isComp ? 'line-through opacity-40' : 'text-on-surface'}`}>{task.title}</h4>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-4 space-y-2 max-w-[140px]">
                          <div className="flex items-center justify-between text-[8px] font-black uppercase text-on-surface-variant/40 tracking-widest">
                             <div className="flex items-center gap-1">
                               <ListTodo size={10} className="text-primary" />
                               <span>Subtask Progress</span>
                             </div>
                             <span className="text-primary">{task.completion}%</span>
                          </div>
                          <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-700"
                              style={{ width: `${task.completion}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setReminderTaskId(task.id);
                          setReminderConfig({ 
                            date: task.reminder?.date || '', 
                            time: task.reminder?.time || '' 
                          });
                          setIsReminderModalOpen(true);
                        }}
                        className={`p-3 rounded-full hover:bg-white/5 transition-colors ${task.reminder?.active ? 'text-primary' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <Bell size={20} className={task.reminder?.active ? 'fill-primary' : 'text-on-surface-variant/40 hover:text-primary'} />
                      </button>
                      <button 
                        onClick={() => {
                          setIsLinking(true);
                          setLinkingTaskId(task.id);
                        }}
                        className="p-3 rounded-full hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <LinkIcon size={20} className="text-on-surface-variant/40 hover:text-primary" />
                      </button>
                      <button 
                        onClick={() => met && setExpandedTaskId(isExpanded ? null : task.id)}
                        className={`p-3 rounded-full hover:bg-white/5 transition-all ${isExpanded ? 'rotate-90 text-primary' : 'text-on-surface-variant/40'}`}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </GlassCard>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-8"
                      >
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
                           <div className="flex items-center justify-between mb-4">
                             <h5 className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Granular Decomposition</h5>
                             <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{task.completion}% Verified</span>
                           </div>

                           <div className="space-y-3">
                              {task.subtasks?.map(st => (
                                <div key={st.id} className="flex items-center gap-4 group/st">
                                   <button 
                                      onClick={() => toggleSubtask(task.id, st.id)}
                                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                        st.completed ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-transparent group-hover/st:border-primary/50'
                                      }`}
                                   >
                                      <CheckCircle2 size={14} />
                                   </button>
                                   <span className={`text-sm font-medium transition-all ${st.completed ? 'text-on-surface-variant/40 line-through' : 'text-on-surface'}`}>
                                     {st.title}
                                   </span>
                                </div>
                              ))}
                           </div>

                           <div className="flex gap-4 pt-4">
                              <input 
                                type="text"
                                placeholder="Define Subtask..."
                                className="bg-white/[0.03] border border-white/10 rounded-xl px-6 py-3 flex-1 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:opacity-20"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addSubtask(task.id, newSubtaskTitle);
                                    setNewSubtaskTitle("");
                                  }
                                }}
                              />
                              <button 
                                onClick={() => {
                                  addSubtask(task.id, newSubtaskTitle);
                                  setNewSubtaskTitle("");
                                }}
                                className="bg-white/5 border border-white/10 text-on-surface px-6 py-3 rounded-xl hover:bg-primary hover:text-black transition-all"
                              >
                                <Plus size={20} />
                              </button>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem]">
            <span className="text-[10px] font-mono tracking-widest text-primary uppercase block mb-3">All Clear</span>
            <p className="text-xl serif italic text-on-surface-variant">No tasks matched current criteria.</p>
          </div>
        )}
      </div>

      {/* FAB - Add Task */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-36 right-10 w-20 h-20 bg-background text-on-surface rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border-4 border-white/10 accent-glow hover:scale-105"
      >
        <Plus size={36} strokeWidth={1.5} />
      </button>

      {/* Add Task Modal */}
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
              className="bg-background border border-white/10 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[90vh] no-scrollbar accent-glow"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-3 block">Tactical Matrix</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">Log Objective</h3>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Title</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="e.g. Audit SaaS Subscriptions"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Description</label>
                  <input 
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="Brief description of requirements"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Priority</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    >
                      <option value="standard">Standard</option>
                      <option value="quick">Quick Win</option>
                      <option value="critical">Critical Path</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Energy Load</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newTask.energy}
                      onChange={(e) => setNewTask({ ...newTask, energy: e.target.value as any })}
                    >
                      <option value="low">Low Energy</option>
                      <option value="medium">Medium Load</option>
                      <option value="high">High focus</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Duration Vector</label>
                    <input 
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="e.g. 45 Mins, 2 Hours"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Due Date</label>
                    <input 
                      type="date"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Category Node</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    >
                      <option value="Strategy">Strategy</option>
                      <option value="Communication">Communication</option>
                      <option value="Financial Hygiene">Financial Hygiene</option>
                      <option value="Privacy Systems">Privacy Systems</option>
                      <option value="System Maintenance">System Maintenance</option>
                    </select>
                  </div>
                  
                  {/* Inline list of other tasks for dependencies */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Prerequisites</label>
                    <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-2 text-xs overflow-y-auto max-h-[85px] space-y-1 no-scrollbar">
                      {tasks.map(t => (
                        <label key={t.id} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                          <input 
                            type="checkbox"
                            className="rounded border-white/10 bg-transparent text-primary focus:ring-0"
                            checked={newTask.dependencies.includes(t.id)}
                            onChange={() => toggleFormDependency(t.id)}
                          />
                          <span className="truncate">{t.title}</span>
                        </label>
                      ))}
                      {tasks.length === 0 && <span className="opacity-30">No target dependencies</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Granular Subtasks (one per line)</label>
                  <textarea 
                    rows={2}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:opacity-20"
                    placeholder="e.g.&#10;Verify bank exports&#10;Match Adobe sub fee"
                    value={newTask.subtasksInput}
                    onChange={(e) => setNewTask({ ...newTask, subtasksInput: e.target.value })}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  Activate Objective
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dependency Modal */}
      <AnimatePresence>
        {isLinking && linkingTaskId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsLinking(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-10">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Logic Architect</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">Define Node Dependencies</h3>
                <p className="text-on-surface-variant text-sm font-medium opacity-60 mt-4">Connect this task to prerequisites. It will remain locked until linked nodes are resolved.</p>
              </div>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                {tasks.filter(t => t.id !== linkingTaskId).map(task => {
                  const targetTask = tasks.find(t => t.id === linkingTaskId);
                  const isDep = targetTask?.dependencies?.includes(task.id);
                  
                  return (
                    <button
                      key={task.id}
                      onClick={() => addDependency(linkingTaskId, task.id)}
                      className={`w-full p-6 rounded-2xl flex items-center gap-6 border transition-all text-left ${
                        isDep ? 'bg-primary border-primary text-black' : 'bg-white/[0.02] border-white/5 text-on-surface hover:border-white/20'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDep ? 'bg-black/10' : 'bg-white/5'}`}>
                         <Zap size={18} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{task.category}</span>
                        <h4 className="text-lg serif italic leading-none mt-1">{task.title}</h4>
                      </div>
                      {isDep ? <CheckCircle2 size={24} /> : <Plus size={20} className="opacity-40" />}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setIsLinking(false)}
                className="w-full py-6 bg-on-surface text-background rounded-full font-bold uppercase tracking-[0.3em] text-[12px] mt-10 shadow-2xl hover:scale-[1.02] transition-all"
              >
                Validate Configuration
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirming && taskToComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center accent-glow"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              
              <h3 className="text-3xl serif italic text-on-surface mb-4 leading-tight">Validate Execution</h3>
              <p className="text-on-surface-variant text-sm font-medium opacity-60 mb-10 mx-auto max-w-[280px]">Are you sure you want to mark this task as complete?</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={confirmCompletion}
                  className="w-full py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] transition-all"
                >
                  Confirm Completion
                </button>
                <button 
                  onClick={() => setIsConfirming(false)}
                  className="w-full py-6 bg-white/5 text-on-surface rounded-full font-bold uppercase tracking-[0.3em] text-[12px] hover:bg-white/10 transition-all"
                >
                  Recall Action
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder Modal */}
      <AnimatePresence>
        {isReminderModalOpen && reminderTaskId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl accent-glow"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsReminderModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-10">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Temporal Synchronizer</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">Schedule Reminder</h3>
                <p className="text-on-surface-variant text-sm font-medium opacity-60 mt-4">Assign a neural trigger to this objective.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Vector Date</label>
                  <input 
                    type="date"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-10 py-6 text-on-surface text-lg serif italic focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                    value={reminderConfig.date}
                    onChange={(e) => setReminderConfig({ ...reminderConfig, date: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Vector Time</label>
                  <input 
                    type="time"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-10 py-6 text-on-surface text-lg serif italic focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                    value={reminderConfig.time}
                    onChange={(e) => setReminderConfig({ ...reminderConfig, time: e.target.value })}
                  />
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => {
                      setReminder(reminderTaskId, reminderConfig.date, reminderConfig.time);
                      setIsReminderModalOpen(false);
                    }}
                    disabled={!reminderConfig.date || !reminderConfig.time}
                    className="flex-1 py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-20 translate-y-0.5"
                  >
                    Calibrate Vector
                  </button>
                  {tasks.find(t => t.id === reminderTaskId)?.reminder?.active && (
                    <button 
                      onClick={() => {
                        setReminder(reminderTaskId, '', '');
                        setIsReminderModalOpen(false);
                      }}
                      className="px-8 py-6 bg-error/10 border border-error/20 text-error rounded-full font-bold uppercase tracking-[0.3em] text-[12px] hover:bg-error hover:text-white transition-all"
                    >
                      Purge
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
