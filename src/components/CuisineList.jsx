import { useState, useMemo } from 'react'
import { CUISINES, REGIONS } from '../data/cuisines'
import RestaurantCard from './RestaurantCard'

const C_TRIED = '#1D9E75'
const C_WANT  = '#EF9F27'

const TYPE_BADGE = {
  territory: { label: 'Territory' },
  regional:  { label: 'Regional'  },
  stateless: { label: 'Stateless' },
}

export default function CuisineList({ triedIds, wantIds, restaurantsByCuisine }) {
  const [search,   setSearch]   = useState('')
  const [region,   setRegion]   = useState('All')
  const [typeF,    setTypeF]    = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => CUISINES.filter(c => {
    if (region !== 'All' && c.region !== region) return false
    if (typeF  !== 'All' && c.type  !== typeF)  return false
    const q = search.toLowerCase()
    if (q && !c.name.toLowerCase().includes(q) && !(c.parent ?? '').toLowerCase().includes(q)) return false
    return true
  }), [search, region, typeF])

  const toggle = id => setSelected(prev => prev === id ? null : id)

  return (
    <div>
      {/* Controls */}
      <div className="controls-row">
        <input
          type="text"
          placeholder="Search cuisines…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={region} onChange={e => setRegion(e.target.value)} className="region-select">
          {REGIONS.map(r => (
            <option key={r} value={r}>{r === 'All' ? 'All regions' : r}</option>
          ))}
        </select>
      </div>

      <div className="type-pills">
        {[
          { v: 'All',       l: 'All'             },
          { v: 'nation',    l: 'Nations'          },
          { v: 'regional',  l: 'Regional'         },
          { v: 'territory', l: 'Territories'      },
          { v: 'stateless', l: 'Stateless nations'},
        ].map(t => (
          <button
            key={t.v}
            className={`pill ${typeF === t.v ? 'pill--active' : ''}`}
            onClick={() => setTypeF(t.v)}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="cuisine-list">
        {filtered.length === 0 && (
          <p className="empty-msg">No cuisines match your filters.</p>
        )}
        {filtered.map(c => {
          const status    = triedIds.has(c.id) ? 'tried' : wantIds.has(c.id) ? 'want' : 'none'
          const rests     = restaurantsByCuisine[c.id] ?? []
          const isOpen    = selected === c.id
          const badge     = TYPE_BADGE[c.type]
          const accentCol = status === 'tried' ? C_TRIED : status === 'want' ? C_WANT : 'var(--c-border)'

          return (
            <div key={c.id} className="cuisine-item">
              <div
                className={`cuisine-row ${isOpen ? 'cuisine-row--open' : ''}`}
                style={{ borderLeft: `3px solid ${accentCol}` }}
                onClick={() => toggle(c.id)}
              >
                <div className="cuisine-row-main">
                  <span className={`cuisine-name ${status !== 'none' ? 'cuisine-name--active' : ''}`}>
                    {c.name}
                  </span>
                  {c.parent && <span className="cuisine-parent">{c.parent}</span>}
                  {badge && <span className={`type-badge type-badge--${c.type}`}>{badge.label}</span>}
                </div>
                <div className="cuisine-row-right">
                  {rests.length > 0 && (
                    <span className="count-pill">{rests.length}</span>
                  )}
                  <span className="chevron">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div className="cuisine-expanded">
                  {rests.length === 0 ? (
                    <p className="empty-msg">No restaurants logged yet.</p>
                  ) : (
                    rests.map(r => <RestaurantCard key={r.id} r={r} />)
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
