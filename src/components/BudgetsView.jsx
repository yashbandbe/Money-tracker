import React, { useState } from 'react';
import { 
  PieChart, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Edit2, 
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { CATEGORIES } from '../utils/initialData';
import { formatCurrency, getCategoryIcon } from '../utils/formatters';

export default function BudgetsView({ 
  budgets, 
  setBudgets, 
  transactions, 
  currency 
}) {
  const [editingBudget, setEditingBudget] = useState(null);
  const [newLimitInput, setNewLimitInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCatForAdd, setSelectedCatForAdd] = useState('health');
  const [addLimitInput, setAddLimitInput] = useState('300');

  // Calculate spent amounts for each budget category
  const getSpentForCategory = (catKey) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === catKey)
      .reduce((acc, t) => acc + Number(t.amount), 0);
  };

  const totalBudgeted = budgets.reduce((acc, b) => acc + Number(b.limit), 0);
  const totalSpentInBudgets = budgets.reduce((acc, b) => acc + getSpentForCategory(b.category), 0);
  const totalRemaining = totalBudgeted - totalSpentInBudgets;

  const overbudgetCount = budgets.filter(b => getSpentForCategory(b.category) > b.limit).length;

  const handleUpdateLimit = (e) => {
    e.preventDefault();
    if (!editingBudget || !newLimitInput) return;
    const numLimit = parseFloat(newLimitInput);
    if (isNaN(numLimit) || numLimit <= 0) return;

    setBudgets(budgets.map(b => b.id === editingBudget.id ? { ...b, limit: numLimit } : b));
    setEditingBudget(null);
    setNewLimitInput('');
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    const limitNum = parseFloat(addLimitInput);
    if (isNaN(limitNum) || limitNum <= 0) return;

    // Check if budget already exists for this category
    const existing = budgets.find(b => b.category === selectedCatForAdd);
    if (existing) {
      setBudgets(budgets.map(b => b.category === selectedCatForAdd ? { ...b, limit: limitNum } : b));
    } else {
      setBudgets([...budgets, { id: `b-${Date.now()}`, category: selectedCatForAdd, limit: limitNum }]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="budgets-view">
      {/* Budget Summary Cards Header */}
      <div className="metrics-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Monthly Budget</span>
            <div className="metric-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <PieChart size={20} />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(totalBudgeted, currency)}</div>
          <div className="metric-subtext">Across {budgets.length} budgeted categories</div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Spent So Far</span>
            <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Sliders size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: totalSpentInBudgets > totalBudgeted ? '#ef4444' : 'var(--text-primary)' }}>
            {formatCurrency(totalSpentInBudgets, currency)}
          </div>
          <div className="metric-subtext">
            {((totalSpentInBudgets / (totalBudgeted || 1)) * 100).toFixed(1)}% of total monthly budget
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Remaining Available</span>
            <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: totalRemaining >= 0 ? '#10b981' : '#ef4444' }}>
            {formatCurrency(totalRemaining, currency)}
          </div>
          <div className="metric-subtext">
            {totalRemaining >= 0 ? 'Budget is on track' : 'Overbudget in total'}
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">Budget Health Alerts</span>
            <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: overbudgetCount > 0 ? '#ef4444' : '#10b981' }}>
            {overbudgetCount} Overbudget
          </div>
          <div className="metric-subtext">
            {overbudgetCount === 0 ? 'All categories in safe limits' : 'Requires budget adjustment'}
          </div>
        </div>
      </div>

      {/* Header and Add Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 className="font-heading">Category Budgets</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Set monthly spending limits and monitor real-time progress</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>New Budget Limit</span>
        </button>
      </div>

      {/* Category Budget Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {budgets.map((b) => {
          const cat = CATEGORIES[b.category] || CATEGORIES.other;
          const spent = getSpentForCategory(b.category);
          const percent = Math.min(100, Math.round((spent / b.limit) * 100));
          const isOver = spent > b.limit;
          const isWarning = !isOver && percent >= 80;

          let statusColor = '#10b981'; // Green
          if (isWarning) statusColor = '#f59e0b'; // Yellow
          if (isOver) statusColor = '#ef4444'; // Red

          return (
            <div key={b.id} className="glass-card budget-card glass-card-interactive">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: `${cat.color}20`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getCategoryIcon(cat.icon, 20)}
                  </div>
                  <div>
                    <h4 className="font-heading" style={{ fontSize: '1.05rem' }}>{cat.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Limit: {formatCurrency(b.limit, currency)}
                    </span>
                  </div>
                </div>

                <button 
                  className="icon-btn"
                  onClick={() => {
                    setEditingBudget(b);
                    setNewLimitInput(b.limit.toString());
                  }}
                  title="Edit Budget Limit"
                >
                  <Edit2 size={15} />
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.86rem' }}>
                  <span>Spent: <strong style={{ color: statusColor }}>{formatCurrency(spent, currency)}</strong></span>
                  <span style={{ fontWeight: '700', color: statusColor }}>{percent}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill"
                    style={{
                      width: `${percent}%`,
                      background: statusColor,
                      boxShadow: `0 0 10px ${statusColor}80`
                    }}
                  />
                </div>
              </div>

              {/* Card Footer Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isOver ? (
                  <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <AlertTriangle size={14} /> Over budget by {formatCurrency(spent - b.limit, currency)}
                  </span>
                ) : (
                  <span>Remaining: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(b.limit - spent, currency)}</strong></span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="modal-overlay" onClick={() => setEditingBudget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Budget Limit</h3>
              <button className="icon-btn" onClick={() => setEditingBudget(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdateLimit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={CATEGORIES[editingBudget.category]?.name || editingBudget.category}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Limit ({currency})</label>
                <input 
                  type="number"
                  step="10"
                  className="form-input"
                  value={newLimitInput}
                  onChange={(e) => setNewLimitInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingBudget(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Limit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Budget Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Set Category Budget Limit</h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddBudget}>
              <div className="form-group">
                <label className="form-label">Select Expense Category</label>
                <select 
                  className="select-input"
                  style={{ width: '100%' }}
                  value={selectedCatForAdd}
                  onChange={(e) => setSelectedCatForAdd(e.target.value)}
                >
                  {Object.entries(CATEGORIES)
                    .filter(([_, cat]) => cat.type === 'expense')
                    .map(([key, cat]) => (
                      <option key={key} value={key}>{cat.name}</option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Limit ({currency})</label>
                <input 
                  type="number"
                  step="10"
                  className="form-input"
                  value={addLimitInput}
                  onChange={(e) => setAddLimitInput(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
