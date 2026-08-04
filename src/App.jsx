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

import {
  fetchCloudTransactions,
  syncTransactionToCloud,
  deleteTransactionFromCloud,
  fetchCloudBudgets,
  syncBudgetToCloud,
  fetchCloudGoals,
  syncGoalToCloud
} from './utils/supabaseStorage';

import { isSupabaseConfigured } from './utils/supabaseClient';

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

  // Fetch initial data from Supabase Cloud if available
  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchCloudTransactions().then(cloudTxs => {
        if (cloudTxs && cloudTxs.length > 0) {
          setTransactions(cloudTxs);
        } else if (cloudTxs && cloudTxs.length === 0 && transactions.length > 0) {
          // Push initial local transactions to cloud
          transactions.forEach(t => syncTransactionToCloud(t));
        }
      });

      fetchCloudBudgets().then(cloudBudgets => {
        if (cloudBudgets && cloudBudgets.length > 0) {
          setBudgets(cloudBudgets);
        } else if (cloudBudgets && cloudBudgets.length === 0 && budgets.length > 0) {
          budgets.forEach(b => syncBudgetToCloud(b));
        }
      });

      fetchCloudGoals().then(cloudGoals => {
        if (cloudGoals && cloudGoals.length > 0) {
          setGoals(cloudGoals);
        } else if (cloudGoals && cloudGoals.length === 0 && goals.length > 0) {
          goals.forEach(g => syncGoalToCloud(g));
        }
      });
    }
  }, []);

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

  // Actions with Supabase Cloud Syncing
  const handleSaveTransaction = (record) => {
    if (editingTx) {
      setTransactions(transactions.map(t => t.id === record.id ? record : t));
    } else {
      setTransactions([record, ...transactions]);
    }
    // Sync to Cloud
    syncTransactionToCloud(record);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      deleteTransactionFromCloud(id);
    }
  };

  const handleUpdateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    newBudgets.forEach(b => syncBudgetToCloud(b));
  };

  const handleUpdateGoals = (newGoals) => {
    setGoals(newGoals);
    newGoals.forEach(g => syncGoalToCloud(g));
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
      if (isSupabaseConfigured) {
        demo.transactions.forEach(t => syncTransactionToCloud(t));
        demo.budgets.forEach(b => syncBudgetToCloud(b));
        demo.goals.forEach(g => syncGoalToCloud(g));
      }
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
            budgets={budgets}
            setBudgets={handleUpdateBudgets}
            goals={goals}
            setGoals={handleUpdateGoals}
            currency={currency}
            onOpenAddTransaction={handleOpenAdd}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onResetDemoData={handleResetData}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsView 
            budgets={budgets}
            setBudgets={handleUpdateBudgets}
            transactions={transactions}
            currency={currency}
          />
        )}

        {activeTab === 'goals' && (
          <SavingsView 
            goals={goals}
            setGoals={handleUpdateGoals}
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
