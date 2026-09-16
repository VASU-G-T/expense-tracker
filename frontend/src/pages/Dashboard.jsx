import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  DollarSign, TrendingUp, Receipt, BarChart3, PlusCircle
} from 'lucide-react';
import { getAllExpenses } from '../services/expenseApi';
import { formatCurrency, formatDate, getCategoryBadgeClass, getCategoryIcon } from '../utils/formatters';
import StatCard from '../components/StatCard';
import Loading, { SkeletonCard } from '../components/Loading';
import EmptyState from '../components/EmptyState';

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Chart defaults for dark mode
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = '#1e2a3a';

const CATEGORY_COLORS = {
  Food: '#f59e0b', Transport: '#3b82f6', Shopping: '#ec4899',
  Education: '#8b5cf6', Bills: '#ef4444', Entertainment: '#a855f7',
  Health: '#22c55e', Travel: '#06b6d4', Groceries: '#84cc16', Other: '#64748b',
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getAllExpenses();
      if (err) setError(err);
      else setExpenses(data || []);
      setLoading(false);
    })();
  }, []);

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!expenses.length) return { total: 0, thisMonth: 0, count: 0, average: 0 };

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthExpenses = expenses.filter(e => e.date?.startsWith(monthKey));

    const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const thisMonth = thisMonthExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const average = total / expenses.length;

    return { total, thisMonth, count: expenses.length, average };
  }, [expenses]);

  // ── Category breakdown (Doughnut) ────────────────────────────
  const doughnutData = useMemo(() => {
    const catMap = {};
    expenses.forEach(e => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    const labels = Object.keys(catMap);
    return {
      labels,
      datasets: [{
        data: labels.map(l => catMap[l]),
        backgroundColor: labels.map(l => CATEGORY_COLORS[l] || '#64748b'),
        borderColor: 'hsl(226, 22%, 12%)',
        borderWidth: 2,
        hoverOffset: 6,
      }],
    };
  }, [expenses]);

  // ── Monthly spending (Bar) ───────────────────────────────────
  const barData = useMemo(() => {
    const monthMap = {};
    expenses.forEach(e => {
      if (!e.date) return;
      const key = e.date.slice(0, 7); // YYYY-MM
      monthMap[key] = (monthMap[key] || 0) + e.amount;
    });
    const sorted = Object.keys(monthMap).sort().slice(-6);
    const labels = sorted.map(k => {
      const [y, m] = k.split('-');
      return new Date(+y, +m - 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    });
    return {
      labels,
      datasets: [{
        label: 'Total Spent',
        data: sorted.map(k => monthMap[k]),
        backgroundColor: 'hsla(245, 80%, 60%, 0.7)',
        borderColor: 'hsl(245, 80%, 60%)',
        borderWidth: 1,
        borderRadius: 6,
      }],
    };
  }, [expenses]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } } },
  };

  const barOptions = {
    ...chartOptions,
    plugins: { ...chartOptions.plugins, legend: { display: false } },
    scales: {
      x: { grid: { color: 'hsla(226, 18%, 22%, 0.5)' } },
      y: {
        grid: { color: 'hsla(226, 18%, 22%, 0.5)' },
        ticks: { callback: v => '₹' + v.toLocaleString('en-IN') },
      },
    },
  };

  const recentExpenses = [...expenses].slice(0, 5);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Your financial overview at a glance.</p>
        </div>
        <div className="stats-grid">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <Loading fullPage text="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Your financial overview at a glance.</p>
        </div>
        <Link to="/add" className="btn btn-primary" id="dashboard-add-btn">
          <PlusCircle size={16} /> Add Expense
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="card" style={{ borderColor: 'var(--error-500)', marginBottom: '2rem' }}>
          <p className="text-error">⚠️ {error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Spent"
          value={formatCurrency(stats.total)}
          icon={<DollarSign size={22} />}
          iconBg="hsla(245, 80%, 60%, 0.15)"
          iconColor="var(--brand-400)"
          sub={`${stats.count} expense${stats.count !== 1 ? 's' : ''} total`}
        />
        <StatCard
          label="This Month"
          value={formatCurrency(stats.thisMonth)}
          icon={<TrendingUp size={22} />}
          iconBg="hsla(185, 85%, 45%, 0.15)"
          iconColor="var(--accent-400)"
          sub="Current month spending"
        />
        <StatCard
          label="Total Records"
          value={stats.count.toLocaleString('en-IN')}
          icon={<Receipt size={22} />}
          iconBg="hsla(142, 68%, 45%, 0.15)"
          iconColor="var(--success-400)"
          sub="Expenses recorded"
        />
        <StatCard
          label="Average Expense"
          value={formatCurrency(stats.average)}
          icon={<BarChart3 size={22} />}
          iconBg="hsla(38, 90%, 50%, 0.15)"
          iconColor="var(--warning-400)"
          sub="Per expense average"
        />
      </div>

      {/* Charts */}
      {expenses.length > 0 ? (
        <div className="charts-grid">
          {/* Doughnut — category breakdown */}
          <div className="chart-card">
            <h3 className="chart-title"><span>🍩</span> By Category</h3>
            <div style={{ height: 260, position: 'relative' }}>
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>

          {/* Bar — monthly trend */}
          <div className="chart-card">
            <h3 className="chart-title"><span>📊</span> Monthly Spending (Last 6 Months)</h3>
            <div style={{ height: 260, position: 'relative' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No data yet"
          message="Add your first expense to see charts and analytics here."
        />
      )}

      {/* Recent expenses */}
      {recentExpenses.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 style={{ margin: 0 }}>Recent Expenses</h3>
            <Link to="/expenses" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recentExpenses.map(exp => (
              <div
                key={exp.id}
                className="flex items-center justify-between"
                style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-hover)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '1.125rem' }}>{getCategoryIcon(exp.category)}</span>
                  <div>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>
                      {exp.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                      {formatDate(exp.date)} &bull; {exp.category}
                    </p>
                  </div>
                </div>
                <span className="amount">{formatCurrency(exp.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
