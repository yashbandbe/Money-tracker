import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CreditCard, 
  PieChart as PieIcon, 
  Calendar,
  Zap,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CATEGORIES } from '../utils/initialData';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyticsView({ transactions, currency }) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount), 0);

  const income = transactions.filter(t => t.type === 'income');
  const totalIncome = income.reduce((acc, t) => acc + Number(t.amount), 0);

  // Spending by Payment Method
  const paymentMap = {};
  expenses.forEach(t => {
    paymentMap[t.paymentMethod] = (paymentMap[t.paymentMethod] || 0) + Number(t.amount);
  });

  const paymentLabels = Object.keys(paymentMap);
  const paymentData = Object.values(paymentMap);
  const paymentColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  const paymentChartData = {
    labels: paymentLabels,
    datasets: [
      {
        data: paymentData,
        backgroundColor: paymentColors.slice(0, paymentLabels.length),
        borderWidth: 0
      }
    ]
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const paymentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: isMobile ? 11 : 12 }, usePointStyle: true }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${formatCurrency(context.raw, currency)}`
        }
      }
    }
  };

  // Spending by Category List
  const catMap = {};
  expenses.forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
  });

  const sortedCatList = Object.entries(catMap)
    .map(([key, amount]) => ({
      key,
      name: CATEGORIES[key]?.name || key,
      color: CATEGORIES[key]?.color || '#64748b',
      amount,
      percentage: totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = sortedCatList[0];
  const avgDailyExpense = (totalExpense / 30).toFixed(2);

  return (
    <div className="analytics-view">
      {/* AI Financial Insights Banner */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6366f1', marginBottom: '12px' }}>
          <Sparkles size={22} />
          <h3 className="font-heading" style={{ fontSize: '1.25rem' }}>Smart Wealth Insights & AI Advice</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Top Spending Category</h4>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: topCategory?.color || 'var(--text-primary)' }}>
              {topCategory ? topCategory.name : 'N/A'}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Accounts for {topCategory?.percentage}% of your total expenses ({formatCurrency(topCategory?.amount || 0, currency)}).
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Average Daily Outflow</h4>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#3b82f6' }}>
              {formatCurrency(avgDailyExpense, currency)} / day
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Based on monthly run-rate. Keeping daily spend under {formatCurrency(80, currency)} keeps you on budget.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Cashflow Health Score</h4>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#10b981' }}>
              92 / 100 (Excellent)
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Positive net cash flow of {formatCurrency(totalIncome - totalExpense, currency)} generated this period.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Charts & Detailed Breakdown */}
      <div className="charts-grid">
        {/* Payment Method Pie Chart */}
        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="font-heading">Payment Method Breakdown</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>How you pay for daily purchases</p>
            </div>
          </div>
          <div className="chart-container">
            {paymentLabels.length > 0 ? (
              <Pie data={paymentChartData} options={paymentChartOptions} />
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No payment data recorded.</p>
            )}
          </div>
        </div>

        {/* Category Breakdown Progress List */}
        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="font-heading">Expense Share by Category</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sorted from highest to lowest</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            {sortedCatList.map((item) => (
              <div key={item.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                  </span>
                  <span>
                    <strong>{formatCurrency(item.amount, currency)}</strong> ({item.percentage}%)
                  </span>
                </div>
                <div className="progress-bar-bg" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${item.percentage}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
