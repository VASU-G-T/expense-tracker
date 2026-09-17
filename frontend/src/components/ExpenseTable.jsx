import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryBadgeClass, getPaymentBadgeClass, truncate } from '../utils/formatters';
import { SkeletonRow } from './Loading';
import EmptyState from './EmptyState';

export default function ExpenseTable({ expenses, loading, onDelete }) {
  return (
    <div className="table-wrapper">
      <table aria-label="Expenses table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Category</th>
            <th scope="col">Payment</th>
            <th scope="col">Date</th>
            <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
            <th scope="col" style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
          ) : expenses.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 0 }}>
                <EmptyState
                  title="No expenses here"
                  message="Try adjusting your search or filters, or add a new expense."
                />
              </td>
            </tr>
          ) : (
            expenses.map(exp => (
              <tr key={exp.id}>
                {/* Title + description */}
                <td>
                  <Link
                    to={`/expenses/${exp.id}`}
                    style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}
                  >
                    {truncate(exp.title, 40)}
                  </Link>
                  {exp.description && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {truncate(exp.description, 45)}
                    </div>
                  )}
                </td>

                {/* Category badge */}
                <td>
                  <span className={`badge ${getCategoryBadgeClass(exp.category)}`}>
                    {exp.category}
                  </span>
                </td>

                {/* Payment badge */}
                <td>
                  <span className={`badge ${getPaymentBadgeClass(exp.paymentMethod)}`}>
                    {exp.paymentMethod}
                  </span>
                </td>

                {/* Date */}
                <td style={{ whiteSpace: 'nowrap' }}>
                  {formatDate(exp.date)}
                </td>

                {/* Amount */}
                <td style={{ textAlign: 'right' }}>
                  <span className="amount">{formatCurrency(exp.amount)}</span>
                </td>

                {/* Action buttons */}
                <td style={{ textAlign: 'center' }}>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/expenses/${exp.id}`}
                      className="btn btn-ghost btn-icon btn-sm"
                      title="View details"
                      aria-label={`View ${exp.title}`}
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      to={`/expenses/${exp.id}/edit`}
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Edit"
                      aria-label={`Edit ${exp.title}`}
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Delete"
                      aria-label={`Delete ${exp.title}`}
                      onClick={() => onDelete(exp)}
                      style={{ color: 'var(--error-400)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
