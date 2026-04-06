'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getResidences, SITE, COMMUNES, TYPES_BIEN, formatPrix } from '@/lib/config'
import ResidenceCard from '@/components/ui/ResidenceCard'

// ── Mobile 2×2 Carousel ───────────────────────────────────────
function MobileCarousel({ items }) {
  const [page, setPage] = useState(0)
  const trackRef = useRef(null)
  const startX = useRef(null)
  const dragging = useRef(false)

  // Group items into pages of 4 (2 cols × 2 rows)
  const pages = []
  for (let i = 0; i < items.length; i += 4) pages.push(items.slice(i, i + 4))
  const total = pages.length

  const goTo = (p) => {
    const clamped = Math.max(0, Math.min(p, total - 1))
    setPage(clamped)
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-clamped * 100}%)`
    }
  }

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; dragging.current = true }
  const onTouchEnd   = (e) => {
    if (!dragging.current) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) goTo(page + (dx < 0 ? 1 : -1))
    dragging.current = false
  }
  const onMouseDown  = (e) => { startX.current = e.clientX; dragging.current = true }
  const onMouseUp    = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 40) goTo(page + (dx < 0 ? 1 : -1))
    dragging.current = false
  }

  return (
    <div>
      {/* Track */}
      <div style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <div ref={trackRef} style={{
          display: 'flex', transition: 'transform .38s cubic-bezier(.4,0,.2,1)',
          willChange: 'transform', userSelect: 'none',
        }}>
          {pages.map((group, gi) => (
            <div key={gi} style={{
              minWidth: '100%', display: 'grid',
              gridTemplateColumns: '1fr 1fr', gap: 10,
            }}>
              {group.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
            </div>
          ))}
        </div>
      </div>

      {/* Dots + arrows */}
      {total > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
          <button onClick={() => goTo(page - 1)} disabled={page === 0}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: page === 0 ? .3 : 1, transition: 'opacity .2s', color: 'var(--ink)' }}>
            <span className="material-icons" style={{ fontSize: 20 }}>chevron_left</span>
          </button>
          {pages.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === page ? 22 : 7, height: 7, borderRadius: 99,
              background: i === page ? 'var(--ink)' : 'var(--border)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all .25s', flexShrink: 0,
            }}/>
          ))}
          <button onClick={() => goTo(page + 1)} disabled={page === total - 1}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: page === total - 1 ? .3 : 1, transition: 'opacity .2s', color: 'var(--ink)' }}>
            <span className="material-icons" style={{ fontSize: 20 }}>chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}

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
const SLIDES = [
  {
    eyebrow: 'Abidjan · Cocody · Riviera',
    title: ['Trouvez votre résidence', <em key="e"> en 5 min</em>],
    sub: 'Logements meublés, climatisés, prêts à vivre. Sans frais cachés. Réservation directe sur WhatsApp.',
    localImage: '/hero/hero-1.jpg',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'Cocody · Marcory · Plateau · Yopougon',
    title: ['Votre chez-vous', <em key="e"> à Abidjan</em>],
    sub: 'Studios, appartements et villas disponibles dans tous les quartiers. Réponse WhatsApp en moins de 5 min.',
    localImage: '/hero/hero-2.jpg',
    fallback: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'Réservation instantanée',
    title: ['Réservez en', <em key="e"> 30 secondes</em>],
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
      {SLIDES.map((sl, i) => (
        <HeroSlide key={i} slide={sl} active={i === active} />
      ))}
      <div className="hero-overlay"/>

      {/* Urgency badge */}
      <div style={{
        position: 'absolute', top: 80, right: 'var(--pad)', zIndex: 20,
        background: 'rgba(239,68,68,.92)', backdropFilter: 'blur(12px)',
        borderRadius: 99, padding: '7px 14px',
        display: 'flex', alignItems: 'center', gap: 7,
        boxShadow: '0 4px 20px rgba(239,68,68,.4)',
        animation: 'pulseUrgency 2.5s ease-in-out infinite',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'blink 1.2s ease-in-out infinite' }}/>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '.04em', display:'flex', alignItems:'center', gap:5 }}><span className="material-icons" style={{fontSize:14}}>local_fire_department</span> Très demandé cette semaine</span>
      </div>

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
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa btn-wa-pulse">
              <span className="material-icons" style={{ fontSize: 17 }}>chat</span>
              <span className="material-icons" style={{fontSize:14}}>local_fire_department</span> Réserver maintenant (réponse en 2 min)
            </a>
          </div>

          {/* Trust bar sous les CTA */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap',
            opacity: fading ? 0 : 1, transition: 'opacity .55s .22s',
          }}>
            {[
              { icon: 'shield', text: 'Aucun paiement avant validation' },
              { icon: 'verified', text: 'Visite réelle avant publication' },
              { icon: 'lock', text: 'Zéro arnaque garantie' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-icons" style={{ fontSize: 14, color: 'rgba(255,255,255,.7)' }}>{t.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', fontWeight: 500 }}>{t.text}</span>
              </div>
            ))}
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

  const QUICK_SUGGESTIONS = [
    { label: 'Studio à Cocody', ville: 'Abidjan', type: 'studio' },
    { label: 'Villa avec piscine', ville: '', type: 'villa' },
    { label: 'Appartement Plateau', ville: 'Abidjan', type: 'appartement' },
  ]

  return (
    <div>
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--r-2xl)',
        boxShadow: 'var(--sh-xl)', padding: 8,
        display: 'flex', alignItems: 'center', gap: 0,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 180px', padding: '10px 20px', borderRight: '1px solid var(--border)', minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 4 }}>Commune / Quartier</div>
          <select value={ville} onChange={e => setVille(e.target.value)} style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-ui)', fontSize: 14, color: ville ? 'var(--ink)' : 'var(--subtle)', cursor: 'pointer',
          }}>
            <option value="">Toutes communes</option>
            {COMMUNES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

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

        <div style={{ padding: '4px 4px 4px 8px', flexShrink: 0 }}>
          <button className="btn btn-dark" onClick={handleSearch} style={{ borderRadius: 'var(--r-lg)', padding: '13px 24px' }}>
            <span className="material-icons" style={{ fontSize: 18 }}>search</span>
            Explorer
          </button>
        </div>
      </div>

      {/* Suggestions rapides */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Populaires :</span>
        {QUICK_SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => {
            const params = new URLSearchParams()
            if (s.ville) params.set('ville', s.ville)
            if (s.type) params.set('type', s.type)
            window.location.href = `/residences${params.toString() ? '?' + params : ''}`
          }} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 99,
            background: 'var(--white)', border: '1px solid var(--border)',
            fontSize: 12, fontWeight: 500, color: 'var(--ink-2)',
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.background = 'var(--surface)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--white)' }}>
            <span className="material-icons" style={{ fontSize: 12 }}>search</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── How it works ──────────────────────────────────────────────
function StepsCarousel({ steps }) {
  const [cur, setCur] = useState(0)
  const trackRef = useRef(null)
  const startX = useRef(null)

  const goTo = (i) => {
    const c = Math.max(0, Math.min(i, steps.length - 1))
    setCur(c)
    if (trackRef.current) trackRef.current.style.transform = `translateX(${-c * 100}%)`
  }
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1))
  }

  return (
    <div>
      <div style={{ overflow: 'hidden' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div ref={trackRef} style={{ display: 'flex', transition: 'transform .38s cubic-bezier(.4,0,.2,1)', willChange: 'transform' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ minWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 8px' }}>
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 'var(--r-xl)',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', boxShadow: '0 8px 24px rgba(255,122,26,.3)',
                }}>
                  <span className="material-icons" style={{ fontSize: 32 }}>{s.icon}</span>
                </div>
                <div style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--ink)', color: 'var(--bg)',
                  fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.num}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: 'var(--ink)', marginBottom: 10 }}>{s.title}</div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 260 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Dots + arrows */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 28 }}>
        <button onClick={() => goTo(cur - 1)} disabled={cur === 0}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: cur === 0 ? .3 : 1, transition: 'opacity .2s', color: 'var(--ink)' }}>
          <span className="material-icons" style={{ fontSize: 22 }}>chevron_left</span>
        </button>
        {steps.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === cur ? 24 : 8, height: 8, borderRadius: 99,
            background: i === cur ? 'var(--gold)' : 'var(--border)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all .25s', flexShrink: 0,
          }}/>
        ))}
        <button onClick={() => goTo(cur + 1)} disabled={cur === steps.length - 1}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: cur === steps.length - 1 ? .3 : 1, transition: 'opacity .2s', color: 'var(--ink)' }}>
          <span className="material-icons" style={{ fontSize: 22 }}>chevron_right</span>
        </button>
      </div>
    </div>
  )
}

function HowItWorks() {
  const STEPS = [
    { icon: 'apartment', num: '1', title: 'Choisissez une résidence', desc: 'Parcourez nos logements avec photos réelles, prix affichés, équipements détaillés.' },
    { icon: 'chat',      num: '2', title: 'Cliquez sur WhatsApp',      desc: 'Un bouton → contact direct. Pas de formulaire, pas d\'attente, pas d\'intermédiaire.' },
    { icon: 'check_circle', num: '3', title: 'Confirmez en 2 minutes', desc: 'Notre agent confirme la disponibilité et vous guide pour la caution sécurisée.' },
  ]
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,48px)' }}>
          <div className="section-label">Simple & rapide</div>
          <h2 className="section-title">Comment<br/><em>ça marche ?</em></h2>
        </div>

        {/* Mobile: carousel | Desktop: grid */}
        {isMobile ? (
          <StepsCarousel steps={STEPS} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px,3vw,32px)' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 'var(--r-xl)',
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', boxShadow: '0 8px 24px rgba(255,122,26,.3)',
                  }}>
                    <span className="material-icons" style={{ fontSize: 28 }}>{s.icon}</span>
                  </div>
                  <div style={{
                    position: 'absolute', top: -8, right: -8,
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--ink)', color: 'var(--bg)',
                    fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{s.num}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--ink)', marginBottom: 8 }}>{s.title}</div>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 220 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 'clamp(32px,4vw,48px)' }}>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa btn-wa-pulse" style={{ fontSize: 15, padding: '14px 32px' }}>
            <span className="material-icons" style={{ fontSize: 19 }}>chat</span>
            <span className="material-icons" style={{fontSize:16}}>local_fire_department</span> Démarrer ma recherche sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials() {
  const REVIEWS = [
    { name: 'Kofi A.',  zone: 'Cocody',  text: "J'ai trouvé mon appartement en moins d'une heure. Le suivi WhatsApp est très réactif, top service !", avatar: 'K' },
    { name: 'Marie D.', zone: 'Plateau', text: "Résidence exactement comme sur les photos. Aucune mauvaise surprise à l'arrivée. Je recommande vraiment !", avatar: 'M' },
    { name: 'Serge B.', zone: 'Marcory', text: "Réponse en 3 minutes sur WhatsApp. Clé en main, meublé, climatisé. Parfait pour un séjour professionnel.", avatar: 'S' },
  ]
  const [cur, setCur] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const trackRef = useRef(null)
  const startX = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-slide every 3s on mobile
  useEffect(() => {
    if (!isMobile) return
    const id = setInterval(() => {
      setCur(c => {
        const next = (c + 1) % REVIEWS.length
        if (trackRef.current) trackRef.current.style.transform = `translateX(${-next * 100}%)`
        return next
      })
    }, 3000)
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
    <div style={{
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)', padding: 'clamp(20px,3vw,28px)',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {'★★★★★'.split('').map((s, j) => <span key={j} style={{ color: '#F59E0B', fontSize: 17 }}>{s}</span>)}
      </div>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7, flex: 1, fontStyle: 'italic' }}>"{r.text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'var(--gold-pale)', border: '1px solid rgba(255,122,26,.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--gold)',
        }}>{r.avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{r.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>{r.zone} · <span className="material-icons" style={{fontSize:12,color:'#16A34A'}}>check_circle</span><span>Client vérifié</span></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,48px)' }}>
        <div className="section-label">Avis clients vérifiés</div>
        <h2 className="section-title">Ils nous font<br/><em>confiance</em></h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 10 }}>
          <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:2,marginBottom:4}}>
            {['star','star','star','star','star'].map((s,i)=><span key={i} className="material-icons" style={{fontSize:16,color:'#F59E0B'}}>{s}</span>)}
            <span style={{fontSize:14,color:'var(--muted)',marginLeft:6}}>4.9/5 sur 120+ réservations ce mois</span>
          </span>
        </p>
      </div>

      {isMobile ? (
        /* Mobile: auto-slide carousel, no arrows */
        <div>
          <div style={{ overflow: 'hidden', borderRadius: 'var(--r-xl)' }}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div ref={trackRef} style={{
              display: 'flex',
              transition: 'transform .5s cubic-bezier(.4,0,.2,1)',
              willChange: 'transform',
            }}>
              {REVIEWS.map((r, i) => (
                <div key={i} style={{ minWidth: '100%' }}>
                  <ReviewCard r={r} />
                </div>
              ))}
            </div>
          </div>
          {/* Dots only */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
            {REVIEWS.map((_, i) => (
              <div key={i} style={{
                width: i === cur ? 22 : 7, height: 7, borderRadius: 99,
                background: i === cur ? 'var(--gold)' : 'var(--border)',
                transition: 'all .3s',
              }}/>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop: grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {REVIEWS.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      )}
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
  const display3  = featured.length > 0 ? featured : residences.slice(0, 3)
  const allRes    = residences

  return (
    <>
      <style>{`
        @keyframes pulseUrgency { 0%,100%{opacity:1} 50%{opacity:.75} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes waPulse { 0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.3)} 60%{box-shadow:0 4px 40px rgba(37,211,102,.6),0 0 0 8px rgba(37,211,102,.12)} }
        .btn-wa-pulse { animation: waPulse 2.4s ease-in-out infinite; }
      `}</style>

      {/* ── Hero ── */}
      <Hero/>

      {/* ── Quick Search ── */}
      <div style={{ background: 'var(--bg)', padding: '0 var(--pad)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', transform: 'translateY(-32px)' }}>
          <QuickSearch/>
        </div>
      </div>

      {/* ── Stats (crédibles) ── */}
      <div style={{ background: 'var(--bg)', padding: '0 var(--pad) clamp(56px,9vw,96px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 1, background: 'var(--border)',
            border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden',
          }}>
            {[
              { n: residences.length > 0 ? residences.length : 0, suf: '', label: 'Résidences actives', loading },
              { n: 120, suf: '+', label: 'Réservations ce mois', loading: false },
              { n: 5, suf: ' min', label: 'Réponse WhatsApp', loading: false },
              { n: 50, suf: '+', label: 'Clients actifs', loading: false },
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
              <div className="section-label">
                Catalogue 2025
              </div>
              <h2 className="section-title">Toutes nos<br/><em>résidences</em></h2>
            </div>
            <Link href="/residences" className="btn btn-outline" style={{ flexShrink: 0 }}>
              Voir tout
              <span className="material-icons" style={{ fontSize: 18 }}>arrow_forward</span>
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
          ) : allRes.length > 0 ? (
            <div className="grid-auto">
              {allRes.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <span className="material-icons" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: 'var(--subtle)' }}>apartment</span>
              <p>Aucune résidence disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── How It Works ── */}
      <HowItWorks/>

      {/* ── Value Props ── */}
      <div className="section" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="value-props-grid">
          <div>
            <div className="section-label">Pourquoi nous</div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>
              Votre accès aux<br/><em>plus belles résidences</em>
            </h2>
            <p className="section-desc" style={{ marginBottom: 36 }}>
              New Horizon vous donne accès à de belles résidences meublées à Abidjan, directement réservables. Des logements soigneusement sélectionnés par notre équipe — prix clairs, photos fidèles, réservation en quelques clics.
            </p>
            <Link href="/residences" className="btn btn-dark">
              <span className="material-icons" style={{fontSize:17}}>apartment</span>
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

      {/* ── Testimonials ── */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <Testimonials/>
      </div>

      {/* ── CTA Banner ── */}
      <div style={{ padding: 'clamp(56px,9vw,100px) var(--pad)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: 'var(--cta-bg)', borderRadius: 'var(--r-2xl)',
          padding: 'clamp(48px,7vw,80px) var(--pad)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: 60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,211,102,.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#fff', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12 }}>
              <span style={{display:'flex',alignItems:'center',gap:10}}><span className="material-icons" style={{fontSize:'inherit',color:'#EF4444'}}>local_fire_department</span> Trouvez votre résidence</span><em style={{ color: 'rgba(255,255,255,.45)' }}>avant ce soir</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', maxWidth: 400 }}>
              <span style={{display:'flex',alignItems:'center',gap:7}}><span className="material-icons" style={{fontSize:16}}>smartphone</span> Cliquez et discutez directement avec un agent — réponse garantie en 2 min.</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/residences" className="btn btn-white">
              Explorer les résidences
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa btn-wa-pulse">
              <span className="material-icons" style={{ fontSize: 17 }}>chat</span>
              Réserver sur WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Sticky WhatsApp CTA ── */}
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank" rel="noopener"
        title="Réserver via WhatsApp"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 7000,
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#25D366', color: '#fff',
          padding: '13px 22px', borderRadius: 99,
          fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14,
          textDecoration: 'none',
          animation: 'waPulse 2.4s ease-in-out infinite',
          transition: 'transform .18s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.animation = 'none' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.animation = 'waPulse 2.4s ease-in-out infinite' }}
      >
        <span className="material-icons" style={{ fontSize: 20 }}>chat</span>
        Réserver · 2 min
      </a>
    </>
  )
}
