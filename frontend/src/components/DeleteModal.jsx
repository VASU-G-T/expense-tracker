import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ expense, onConfirm, onCancel, isDeleting }) {
  if (!expense) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-icon-wrapper modal-icon-danger">
          <AlertTriangle size={28} />
        </div>

        <h3 id="delete-modal-title">Delete Expense</h3>
        <p>
          Are you sure you want to delete{' '}
          <strong style={{ color: 'var(--text-primary)' }}>"{expense.title}"</strong>?
          <br />
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
            id="delete-cancel-btn"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onConfirm(expense.id)}
            disabled={isDeleting}
            id="delete-confirm-btn"
          >
            {isDeleting ? (
              <>
                <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
