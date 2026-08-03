import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';
import BudgetsView from './components/BudgetsView';
import SavingsView from './components/SavingsView';
import AnalyticsView from './components/AnalyticsView';
import TransactionModal from './components/TransactionModal';

import { 
  getStoredTransactions, 
  saveStoredTransactions,
  getStoredBudgets,
  saveStoredBudgets,
  getStoredGoals,
  saveStoredGoals,
  getStoredSettings,
  saveStoredSettings,
  resetAllData
} from './utils/storage';

export default function App() {
  const [transactions, setTransactions] = useState(getStoredTransactions);
  const [budgets, setBudgets] = useState(getStoredBudgets);
  const [goals, setGoals] = useState(getStoredGoals);

  const initialSettings = getStoredSettings();
  const [currency, setCurrency] = useState(initialSettings.currency || 'USD');
  const [theme, setTheme] = useState(initialSettings.theme || 'dark');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Sync localStorage & theme
  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredBudgets(budgets);
  }, [budgets]);

  useEffect(() => {
    saveStoredGoals(goals);
  }, [goals]);

  useEffect(() => {
    saveStoredSettings({ currency, theme });
    document.documentElement.setAttribute('data-theme', theme);
  }, [currency, theme]);

  // Actions
  const handleSaveTransaction = (record) => {
    if (editingTx) {
      setTransactions(transactions.map(t => t.id === record.id ? record : t));
    } else {
      setTransactions([record, ...transactions]);
    }
  };

  const handleEditTransaction = (tx) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all transactions, budgets, and savings goals to initial demo dataset?')) {
      const demo = resetAllData();
      setTransactions(demo.transactions);
      setBudgets(demo.budgets);
      setGoals(demo.goals);
    }
  };

  return (
    <div className="app-container">
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        setTheme={setTheme}
        onOpenAddTransaction={handleOpenAdd}
      />

      <main>
        {activeTab === 'dashboard' && (
          <DashboardView 
            transactions={transactions}
            budgets={budgets}
            currency={currency}
            setActiveTab={setActiveTab}
            onOpenAddTransaction={handleOpenAdd}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView 
            transactions={transactions}
            setTransactions={setTransactions}
            currency={currency}
            onOpenAddTransaction={handleOpenAdd}
            onEditTransaction={handleEditTransaction}
            onResetDemoData={handleResetData}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsView 
            budgets={budgets}
            setBudgets={setBudgets}
            transactions={transactions}
            currency={currency}
          />
        )}

        {activeTab === 'goals' && (
          <SavingsView 
            goals={goals}
            setGoals={setGoals}
            currency={currency}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView 
            transactions={transactions}
            currency={currency}
          />
        )}
      </main>

      <TransactionModal 
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        editingTx={editingTx}
        currency={currency}
      />
    </div>
  );
}
