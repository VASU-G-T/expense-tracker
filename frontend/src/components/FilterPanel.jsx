import { VALID_CATEGORIES, VALID_PAYMENT_METHODS } from '../utils/validation';
import { Filter, RotateCcw } from 'lucide-react';

const DATE_RANGES = [
  { value: 'all',   label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week',  label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const SORT_OPTIONS = [
  { value: 'date-desc',   label: 'Newest First' },
  { value: 'date-asc',    label: 'Oldest First' },
  { value: 'amount-desc', label: 'Amount: High → Low' },
  { value: 'amount-asc',  label: 'Amount: Low → High' },
];

export default function FilterPanel({ filters, onChange, onReset }) {
  function handleChange(key, val) {
    onChange({ ...filters, [key]: val });
  }

  const hasActiveFilters =
    filters.category !== '' ||
    filters.paymentMethod !== '' ||
    filters.dateRange !== 'all' ||
    filters.sort !== 'date-desc';

  return (
    <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
      {/* Category */}
      <select
        id="filter-category"
        className="filter-select"
        value={filters.category}
        onChange={e => handleChange('category', e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {VALID_CATEGORIES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Payment method */}
      <select
        id="filter-payment"
        className="filter-select"
        value={filters.paymentMethod}
        onChange={e => handleChange('paymentMethod', e.target.value)}
        aria-label="Filter by payment method"
      >
        <option value="">All Payment Methods</option>
        {VALID_PAYMENT_METHODS.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Date range */}
      <select
        id="filter-date"
        className="filter-select"
        value={filters.dateRange}
        onChange={e => handleChange('dateRange', e.target.value)}
        aria-label="Filter by date range"
      >
        {DATE_RANGES.map(r => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        id="filter-sort"
        className="filter-select"
        value={filters.sort}
        onChange={e => handleChange('sort', e.target.value)}
        aria-label="Sort expenses"
      >
        {SORT_OPTIONS.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={onReset}
          id="filter-reset-btn"
          aria-label="Reset all filters"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}
    </div>
  );
}
