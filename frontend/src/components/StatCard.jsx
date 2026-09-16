import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg = 'hsla(245, 80%, 60%, 0.15)',
  iconColor = 'var(--brand-400)',
  trend,       // 'up' | 'down' | 'neutral'
  trendLabel,
}) {
  return (
    <div className="stat-card">
      {/* Icon */}
      <div
        className="stat-card-icon"
        style={{ background: iconBg, color: iconColor }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Label */}
      <p className="stat-card-label">{label}</p>

      {/* Value */}
      <div className="stat-card-value">{value}</div>

      {/* Sub / trend */}
      {(sub || trendLabel) && (
        <div className="stat-card-sub flex items-center gap-2">
          {trend === 'up'      && <TrendingUp   size={13} className="stat-trend-up" />}
          {trend === 'down'    && <TrendingDown  size={13} className="stat-trend-down" />}
          {trend === 'neutral' && <Minus         size={13} style={{ color: 'var(--text-muted)' }} />}
          <span>{trendLabel || sub}</span>
        </div>
      )}
    </div>
  );
}
