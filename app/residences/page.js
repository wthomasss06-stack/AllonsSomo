'use client'
import { useState, useEffect } from 'react'
import { getResidences, VILLES, TYPES_BIEN } from '@/lib/config'
import ResidenceCard from '@/components/ui/ResidenceCard'

export default function ResidencesPage() {
  const [all,     setAll]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [ville,   setVille]   = useState('')
  const [type,    setType]    = useState('')
  const [sortBy,  setSortBy]  = useState('default')

  useEffect(() => {
    getResidences().then(data => { setAll(data); setLoading(false) })
  }, [])

  const filtered = all
    .filter(r => {
      const q = search.toLowerCase()
      const mQ = !q || [r.titre, r.quartier, r.commune, r.ville].some(s => s?.toLowerCase().includes(q))
      const mV = !ville || r.ville === ville
      const mT = !type  || r.type_bien === type
      return mQ && mV && mT
    })
    .sort((a, b) => {
      if (sortBy === 'prix-asc')  return (a.prix_nuit||a.prix_journee||0) - (b.prix_nuit||b.prix_journee||0)
      if (sortBy === 'prix-desc') return (b.prix_nuit||b.prix_journee||0) - (a.prix_nuit||a.prix_journee||0)
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    })

  const hasFilters = ville || type || search

  const clearFilters = () => { setSearch(''); setVille(''); setType('') }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 64 }}>

      {/* ── Header ── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(40px,6vw,72px) var(--pad) clamp(32px,5vw,56px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-label">Catalogue complet</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2.4rem,5.5vw,4.5rem)', letterSpacing: '-.025em', color: 'var(--ink)', lineHeight: 1.05, marginBottom: 10 }}>
            Toutes nos <em>résidences</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--muted)', letterSpacing: '.02em' }}>
            {loading ? '…' : `${all.length} bien${all.length !== 1 ? 's' : ''} disponible${all.length !== 1 ? 's' : ''}`} · Réservation directe par WhatsApp
          </p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        <div className="filter-bar-inner">
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
            <span className="material-icons" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--subtle)', pointerEvents: 'none' }}>search</span>
            <input
              className="input"
              type="text"
              placeholder="Rechercher une résidence…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
          </div>

          {/* Ville */}
          <select className="select" value={ville} onChange={e => setVille(e.target.value)} style={{ flex: '0 1 160px' }}>
            <option value="">Toutes villes</option>
            {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>

          {/* Type */}
          <select className="select" value={type} onChange={e => setType(e.target.value)} style={{ flex: '0 1 140px' }}>
            <option value="">Tous types</option>
            {TYPES_BIEN.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>

          {/* Sort */}
          <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ flex: '0 1 150px' }}>
            <option value="default">Mise en avant</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>

          {/* Clear */}
          {hasFilters && (
            <button className="btn btn-outline" onClick={clearFilters} style={{ padding: '8px 16px', fontSize: 13, flexShrink: 0 }}>
              <span className="material-icons" style={{ fontSize: 15 }}>close</span>
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ padding: 'clamp(32px,5vw,56px) var(--pad)', maxWidth: 1280, margin: '0 auto' }}>
        {/* Count */}
        {!loading && (
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              {hasFilters ? `${filtered.length} résultat${filtered.length !== 1 ? 's' : ''} pour votre recherche` : `${all.length} résidence${all.length !== 1 ? 's' : ''} disponibles`}
            </p>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--white)' }}>
                <div className="skeleton" style={{ paddingBottom: '65%' }}/>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 99 }}/>
                  <div className="skeleton" style={{ height: 20, width: '75%' }}/>
                  <div className="skeleton" style={{ height: 12, width: '55%' }}/>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <div className="skeleton" style={{ height: 24, width: 70, borderRadius: 99 }}/>
                    <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 99 }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <span className="material-icons" style={{ fontSize: 56, color: 'var(--border)', display: 'block', marginBottom: 16 }}>search_off</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, marginBottom: 8 }}>Aucun résultat</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Essayez avec d'autres critères de recherche.</p>
            <button className="btn btn-dark" onClick={clearFilters}>Effacer les filtres</button>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
