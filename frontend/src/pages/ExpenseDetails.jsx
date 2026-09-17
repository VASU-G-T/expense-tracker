import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft, Calendar, Tag, CreditCard, Clock } from 'lucide-react';
import { getExpenseById, deleteExpense } from '../services/expenseApi';
import { useToast } from '../context/ToastContext';
import {
  formatCurrency, formatDate, formatDateTime,
  getCategoryBadgeClass, getPaymentBadgeClass, getCategoryIcon
} from '../utils/formatters';
import Loading from '../components/Loading';
import DeleteModal from '../components/DeleteModal';

function DetailRow({ icon, label, value, badge, badgeClass }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '1rem',
      padding: '0.875rem 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 'var(--radius-md)',
        background: 'var(--bg-hover)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
          {label}
        </p>
        {badge ? (
          <span className={`badge ${badgeClass}`}>{value}</span>
        ) : (
          <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem' }}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ExpenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await getExpenseById(id);
      if (error) {
        setFetchError(error);
        toast.error(`Could not load expense: ${error}`);
      } else {
        setExpense(data);
      }
      setLoading(false);
    })();
  }, [id]);

  async function handleDelete(expId) {
    setIsDeleting(true);
    const { error } = await deleteExpense(expId);
    setIsDeleting(false);
    if (error) {
      toast.error(`Delete failed: ${error}`);
    } else {
      toast.success('Expense deleted.');
      navigate('/expenses');
    }
    setShowDelete(false);
  }

  if (loading) return <Loading fullPage text="Loading expense…" />;

  if (fetchError || !expense) {
    return (
      <div className="page-container">
        <div className="card" style={{ borderColor: 'var(--error-500)', maxWidth: 480 }}>
          <h3 className="text-error">⚠️ Not Found</h3>
          <p>{fetchError || 'The expense could not be found.'}</p>
          <Link to="/expenses" className="btn btn-secondary mt-4">← Back to Expenses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <Link to="/expenses" className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} /> All Expenses
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{expense.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Main detail card */}
        <div className="card">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontSize: '2rem' }}>{getCategoryIcon(expense.category)}</span>
            <div>
              <h2 style={{ margin: 0 }}>{expense.title}</h2>
              {expense.description && (
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>{expense.description}</p>
              )}
            </div>
          </div>

          {/* Amount hero */}
          <div style={{
            background: 'var(--bg-hover)', borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Amount
            </span>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)',
                           letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              {formatCurrency(expense.amount)}
            </span>
          </div>

          {/* Detail rows */}
          <DetailRow icon={<Tag size={16} />}        label="Category"       value={expense.category}      badge badgeClass={getCategoryBadgeClass(expense.category)} />
          <DetailRow icon={<CreditCard size={16} />} label="Payment Method" value={expense.paymentMethod}  badge badgeClass={getPaymentBadgeClass(expense.paymentMethod)} />
          <DetailRow icon={<Calendar size={16} />}   label="Date"           value={formatDate(expense.date)} />
          <DetailRow icon={<Clock size={16} />}      label="Created At"     value={formatDateTime(expense.createdAt)} />
          <DetailRow icon={<Clock size={16} />}      label="Last Updated"   value={formatDateTime(expense.updatedAt)} />
        </div>

        {/* Actions card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.8125rem',
                         textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link
                to={`/expenses/${expense.id}/edit`}
                className="btn btn-primary w-full"
                style={{ justifyContent: 'center' }}
                id="detail-edit-btn"
              >
                <Pencil size={16} /> Edit Expense
              </Link>
              <button
                className="btn btn-danger w-full"
                style={{ justifyContent: 'center' }}
                onClick={() => setShowDelete(true)}
                id="detail-delete-btn"
              >
                <Trash2 size={16} /> Delete Expense
              </button>
              <Link
                to="/expenses"
                className="btn btn-secondary w-full"
                style={{ justifyContent: 'center' }}
              >
                <ArrowLeft size={16} /> Back to List
              </Link>
            </div>
          </div>

          {/* ID card */}
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
              Record ID
            </p>
            <code style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              {expense.id}
            </code>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDelete && (
        <DeleteModal
          expense={expense}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
