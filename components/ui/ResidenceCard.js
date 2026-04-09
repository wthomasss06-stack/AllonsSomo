'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { EQUIPEMENTS_ICONS, formatPrix } from '@/lib/config'

// ── 3D Tilt ───────────────────────────────────────────────────
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return
    let raf = null
    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width  - 0.5
        const y = (e.clientY - r.top)  / r.height - 0.5
        el.style.transform = `perspective(900px) rotateY(${x*10}deg) rotateX(${-y*8}deg) translateY(-6px) scale(1.022)`
        el.style.boxShadow = `${-x*20}px ${y*16+14}px 52px rgba(15,14,12,.16)`
        el.style.zIndex    = '2'
      })
    }
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      el.style.transform = ''
      el.style.boxShadow = ''
      el.style.zIndex    = ''
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref])
}

// ── Scroll reveal ─────────────────────────────────────────────
function useScrollReveal(ref, delayMs) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return visible
}

// ── Slideshow — opacity crossfade, images jamais démontées ────
function Slideshow({ photos, title, prix, prixUnit, typeBien }) {
  const [cur, setCur] = useState(0)
  const count = photos.length

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => setCur(c => (c + 1) % count), 5000)
    return () => clearInterval(id)
  }, [count])

  return (
    // .res-card-img gère position:relative + padding-bottom:65% + overflow:hidden
    <div className="res-card-img">

      {/* Toutes les images empilées — seule l'active est opaque */}
      {count === 0 ? (
        <div className="res-card-img-placeholder">
          <span className="material-icons" style={{ fontSize: 48, color: 'var(--border)' }}>apartment</span>
        </div>
      ) : photos.map((src, i) => (
        <img
          key={src}           /* clé stable = pas de démontage */
          src={src}
          alt={title}
          loading={i === 0 ? 'eager' : 'lazy'}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: i === cur ? 1 : 0,
            transition: 'opacity .75s ease',
            willChange: 'opacity',
            // pointerEvents uniquement sur l'image active
            pointerEvents: i === cur ? 'auto' : 'none',
          }}
        />
      ))}

      {/* Dégradé bas */}
      <div className="res-card-overlay"/>

      {/* Badges haut */}
      <div className="res-card-badges">
        <span className="badge badge-dark" style={{ textTransform: 'capitalize' }}>{typeBien}</span>
        <span className="badge badge-gold badge-priority">
          <span className="material-icons" style={{ fontSize: 11 }}>star</span>
          Prioritaire
        </span>
      </div>

      {/* Prix bas-gauche */}
      {prix && (
        <div className="res-card-price-overlay">
          <div className="price-amount">{formatPrix(prix)}</div>
          <div className="price-unit">{prixUnit}</div>
        </div>
      )}

      {/* Dots indicateurs */}
      {count > 1 && (
        <div className="slide-dots">
          {photos.map((_, i) => (
            <span key={i} className={`slide-dot${i === cur ? ' active' : ''}`}/>
          ))}
        </div>
      )}
    </div>
  )
}

// ── ResidenceCard ─────────────────────────────────────────────
export default function ResidenceCard({ residence, index = 0 }) {
  const wrapRef = useRef(null)
  const tiltRef = useRef(null)
  useTilt(tiltRef)
  const visible = useScrollReveal(wrapRef)

  const photos   = (residence.photos || []).filter(Boolean)
  const equips   = (residence.equipements || []).slice(0, 3)
  const prix     = residence.prix_nuit || residence.prix_journee || residence.prix_mensuel
  const prixUnit = residence.prix_nuit ? '/nuit' : residence.prix_journee ? '/j' : '/mois'

  return (
    <div
      ref={wrapRef}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0) scale(1)' : 'translateY(26px) scale(.97)',
        transition: `opacity .5s ease ${index * 65}ms, transform .5s ease ${index * 65}ms`,
        borderRadius: 'var(--r-xl)',
      }}
    >
      <div
        ref={tiltRef}
        style={{ borderRadius: 'var(--r-xl)', transition: 'transform .22s, box-shadow .22s' }}
      >
        <Link href={`/residences/${residence.id}`} style={{ display: 'block', textDecoration: 'none' }}>
          <article className="res-card" style={{ transform: 'none' }}>

            <Slideshow
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
