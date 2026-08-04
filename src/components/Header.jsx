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
  CloudCheck,
  Cloud
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
    <header className="app-header">
      <div className="brand-logo">
        <div className="brand-icon-wrapper">
          <Compass size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="brand-title">WealthPilot</h1>
            {isSupabaseConfigured && (
              <span 
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
                title="Connected to Supabase Cloud Database"
              >
                <CloudCheck size={12} /> Supabase Sync
              </span>
            )}
          </div>
        </div>
      </div>

      <nav className="nav-tabs">
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

      <div className="header-actions">
        <select 
          className="select-input"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          title="Select Currency"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <button 
          className="icon-btn" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="btn-primary" onClick={onOpenAddTransaction}>
          <Plus size={18} />
          <span>Add Record</span>
        </button>
      </div>
    </header>
  );
}
