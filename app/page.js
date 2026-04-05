'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getResidences, SITE, VILLES, TYPES_BIEN, formatPrix } from '@/lib/config'
import ResidenceCard from '@/components/ui/ResidenceCard'

// ── Animated counter ──────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s = 0
        const step = () => {
          s += Math.ceil(target / 38)
          if (s >= target) { setVal(target); return }
          setVal(s); requestAnimationFrame(step)
        }
        requestAnimationFrame(step); obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val}{suffix}</span>
}

// ── Hero ──────────────────────────────────────────────────────
// 📁 Placez vos photos dans /public/hero/
//    hero-1.jpg, hero-2.jpg, hero-3.jpg  (1800×1200px recommandé, <500Ko)
//    Si absentes → fallback Unsplash automatique
const SLIDES = [
  {
    eyebrow: 'Abidjan · Cocody · Riviera',
    title: ['Résidences', <em key="e">de Prestige</em>],
    sub: 'Résidences meublées, climatisées et prêtes à vivre en Côte d\'Ivoire.',
    localImage: '/hero/hero-1.jpg',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'Cocody · Marcory · Plateau · Yopougon',
    title: ['Votre chez-vous', <em key="e">à Abidjan</em>],
    sub: 'Studios, appartements et villas disponibles dans tous les quartiers d\'Abidjan.',
    localImage: '/hero/hero-2.jpg',
    fallback: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'Réservation rapide',
    title: ['Réservez en', <em key="e">30 secondes</em>],
    sub: 'Caution sécurisée, arrivée garantie. Directement par WhatsApp.',
    localImage: '/hero/hero-3.jpg',
    fallback: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=85&auto=format&fit=crop',
  },
]

// Résoudre l'image : locale si disponible, sinon fallback
function useHeroImage(localPath, fallback) {
  const [src, setSrc] = useState(localPath)
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setSrc(localPath)
    img.onerror = () => setSrc(fallback)
    img.src = localPath
  }, [localPath, fallback])
  return src
}

function HeroSlide({ slide, active }) {
  const src = useHeroImage(slide.localImage, slide.fallback)
  return (
    <div
      className={`hero-slide ${active ? 'active' : 'inactive'}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  )
}

function Hero() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const timer = useRef(null)

  const go = (idx) => {
    if (fading || idx === active) return
    setFading(true)
    setTimeout(() => { setActive(idx); setFading(false) }, 600)
  }

  useEffect(() => {
    timer.current = setInterval(() => go((active + 1) % SLIDES.length), 7000)
    return () => clearInterval(timer.current)
  }, [active])

  const s = SLIDES[active]

  return (
    <div className="hero">
      {/* Slides */}
      {SLIDES.map((sl, i) => (
        <HeroSlide key={i} slide={sl} active={i === active} />
      ))}
      <div className="hero-overlay"/>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="hero-content">
          <div className="hero-eyebrow" style={{ opacity: fading ? 0 : 1, transition: 'opacity .5s', transform: fading ? 'translateY(-8px)' : 'none', transitionProperty: 'opacity, transform' }}>
            {s.eyebrow}
          </div>
          <h1 className="hero-title" style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(16px)' : 'none', transition: 'opacity .55s .06s, transform .55s .06s' }}>
            {s.title[0]}<br/>{s.title[1]}
          </h1>
          <p className="hero-sub" style={{ opacity: fading ? 0 : 1, transition: 'opacity .55s .12s' }}>
            {s.sub}
          </p>
          <div className="hero-actions" style={{ opacity: fading ? 0 : 1, transition: 'opacity .55s .18s' }}>
            <Link href="/residences" className="btn btn-white">
              <span className="material-icons" style={{ fontSize: 17 }}>apartment</span>
              Voir les résidences
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
              <span className="material-icons" style={{ fontSize: 17 }}>chat</span>
              Réserver via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot${i === active ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i+1}`}/>
        ))}
      </div>
    </div>
  )
}

