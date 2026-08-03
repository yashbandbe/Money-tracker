import React, { useState, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/initialData';

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTx, 
  currency 
}) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingTx) {
      setType(editingTx.type || 'expense');
      setTitle(editingTx.title || '');
      setAmount(editingTx.amount ? editingTx.amount.toString() : '');
      setCategory(editingTx.category || 'food');
      setDate(editingTx.date || new Date().toISOString().slice(0, 10));
      setPaymentMethod(editingTx.paymentMethod || PAYMENT_METHODS[0]);
      setNote(editingTx.note || '');
    } else {
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory('food');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod(PAYMENT_METHODS[0]);
      setNote('');
    }
  }, [editingTx, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !title.trim()) return;

    const record = {
      id: editingTx ? editingTx.id : `tx-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      type,
      category,
      date,
      paymentMethod,
      note: note.trim()
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title font-heading">
            {editingTx ? 'Edit Transaction' : 'Record New Transaction'}
          </h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Income vs Expense Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: type === 'expense' ? '#ef4444' : 'transparent',
                color: type === 'expense' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
              onClick={() => {
                setType('expense');
                if (category === 'salary' || category === 'freelance' || category === 'investments') {
                  setCategory('food');
                }
              }}
            >
              💸 Expense
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: type === 'income' ? '#10b981' : 'transparent',
                color: type === 'income' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
              onClick={() => {
                setType('income');
                setCategory('salary');
              }}
            >
              💰 Income
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Transaction Title</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Grocery Shopping, Client Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount ({currency})</label>
              <input 
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="select-input"
                style={{ width: '100%', height: '44px' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.entries(CATEGORIES)
                  .filter(([_, cat]) => cat.type === type)
                  .map(([key, cat]) => (
                    <option key={key} value={key}>{cat.name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select 
                className="select-input"
                style={{ width: '100%', height: '44px' }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Note / Description (Optional)</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Additional details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {editingTx ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
