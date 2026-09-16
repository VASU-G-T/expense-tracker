import { Link } from 'react-router-dom';
import { PlusCircle, SearchX } from 'lucide-react';

export default function EmptyState({
  title = 'No expenses found',
  message = 'Start tracking your spending by adding your first expense.',
  icon = null,
  actionLabel = 'Add Your First Expense',
  actionTo = '/add',
  showAction = true,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {icon || <SearchX size={32} />}
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {showAction && (
        <Link to={actionTo} className="btn btn-primary" id="empty-state-action-btn">
          <PlusCircle size={16} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
