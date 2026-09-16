import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { getExpenseById, updateExpense } from '../services/expenseApi';
import { useToast } from '../context/ToastContext';
import ExpenseForm from '../components/ExpenseForm';
import Loading from '../components/Loading';

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await getExpenseById(id);
      if (error) {
        setFetchError(error);
        toast.error(`Could not load expense: ${error}`);
      } else {
        setInitialValues({
          title:         data.title || '',
          description:   data.description || '',
          amount:        data.amount?.toString() || '',
          category:      data.category || '',
          paymentMethod: data.paymentMethod || '',
          date:          data.date || '',
        });
      }
      setLoading(false);
    })();
  }, [id]);

  async function handleSubmit(payload) {
    setIsSubmitting(true);
    const { error } = await updateExpense(id, payload);
    setIsSubmitting(false);

    if (error) {
      toast.error(`Failed to update expense: ${error}`);
      return;
    }

    toast.success('Expense updated successfully! ✅');
    navigate(`/expenses/${id}`);
  }

  if (loading) return <Loading fullPage text="Loading expense details…" />;

  if (fetchError) {
    return (
      <div className="page-container">
        <div className="card" style={{ borderColor: 'var(--error-500)', maxWidth: 480 }}>
          <h3 className="text-error">⚠️ Failed to load</h3>
          <p>{fetchError}</p>
          <button className="btn btn-secondary mt-4" onClick={() => navigate('/expenses')}>
            ← Back to Expenses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3" style={{ marginBottom: '0.5rem' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: 'hsla(185, 85%, 45%, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-400)',
            }}
            aria-hidden="true"
          >
            <Pencil size={20} />
          </div>
          <h1 style={{ margin: 0 }}>Edit Expense</h1>
        </div>
        <p>Update the details of your expense record.</p>
      </div>

      <div className="card" style={{ maxWidth: 760 }}>
        <ExpenseForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
