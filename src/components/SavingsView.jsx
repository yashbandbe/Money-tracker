import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Award,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatters';

export default function SavingsView({ 
  goals, 
  setGoals, 
  currency 
}) {
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('100');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '2026-12-31',
    color: '#3b82f6'
  });

  const totalTarget = goals.reduce((acc, g) => acc + Number(g.targetAmount), 0);
  const totalSaved = goals.reduce((acc, g) => acc + Number(g.currentAmount), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0 || !depositGoal) return;

    setGoals(goals.map(g => {
      if (g.id === depositGoal.id) {
        const updated = Number(g.currentAmount) + amountNum;
        if (updated >= g.targetAmount) {
          triggerCelebration();
        }
        return { ...g, currentAmount: updated };
      }
      return g;
    }));

    setDepositGoal(null);
    setDepositAmount('100');
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;

    const goalObj = {
      id: `g-${Date.now()}`,
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount || 0),
      targetDate: newGoal.targetDate,
      color: newGoal.color || '#6366f1'
    };

    setGoals([...goals, goalObj]);
    setShowCreateModal(false);
    setNewGoal({ name: '', targetAmount: '', currentAmount: '0', targetDate: '2026-12-31', color: '#3b82f6' });
    triggerCelebration();
  };

  return (
    <div className="savings-view">
      {/* Savings Summary Banner */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', marginBottom: '8px' }}>
              <Sparkles size={18} />
              <span style={{ fontSize: '0.88rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Financial Wealth Building
              </span>
            </div>
            <h2 className="font-heading" style={{ fontSize: '1.8rem' }}>Savings & Financial Goals</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Track your long-term wealth milestones, trip funds, and rainy-day reserves
            </p>
          </div>

          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            <span>Create Goal</span>
          </button>
        </div>

        {/* Overall Progress Widget */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Overall Portfolio Progress: <strong>{formatCurrency(totalSaved, currency)}</strong> / {formatCurrency(totalTarget, currency)}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-success)' }}>
              {overallProgress}% Achieved
            </span>
          </div>
          <div className="progress-bar-bg" style={{ height: '14px' }}>
            <div 
              className="progress-bar-fill"
              style={{
                width: `${overallProgress}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
                boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {goals.map((g) => {
          const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const isCompleted = g.currentAmount >= g.targetAmount;
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);

          return (
            <div key={g.id} className="glass-card glass-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: `${g.color}20`,
                        color: g.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Target size={20} />
                    </div>
                    <h3 className="font-heading" style={{ fontSize: '1.1rem' }}>{g.name}</h3>
                  </div>

                  {isCompleted && (
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '4px' }}>
                  {formatCurrency(g.currentAmount, currency)}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Target: {formatCurrency(g.targetAmount, currency)} • Target Date: {g.targetDate}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '6px' }}>
                    <span>{remaining > 0 ? `${formatCurrency(remaining, currency)} remaining` : 'Target reached!'}</span>
                    <span style={{ fontWeight: '700', color: g.color }}>{percent}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: g.color,
                        boxShadow: `0 0 10px ${g.color}80`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Deposit Button */}
              <button 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setDepositGoal(g);
                  setDepositAmount('100');
                }}
              >
                <Plus size={16} />
                <span>Deposit Funds</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Deposit Funds Modal */}
      {depositGoal && (
        <div className="modal-overlay" onClick={() => setDepositGoal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Deposit to {depositGoal.name}</h3>
              <button className="icon-btn" onClick={() => setDepositGoal(null)}>✕</button>
            </div>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label className="form-label">Contribution Amount ({currency})</label>
                <input 
                  type="number"
                  step="10"
                  className="form-input"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setDepositGoal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Goal Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Savings Goal</h3>
              <button className="icon-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Vacation to Hawaii, House Downpayment"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target Amount ({currency})</label>
                  <input 
                    type="number"
                    step="50"
                    className="form-input"
                    placeholder="5000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Amount ({currency})</label>
                  <input 
                    type="number"
                    step="50"
                    className="form-input"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Card Theme Accent</label>
                  <input 
                    type="color"
                    className="form-input"
                    style={{ height: '42px', padding: '4px', cursor: 'pointer' }}
                    value={newGoal.color}
                    onChange={(e) => setNewGoal({ ...newGoal, color: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
