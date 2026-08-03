import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  Plus,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/initialData';
import { formatCurrency, getCategoryIcon } from '../utils/formatters';

export default function TransactionsView({ 
  transactions, 
  setTransactions, 
  currency, 
  onOpenAddTransaction,
  onEditTransaction,
  onResetDemoData 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filtering
  const filtered = transactions.filter((tx) => {
    const matchesSearch = 
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesPayment = selectedPayment === 'all' || tx.paymentMethod === selectedPayment;

    return matchesSearch && matchesCategory && matchesType && matchesPayment;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  // Delete Transaction
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Type', 'Amount', 'Category', 'Date', 'Payment Method', 'Note'];
    const rows = sorted.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      t.category,
      t.date,
      `"${t.paymentMethod}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wealthpilot_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="transactions-view">
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 className="font-heading">Transactions Manager</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Manage, search, filter, and export all income & expense logs
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn-secondary" onClick={handleExportCSV}>
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button className="btn-secondary" onClick={onResetDemoData} title="Reset demo dataset">
              <RefreshCw size={16} />
              <span>Reset Data</span>
            </button>
            <button className="btn-primary" onClick={onOpenAddTransaction}>
              <Plus size={16} />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              className="form-input"
              placeholder="Search description..."
              style={{ paddingLeft: '36px', width: '100%' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select className="select-input" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All Types (Expense/Income)</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* Category Filter */}
          <select className="select-input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.name}</option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select className="select-input" value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
            <option value="all">All Payment Methods</option>
            {PAYMENT_METHODS.map(pm => (
              <option key={pm} value={pm}>{pm}</option>
            ))}
          </select>

          {/* Sort By */}
          <select className="select-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest Date First</option>
            <option value="date-asc">Oldest Date First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '14px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Showing {sorted.length} of {transactions.length} total transactions
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title & Note</th>
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length > 0 ? (
                sorted.map((tx) => {
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
                      <td>
                        <span 
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: isExpense ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                            color: isExpense ? '#ef4444' : '#10b981'
                          }}
                        >
                          {tx.type}
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
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button 
                            className="icon-btn" 
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => onEditTransaction(tx)}
                            title="Edit Record"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            className="icon-btn" 
                            style={{ width: '32px', height: '32px', color: '#ef4444' }}
                            onClick={() => handleDelete(tx.id)}
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No transactions match your search filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
