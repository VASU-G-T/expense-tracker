import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertCircle } from 'lucide-react';
import { validateExpense, VALID_CATEGORIES, VALID_PAYMENT_METHODS } from '../utils/validation';
import { todayISODate } from '../utils/formatters';

const EMPTY_FORM = {
  title: '',
  description: '',
  amount: '',
  category: '',
  paymentMethod: '',
  date: todayISODate(),
};

export default function ExpenseForm({
  initialValues = null,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Expense',
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  }

  function handleBlur(e) {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(values).map(k => [k, true]));
    setTouched(allTouched);

    const validationErrors = validateExpense(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || '',
      amount: parseFloat(values.amount),
      category: values.category,
      paymentMethod: values.paymentMethod,
      date: values.date,
    };

    await onSubmit(payload);
  }

  function fieldError(name) {
    return touched[name] && errors[name] ? errors[name] : null;
  }

  return (
    <form onSubmit={handleSubmit} noValidate id="expense-form">
      <div className="form-grid">
        {/* Title */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label" htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-control${fieldError('title') ? ' error' : ''}`}
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Grocery Run, Netflix Subscription"
            maxLength={100}
            aria-required="true"
            aria-describedby={fieldError('title') ? 'title-error' : undefined}
          />
          {fieldError('title') && (
            <span id="title-error" className="form-error" role="alert">
              <AlertCircle size={13} /> {fieldError('title')}
            </span>
          )}
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Amount (₹) *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            className={`form-control${fieldError('amount') ? ' error' : ''}`}
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.00"
            aria-required="true"
            aria-describedby={fieldError('amount') ? 'amount-error' : undefined}
          />
          {fieldError('amount') && (
            <span id="amount-error" className="form-error" role="alert">
              <AlertCircle size={13} /> {fieldError('amount')}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="date">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            className={`form-control${fieldError('date') ? ' error' : ''}`}
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            max={todayISODate()}
            aria-required="true"
            aria-describedby={fieldError('date') ? 'date-error' : undefined}
          />
          {fieldError('date') && (
            <span id="date-error" className="form-error" role="alert">
              <AlertCircle size={13} /> {fieldError('date')}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            className={`form-control${fieldError('category') ? ' error' : ''}`}
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-describedby={fieldError('category') ? 'category-error' : undefined}
          >
            <option value="">Select category…</option>
            {VALID_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {fieldError('category') && (
            <span id="category-error" className="form-error" role="alert">
              <AlertCircle size={13} /> {fieldError('category')}
            </span>
          )}
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label className="form-label" htmlFor="paymentMethod">Payment Method *</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className={`form-control${fieldError('paymentMethod') ? ' error' : ''}`}
            value={values.paymentMethod}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-describedby={fieldError('paymentMethod') ? 'paymentMethod-error' : undefined}
          >
            <option value="">Select payment method…</option>
            {VALID_PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {fieldError('paymentMethod') && (
            <span id="paymentMethod-error" className="form-error" role="alert">
              <AlertCircle size={13} /> {fieldError('paymentMethod')}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label" htmlFor="description">
            Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-control${fieldError('description') ? ' error' : ''}`}
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Add any notes about this expense…"
            rows={3}
            maxLength={500}
            style={{ resize: 'vertical', minHeight: '80px' }}
            aria-describedby={fieldError('description') ? 'description-error' : 'description-hint'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {fieldError('description') ? (
              <span id="description-error" className="form-error" role="alert">
                <AlertCircle size={13} /> {fieldError('description')}
              </span>
            ) : (
              <span id="description-hint" />
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {(values.description || '').length}/500
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          id="expense-form-submit"
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />
              {submitLabel}
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          id="expense-form-cancel"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
}
