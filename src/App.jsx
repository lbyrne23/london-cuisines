import { useState, useEffect, useMemo } from 'react'
import WorldMap from './components/WorldMap'
import CuisineList from './components/CuisineList'
import { fetchRestaurants } from './utils/sheet'
import { CUISINES } from './data/cuisines'
import './App.css'

const C_TRIED = '#1D9E75'

export default function App() {
  const [restaurants, setRestaurants] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [lastFetched, setLastFetched] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRestaurants()
      setRestaurants(data)
      setLastFetched(new Date())
    } catch (e) {
      setError('Could not load restaurant data. Check your SHEET_CSV_URL in src/config.js.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const triedIds = useMemo(
    () => new Set(restaurants.filter(r => r.status === 'Tried').map(r => r.cuisineId)),
    [restaurants]
  )
  const wantIds = useMemo(
    () => new Set(restaurants.filter(r => r.status === 'Want to try').map(r => r.cuisineId)),
    [restaurants]
  )
  const restaurantsByCuisine = useMemo(() => {
    const m = {}
    restaurants.forEach(r => { (m[r.cuisineId] = m[r.cuisineId] ?? []).push(r) })
    return m
  }, [restaurants])

  const total  = CUISINES.length
  const tried  = triedIds.size
  const want   = wantIds.size
  const pct    = Math.round((tried / total) * 100)

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">World Cuisine Tracker</h1>
          <p className="app-subtitle">
            {tried} of {total} cuisines tried · {pct}%
          </p>
        </div>
        <button className="refresh-btn" onClick={load} disabled={loading} title="Refresh from sheet">
          {loading ? '↻' : '↻'} Refresh
        </button>
      </header>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <section className="map-section">
        <WorldMap triedIds={triedIds} wantIds={wantIds} />
      </section>

      <section className="stats-row">
        {[
          { label: 'Total cuisines',    value: total              },
          { label: 'Cuisines tried',    value: tried              },
          { label: 'Want to try',       value: want               },
          { label: 'Restaurants logged', value: restaurants.length },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="list-section">
        {loading ? (
          <p className="loading-msg">Loading restaurants…</p>
        ) : (
          <CuisineList
            triedIds={triedIds}
            wantIds={wantIds}
            restaurantsByCuisine={restaurantsByCuisine}
          />
        )}
      </section>

      {lastFetched && (
        <p className="last-fetched">
          Last synced {lastFetched.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
