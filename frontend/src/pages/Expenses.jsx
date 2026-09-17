import { useEffect, useState, useMemo, useCallback } from 'react';
import { getAllExpenses, deleteExpense } from '../services/expenseApi';
import { useToast } from '../context/ToastContext';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ExpenseTable from '../components/ExpenseTable';
import DeleteModal from '../components/DeleteModal';
import { Receipt } from 'lucide-react';

const DEFAULT_FILTERS = {
  category: '',
  paymentMethod: '',
  dateRange: 'all',
  sort: 'date-desc',
};

const PAGE_SIZE = 10;

export default function Expenses() {
  const toast = useToast();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await getAllExpenses();
    if (err) { setError(err); toast.error(err); }
    else setExpenses(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // ── Filtering + Sorting ──────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const now = new Date();

    let result = expenses.filter(e => {
      // Text search
      const matchesQ = !q || [e.title, e.description, e.category, e.paymentMethod]
        .some(f => f?.toLowerCase().includes(q));

      // Category filter
      const matchesCat = !filters.category || e.category === filters.category;

      // Payment method filter
      const matchesPay = !filters.paymentMethod || e.paymentMethod === filters.paymentMethod;

      // Date range filter
      let matchesDate = true;
      if (filters.dateRange === 'today') {
        matchesDate = e.date === now.toISOString().split('T')[0];
      } else if (filters.dateRange === 'week') {
        const start = new Date(now); start.setDate(now.getDate() - 7);
        matchesDate = new Date(e.date) >= start;
      } else if (filters.dateRange === 'month') {
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        matchesDate = e.date?.startsWith(monthKey);
      }

      return matchesQ && matchesCat && matchesPay && matchesDate;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (filters.sort === 'date-asc')    return a.date < b.date ? -1 : 1;
      if (filters.sort === 'amount-desc') return b.amount - a.amount;
      if (filters.sort === 'amount-asc')  return a.amount - b.amount;
      return a.date > b.date ? -1 : 1; // date-desc (default)
    });

    return result;
  }, [expenses, search, filters]);

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1); }, [search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Delete ───────────────────────────────────────────────────
  async function handleDelete(id) {
    setIsDeleting(true);
    const { error: err } = await deleteExpense(id);
    setIsDeleting(false);
    if (err) {
      toast.error(`Delete failed: ${err}`);
    } else {
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success('Expense deleted successfully');
    }
    setDeleteTarget(null);
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>All Expenses</h1>
        <p>Search, filter, and manage all your expense records.</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="card" style={{ borderColor: 'var(--error-500)', marginBottom: '1.5rem' }}>
          <p className="text-error">⚠️ {error}</p>
        </div>
      )}

      {/* Search + Filters */}
      <div className="search-filter-bar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      {/* Results count */}
      {!loading && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <Receipt size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {filtered.length === expenses.length
            ? `${expenses.length} expense${expenses.length !== 1 ? 's' : ''} total`
            : `${filtered.length} of ${expenses.length} expenses`}
        </p>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <ExpenseTable
          expenses={paginated}
          loading={loading}
          onDelete={setDeleteTarget}
        />

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="pagination-controls">
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => Math.abs(n - page) <= 2)
                .map(n => (
                  <button
                    key={n}
                    className={`page-btn${n === page ? ' active' : ''}`}
                    onClick={() => setPage(n)}
                    aria-label={`Page ${n}`}
                    aria-current={n === page ? 'page' : undefined}
                  >
                    {n}
                  </button>
                ))}
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >›</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          expense={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
