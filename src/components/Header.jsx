import React from 'react';
import { 
  Compass, 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  TrendingUp, 
  Plus, 
  Moon, 
  Sun,
  CloudCheck
} from 'lucide-react';
import { CURRENCIES } from '../utils/initialData';
import { isSupabaseConfigured } from '../utils/supabaseClient';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  currency, 
  setCurrency, 
  theme, 
  setTheme, 
  onOpenAddTransaction 
}) {
  return (
    <>
      {/* Main Top Header */}
      <header className="app-header">
        <div className="brand-logo">
          <div className="brand-icon-wrapper">
            <Compass size={22} />
          </div>
          <div className="brand-text-container">
            <h1 className="brand-title">WealthPilot</h1>
            {isSupabaseConfigured && (
              <span className="supabase-badge" title="Connected to Supabase Cloud Database">
                <CloudCheck size={11} /> Sync
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="nav-tabs desktop-only">
          <button 
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <Receipt size={18} />
            <span>Transactions</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            <PieChart size={18} />
            <span>Budgets</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            <Target size={18} />
            <span>Goals</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={18} />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Header Action Controls */}
        <div className="header-actions">
          <select 
            className="select-input currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            title="Select Currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>

          <button 
            className="icon-btn theme-toggle-btn" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="btn-primary add-record-btn" onClick={onOpenAddTransaction}>
            <Plus size={18} />
            <span className="add-btn-text">Add Record</span>
          </button>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar mobile-only">
        <button 
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <Receipt size={20} />
          <span>Expenses</span>
        </button>

        <button 
          className="mobile-fab-btn"
          onClick={onOpenAddTransaction}
          title="Add New Record"
        >
          <Plus size={22} />
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
          onClick={() => setActiveTab('budgets')}
        >
          <PieChart size={20} />
          <span>Budgets</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <Target size={20} />
          <span>Goals</span>
        </button>
      </nav>
    </>
  );
}
