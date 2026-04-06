'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { EQUIPEMENTS_ICONS, formatPrix } from '@/lib/config'

// ── 3D Tilt hook ──────────────────────────────────────────────
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return

    let raf = null
    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width  - 0.5
        const y = (e.clientY - rect.top)  / rect.height - 0.5
        el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.022)`
        el.style.boxShadow = `${-x * 20}px ${y * 16 + 14}px 52px rgba(15,14,12,.16), 0 2px 8px rgba(15,14,12,.06)`
        el.style.zIndex = '2'
      })
    }
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      el.style.transform = ''
      el.style.boxShadow = ''
      el.style.zIndex = ''
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref])
}

// ── Photo Slideshow ───────────────────────────────────────────
function PhotoSlideshow({ photos, title, prix, prixUnit, typeBien }) {
  const [cur, setCur]               = useState(0)
  const [prev, setPrev]             = useState(null)
  const [dir, setDir]               = useState('next')
  const [sliding, setSliding]       = useState(false)
  const timerRef                    = useRef(null)
  const count                       = photos.length

  const go = useCallback((to, direction = 'next') => {
    if (sliding || count <= 1 || to === cur) return
    setDir(direction)
    setPrev(cur)
    setSliding(true)
    setCur(to)
    setTimeout(() => { setPrev(null); setSliding(false) }, 400)
  }, [sliding, count, cur])

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    if (count <= 1) return
    timerRef.current = setInterval(() => {
      setCur(c => {
        const next = (c + 1) % count
        setDir('next')
        setPrev(c)
        setSliding(true)
        setTimeout(() => { setPrev(null); setSliding(false) }, 400)
        return next
      })
    }, 5000)
  }, [count])

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [startTimer])

  const handlePrev = (e) => {
    e.preventDefault(); e.stopPropagation()
    go((cur - 1 + count) % count, 'prev')
    startTimer()
  }
  const handleNext = (e) => {
    e.preventDefault(); e.stopPropagation()
    go((cur + 1) % count, 'next')
    startTimer()
  }

  const imgStyle = (role) => {
    // role: 'cur-enter' | 'prev-exit'
    let tx = '0%'
    if (role === 'cur-enter')  tx = sliding ? '0%'                            : (dir === 'next' ? '100%' : '-100%')
    if (role === 'prev-exit')  tx = dir === 'next' ? '-100%' : '100%'
    return {
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      objectFit: 'cover',
      transform: `translateX(${tx})`,
      transition: sliding ? 'transform .4s cubic-bezier(.4,0,.2,1)' : 'none',
      willChange: 'transform',
    }
  }

  if (count === 0) {
    return (
      <div className="res-card-img">
        <div className="res-card-img-placeholder">
          <span className="material-icons" style={{ fontSize: 48, color: 'var(--border)' }}>apartment</span>
        </div>
        <CardOverlays prix={prix} prixUnit={prixUnit} typeBien={typeBien} count={count} cur={0} photos={[]}/>
      </div>
    )
  }

  return (
    <div className="res-card-img">
      {/* Previous photo exiting */}
      {sliding && prev !== null && (
        <img src={photos[prev]} alt={title} style={imgStyle('prev-exit')} loading="lazy"/>
      )}
      {/* Current photo entering */}
      <img src={photos[cur]} alt={title} style={imgStyle('cur-enter')} loading="lazy"/>

      {/* Gradient overlay */}
      <div className="res-card-overlay"/>

      <CardOverlays
        prix={prix} prixUnit={prixUnit} typeBien={typeBien}
        count={count} cur={cur} photos={photos}
        onPrev={handlePrev} onNext={handleNext}
        onDot={(i, e) => { e.preventDefault(); e.stopPropagation(); go(i, i > cur ? 'next' : 'prev'); startTimer() }}
      />
    </div>
  )
}

function CardOverlays({ prix, prixUnit, typeBien, count, cur, photos, onPrev, onNext, onDot }) {
  return (
    <>
      {/* Top badges */}
      <div className="res-card-badges">
        <span className="badge badge-dark" style={{ textTransform: 'capitalize' }}>{typeBien}</span>
        <span className="badge badge-gold badge-priority">
          <span className="material-icons" style={{ fontSize: 11 }}>star</span>
          Prioritaire
        </span>
      </div>

      {/* Price */}
      {prix && (
        <div className="res-card-price-overlay">
          <div className="price-amount">{formatPrix(prix)}</div>
          <div className="price-unit">{prixUnit}</div>
        </div>
      )}

      {/* Dots only */}
      {count > 1 && (
        <div className="slide-dots">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`slide-dot${i === cur ? ' active' : ''}`}
            />
          ))}
        </div>
      )}
    </>
  )
}

// ── Scroll reveal hook ────────────────────────────────────────
function useScrollReveal(ref, delay = 0) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return visible
}

// ── ResidenceCard ─────────────────────────────────────────────
export default function ResidenceCard({ residence, index = 0 }) {
  const wrapRef  = useRef(null)
  const tiltRef  = useRef(null)
  useTilt(tiltRef)
  const visible  = useScrollReveal(wrapRef, index * 80)

  const photos   = (residence.photos || []).filter(Boolean)
  const equips   = (residence.equipements || []).slice(0, 3)
  const prix     = residence.prix_nuit || residence.prix_journee || residence.prix_mensuel
  const prixUnit = residence.prix_nuit ? '/nuit' : residence.prix_journee ? '/j' : '/mois'

  return (
    <div
      ref={wrapRef}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(.97)',
        transition: `opacity .52s cubic-bezier(.22,.68,0,1.1) ${index * 70}ms,
                     transform .52s cubic-bezier(.22,.68,0,1.1) ${index * 70}ms`,
        borderRadius: 'var(--r-xl)',
        willChange: 'transform, opacity',
      }}
    >
      <div ref={tiltRef} style={{ borderRadius: 'var(--r-xl)', transition: 'transform .22s, box-shadow .22s', willChange: 'transform' }}>
        <Link href={`/residences/${residence.id}`} style={{ display: 'block', textDecoration: 'none' }}>
          <article className="res-card" style={{ transform: 'none' }}>

            <PhotoSlideshow
              photos={photos}
              title={residence.titre}
              prix={prix}
              prixUnit={prixUnit}
              typeBien={residence.type_bien}
            />

            <div className="res-card-body">
              <div className="res-card-location">
                <span className="material-icons" style={{ fontSize: 11, verticalAlign: 'middle', marginRight: 3 }}>location_on</span>
                {[residence.quartier, residence.commune, residence.ville].filter(Boolean).join(' · ')}
              </div>
              <h3 className="res-card-title">{residence.titre}</h3>

              {equips.length > 0 && (
                <div className="res-card-tags">
                  {equips.map(k => {
                    const eq = EQUIPEMENTS_ICONS[k]
                    if (!eq) return null
                    return (
                      <span key={k} className="res-card-tag">
                        <span className="material-icons" style={{ fontSize: 12 }}>{eq.icon}</span>
                        {eq.label}
                      </span>
                    )
                  })}
                  {(residence.equipements || []).length > 3 && (
                    <span className="res-card-tag">+{(residence.equipements).length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </article>
        </Link>
      </div>
    </div>
  )
}
