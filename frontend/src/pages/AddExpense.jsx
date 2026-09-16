import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { createExpense } from '../services/expenseApi';
import { useToast } from '../context/ToastContext';
import ExpenseForm from '../components/ExpenseForm';

export default function AddExpense() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(payload) {
    setIsSubmitting(true);
    const { data, error } = await createExpense(payload);
    setIsSubmitting(false);

    if (error) {
      toast.error(`Failed to create expense: ${error}`);
      return;
    }

    toast.success('Expense created successfully! 🎉');
    navigate('/expenses');
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3" style={{ marginBottom: '0.5rem' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}
            aria-hidden="true"
          >
            <PlusCircle size={20} />
          </div>
          <h1 style={{ margin: 0 }}>Add Expense</h1>
        </div>
        <p>Record a new expense with all its details.</p>
      </div>

      <div className="card" style={{ maxWidth: 760 }}>
        <ExpenseForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Create Expense"
        />
      </div>
    </div>
  );
}
