import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search expenses…' }) {
  return (
    <div className="search-wrapper">
      <Search size={16} className="search-icon" aria-hidden="true" />
      <input
        id="expense-search-input"
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search expenses"
      />
      {value && (
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: '0.4rem', top: '50%',
            transform: 'translateY(-50%)', padding: '0.25rem',
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
