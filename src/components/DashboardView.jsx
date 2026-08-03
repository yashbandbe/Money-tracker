import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PiggyBank, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { CATEGORIES } from '../utils/initialData';
import { formatCurrency, getCategoryIcon } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardView({ 
  transactions, 
  budgets, 
  currency, 
  setActiveTab,
  onOpenAddTransaction 
}) {
  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Donut Chart Data (Expenses by Category)
  const expenseByCategory = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Number(t.amount);
    });

  const donutLabels = Object.keys(expenseByCategory).map(catKey => CATEGORIES[catKey]?.name || catKey);
  const donutData = Object.values(expenseByCategory);
  const donutColors = Object.keys(expenseByCategory).map(catKey => CATEGORIES[catKey]?.color || '#64748b');

  const donutChartData = {
    labels: donutLabels,
    datasets: [
      {
        data: donutData,
        backgroundColor: donutColors.length > 0 ? donutColors : ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          padding: 14,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${formatCurrency(context.raw, currency)}`
        }
      }
    },
    cutout: '72%'
  };

  // Cashflow Bar Chart Data (Monthly Income vs Expense)
  const monthlyData = {
    'May': { income: 4800, expense: 2200 },
    'Jun': { income: 5100, expense: 2600 },
    'Jul': { income: 5540, expense: 2850 },
    'Aug': { income: totalIncome, expense: totalExpense }
  };

  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map(m => m.income),
        backgroundColor: '#10b981',
        borderRadius: 8
      },
      {
        label: 'Expense',
        data: Object.values(monthlyData).map(m => m.expense),
        backgroundColor: '#ef4444',
        borderRadius: 8
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, usePointStyle: true }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatCurrency(context.raw, currency)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="dashboard-view">
      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="glass-card metric-card glass-card-interactive">
          <div className="metric-header">
            <span className="metric-title">Total Net Balance</span>
            <div className="metric-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(netBalance, currency)}</div>
          <div className="metric-subtext">
            <span className="badge-positive">+12.4%</span>
            <span>vs. previous month</span>
          </div>
        </div>

        <div className="glass-card metric-card glass-card-interactive">
          <div className="metric-header">
            <span className="metric-title">Total Income</span>
            <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#10b981' }}>
            {formatCurrency(totalIncome, currency)}
          </div>
          <div className="metric-subtext">
            <span className="badge-positive">+8.1%</span>
            <span>from 2 income sources</span>
          </div>
        </div>

        <div className="glass-card metric-card glass-card-interactive">
          <div className="metric-header">
            <span className="metric-title">Total Expenses</span>
            <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <ArrowDownRight size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#ef4444' }}>
            {formatCurrency(totalExpense, currency)}
          </div>
          <div className="metric-subtext">
            <span className="badge-negative">-3.5%</span>
            <span>spent this month</span>
          </div>
        </div>

        <div className="glass-card metric-card glass-card-interactive">
          <div className="metric-header">
            <span className="metric-title">Savings Rate</span>
            <div className="metric-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <PiggyBank size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#8b5cf6' }}>{savingsRate}%</div>
          <div className="metric-subtext">
            <Sparkles size={14} style={{ color: '#f59e0b' }} />
            <span>Target: 25.0% minimum</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="charts-grid">
        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="font-heading">Monthly Cash Flow</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Income vs Expense Breakdown</p>
            </div>
          </div>
          <div className="chart-container">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="font-heading">Spending by Category</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Distribution of Expenses</p>
            </div>
          </div>
          <div className="chart-container">
            {donutData.length > 0 ? (
              <Doughnut data={donutChartData} options={donutOptions} />
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No expense data recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 className="font-heading">Recent Activity</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest transactions across all accounts</p>
          </div>
          <button className="btn-secondary" onClick={() => setActiveTab('transactions')}>
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => {
                const cat = CATEGORIES[tx.category] || CATEGORIES.other;
                const isExpense = tx.type === 'expense';
                return (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div 
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: `${cat.color}20`,
                            color: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <div>
                          <div>{tx.title}</div>
                          {tx.note && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tx.note}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag" style={{ background: `${cat.color}15`, color: cat.color }}>
                        {cat.name}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{tx.date}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx.paymentMethod}</td>
                    <td 
                      style={{ 
                        textAlign: 'right', 
                        fontWeight: '700', 
                        color: isExpense ? '#ef4444' : '#10b981' 
                      }}
                    >
                      {isExpense ? '-' : '+'}{formatCurrency(tx.amount, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
