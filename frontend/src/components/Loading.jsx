export default function Loading({ text = 'Loading…', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3" style={{ padding: '2rem', justifyContent: 'center' }}>
      <div className="loading-spinner" />
      <span className="text-muted" style={{ fontSize: '0.875rem' }}>{text}</span>
    </div>
  );
}

/** Skeleton row for table loading state */
export function SkeletonRow({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '1rem' }}>
          <div className="skeleton" style={{ height: '16px', borderRadius: '6px', width: i === 0 ? '60%' : '80%' }} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton card */
export function SkeletonCard() {
  return (
    <div className="card" style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ height: '20px', width: '50%' }} />
      <div className="skeleton" style={{ height: '14px', width: '80%' }} />
      <div className="skeleton" style={{ height: '28px', width: '35%', marginTop: '8px' }} />
    </div>
  );
}
