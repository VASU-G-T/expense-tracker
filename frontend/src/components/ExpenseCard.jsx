import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryBadgeClass, getPaymentBadgeClass } from '../utils/formatters';

export default function ExpenseCard({ expense, onDelete }) {
  if (!expense) return null;

  return (
    <div className="card expense-card" style={{
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      backgroundColor: 'var(--surface-elevated)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {expense.title}
          </h4>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {formatDate(expense.date)}
          </span>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--brand)' }}>
          {formatCurrency(expense.amount)}
        </div>
      </div>

      {expense.description && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {expense.description}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
        <span className={`badge ${getCategoryBadgeClass(expense.category)}`}>
          {expense.category}
        </span>
        <span className={`badge ${getPaymentBadgeClass(expense.paymentMethod)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <CreditCard size={12} />
          {expense.paymentMethod}
        </span>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.75rem',
        marginTop: '0.25rem'
      }}>
        <Link
          to={`/expenses/${expense.id}`}
          className="btn btn-ghost btn-sm btn-icon"
          title="View Details"
          aria-label={`View details for ${expense.title}`}
        >
          <Eye size={16} />
        </Link>
        <Link
          to={`/expenses/${expense.id}/edit`}
          className="btn btn-ghost btn-sm btn-icon"
          title="Edit Expense"
          aria-label={`Edit ${expense.title}`}
        >
          <Pencil size={16} />
        </Link>
        <button
          onClick={() => onDelete(expense)}
          className="btn btn-ghost btn-sm btn-icon text-danger"
          title="Delete Expense"
          aria-label={`Delete ${expense.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
