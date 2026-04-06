'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getResidences, SITE, COMMUNES, TYPES_BIEN, formatPrix } from '@/lib/config'
import ResidenceCard from '@/components/ui/ResidenceCard'
import Icon from '@/components/ui/Icon'

/* ── Animated counter ── */
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

/* ── Hero slides ── */
const SLIDES = [
  {
    eyebrow: 'Abidjan · Cocody · Riviera',
    title: 'Trouvez votre',
    titleItalic: 'résidence',
    sub: 'Logements meublés, climatisés, prêts à vivre. Sans frais cachés. Réservation directe sur WhatsApp.',
    localImage: '/hero/hero-1.jpg',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'Cocody · Marcory · Plateau · Yopougon',
    title: 'Votre chez-vous',
    titleItalic: 'à Abidjan',
    sub: 'Studios, appartements et villas disponibles dans tous les quartiers. Réponse WhatsApp en moins de 5 min.',
    localImage: '/hero/hero-2.jpg',
    fallback: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'Réservation instantanée',
    title: 'Réservez en',
    titleItalic: '30 secondes',
    sub: 'Un clic sur WhatsApp, on vous répond immédiatement. Aucun paiement avant validation.',
    localImage: '/hero/hero-3.jpg',
    fallback: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=85&auto=format&fit=crop',
  },
]

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
    <div className={`hero-slide ${active ? 'active' : 'inactive'}`}
      style={{ backgroundImage: `url(${src})` }}/>
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
      {SLIDES.map((sl, i) => <HeroSlide key={i} slide={sl} active={i === active}/>)}
      <div className="hero-overlay"/>

      <div className="hero-urgency-badge">
        <span className="hero-urgency-dot"/>
        <Icon n="local_fire_department" size={13}/>
        <span>Très demandé cette semaine</span>
      </div>

      <div className="hero-content">
        <div style={{ opacity: fading ? 0 : 1, transition: 'opacity .5s, transform .55s', transform: fading ? 'translateY(14px)' : 'none' }}>
          <div className="hero-eyebrow">{s.eyebrow}</div>
          <h1 className="hero-title">
            {s.title}<br/><em>{s.titleItalic}</em>
          </h1>
          <p className="hero-sub">{s.sub}</p>
          <div className="hero-actions">
            <Link href="/residences" className="btn btn-white">
              <Icon n="apartment" size={17}/>
              Voir les résidences
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa btn-wa-pulse">
              <Icon n="chat" size={17}/>
              <Icon n="local_fire_department" size={13}/>
              Réserver (2 min)
            </a>
          </div>
          <div className="hero-trust">
            {[
              { icon: 'shield',   text: 'Aucun paiement avant validation' },
              { icon: 'verified', text: 'Visites réelles vérifiées' },
              { icon: 'lock',     text: 'Zéro arnaque garantie' },
            ].map((t, i) => (
              <div key={i} className="hero-trust-item">
                <Icon n={t.icon} size={13} color={'rgba(255,255,255,.55)'}/>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot${i === active ? ' active' : ''}`}
            onClick={() => go(i)} aria-label={`Slide ${i+1}`}/>
        ))}
      </div>
    </div>
  )
}

/* ── Search Bar ── */
function QuickSearch() {
  const [ville, setVille]   = useState('')
  const [type, setType]     = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (ville) params.set('ville', ville)
    if (type)  params.set('type', type)
    window.location.href = `/residences${params.toString() ? '?' + params : ''}`
  }

  const BUDGETS = [
    { label: 'Tout budget', val: '' },
    { label: '< 100 000 XOF', val: '0-100000' },
    { label: '100k – 250k XOF', val: '100000-250000' },
    { label: '250k – 500k XOF', val: '250000-500000' },
    { label: '> 500 000 XOF', val: '500000-' },
  ]

  return (
    <div className="search-pill">
      <div className="search-pill-field">
        <div className="search-pill-label">Commune / Quartier</div>
        <select value={ville} onChange={e => setVille(e.target.value)} className="search-pill-select">
          <option value="">Toutes communes</option>
          {COMMUNES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="search-pill-sep"/>
      <div className="search-pill-field">
        <div className="search-pill-label">Type de bien</div>
        <select value={type} onChange={e => setType(e.target.value)} className="search-pill-select">
          <option value="">Tous types</option>
          {TYPES_BIEN.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>
      <div className="search-pill-sep"/>
      <div className="search-pill-field">
        <div className="search-pill-label">Budget</div>
        <select value={budget} onChange={e => setBudget(e.target.value)} className="search-pill-select">
          {BUDGETS.map(b => <option key={b.val} value={b.val}>{b.label}</option>)}
        </select>
      </div>
      <div className="search-pill-action">
        <button className="btn btn-dark search-pill-btn" onClick={handleSearch}>
          <Icon n="search" size={18}/>
          Explorer
        </button>
      </div>
    </div>
  )
}

/* ── Featured card ── */
function FeaturedCard({ residence, size = 'normal' }) {
  const imgs = residence.images || []
  const imgSrc = imgs[0] || null
  const prix = residence.prix_min ? formatPrix(residence.prix_min) : null
  return (
    <Link href={`/residences/${residence.id}`} className={`feat-card feat-card-${size}`}>
      <div className="feat-card-img">
        {imgSrc
          ? <img src={imgSrc} alt={residence.titre} loading="lazy"/>
          : <div className="feat-card-placeholder"><Icon n="apartment" size={40}/></div>
        }
        <div className="feat-card-overlay"/>
        <div className="feat-card-info">
          <div className="feat-card-location">{residence.commune || residence.ville}</div>
          <div className="feat-card-name">{residence.titre}</div>
          {prix && <div className="feat-card-price">{prix}<span>/mois</span></div>}
        </div>
      </div>
    </Link>
  )
}

/* ── How It Works ── */
const STEPS = [
  { icon: 'apartment',    num: '1', title: 'Choisissez une résidence', desc: 'Parcourez nos logements avec photos réelles, prix affichés, équipements détaillés.' },
  { icon: 'chat',         num: '2', title: 'Cliquez sur WhatsApp',      desc: 'Un bouton → contact direct. Pas de formulaire, pas d\'attente, pas d\'intermédiaire.' },
  { icon: 'check_circle', num: '3', title: 'Confirmez en 2 minutes',    desc: 'Notre agent confirme la disponibilité et vous guide pour la caution sécurisée.' },
]

function StepsCarousel() {
  const [cur, setCur] = useState(0)
  const trackRef = useRef(null)
  const startX = useRef(null)
  useEffect(() => {
    const id = setInterval(() => {
      setCur(c => {
        const next = (c + 1) % STEPS.length
        if (trackRef.current) trackRef.current.style.transform = `translateX(${-next * 100}%)`
        return next
      })
    }, 3200)
    return () => clearInterval(id)
  }, [])
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) {
      const next = Math.max(0, Math.min(cur + (dx < 0 ? 1 : -1), STEPS.length - 1))
      setCur(next)
      if (trackRef.current) trackRef.current.style.transform = `translateX(${-next * 100}%)`
    }
  }
  return (
    <div>
      <div style={{ overflow: 'hidden' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div ref={trackRef} style={{ display: 'flex', transition: 'transform .5s cubic-bezier(.4,0,.2,1)', willChange: 'transform' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ minWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 8px' }}>
              <div className="step-icon-wrap">
                <div className="step-icon"><Icon n={s.icon} size={28}/></div>
                <div className="step-num">{s.num}</div>
              </div>
              <div className="step-title">{s.title}</div>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ width: i === cur ? 24 : 8, height: 8, borderRadius: 99, background: i === cur ? 'var(--gold)' : 'var(--border)', transition: 'all .3s' }}/>
        ))}
      </div>
    </div>
  )
}

function HowItWorks() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return (
    <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(36px,5vw,56px)', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="section-label">Simple & rapide</div>
            <h2 className="section-title">Comment<br/><em>ça marche ?</em></h2>
          </div>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa btn-wa-pulse" style={{ fontSize: 14 }}>
            <Icon n="chat" size={18}/>
            Démarrer sur WhatsApp
          </a>
        </div>
        {isMobile ? <StepsCarousel/> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 32, left: '17%', right: '17%', height: 1, background: 'var(--border)', zIndex: 0 }}/>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 clamp(16px,3vw,40px)' }}>
                <div className="step-icon-wrap">
                  <div className="step-icon"><Icon n={s.icon} size={28}/></div>
                  <div className="step-num">{s.num}</div>
                </div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Testimonials ── */
const REVIEWS = [
  { name: 'Kofi A.',  zone: 'Cocody',  text: "J'ai trouvé mon appartement en moins d'une heure. Le suivi WhatsApp est très réactif, top service !", avatar: 'K' },
  { name: 'Marie D.', zone: 'Plateau', text: "Résidence exactement comme sur les photos. Aucune mauvaise surprise à l'arrivée. Je recommande vraiment !", avatar: 'M' },
  { name: 'Serge B.', zone: 'Marcory', text: "Réponse en 3 minutes sur WhatsApp. Clé en main, meublé, climatisé. Parfait pour un séjour professionnel.", avatar: 'S' },
]

function Testimonials() {
  const [cur, setCur] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const trackRef = useRef(null)
  const startX = useRef(null)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  useEffect(() => {
    if (!isMobile) return
    const id = setInterval(() => {
      setCur(c => {
        const next = (c + 1) % REVIEWS.length
        if (trackRef.current) trackRef.current.style.transform = `translateX(${-next * 100}%)`
        return next
      })
    }, 3200)
    return () => clearInterval(id)
  }, [isMobile])
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) {
      const next = Math.max(0, Math.min(cur + (dx < 0 ? 1 : -1), REVIEWS.length - 1))
      setCur(next)
      if (trackRef.current) trackRef.current.style.transform = `translateX(${-next * 100}%)`
    }
  }
  const ReviewCard = ({ r }) => (
    <div className="review-card">
      <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
        {[0,1,2,3,4].map(j => <span key={j} style={{ color: '#F59E0B', fontSize: 16 }}>★</span>)}
      </div>
      <p className="review-text">"{r.text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 18, borderTop: '1px solid var(--border)' }}>
        <div className="review-avatar">{r.avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{r.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {r.zone} · <Icon n="check_circle" size={12} color={'#16A34A'}/> Client vérifié
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(32px,5vw,48px)', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">Avis clients vérifiés</div>
          <h2 className="section-title">Ils nous font<br/><em>confiance</em></h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[0,1,2,3,4].map(i => <Icon key={i} n="star" size={18} color="#F59E0B"/>)}
          <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 8 }}>4.9 / 5 · 120+ avis</span>
        </div>
      </div>
      {isMobile ? (
        <div>
          <div style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div ref={trackRef} style={{ display: 'flex', transition: 'transform .5s cubic-bezier(.4,0,.2,1)', willChange: 'transform' }}>
              {REVIEWS.map((r, i) => <div key={i} style={{ minWidth: '100%' }}><ReviewCard r={r}/></div>)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
            {REVIEWS.map((_, i) => <div key={i} style={{ width: i === cur ? 22 : 7, height: 7, borderRadius: 99, background: i === cur ? 'var(--gold)' : 'var(--border)', transition: 'all .3s' }}/>)}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {REVIEWS.map((r, i) => <ReviewCard key={i} r={r}/>)}
        </div>
      )}
    </div>
  )
}

/* ── Mobile 2×2 Carousel ── */
function MobileCarousel({ items }) {
  const [page, setPage] = useState(0)
  const trackRef = useRef(null)
  const startX = useRef(null)
  const dragging = useRef(false)
  const pages = []
  for (let i = 0; i < items.length; i += 4) pages.push(items.slice(i, i + 4))
  const total = pages.length
  const goTo = (p) => {
    const clamped = Math.max(0, Math.min(p, total - 1))
    setPage(clamped)
    if (trackRef.current) trackRef.current.style.transform = `translateX(${-clamped * 100}%)`
  }
  return (
    <div>
      <div style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }}
        onTouchStart={e => { startX.current = e.touches[0].clientX; dragging.current = true }}
        onTouchEnd={e => { if (!dragging.current) return; const dx = e.changedTouches[0].clientX - startX.current; if (Math.abs(dx) > 40) goTo(page + (dx < 0 ? 1 : -1)); dragging.current = false }}
        onMouseDown={e => { startX.current = e.clientX; dragging.current = true }}
        onMouseUp={e => { if (!dragging.current) return; const dx = e.clientX - startX.current; if (Math.abs(dx) > 40) goTo(page + (dx < 0 ? 1 : -1)); dragging.current = false }}>
        <div ref={trackRef} style={{ display: 'flex', transition: 'transform .38s cubic-bezier(.4,0,.2,1)', willChange: 'transform', userSelect: 'none' }}>
          {pages.map((group, gi) => (
            <div key={gi} style={{ minWidth: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {group.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
            </div>
          ))}
        </div>
      </div>
      {total > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
          <button onClick={() => goTo(page - 1)} disabled={page === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: page === 0 ? .3 : 1, transition: 'opacity .2s', color: 'var(--ink)' }}><Icon n="chevron_left" size={20}/></button>
          {pages.map((_, i) => <button key={i} onClick={() => goTo(i)} style={{ width: i === page ? 22 : 7, height: 7, borderRadius: 99, background: i === page ? 'var(--ink)' : 'var(--border)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all .25s', flexShrink: 0 }}/>)}
          <button onClick={() => goTo(page + 1)} disabled={page === total - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: page === total - 1 ? .3 : 1, transition: 'opacity .2s', color: 'var(--ink)' }}><Icon n="chevron_right" size={20}/></button>
        </div>
      )}
    </div>
  )
}

/* ── Main Page ── */
export default function HomePage() {
  const [residences, setResidences] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    getResidences().then(data => { setResidences(data); setLoading(false) })
  }, [])
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const featured = residences.filter(r => r.featured).slice(0, 3)
  const display3  = featured.length > 0 ? featured : residences.slice(0, 3)

  return (
    <>
      <style>{`
        @keyframes waPulse { 0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.3)} 60%{box-shadow:0 4px 40px rgba(37,211,102,.6),0 0 0 8px rgba(37,211,102,.12)} }
        .btn-wa-pulse { animation: waPulse 2.4s ease-in-out infinite; }
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <Hero/>

      {/* Floating search bar */}
      <div style={{ background: 'var(--bg)', padding: '0 var(--pad)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', transform: 'translateY(-40px)' }}>
          <QuickSearch/>
        </div>
      </div>

      {/* Stats ticker */}
      <div className="ticker-strip">
        <div className="ticker-track">
          {[0, 1].map(rep => (
            <div key={rep} className="ticker-items">
              {[
                { icon: 'apartment',  text: 'Résidences actives à Abidjan' },
                { icon: 'star',       text: '4.9 / 5 · Clients satisfaits' },
                { icon: 'chat',       text: '< 5 min · Réponse WhatsApp' },
                { icon: 'verified',   text: '100% Visites vérifiées' },
                { icon: 'shield',     text: 'Zéro arnaque garantie' },
                { icon: 'bolt',       text: 'Réservation en 30 secondes' },
              ].map((item, i) => (
                <span key={i} className="ticker-item">
                  <Icon n={item.icon} size={14} color={'var(--gold)'}/>
                  {item.text}
                  <span className="ticker-dot">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Split */}
      <div className="section" style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 0 }}>
        <div className="editorial-split">
          <div>
            <div className="section-label">01 Notre valeur</div>
            <h2 className="editorial-headline">
              Pas votre agence<br/>
              immobilière <em>ordinaire</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 380, margin: '22px 0 32px' }}>
              Nous sélectionnons des résidences meublées de qualité à Abidjan. Réservation directe sur WhatsApp, sans intermédiaire, sans frais cachés.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link href="/residences" className="btn btn-dark" style={{ borderRadius: 'var(--r-lg)', padding: '14px 28px' }}>
                <Icon n="apartment" size={17}/>
                Voir les résidences
              </Link>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-outline" style={{ borderRadius: 'var(--r-lg)', padding: '14px 22px' }}>
                <Icon n="chat" size={17}/>
                WhatsApp
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: 'verified',      text: 'Visite réelle avant chaque publication' },
                { icon: 'shield',        text: 'Aucun paiement avant confirmation' },
                { icon: 'support_agent', text: 'Support disponible 7j/7 sur WhatsApp' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon n={f.icon} size={18} color={'var(--gold)'}/>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured cards cluster */}
          {loading ? (
            <div className="feat-cards-cluster">
              <div className="skeleton" style={{ flex: 1, minHeight: 420, borderRadius: 'var(--r-xl)' }}/>
              <div className="feat-cards-side">
                <div className="skeleton" style={{ flex: 1, borderRadius: 'var(--r-xl)', minHeight: 195 }}/>
                <div className="skeleton" style={{ flex: 1, borderRadius: 'var(--r-xl)', minHeight: 195 }}/>
              </div>
            </div>
          ) : display3.length > 0 ? (
            <div className="feat-cards-cluster">
              {display3[0] && <FeaturedCard residence={display3[0]} size="large"/>}
              <div className="feat-cards-side">
                {display3[1] && <FeaturedCard residence={display3[1]} size="small"/>}
                {display3[2] && <FeaturedCard residence={display3[2]} size="small"/>}
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="apartment" size={52} color={'var(--subtle)'}/>
            </div>
          )}
        </div>
      </div>

      {/* Marquee Headline + Stats */}
      <div className="marquee-section">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--pad)' }}>
          <div className="marquee-headline">
            New Horizon signifie<br/>
            <span className="marquee-italic">Trouver un chez-soi</span>
            <span className="marquee-cursor">_</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 1, background: 'var(--border)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)', overflow: 'hidden', marginTop: 52,
          }}>
            {[
              { n: residences.length > 0 ? residences.length : 0, suf: '', label: 'Résidences actives', ld: loading },
              { n: 120, suf: '+', label: 'Réservations ce mois', ld: false },
              { n: 5,   suf: ' min', label: 'Réponse WhatsApp', ld: false },
              { n: 50,  suf: '+', label: 'Clients actifs', ld: false },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', padding: 'clamp(24px,4vw,40px) clamp(20px,3vw,32px)' }}>
                <div className="stat-number">
                  {s.ld ? <span style={{ color: 'var(--subtle)' }}>—</span> : <Counter target={s.n} suffix={s.suf}/>}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Residences */}
      <div style={{ background: 'var(--bg)' }}>
        <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 'clamp(32px,5vw,48px)', flexWrap: 'wrap' }}>
            <div>
              <div className="section-label">Catalogue 2025</div>
              <h2 className="section-title">Choisissez<br/><em>votre résidence</em></h2>
            </div>
            <Link href="/residences" className="btn btn-outline" style={{ flexShrink: 0 }}>
              Voir tout <Icon n="arrow_forward" size={18}/>
            </Link>
          </div>
          {loading ? (
            <div className="grid-auto">
              {[1,2,3,4,5,6].map(i => (
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
          ) : residences.length > 0 ? (
            isMobile
              ? <MobileCarousel items={residences}/>
              : <div className="grid-auto">{residences.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}</div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <Icon n="apartment" size={48} color={'var(--subtle)'} style={{ display: 'block', margin: '0 auto 12px' }}/>
              <p>Aucune résidence disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      <HowItWorks/>

      {/* Value Props */}
      <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="value-props-grid">
          <div>
            <div className="section-label">Pourquoi nous</div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>
              Votre accès aux<br/><em>plus belles résidences</em>
            </h2>
            <p className="section-desc" style={{ marginBottom: 36 }}>
              New Horizon vous donne accès à de belles résidences meublées à Abidjan, directement réservables. Des logements soigneusement sélectionnés — prix clairs, photos fidèles.
            </p>
            <Link href="/residences" className="btn btn-dark">
              <Icon n="apartment" size={17}/>
              Voir les résidences
            </Link>
          </div>
          <div className="feature-strip">
            {[
              { icon: 'verified',      title: 'Visite réelle avant publication', desc: 'Chaque bien est inspecté physiquement. Zéro arnaque possible.' },
              { icon: 'chat',          title: 'Réponse WhatsApp en < 5 min',     desc: 'Aucun formulaire compliqué. Un clic et on vous répond directement.' },
              { icon: 'shield',        title: 'Aucun paiement avant validation',  desc: 'On confirme d\'abord la disponibilité. Vous payez après accord.' },
              { icon: 'support_agent', title: 'Support 24h/7j',                   desc: 'On répond toujours, même le weekend et les jours fériés.' },
            ].map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon"><Icon n={f.icon} size={36}/></div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <Testimonials/>
      </div>

      {/* CTA Banner */}
      <div style={{ padding: 'clamp(56px,9vw,100px) var(--pad)' }}>
        <div className="cta-banner">
          <div className="cta-glow"/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="cta-banner-title">
              <span><Icon n="local_fire_department" size={22} color={'#EF4444'}/> Trouvez votre résidence</span>
              <em>avant ce soir</em>
            </h2>
            <p className="cta-banner-sub">
              <Icon n="smartphone" size={16}/>
              Cliquez et discutez directement avec un agent — réponse garantie en 2 min.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/residences" className="btn btn-white">Explorer les résidences</Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa btn-wa-pulse">
              <Icon n="chat" size={17}/>
              Réserver sur WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Sticky WhatsApp */}
      <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener"
        title="Réserver via WhatsApp"
        className="wa-sticky"
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.animationName = 'none' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.animationName = 'waPulse' }}>
        <Icon n="chat" size={20}/>
        Réserver · 2 min
      </a>
    </>
  )
}
