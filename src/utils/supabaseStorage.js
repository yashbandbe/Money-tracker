import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_GOALS } from './initialData';

// --- TRANSACTIONS ---
export const fetchCloudTransactions = async () => {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('Supabase fetch transactions warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        title: item.title,
        amount: Number(item.amount),
        type: item.type,
        category: item.category,
        date: item.date,
        paymentMethod: item.payment_method || item.paymentMethod || 'Bank Transfer',
        note: item.note || ''
      }));
    }
    return [];
  } catch (e) {
    console.error('Supabase fetch transactions exception:', e);
    return null;
  }
};

export const syncTransactionToCloud = async (tx) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: tx.id,
      title: tx.title,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      date: tx.date,
      payment_method: tx.paymentMethod,
      note: tx.note || ''
    };
    const { error } = await supabase.from('transactions').upsert(payload);
    if (error) console.error('Cloud tx upsert error:', error.message);
  } catch (e) {
    console.error('Cloud tx upsert exception:', e);
  }
};

export const deleteTransactionFromCloud = async (id) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) console.error('Cloud tx delete error:', error.message);
  } catch (e) {
    console.error('Cloud tx delete exception:', e);
  }
};

// --- BUDGETS ---
export const fetchCloudBudgets = async () => {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('budgets').select('*');
    if (error) return null;
    if (data && data.length > 0) {
      return data.map(b => ({
        id: b.id,
        category: b.category,
        limit: Number(b.limit || b.limit_amount || 500)
      }));
    }
    return [];
  } catch (e) {
    return null;
  }
};

export const syncBudgetToCloud = async (b) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: b.id,
      category: b.category,
      limit_amount: b.limit
    };
    await supabase.from('budgets').upsert(payload);
  } catch (e) {}
};

// --- GOALS ---
export const fetchCloudGoals = async () => {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('goals').select('*');
    if (error) return null;
    if (data && data.length > 0) {
      return data.map(g => ({
        id: g.id,
        name: g.name,
        targetAmount: Number(g.target_amount || g.targetAmount || 1000),
        currentAmount: Number(g.current_amount || g.currentAmount || 0),
        targetDate: g.target_date || g.targetDate || '2026-12-31',
        color: g.color || '#3b82f6'
      }));
    }
    return [];
  } catch (e) {
    return null;
  }
};

export const syncGoalToCloud = async (g) => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const payload = {
      id: g.id,
      name: g.name,
      target_amount: g.targetAmount,
      current_amount: g.currentAmount,
      target_date: g.targetDate,
      color: g.color
    };
    await supabase.from('goals').upsert(payload);
  } catch (e) {}
};
