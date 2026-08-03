import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_GOALS } from './initialData';

const KEYS = {
  TRANSACTIONS: 'wealthpilot_transactions',
  BUDGETS: 'wealthpilot_budgets',
  GOALS: 'wealthpilot_goals',
  SETTINGS: 'wealthpilot_settings'
};

export const getStoredTransactions = () => {
  try {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  } catch (e) {
    console.error('Failed to load transactions from localStorage', e);
    return INITIAL_TRANSACTIONS;
  }
};

export const saveStoredTransactions = (transactions) => {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to localStorage', e);
  }
};

export const getStoredBudgets = () => {
  try {
    const data = localStorage.getItem(KEYS.BUDGETS);
    return data ? JSON.parse(data) : INITIAL_BUDGETS;
  } catch (e) {
    console.error('Failed to load budgets from localStorage', e);
    return INITIAL_BUDGETS;
  }
};

export const saveStoredBudgets = (budgets) => {
  try {
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (e) {
    console.error('Failed to save budgets to localStorage', e);
  }
};

export const getStoredGoals = () => {
  try {
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : INITIAL_GOALS;
  } catch (e) {
    console.error('Failed to load goals from localStorage', e);
    return INITIAL_GOALS;
  }
};

export const saveStoredGoals = (goals) => {
  try {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals to localStorage', e);
  }
};

export const getStoredSettings = () => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { currency: 'USD', theme: 'dark' };
  } catch (e) {
    return { currency: 'USD', theme: 'dark' };
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};

export const resetAllData = () => {
  localStorage.removeItem(KEYS.TRANSACTIONS);
  localStorage.removeItem(KEYS.BUDGETS);
  localStorage.removeItem(KEYS.GOALS);
  return {
    transactions: INITIAL_TRANSACTIONS,
    budgets: INITIAL_BUDGETS,
    goals: INITIAL_GOALS
  };
};
