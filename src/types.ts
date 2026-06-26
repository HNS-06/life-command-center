export enum Page {
  LANDING = 'landing',
  LOGIN = 'login',
  HOME = 'home',
  BILLS = 'bills',
  TASKS = 'tasks',
  DATA = 'data',
  DOCS = 'docs',
  HABITS = 'habits',
  SEARCH = 'search',
  NOTIFICATIONS = 'notifications',
  PROFILE = 'profile',
  SETTINGS = 'settings',
  SYNCED = 'synced'
}

export interface Bill {
  id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'due' | 'urgent' | 'paid' | 'scheduled';
  icon: string;
  category: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  energy: 'high' | 'medium' | 'low';
  priority: 'critical' | 'quick' | 'standard';
  completion: number;
  category: string;
  time?: string;
  dependencies?: string[];
  subtasks?: Subtask[];
  reminder?: {
    date: string;
    time: string;
    active: boolean;
  };
  createdAt: string;
  dueDate?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  current: number;
  goal: number;
  unit: string;
  streak: number;
  color: string;
}

export interface Doc {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status?: string;
  statusType?: 'error' | 'success' | 'warning' | 'info';
  icon: string;
}

export interface AppNotification {
  id: string;
  type: 'urgent' | 'system' | 'update';
  title: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}
