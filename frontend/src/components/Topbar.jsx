import { Link } from 'react-router-dom';
import { Menu, PlusCircle, TrendingUp } from 'lucide-react';

export default function Topbar({ title, onMenuToggle }) {
  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button
          className="btn btn-ghost btn-icon"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          id="topbar-menu-toggle"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>
        <span className="topbar-title">{title}</span>
      </div>

      <div className="topbar-actions">
        <Link to="/add" className="btn btn-primary btn-sm" id="topbar-add-btn">
          <PlusCircle size={16} />
          Add Expense
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #topbar-menu-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
