import { Bill, Task, Habit, Doc, AppNotification } from './types';

export const BILLS: Bill[] = [
  {
    id: '1',
    name: 'AWS Cloud',
    description: 'Infrastructure usage',
    amount: 284.12,
    dueDate: 'Today',
    status: 'urgent',
    icon: 'cloud',
    category: 'Infrastructure'
  },
  {
    id: '2',
    name: 'Netflix Premium',
    description: 'Streaming Service',
    amount: 22.99,
    dueDate: 'In 3 days',
    status: 'due',
    icon: 'play-square',
    category: 'Entertainment'
  },
  {
    id: '3',
    name: 'Fiber Optics',
    description: 'Monthly Broadband',
    amount: 85.00,
    dueDate: 'In 5 days',
    status: 'due',
    icon: 'wifi',
    category: 'Utilities'
  },
  {
    id: '4',
    name: 'Adobe Creative',
    description: 'Design Suite',
    amount: 54.99,
    dueDate: 'Oct 12',
    status: 'scheduled',
    icon: 'palette',
    category: 'Design'
  },
  {
    id: '5',
    name: 'Elite Fitness',
    description: 'Gym Membership',
    amount: 120.00,
    dueDate: 'Oct 20',
    status: 'scheduled',
    icon: 'dumbbell',
    category: 'Health'
  }
];

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Finalize Quarterly Strategic Roadmap',
    description: 'Progressive Task',
    energy: 'high',
    priority: 'critical',
    completion: 65,
    category: 'Strategy',
    duration: '90 Mins',
    createdAt: '2026-05-01T10:00:00Z',
    dueDate: '2026-05-10'
  },
  {
    id: '2',
    title: 'Clear Communication Buffer',
    description: 'Inbox Zero protocol for 14 urgent threads.',
    energy: 'medium',
    priority: 'quick',
    completion: 0,
    category: 'Communication',
    dependencies: ['1'],
    createdAt: '2026-05-02T12:00:00Z',
    dueDate: '2026-05-08'
  },
  {
    id: '3',
    title: 'Audit SaaS Subscriptions',
    energy: 'low',
    priority: 'standard',
    completion: 0,
    category: 'Financial Hygiene',
    dependencies: ['2'],
    createdAt: '2026-05-03T09:00:00Z',
    dueDate: '2026-05-15'
  },
  {
      id: '4',
      title: 'Update Security Vault',
      energy: 'low',
      priority: 'standard',
      completion: 0,
      category: 'Privacy Systems',
      createdAt: '2026-04-20T15:30:00Z',
      dueDate: '2026-05-05'
  },
  {
      id: '5',
      title: 'Calibrate Daily Habits',
      energy: 'low',
      priority: 'standard',
      completion: 0,
      category: 'System Maintenance',
      createdAt: '2026-05-04T11:45:00Z',
      dueDate: '2026-05-20'
  }
];

export const HABITS: Habit[] = [
  {
    id: '1',
    name: 'Deep Work',
    description: 'Cognitive focus session',
    current: 90,
    goal: 120,
    unit: 'm',
    streak: 12,
    color: 'primary'
  },
  {
    id: '2',
    name: 'Hydrate',
    description: 'Cellular hydration level',
    current: 1.5,
    goal: 3.0,
    unit: 'L',
    streak: 12,
    color: 'secondary'
  },
  {
    id: '3',
    name: 'Meditation',
    description: 'Clarity protocol',
    current: 18,
    goal: 20,
    unit: 'm',
    streak: 4,
    color: 'tertiary'
  }
];

export const DOCS: Doc[] = [
  {
    id: '1',
    name: 'International Passport',
    category: 'ID Section',
    updatedAt: '2d ago',
    status: 'Expires in 30 days',
    statusType: 'error',
    icon: 'contact-round'
  },
  {
    id: '2',
    name: 'Premium Health Plan',
    category: 'Medical',
    updatedAt: '1mo ago',
    status: 'Secured Vault 01',
    statusType: 'success',
    icon: 'activity'
  },
  {
    id: '3',
    name: 'Mortgage Deed',
    category: 'Real Estate',
    updatedAt: '1y ago',
    status: 'HIGH PRIORITY',
    statusType: 'warning',
    icon: 'home'
  },
  {
    id: '4',
    name: '2023 Tax Returns',
    category: 'Finance',
    updatedAt: '3mo ago',
    status: 'AES-256 Encrypted',
    statusType: 'info',
    icon: 'wallet'
  },
  {
      id: '5',
      name: 'Vehicle Title',
      category: 'Assets',
      updatedAt: '2y ago',
      status: 'Verified by Auth0',
      statusType: 'success',
      icon: 'car'
  }
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Electricity Bill Overdue',
    message: 'Your utility payment for March is 3 days overdue. Avoid service interruption by settling the balance now.',
    time: '2m ago',
    icon: 'banknote',
    read: false
  },
  {
    id: '2',
    type: 'system',
    title: 'Security Vault Synced',
    message: 'Encrypted backup completed successfully. 128 new entries secured in the Archive.',
    time: '1h ago',
    icon: 'shield-check',
    read: false
  },
  {
    id: '3',
    type: 'system',
    title: 'Firmware Update',
    message: 'System v4.2.0 installed. Performance optimizations applied to glass rendering engine.',
    time: '5h ago',
    icon: 'settings',
    read: true
  }
];
