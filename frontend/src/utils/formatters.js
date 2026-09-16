/**
 * Formatting utilities for amounts, dates, and badges.
 */

/** Format a number as Indian Rupee currency */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format an ISO date string to a human-readable format */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/** Format an ISO timestamp to readable date-time */
export function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch {
    return iso;
  }
}

/** Map category name to CSS badge class */
export function getCategoryBadgeClass(category) {
  const map = {
    'Food': 'badge-food',
    'Transport': 'badge-transport',
    'Shopping': 'badge-shopping',
    'Education': 'badge-education',
    'Bills': 'badge-bills',
    'Entertainment': 'badge-entertainment',
    'Health': 'badge-health',
    'Travel': 'badge-travel',
    'Groceries': 'badge-groceries',
    'Other': 'badge-other',
  };
  return map[category] || 'badge-other';
}

/** Map payment method to CSS badge class */
export function getPaymentBadgeClass(method) {
  const map = {
    'Cash': 'badge-cash',
    'UPI': 'badge-upi',
    'Debit Card': 'badge-debit-card',
    'Credit Card': 'badge-credit-card',
    'Bank Transfer': 'badge-bank-transfer',
    'Other': 'badge-other',
  };
  return map[method] || 'badge-other';
}

/** Category emoji icons */
export function getCategoryIcon(category) {
  const icons = {
    Food: '🍔', Transport: '🚗', Shopping: '🛍️', Education: '📚',
    Bills: '📄', Entertainment: '🎬', Health: '💊', Travel: '✈️',
    Groceries: '🛒', Other: '💰',
  };
  return icons[category] || '💰';
}

/** Get today's date as YYYY-MM-DD */
export function todayISODate() {
  return new Date().toISOString().split('T')[0];
}

/** Get the start of current month as YYYY-MM-DD */
export function startOfMonthISODate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/** Truncate long text */
export function truncate(str, maxLen = 50) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}
