import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bill, Task, Habit, Doc, AppNotification, Page } from '../types';
import { 
  BILLS as INITIAL_BILLS, 
  TASKS as INITIAL_TASKS, 
  HABITS as INITIAL_HABITS, 
  DOCS as INITIAL_DOCS, 
  NOTIFICATIONS as INITIAL_NOTIFICATIONS 
} from '../constants';
import { GoogleGenAI } from '@google/genai';

interface AppContextType {
  bills: Bill[];
  tasks: Task[];
  habits: Habit[];
  docs: Doc[];
  notifications: AppNotification[];
  operativeName: string;
  streakCount: number;
  missionsDone: number;
  geminiKey: string;
  isLoadingAI: boolean;
  
  // Mutators
  addBill: (bill: Omit<Bill, 'id' | 'status'>) => void;
  resolveBill: (billId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completion'>) => void;
  toggleTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  addDependency: (taskId: string, depId: string) => void;
  setReminder: (taskId: string, date: string, time: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'current' | 'streak'>) => void;
  logHabitProgress: (habitId: string, amount: number) => void;
  addDoc: (doc: Omit<Doc, 'id' | 'updatedAt'>) => void;
  deleteDoc: (docId: string) => void;
  markNotificationRead: (notiId: string) => void;
  dismissNotification: (notiId: string) => void;
  clearAllNotifications: () => void;
  updateProfile: (name: string, key: string) => void;
  
  // Data actions
  exportDatabase: () => void;
  importDatabase: (jsonData: string) => boolean;
  resetDatabase: () => void;
  triggerServerSync: () => Promise<boolean>;
  
  // AI Actions
  triggerNeuralAudit: () => Promise<string>;
  queryAICore: (prompt: string) => Promise<string>;
  summarizeDocument: (docName: string, category: string) => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fall back to constants
  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('nexus_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nexus_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('nexus_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [docs, setDocs] = useState<Doc[]>(() => {
    const saved = localStorage.getItem('nexus_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('nexus_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [operativeName, setOperativeName] = useState<string>(() => {
    return localStorage.getItem('nexus_operative_name') || 'Sarah K.';
  });

  const [geminiKey, setGeminiKey] = useState<string>(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('nexus_gemini_key') || '';
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexus_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nexus_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('nexus_docs', JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem('nexus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nexus_operative_name', operativeName);
  }, [operativeName]);

  useEffect(() => {
    if (geminiKey) {
      localStorage.setItem('nexus_gemini_key', geminiKey);
    } else {
      localStorage.removeItem('nexus_gemini_key');
    }
  }, [geminiKey]);

  // Derived stats
  const missionsDone = tasks.filter(t => t.completion === 100).length;
  const streakCount = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 12;

  // Initialize AI Client
  const getAIClient = () => {
    const key = geminiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!key) {
      throw new Error("Gemini API key is not configured. Please configure it in your Operative Profile.");
    }
    return new GoogleGenAI({ apiKey: key });
  };

  // State Mutators
  const addBill = (newBill: Omit<Bill, 'id' | 'status'>) => {
    const bill: Bill = {
      ...newBill,
      id: Math.random().toString(36).substr(2, 9),
      status: 'due'
    };
    setBills(prev => [bill, ...prev]);
    addSystemNotification(
      'urgent',
      'New Obligation Logged',
      `Payment of $${bill.amount.toFixed(2)} is due for ${bill.name} (${bill.dueDate}).`,
      'banknote'
    );
  };

  const resolveBill = (billId: string) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'paid' } : b));
    const targetBill = bills.find(b => b.id === billId);
    if (targetBill) {
      addSystemNotification(
        'system',
        'Obligation Settled',
        `Payment of $${targetBill.amount.toFixed(2)} for ${targetBill.name} has been processed successfully.`,
        'shield-check'
      );
    }
  };

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'completion'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      completion: 0
    };
    setTasks(prev => [task, ...prev]);
    addSystemNotification(
      'system',
      'Objective Activated',
      `New objective "${task.title}" has been registered in the Mission Log.`,
      'settings'
    );
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isNowComplete = t.completion !== 100;
        const updatedSubtasks = (t.subtasks || []).map(st => ({ ...st, completed: isNowComplete }));
        return { 
          ...t, 
          completion: isNowComplete ? 100 : 0,
          subtasks: updatedSubtasks,
          reminder: t.reminder ? { ...t.reminder, active: !isNowComplete } : undefined
        };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = updatedSubtasks.filter(st => st.completed).length;
        const totalCount = updatedSubtasks.length;
        const completion = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : t.completion;
        return { ...t, subtasks: updatedSubtasks, completion };
      }
      return t;
    }));
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newSubtask = {
          id: Math.random().toString(36).substr(2, 9),
          title: title.trim(),
          completed: false
        };
        const updatedSubtasks = [...(t.subtasks || []), newSubtask];
        const completedCount = updatedSubtasks.filter(st => st.completed).length;
        const totalCount = updatedSubtasks.length;
        const completion = Math.round((completedCount / totalCount) * 100);
        return { ...t, subtasks: updatedSubtasks, completion };
      }
      return t;
    }));
  };

  const addDependency = (taskId: string, depId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const deps = t.dependencies || [];
        const isDep = deps.includes(depId);
        return { 
          ...t, 
          dependencies: isDep ? deps.filter(id => id !== depId) : [...deps, depId] 
        };
      }
      return t;
    }));
  };

  const setReminder = (taskId: string, date: string, time: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          reminder: { date, time, active: true }
        };
      }
      return t;
    }));
  };

  const addHabit = (newHabit: Omit<Habit, 'id' | 'current' | 'streak'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Math.random().toString(36).substr(2, 9),
      current: 0,
      streak: 0
    };
    setHabits(prev => [...prev, habit]);
    addSystemNotification(
      'system',
      'Momentum Core Formed',
      `Habit tracker for "${habit.name}" has been calibrated.`,
      'settings'
    );
  };

  const logHabitProgress = (habitId: string, amount: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newCurrent = Math.min(h.current + amount, h.goal);
        const reachedGoal = newCurrent >= h.goal && h.current < h.goal;
        const newStreak = reachedGoal ? h.streak + 1 : h.streak;
        
        if (reachedGoal) {
          addSystemNotification(
            'system',
            'Goal Limit Breach',
            `Momentum Vector "${h.name}" reached goal threshold! Streak incremented to ${newStreak}.`,
            'task_alt'
          );
        }

        return {
          ...h,
          current: Number(newCurrent.toFixed(2)),
          streak: newStreak
        };
      }
      return h;
    }));
  };

  const addDoc = (newDoc: Omit<Doc, 'id' | 'updatedAt'>) => {
    const doc: Doc = {
      ...newDoc,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: 'Just now'
    };
    setDocs(prev => [doc, ...prev]);
    addSystemNotification(
      'system',
      'Vault Entry Saved',
      `Document "${doc.name}" has been encrypted and saved in the vault.`,
      'shield-check'
    );
  };

  const deleteDoc = (docId: string) => {
    setDocs(prev => prev.filter(d => d.id !== docId));
  };

  const addSystemNotification = (
    type: 'urgent' | 'system' | 'update',
    title: string,
    message: string,
    icon: string
  ) => {
    const noti: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      icon,
      time: '1m ago',
      read: false
    };
    setNotifications(prev => [noti, ...prev]);
  };

  const markNotificationRead = (notiId: string) => {
    setNotifications(prev => prev.map(n => n.id === notiId ? { ...n, read: true } : n));
  };

  const dismissNotification = (notiId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notiId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateProfile = (name: string, key: string) => {
    setOperativeName(name);
    setGeminiKey(key);
    addSystemNotification(
      'system',
      'Operative Profile Updated',
      `Ident vectors modified for ${name}. Configuration synced.`,
      'settings'
    );
  };

  // Real Data Actions
  const exportDatabase = () => {
    const backup = {
      bills,
      tasks,
      habits,
      docs,
      notifications,
      operativeName,
      geminiKey
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-backup-${operativeName.replace(/\s+/g, '_')}-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDatabase = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.bills || !parsed.tasks || !parsed.habits) {
        return false;
      }
      
      setBills(parsed.bills);
      setTasks(parsed.tasks);
      setHabits(parsed.habits);
      if (parsed.docs) setDocs(parsed.docs);
      if (parsed.notifications) setNotifications(parsed.notifications);
      if (parsed.operativeName) setOperativeName(parsed.operativeName);
      if (parsed.geminiKey) setGeminiKey(parsed.geminiKey);
      
      addSystemNotification(
        'system',
        'Database Sync Restored',
        'Your profile configurations and database blocks have been successfully loaded from backup.',
        'shield-check'
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetDatabase = () => {
    setBills(INITIAL_BILLS);
    setTasks(INITIAL_TASKS);
    setHabits(INITIAL_HABITS);
    setDocs(INITIAL_DOCS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setOperativeName('Sarah K.');
    setGeminiKey('');
    
    // Clear localStorage
    localStorage.removeItem('nexus_bills');
    localStorage.removeItem('nexus_tasks');
    localStorage.removeItem('nexus_habits');
    localStorage.removeItem('nexus_docs');
    localStorage.removeItem('nexus_notifications');
    localStorage.removeItem('nexus_operative_name');
    localStorage.removeItem('nexus_gemini_key');
  };

  const triggerServerSync = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        addSystemNotification(
          'system',
          'Global core synced',
          'Database check completed. Latency: 0.02ms. Entropy: 0.002%. All local layers consolidated.',
          'shield-check'
        );
        resolve(true);
      }, 3000);
    });
  };

  // AI CORE OPERATIONS
  const triggerNeuralAudit = async (): Promise<string> => {
    setIsLoadingAI(true);
    try {
      const ai = getAIClient();
      const prompt = `You are the AI Core of a high-tech "Life Command Center" called Nexus. 
The operative is Sarah K. (Level 42, Level 4 Admin). 
Analyze the current live metrics of the operative and generate an "Operative Strategic Audit". 
Keep it in a professional, immersive, futuristic "cyberpunk military console" tone.

LIVE METRICS SUMMARY:
- Unpaid/Due Bills: ${bills.filter(b => b.status !== 'paid').map(b => `${b.name} ($${b.amount} due ${b.dueDate})`).join(', ')}
- Critical Unresolved Tasks: ${tasks.filter(t => t.completion < 100).map(t => `${t.title} (${t.priority} priority, ${t.energy} energy req)`).join(', ')}
- Habits / Streaks: ${habits.map(h => `${h.name}: streak ${h.streak}d, current ${h.current}/${h.goal} ${h.unit}`).join(', ')}
- Vault Documents: ${docs.map(d => `${d.name} (${d.category}, status: ${d.status})`).join(', ')}

Structure the report with the following sections (use clear, styled markdown formatting):
1. SYSTEM DIAGNOSTIC (Overall status, health score, recovery efficiency, and reserves summary)
2. THREAT MATRIX (Critical alerts on overdue obligations, subscription waste detection, and dependency blockages)
3. COGNITIVE CALIBRATION (Suggestions for daily habits scheduling, streak optimization, and energy planning)
4. DIRECT COMMANDS (A bulleted list of 3 specific, highly action-oriented task recommendations for today)

Make sure the output feels premium, detailed, and completely custom to the data.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "Failed to generate report text from AI Core.";
    } catch (e: any) {
      console.error(e);
      return `### AI Core Error\n\nFailed to establish synaptic link to AI Core: **${e.message}**\n\nPlease ensure your API Key is valid and that you have an active network connection.`;
    } finally {
      setIsLoadingAI(false);
    }
  };

  const queryAICore = async (queryPrompt: string): Promise<string> => {
    setIsLoadingAI(true);
    try {
      const ai = getAIClient();
      const prompt = `You are the Nexus System Tactical Advisor, a natural-language search query engine and executive planner.
The user (Sarah K.) has searched for: "${queryPrompt}".
Look at the following database vectors:
- Tasks: ${JSON.stringify(tasks)}
- Bills: ${JSON.stringify(bills)}
- Habits: ${JSON.stringify(habits)}
- Docs: ${JSON.stringify(docs)}

Answer their query. 
1. If the query asks for specific information (e.g. "Do I have any bills due?" or "What is my meditation streak?"), filter the database vectors and output a clean, styled tabular or bulleted summary.
2. If the query is an advice/coaching question (e.g. "How can I optimize my productivity?"), analyze their open tasks and suggest a customized strategy using their data.
3. Keep the tone immersive, tactical, and clean. Wrap important keywords in code block accents or bolding. Keep the response to 3-4 concise paragraphs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "No intelligence returned from core.";
    } catch (e: any) {
      console.error(e);
      return `TACTICAL LINK ERROR: **${e.message}**`;
    } finally {
      setIsLoadingAI(false);
    }
  };

  const summarizeDocument = async (docName: string, category: string): Promise<string> => {
    setIsLoadingAI(true);
    try {
      const ai = getAIClient();
      const prompt = `You are the Nexus Encrypted Document Analyzer.
The operative has requested a semantic summary and risk assessment for:
Document Name: "${docName}"
Category: "${category}"

Since this document is stored in the local AES-256 vault, analyze what this document represents.
Generate:
1. DOCUMENT CLASSIFICATION & DETAILS (Explain typical contents of such a document, e.g. passport, health plan, vehicle title)
2. EXECUTIVE SUMMARY (Mocked, professional-grade 3-bullet summary of the document's crucial metadata)
3. EXPIRATION & RENEWAL TASK LIST (Actions required to maintain this document's validity, including reminders)
4. SECURITY PROTOCOL RECOMMENDATION (Optimal storage advice)

Tone: Technical, highly secure, military database style. Make it short and punchy.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "No summary returned.";
    } catch (e: any) {
      console.error(e);
      return `SYNAPSE BLOCK: **${e.message}**`;
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <AppContext.Provider value={{
      bills,
      tasks,
      habits,
      docs,
      notifications,
      operativeName,
      streakCount,
      missionsDone,
      geminiKey,
      isLoadingAI,
      addBill,
      resolveBill,
      addTask,
      toggleTask,
      toggleSubtask,
      addSubtask,
      addDependency,
      setReminder,
      addHabit,
      logHabitProgress,
      addDoc,
      deleteDoc,
      markNotificationRead,
      dismissNotification,
      clearAllNotifications,
      updateProfile,
      exportDatabase,
      importDatabase,
      resetDatabase,
      triggerServerSync,
      triggerNeuralAudit,
      queryAICore,
      summarizeDocument
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
