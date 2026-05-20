const C_TRIED = '#1D9E75'
const C_WANT  = '#EF9F27'

function Stars({ n }) {
  if (!n) return null
  return (
    <span className="stars" style={{ color: C_WANT }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

function fmtDate(d) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
  } catch {
    return d
  }
}

export default function RestaurantCard({ r }) {
  const urlMatch  = r.notes?.match(/(https?:\/\/[^\s]+)/)
  const noteText  = r.notes?.replace(/(https?:\/\/[^\s]+)/, '').trim() || null
  const isTried   = r.status === 'Tried'

  return (
    <div className="r-card">
      <div className="r-card-header">
        <div>
          <p className="r-card-name">{r.name}</p>
          <div className="r-card-meta">
            {r.date   && <span className="muted small">{fmtDate(r.date)}</span>}
            {r.rating && <Stars n={r.rating} />}
          </div>
        </div>
        <span
          className="badge"
          style={{
            background: isTried ? 'var(--c-success-bg)' : 'var(--c-warn-bg)',
            color:      isTried ? 'var(--c-success)'    : 'var(--c-warn)',
          }}
        >
          {r.status}
        </span>
      </div>
      {noteText && <p className="r-card-notes">{noteText}</p>}
      {urlMatch && (
        <a href={urlMatch[1]} target="_blank" rel="noreferrer" className="maps-link">
          View on Maps ↗
        </a>
      )}
    </div>
  )
}
