import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import { CUISINES, ISO_TO_CUISINES } from '../data/cuisines'

const C_TRIED = '#1D9E75'
const C_WANT  = '#EF9F27'

const cuisineById = Object.fromEntries(CUISINES.map(c => [c.id, c]))

function getCountryData(numId, triedIds, wantIds) {
  const ids = ISO_TO_CUISINES[numId] || []
  if (!ids.length) return { status: 'empty', ids, name: '', tried: 0, want: 0 }
  const tried = ids.filter(id => triedIds.has(id)).length
  const want  = ids.filter(id => wantIds.has(id)).length
  const status = tried > 0 ? 'tried' : want > 0 ? 'want' : 'none'
  const primary = ids.map(id => cuisineById[id]).find(c => c?.type === 'nation')
  const name = primary?.name ?? cuisineById[ids[0]]?.name ?? ''
  return { status, ids, name, tried, want }
}

export default function WorldMap({ triedIds, wantIds }) {
  const [worldData, setWorldData] = useState(null)
  const [tooltip, setTooltip]     = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(setWorldData)
      .catch(console.error)
  }, [])

  const { countries, grat, pathGen } = useMemo(() => {
    if (!worldData) return {}
    const W = 680, H = 340
    const proj = d3.geoNaturalEarth1().scale(103).translate([W / 2, H / 2 + 8])
    const pathGen = d3.geoPath().projection(proj)
    const countries = feature(worldData, worldData.objects.countries).features
    const grat = d3.geoGraticule()()
    return { countries, grat, pathGen }
  }, [worldData])

  const handleMouseMove = (e, feat) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const data = getCountryData(parseInt(feat.id), triedIds, wantIds)
    if (!data.ids.length) { setTooltip(null); return }
    setTooltip({
      x: Math.min(e.clientX - rect.left + 14, rect.width - 170),
      y: Math.max(e.clientY - rect.top  - 55, 8),
      ...data,
    })
  }

  if (!worldData) {
    return (
      <div className="map-loading">
        <span>Loading map…</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="map-container">
      <svg viewBox="0 0 680 340" className="map-svg">
        <path d={pathGen({ type: 'Sphere' })} className="map-sphere" />
        <path d={pathGen(grat)} className="map-grat" />
        {countries.map(feat => {
          const nid = parseInt(feat.id)
          const { status } = getCountryData(nid, triedIds, wantIds)
          const d = pathGen(feat)
          if (!d) return null
          return (
            <path
              key={feat.id}
              d={d}
              className={`map-country map-country--${status}`}
              fill={status === 'tried' ? C_TRIED : status === 'want' ? C_WANT : undefined}
              onMouseMove={e => handleMouseMove(e, feat)}
              onMouseLeave={() => setTooltip(null)}
            />
          )
        })}
      </svg>

      <div className="map-legend">
        {[
          { color: C_TRIED, label: 'Tried' },
          { color: C_WANT,  label: 'Want to try' },
          { color: 'var(--c-border-strong)', label: 'Not yet' },
        ].map(item => (
          <div key={item.label} className="map-legend-item">
            <div className="map-legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {tooltip && (
        <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <p className="map-tooltip-name">{tooltip.name}</p>
          <div className="map-tooltip-stats">
            {tooltip.tried > 0 && <span style={{ color: C_TRIED }}>{tooltip.tried} tried</span>}
            {tooltip.want  > 0 && <span style={{ color: C_WANT  }}>{tooltip.want} want to try</span>}
            {tooltip.tried === 0 && tooltip.want === 0 && (
              <span className="muted">{tooltip.ids.length} cuisine{tooltip.ids.length > 1 ? 's' : ''} to explore</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
