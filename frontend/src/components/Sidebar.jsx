import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, PlusCircle, Info, TrendingUp, X
} from 'lucide-react';

const navItems = [
  { to: '/',           label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/expenses',   label: 'All Expenses', icon: Receipt },
  { to: '/add',        label: 'Add Expense',  icon: PlusCircle },
  { to: '/about',      label: 'About',        icon: Info },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 99 }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <NavLink to="/" className="sidebar-logo" onClick={onClose}>
          <div className="sidebar-logo-icon">
            <TrendingUp size={20} />
          </div>
          <span className="sidebar-logo-text">
            Expense<span>Track</span>
          </span>
        </NavLink>

        {/* Mobile close */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={onClose}
          aria-label="Close menu"
          style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            display: isOpen ? 'flex' : 'none',
          }}
        >
          <X size={18} />
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-title">Navigation</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">
            ExpenseTrack v1.0
            <br />
            <span style={{ opacity: 0.6 }}>React + Spring Boot</span>
          </p>
        </div>
      </aside>
    </>
  );
}
