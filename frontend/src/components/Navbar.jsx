import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PlusCircle, Info, DollarSign, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: ReceiptText },
    { to: '/add', label: 'Add Expense', icon: PlusCircle },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="navbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1.5rem',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'var(--brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <DollarSign size={20} />
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>ExpenseTrack</span>
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: active ? 'var(--brand)' : 'var(--text-secondary)',
                backgroundColor: active ? 'var(--brand-muted)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
