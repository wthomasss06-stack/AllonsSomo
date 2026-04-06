'use client'
import { useState, useEffect, useRef } from 'react'
import { getResidences, COMMUNES, TYPES_BIEN } from '@/lib/config'
import ResidenceCard from '@/components/ui/ResidenceCard'
import Icon from '@/components/ui/Icon'

export default function ResidencesPage() {
  const [all,     setAll]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [ville,   setVille]   = useState('')
  const [type,    setType]    = useState('')
  const [sortBy,  setSortBy]  = useState('default')
  const inputRef = useRef(null)

  useEffect(() => {
    getResidences().then(data => { setAll(data); setLoading(false) })
  }, [])

  const filtered = all
    .filter(r => {
      const q = search.toLowerCase()
      const mQ = !q || [r.titre, r.quartier, r.commune, r.ville].some(s => s?.toLowerCase().includes(q))
      const mV = !ville || [r.commune, r.quartier, r.ville].some(s => s === ville)
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        .skel {
          background: linear-gradient(90deg, var(--surface) 0%, var(--border) 50%, var(--surface) 100%);
          background-size: 600px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .card-enter { animation: fadeUp .4s var(--ease) both; }
      `}</style>

      {/* ── Hero Header — dark editorial ── */}
      <div className="page-hero">
        <div style={{
          position: 'absolute', inset: 0, opacity: .03, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}/>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold) 40%, var(--gold) 60%, transparent)', opacity: .4 }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="page-hero-label">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }}/>
            Catalogue complet
          </div>
          <h1 className="page-hero-title">
            Toutes nos<br/>
            <em>résidences</em>
          </h1>
          <p className="page-hero-desc">
            {loading ? 'Chargement…' : `${all.length} bien${all.length !== 1 ? 's' : ''} disponible${all.length !== 1 ? 's' : ''}`}
            {' '}· Réservation directe par WhatsApp
          </p>

          <div className="search-bar-v2">
            <Icon n="search" size={18} style={{ color: 'rgba(255,255,255,.4)', flexShrink: 0 }}/>
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher une résidence, quartier…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                background: 'rgba(255,255,255,.1)', border: 'none', color: 'rgba(255,255,255,.6)',
                borderRadius: 99, width: 28, height: 28, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon n="close" size={14}/>
              </button>
            )}
            <button className="btn btn-gold" style={{ flexShrink: 0, borderRadius: 99 }}>Chercher</button>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="filter-bar" style={{ top: 64 }}>
        <div className="filter-bar-inner" style={{ gap: 10 }}>
          <select className="select" value={ville} onChange={e => setVille(e.target.value)} style={{ flex: '0 1 170px', height: 40, fontSize: 13 }}>
            <option value="">Toutes les communes</option>
            {COMMUNES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select className="select" value={type} onChange={e => setType(e.target.value)} style={{ flex: '0 1 150px', height: 40, fontSize: 13 }}>
            <option value="">Tous les types</option>
            {TYPES_BIEN.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ flex: '0 1 160px', height: 40, fontSize: 13 }}>
            <option value="default">Mis en avant</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
          <div style={{ flex: 1 }}/>
          {hasFilters && (
            <button className="btn btn-outline" onClick={clearFilters} style={{ padding: '8px 14px', fontSize: 12, flexShrink: 0, height: 40 }}>
              <Icon n="close" size={14}/>Effacer
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(36px,5vw,64px) var(--pad)' }}>
        {!loading && (
          <div className="catalog-header">
            <div>
              <div className="section-label">Résultats</div>
              <div className="catalog-count">
                <span>{filtered.length}</span>{' '}bien{filtered.length !== 1 ? 's' : ''}
                {hasFilters && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', color: 'var(--muted)', fontWeight: 400 }}> pour votre recherche</span>}
              </div>
            </div>
            {hasFilters && (
              <button className="btn btn-outline" onClick={clearFilters}>
                <Icon n="filter_alt_off" size={16}/>Réinitialiser
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--white)' }}>
                <div className="skel" style={{ aspectRatio: '4/3', borderRadius: 0 }}/>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skel" style={{ height: 11, width: '40%', borderRadius: 99 }}/>
                  <div className="skel" style={{ height: 22, width: '72%', borderRadius: 8 }}/>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <div className="skel" style={{ height: 24, width: 70, borderRadius: 99 }}/>
                    <div className="skel" style={{ height: 24, width: 60, borderRadius: 99 }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '96px 20px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            }}>
              <Icon n="search_off" size={36} color={'var(--subtle)'}/>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, marginBottom: 10 }}>Aucun résultat</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>Essayez avec d'autres critères de recherche.</p>
            <button className="btn btn-dark" onClick={clearFilters}>Effacer les filtres</button>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map((r, i) => (
              <div key={r.id} className="card-enter" style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}>
                <ResidenceCard residence={r} index={i}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
