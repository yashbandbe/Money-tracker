export const CATEGORIES = {
  housing: { name: 'Housing & Rent', icon: 'Home', color: '#6366f1', type: 'expense' },
  food: { name: 'Food & Dining', icon: 'Utensils', color: '#f59e0b', type: 'expense' },
  transport: { name: 'Transportation', icon: 'Car', color: '#10b981', type: 'expense' },
  entertainment: { name: 'Entertainment', icon: 'Film', color: '#ec4899', type: 'expense' },
  utilities: { name: 'Utilities & Bills', icon: 'Zap', color: '#3b82f6', type: 'expense' },
  shopping: { name: 'Shopping', icon: 'ShoppingBag', color: '#8b5cf6', type: 'expense' },
  health: { name: 'Health & Wellness', icon: 'HeartPulse', color: '#ef4444', type: 'expense' },
  education: { name: 'Education & Courses', icon: 'GraduationCap', color: '#06b6d4', type: 'expense' },
  salary: { name: 'Salary / Income', icon: 'Wallet', color: '#10b981', type: 'income' },
  freelance: { name: 'Freelance & Side Gig', icon: 'Briefcase', color: '#14b8a6', type: 'income' },
  investments: { name: 'Investments Return', icon: 'TrendingUp', color: '#84cc16', type: 'income' },
  other: { name: 'Misc / Other', icon: 'MoreHorizontal', color: '#64748b', type: 'expense' }
};

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
  'Digital Wallet / UPI'
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Monthly Apartment Rent',
    amount: 1450,
    type: 'expense',
    category: 'housing',
    date: '2026-08-01',
    paymentMethod: 'Bank Transfer',
    note: 'August rent payment'
  },
  {
    id: 'tx-2',
    title: 'Tech Salary Deposit',
    amount: 5200,
    type: 'income',
    category: 'salary',
    date: '2026-08-01',
    paymentMethod: 'Bank Transfer',
    note: 'Bi-weekly payroll'
  },
  {
    id: 'tx-3',
    title: 'Whole Foods Grocery',
    amount: 142.50,
    type: 'expense',
    category: 'food',
    date: '2026-08-02',
    paymentMethod: 'Credit Card',
    note: 'Weekly organic groceries'
  },
  {
    id: 'tx-4',
    title: 'Subway & Bus Pass',
    amount: 75.00,
    type: 'expense',
    category: 'transport',
    date: '2026-08-02',
    paymentMethod: 'Digital Wallet / UPI',
    note: 'Monthly transit card refill'
  },
  {
    id: 'tx-5',
    title: 'Freelance UI/UX Design Project',
    amount: 1200.00,
    type: 'income',
    category: 'freelance',
    date: '2026-08-03',
    paymentMethod: 'Bank Transfer',
    note: 'Client payment for landing page design'
  },
  {
    id: 'tx-6',
    title: 'Netflix & Spotify Subscriptions',
    amount: 28.98,
    type: 'expense',
    category: 'entertainment',
    date: '2026-07-28',
    paymentMethod: 'Credit Card',
    note: 'Recurring monthly digital sub'
  },
  {
    id: 'tx-7',
    title: 'Electric & High-Speed Internet Bill',
    amount: 165.40,
    type: 'expense',
    category: 'utilities',
    date: '2026-07-26',
    paymentMethod: 'Debit Card',
    note: 'July utilities invoice'
  },
  {
    id: 'tx-8',
    title: 'Nike Air Max Sneakers',
    amount: 185.00,
    type: 'expense',
    category: 'shopping',
    date: '2026-07-25',
    paymentMethod: 'Credit Card',
    note: 'Summer sale purchase'
  },
  {
    id: 'tx-9',
    title: 'Weekend Dinner & Drinks',
    amount: 112.30,
    type: 'expense',
    category: 'food',
    date: '2026-07-24',
    paymentMethod: 'Credit Card',
    note: 'Bistro dinner with friends'
  },
  {
    id: 'tx-10',
    title: 'Dental Checkup & Cleaning',
    amount: 95.00,
    type: 'expense',
    category: 'health',
    date: '2026-07-20',
    paymentMethod: 'Debit Card',
    note: 'Routine dental visit copay'
  },
  {
    id: 'tx-11',
    title: 'Stock Dividend Yield',
    amount: 340.00,
    type: 'income',
    category: 'investments',
    date: '2026-07-15',
    paymentMethod: 'Bank Transfer',
    note: 'Q2 Portfolio Payout'
  },
  {
    id: 'tx-12',
    title: 'Online Tech Masterclass Course',
    amount: 49.99,
    type: 'expense',
    category: 'education',
    date: '2026-07-12',
    paymentMethod: 'Credit Card',
    note: 'FullStack React Certification'
  }
];

export const INITIAL_BUDGETS = [
  { id: 'b-1', category: 'food', limit: 600 },
  { id: 'b-2', category: 'housing', limit: 1500 },
  { id: 'b-3', category: 'transport', limit: 250 },
  { id: 'b-4', category: 'entertainment', limit: 200 },
  { id: 'b-5', category: 'shopping', limit: 150 },
  { id: 'b-6', category: 'utilities', limit: 250 }
];

export const INITIAL_GOALS = [
  {
    id: 'g-1',
    name: 'Emergency Rainy Day Fund',
    targetAmount: 10000,
    currentAmount: 6850,
    targetDate: '2026-12-31',
    category: 'Savings',
    color: '#10b981'
  },
  {
    id: 'g-2',
    name: 'Japan Autumn Trip',
    targetAmount: 4500,
    currentAmount: 3100,
    targetDate: '2026-10-15',
    category: 'Travel',
    color: '#3b82f6'
  },
  {
    id: 'g-3',
    name: 'Next-Gen Workstation Upgrade',
    targetAmount: 2500,
    currentAmount: 1950,
    targetDate: '2026-09-30',
    category: 'Tech',
    color: '#8b5cf6'
  }
];