// ── Search quick filter ───────────────────────────────────────
function QuickSearch() {
  const [ville, setVille] = useState('')
  const [type, setType]   = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (ville) params.set('ville', ville)
    if (type)  params.set('type', type)
    window.location.href = `/residences${params.toString() ? '?' + params : ''}`
  }

  return (
    <div style={{
      background: 'var(--white)', borderRadius: 'var(--r-2xl)',
      boxShadow: 'var(--sh-xl)', padding: 8,
      display: 'flex', alignItems: 'center', gap: 0,
      flexWrap: 'wrap',
    }}>
      {/* Ville */}
      <div style={{ flex: '1 1 180px', padding: '10px 20px', borderRight: '1px solid var(--border)', minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 4 }}>Ville</div>
        <select value={ville} onChange={e => setVille(e.target.value)} style={{
          width: '100%', border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-ui)', fontSize: 14, color: ville ? 'var(--ink)' : 'var(--subtle)', cursor: 'pointer',
        }}>
          <option value="">Tous quartiers</option>
          {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {/* Type */}
      <div style={{ flex: '1 1 160px', padding: '10px 20px', minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 4 }}>Type</div>
        <select value={type} onChange={e => setType(e.target.value)} style={{
          width: '100%', border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-ui)', fontSize: 14, color: type ? 'var(--ink)' : 'var(--subtle)', cursor: 'pointer',
        }}>
          <option value="">Tous types</option>
          {TYPES_BIEN.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      {/* CTA */}
      <div style={{ padding: '4px 4px 4px 8px', flexShrink: 0 }}>
        <button className="btn btn-dark" onClick={handleSearch} style={{ borderRadius: 'var(--r-lg)', padding: '13px 24px' }}>
          <span className="material-icons" style={{ fontSize: 18 }}>search</span>
          Explorer
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function HomePage() {
  const [residences, setResidences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResidences().then(data => { setResidences(data); setLoading(false) })
  }, [])

  const featured = residences.filter(r => r.featured).slice(0, 3)
  const recent   = residences.slice(0, 6)

  return (
    <>
      {/* ── Hero ── */}
      <Hero/>

      {/* ── Quick Search ── */}
      <div style={{ background: 'var(--bg)', padding: '0 var(--pad)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', transform: 'translateY(-32px)' }}>
          <QuickSearch/>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ background: 'var(--bg)', padding: '0 var(--pad) clamp(56px,9vw,96px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 1, background: 'var(--border)',
            border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden',
          }}>
            {[
              { n: residences.length > 0 ? residences.length : 0, suf: '', label: 'Résidences', loading },
              { n: [...new Set(residences.map(r => r.ville))].filter(Boolean).length || 1, suf: '', label: loading ? 'Ville' : ([...new Set(residences.map(r => r.ville))].filter(Boolean).length > 1 ? 'Villes' : 'Ville'), loading },
              { n: 98, suf: '%', label: 'Satisfaits', loading: false },
              { n: 24, suf: 'h', label: 'Support', loading: false },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--white)', padding: 'clamp(24px,4vw,40px) clamp(20px,3vw,36px)' }}>
                <div className="stat-number">
                  {s.loading ? <span style={{ color: 'var(--subtle)' }}>—</span> : <Counter target={s.n} suffix={s.suf}/>}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Residences ── */}
      <div style={{ background: 'var(--surface)' }}>
        <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 'clamp(32px,5vw,48px)', flexWrap: 'wrap' }}>
            <div>
              <div className="section-label">Sélection</div>
              <h2 className="section-title">Résidences<br/><em>à la une</em></h2>
            </div>
            <Link href="/residences" className="btn btn-outline" style={{ flexShrink: 0 }}>
              Voir tout
              <span className="material-icons" style={{ fontSize: 18 }}>arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid-3">
              {[1,2,3].map(i => (
                <div key={i} style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div className="skeleton" style={{ paddingBottom: '65%' }}/>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 14, width: '45%', borderRadius: 99 }}/>
                    <div className="skeleton" style={{ height: 20, width: '80%' }}/>
                    <div className="skeleton" style={{ height: 14, width: '60%' }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid-3">
              {featured.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
            </div>
          ) : recent.length > 0 ? (
            <div className="grid-3">
              {recent.slice(0,3).map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <span className="material-icons" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: 'var(--subtle)' }}>apartment</span>
              <p>Aucune résidence disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Value Props ── */}
      <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="value-props-grid">
          <div>
            <div className="section-label">Pourquoi nous</div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>
              Pas une agence<br/><em>ordinaire</em>
            </h2>
            <p className="section-desc" style={{ marginBottom: 36 }}>
              Des résidences soigneusement sélectionnées, une réservation directe et sans surprise. On vous accompagne de A à Z.
            </p>
            <Link href="/residences" className="btn btn-dark">
              Trouver ma résidence
            </Link>
          </div>

          <div className="feature-strip">
            {[
              { icon: 'verified', title: 'Résidences vérifiées', desc: 'Chaque bien est inspecté et validé par notre équipe.' },
              { icon: 'chat',     title: 'Réservation WhatsApp', desc: 'Rapide, direct, sans formulaire compliqué.' },
              { icon: 'shield',   title: 'Caution sécurisée',    desc: 'Votre dépôt est protégé à chaque étape.' },
              { icon: 'support_agent', title: 'Support 24h',     desc: 'On répond toujours, même le weekend.' },
            ].map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">
                  <span className="material-icons">{f.icon}</span>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── All residences preview ── */}
      {recent.length > 3 && (
        <div style={{ background: 'var(--surface)' }}>
          <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 'clamp(32px,5vw,48px)', flexWrap: 'wrap' }}>
              <div>
                <div className="section-label">Catalogue 2025</div>
                <h2 className="section-title">Toutes nos<br/><em>résidences</em></h2>
              </div>
              <Link href="/residences" className="btn btn-outline" style={{ flexShrink: 0 }}>
                Voir tout · {residences.length}
                <span className="material-icons" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
            </div>
            <div className="grid-auto">
              {recent.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA Banner ── */}
      <div style={{ padding: 'clamp(56px,9vw,100px) var(--pad)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: 'var(--ink)', borderRadius: 'var(--r-2xl)',
          padding: 'clamp(48px,7vw,80px) var(--pad)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#fff', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12 }}>
              Prêt à trouver<br/><em style={{ color: 'rgba(255,255,255,.55)' }}>votre résidence ?</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', maxWidth: 400 }}>
              Parcourez notre catalogue et réservez directement par WhatsApp.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/residences" className="btn btn-white">
              Explorer les résidences
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
              <span className="material-icons" style={{ fontSize: 17 }}>chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
