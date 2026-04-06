'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getResidence, getResidences, formatPrix, EQUIPEMENTS_ICONS, SITE, fetchWhatsApp } from '@/lib/config'
import MapView from '@/components/ui/MapView'
import ResidenceCard from '@/components/ui/ResidenceCard'

// ── Page Loader ───────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 64 }}>
      <style>{`
        @keyframes loaderSlide {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes logoPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.7;transform:scale(.95);} }
        @keyframes loaderBar { 0%{width:0%;margin-left:0} 50%{width:80%;margin-left:0} 100%{width:0%;margin-left:100%} }
        .ld-shimmer {
          background: linear-gradient(90deg, var(--surface) 0%, var(--border) 40%, var(--surface) 100%);
          background-size: 600px 100%;
          animation: loaderSlide 1.3s ease-in-out infinite;
          border-radius: 12px;
        }
      `}</style>

      {/* Logo loader pulsant */}
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', pointerEvents: 'none', zIndex: 500,
        flexDirection: 'column', gap: 20,
      }}>
        <div style={{ animation: 'logoPulse 1.4s ease-in-out infinite' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="80" height="80" aria-hidden="true">
            <defs>
              <linearGradient id="lgs" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D3D3D3"/><stop offset="100%" stopColor="#808080"/></linearGradient>
              <linearGradient id="lgb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#A05A2C"/><stop offset="100%" stopColor="#3E1E04"/></linearGradient>
            </defs>
            <g transform="translate(40,20)">
              <path d="M 120 140 L 180 140 L 220 280 L 220 140 L 260 140 L 210 320 L 150 320 L 110 180 L 110 320 L 70 320 Z" fill="var(--ink)"/>
              <polygon points="70,140 120,140 110,180" fill="var(--ink)"/>
              <path d="M 230 140 L 270 140 L 270 210 L 320 210 L 320 140 L 370 140 L 370 320 L 330 320 L 330 250 L 270 250 L 270 320 L 230 320 Z" fill="#FF8C42"/>
              <polygon points="230,140 270,140 250,170" fill="rgba(255,255,255,0.5)"/>
              <polygon points="320,140 370,140 340,170" fill="rgba(255,255,255,0.5)"/>
              <path d="M 270 260 C 310 260, 340 230, 360 210 C 330 240, 300 280, 270 280 Z" fill="url(#lgs)"/>
              <path d="M 280 290 C 330 290, 360 320, 380 350 C 350 320, 310 310, 260 310 Z" fill="url(#lgb)"/>
              <text x="220" y="380" fontFamily="'DM Sans',Arial,sans-serif" fontWeight="900" fontSize="36" textAnchor="middle" letterSpacing="2"><tspan fill="var(--ink)">NEW </tspan><tspan fill="#FF8C42">HORIZON</tspan></text>
            </g>
          </svg>
        </div>
        <div style={{ width: 180, height: 2, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#FF8C42', borderRadius: 99, animation: 'loaderBar 1.4s ease-in-out infinite' }}/>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(28px,4vw,48px) var(--pad)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[80,14,100,14,160].map((w,i) => (
            <div key={i} className="ld-shimmer" style={{ width: w, height: 14, borderRadius: 99 }}/>
          ))}
        </div>
        <div className="ld-shimmer" style={{ width: '100%', aspectRatio: '16/9', maxHeight: 480, marginBottom: 10, borderRadius: 20 }}/>
        <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="ld-shimmer" style={{ width: 80, height: 56, borderRadius: 10, flexShrink: 0 }}/>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) clamp(280px,30%,360px)', gap: 48 }} className="detail-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="ld-shimmer" style={{ width: 90, height: 26, borderRadius: 99 }}/>
              <div className="ld-shimmer" style={{ width: 80, height: 26, borderRadius: 99 }}/>
            </div>
            <div className="ld-shimmer" style={{ height: 42, width: '72%' }}/>
            <div className="ld-shimmer" style={{ height: 16, width: '38%' }}/>
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}/>
            {[100,88,94,82,96].map((w,i) => (
              <div key={i} className="ld-shimmer" style={{ height: 14, width: `${w}%` }}/>
            ))}
          </div>
          <div className="ld-shimmer" style={{ height: 420, borderRadius: 20 }}/>
        </div>
      </div>
    </div>
  )
}

// ── Lightbox Modal ────────────────────────────────────────────
function Lightbox({ photos, startIndex, onClose }) {
  const [cur, setCur] = useState(startIndex)
  const total = photos.length
  const touchX = useRef(null)

  const prev = useCallback(() => setCur(c => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCur(c => (c + 1) % total), [total])

  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [prev, next, onClose])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,.93)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn .15s',
    }}>
      <style>{`@keyframes lbIn { from { opacity:0;transform:scale(.95); } to { opacity:1;transform:scale(1); } }`}</style>

      {/* Main image */}
      <div onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
          touchX.current = null
        }}
        style={{ position: 'relative', maxWidth: 'min(92vw,1100px)', maxHeight: '88vh', animation: 'lbIn .2s' }}>
        <img key={cur} src={photos[cur]} alt={`Photo ${cur+1}`} style={{
          display: 'block', maxWidth: '100%', maxHeight: '78vh',
          borderRadius: 14, objectFit: 'contain',
          boxShadow: '0 32px 80px rgba(0,0,0,.6)',
        }}/>
        <div style={{
          position: 'absolute', bottom: -34, left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,.55)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
        }}>{cur+1} / {total}</div>
      </div>

      {/* Arrows */}
      {total > 1 && [
        { fn: e => { e.stopPropagation(); prev() }, icon: 'chevron_left', side: 'left' },
        { fn: e => { e.stopPropagation(); next() }, icon: 'chevron_right', side: 'right' },
      ].map(b => (
        <button key={b.side} onClick={b.fn} style={{
          position: 'fixed', [b.side]: 12, top: '50%', transform: 'translateY(-50%)',
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', transition: 'background .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.24)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
        >
          <span className="material-icons" style={{ fontSize: 26 }}>{b.icon}</span>
        </button>
      ))}

      {/* Close */}
      <button onClick={onClose} style={{
        position: 'fixed', top: 14, right: 14,
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)',
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', transition: 'background .15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.24)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
      >
        <span className="material-icons">close</span>
      </button>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div onClick={e => e.stopPropagation()} style={{
          position: 'fixed', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6,
          background: 'rgba(0,0,0,.5)', borderRadius: 12, padding: '8px 10px',
          backdropFilter: 'blur(12px)',
          maxWidth: 'calc(100vw - 32px)', overflowX: 'auto',
        }}>
          {photos.map((url, i) => (
            <button key={i} onClick={() => setCur(i)} style={{
              width: 52, height: 38, borderRadius: 7, overflow: 'hidden',
              border: `2px solid ${i === cur ? '#fff' : 'transparent'}`,
              opacity: i === cur ? 1 : .45,
              transition: 'all .15s', flexShrink: 0, padding: 0, cursor: 'pointer',
            }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Gallery ───────────────────────────────────────────────────
function Gallery({ photos, titre }) {
  const [cur, setCur] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const total = photos.length
  const touchX = useRef(null)

  const prev = useCallback(e => { e?.stopPropagation(); setCur(c => (c - 1 + total) % total) }, [total])
  const next = useCallback(e => { e?.stopPropagation(); setCur(c => (c + 1) % total) }, [total])

  if (total === 0) return (
    <div style={{
      background: 'var(--surface)', borderRadius: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320,
    }}>
      <span className="material-icons" style={{ fontSize: 64, color: 'var(--border)' }}>apartment</span>
    </div>
  )

  return (
    <>
      {lightbox !== null && (
        <Lightbox photos={photos} startIndex={lightbox} onClose={() => setLightbox(null)}/>
      )}

      {/* Main image — aspect ratio fixe, jamais overflow */}
      <div
        style={{
          position: 'relative', width: '100%',
          aspectRatio: '16/9', maxHeight: 480,
          borderRadius: 20, overflow: 'hidden',
          background: 'var(--surface)',
          cursor: total > 1 ? 'zoom-in' : 'default',
          marginBottom: 8,
        }}
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
          touchX.current = null
        }}
        onClick={() => setLightbox(cur)}
      >
        {photos.map((url, i) => (
          <img key={i} src={url} alt={`${titre} ${i+1}`} style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: i === cur ? 1 : 0,
            transition: 'opacity .38s var(--ease)',
          }}/>
        ))}

        {/* Expand hint */}
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 4,
          background: 'rgba(15,14,12,.62)', backdropFilter: 'blur(8px)',
          borderRadius: 8, padding: '5px 10px',
          display: 'flex', alignItems: 'center', gap: 5,
          color: '#fff', fontSize: 11, fontWeight: 600,
          pointerEvents: 'none',
        }}>
          <span className="material-icons" style={{ fontSize: 14 }}>open_in_full</span>
          Agrandir
        </div>

        {/* Nav arrows */}
        {total > 1 && [
          { fn: prev, icon: 'chevron_left', side: 'left' },
          { fn: next, icon: 'chevron_right', side: 'right' },
        ].map(b => (
          <button key={b.side} onClick={b.fn} style={{
            position: 'absolute', [b.side]: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 5,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,.88)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', cursor: 'pointer', boxShadow: 'var(--sh-md)',
            transition: 'transform .15s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%)'}
          >
            <span className="material-icons">{b.icon}</span>
          </button>
        ))}

        {/* Counter */}
        {total > 1 && (
          <div style={{
            position: 'absolute', bottom: 12, right: 12, zIndex: 5,
            background: 'rgba(15,14,12,.7)', color: '#fff',
            padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
          }}>
            {cur+1} / {total}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {photos.slice(0, 8).map((url, i) => (
            <button key={i} onClick={() => setCur(i)} style={{
              flex: '0 0 80px', height: 56, borderRadius: 10, overflow: 'hidden',
              border: `2px solid ${i === cur ? 'var(--ink)' : 'transparent'}`,
              opacity: i === cur ? 1 : .5, transition: 'all .18s', padding: 0, cursor: 'pointer',
            }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </button>
          ))}
          {total > 8 && (
            <button onClick={() => setLightbox(0)} style={{
              flex: '0 0 80px', height: 56, borderRadius: 10, overflow: 'hidden',
              border: '2px solid var(--border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 2,
              background: 'var(--surface)', color: 'var(--muted)', padding: 0,
              fontSize: 11, fontWeight: 600,
            }}>
              <span className="material-icons" style={{ fontSize: 16 }}>photo_library</span>
              +{total - 8}
            </button>
          )}
        </div>
      )}
    </>
  )
}

// ── Booking Card ──────────────────────────────────────────────
function BookingCard({ residence }) {
  const [typeKey, setTypeKey] = useState('')
  const [date, setDate] = useState('')
  const [nb, setNb] = useState(1)
  const [wa, setWa] = useState(SITE.whatsapp)
  useEffect(() => { fetchWhatsApp().then(n => setWa(n)) }, [])

  const tarifs = {}
  if (residence.prix_nuit)    tarifs.nuit    = { label: 'Par nuit',    prix: residence.prix_nuit }
  if (residence.prix_journee) tarifs.journee = { label: 'Par journée', prix: residence.prix_journee }
  if (residence.prix_semaine) tarifs.semaine = { label: 'Par semaine', prix: residence.prix_semaine }
  if (residence.prix_mois)    tarifs.mois    = { label: 'Par mois',    prix: residence.prix_mois }

  const firstKey = Object.keys(tarifs)[0]
  const selected = tarifs[typeKey || firstKey]
  const total = selected ? selected.prix * nb : 0
  const today = new Date().toISOString().split('T')[0]

  const buildWA = () => {
    const msg = `Bonjour ! Je souhaite réserver "${residence.titre}" à ${residence.ville}.\n\n📅 Arrivée : ${date ? new Date(date).toLocaleDateString('fr-FR') : 'à définir'}\n⏱ Durée : ${nb} ${typeKey || firstKey || ''}\n💰 ${selected ? formatPrix(selected.prix) : ''}\n\nPuis-vous confirmer la disponibilité ?`
    return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`
  }

  if (!firstKey) return (
    <div className="booking-card" style={{ textAlign: 'center', color: 'var(--muted)' }}>
      <span className="material-icons" style={{ fontSize: 36, display: 'block', marginBottom: 10, color: 'var(--subtle)' }}>payments</span>
      <p style={{ fontSize: 14 }}>Tarifs sur demande WhatsApp</p>
      <a href={`https://wa.me/${wa}?text=${encodeURIComponent('Bonjour ! Je souhaite des informations sur la résidence "'+residence.titre+'"')}`} target="_blank" rel="noopener" className="btn-wa" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
        <span className="material-icons" style={{ fontSize: 17 }}>chat</span>
        Contacter par WhatsApp
      </a>
    </div>
  )

  return (
    <div className="booking-card">
      <div className="booking-price">{formatPrix(selected?.prix)}</div>
      <div className="booking-price-unit">{selected?.label?.toLowerCase()}</div>

      <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }}/>

      {Object.keys(tarifs).length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Type de durée</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {Object.entries(tarifs).map(([k, t]) => (
              <button key={k} onClick={() => setTypeKey(k)} style={{
                padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: (typeKey||firstKey) === k ? 'var(--ink)' : 'var(--surface)',
                color: (typeKey||firstKey) === k ? 'var(--bg)' : 'var(--ink-2)',
                border: `1.5px solid ${(typeKey||firstKey) === k ? 'var(--ink)' : 'var(--border)'}`,
                transition: 'all .15s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Date d'arrivée</label>
        <input className="input" type="date" min={today} value={date} onChange={e => setDate(e.target.value)}/>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Durée</label>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          <button onClick={() => setNb(n => Math.max(1, n-1))} style={{ width: 46, height: 44, background: 'none', border: 'none', borderRight: '1px solid var(--border)', color: 'var(--ink)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>−</button>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--ink)' }}>{nb}</div>
          <button onClick={() => setNb(n => n+1)} style={{ width: 46, height: 44, background: 'none', border: 'none', borderLeft: '1px solid var(--border)', color: 'var(--ink)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>+</button>
        </div>
      </div>

      {selected && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Total estimé</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--ink)' }}>{formatPrix(total)}</span>
        </div>
      )}

      <a href={buildWA()} target="_blank" rel="noopener" className="btn-wa" style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
        <span className="material-icons" style={{ fontSize: 18 }}>chat</span>
        Réserver par WhatsApp
      </a>

      <button className="btn btn-outline" onClick={() => window.open(`https://wa.me/${wa}`, '_blank')} style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
        Poser une question
      </button>

      {/* ── Partager l'annonce ── */}
      <SharePanel title={residence.titre}/>
    </div>
  )
}

// ── Share Panel ───────────────────────────────────────────────
function SharePanel({ title }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const getUrl = () => typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = () => {
    navigator.clipboard.writeText(getUrl()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const share = (platform) => {
    const url = getUrl()
    const text = `Découvrez cette résidence sur New Horizon : ${title}`
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      tiktok:    null, // Pas d'URL de partage web direct
      instagram: null, // Pas d'URL de partage web direct
    }
    if (links[platform]) window.open(links[platform], '_blank')
    else copyLink() // Pour TikTok/Instagram : copier le lien
  }

  const nativeShare = async () => {
    const url = getUrl()
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Découvrez : ${title}`, url })
        return
      } catch {}
    }
    copyLink()
  }

  return (
    <div style={{ marginTop: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '10px 16px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 600,
        background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--ink-2)',
        cursor: 'pointer', transition: 'background .15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
      >
        <span className="material-icons" style={{ fontSize: 16 }}>share</span>
        Partager cette annonce
        <span className="material-icons" style={{ fontSize: 16, marginLeft: 'auto', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>expand_more</span>
      </button>

      {open && (
        <div style={{
          marginTop: 10, padding: 14, borderRadius: 'var(--r-md)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          animation: 'fadeUp .18s var(--ease)',
        }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Envoyer l'annonce à vos amis
          </p>

          {/* Réseau sociaux */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[
              { id: 'whatsapp', label: 'WhatsApp',  icon: 'chat',     color: '#25D366', bg: 'rgba(37,211,102,.08)', border: 'rgba(37,211,102,.2)' },
              { id: 'facebook', label: 'Facebook',  icon: 'facebook', color: '#1877F2', bg: 'rgba(24,119,242,.08)', border: 'rgba(24,119,242,.2)' },
              { id: 'tiktok',   label: 'TikTok',    icon: 'music_video', color: '#000', bg: 'rgba(0,0,0,.06)',     border: 'rgba(0,0,0,.12)' },
              { id: 'instagram',label: 'Instagram', icon: 'camera_alt',  color: '#E1306C', bg: 'rgba(225,48,108,.06)', border: 'rgba(225,48,108,.15)' },
            ].map(s => (
              <button key={s.id} onClick={() => share(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: s.bg, border: `1px solid ${s.border}`, color: s.color,
                cursor: 'pointer', transition: 'transform .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <span className="material-icons" style={{ fontSize: 16 }}>{s.icon}</span>
                {s.label}
                {(s.id === 'tiktok' || s.id === 'instagram') && (
                  <span className="material-icons" style={{ fontSize: 12, marginLeft: 'auto', opacity: .5 }}>content_copy</span>
                )}
              </button>
            ))}
          </div>

          {/* Copier le lien */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }}>
            <span className="material-icons" style={{ fontSize: 15, color: 'var(--muted)', flexShrink: 0 }}>link</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {typeof window !== 'undefined' ? window.location.href : '…'}
            </span>
            <button onClick={copyLink} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7,
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: copied ? '#22C55E' : 'var(--ink)', color: 'var(--bg)', border: 'none',
              transition: 'background .2s', flexShrink: 0,
            }}>
              <span className="material-icons" style={{ fontSize: 13 }}>{copied ? 'check' : 'content_copy'}</span>
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>

          {/* Partage natif mobile */}
          {'share' in (typeof navigator !== 'undefined' ? navigator : {}) && (
            <button onClick={nativeShare} style={{
              marginTop: 8, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: 'var(--white)', border: '1px solid var(--border)', color: 'var(--ink-2)', cursor: 'pointer',
            }}>
              <span className="material-icons" style={{ fontSize: 15 }}>ios_share</span>
              Autres applications…
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function DetailPage() {
  const { id } = useParams()
  const [res, setRes]     = useState(null)
  const [similar, setSim] = useState([])
  const [loading, setLd]  = useState(true)

  useEffect(() => {
    getResidence(id).then(r => { setRes(r); setLd(false) })
    getResidences().then(all => setSim(all.filter(r => r.id !== id).slice(0, 3)))
  }, [id])

  if (loading) return <PageLoader/>

  if (!res) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', paddingTop: 64 }}>
      <div style={{ textAlign: 'center' }}>
        <span className="material-icons" style={{ fontSize: 64, color: 'var(--border)', display: 'block', marginBottom: 16 }}>search_off</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '2rem', marginBottom: 8 }}>Résidence introuvable</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Cette résidence n'existe pas ou a été supprimée.</p>
        <Link href="/residences" className="btn btn-dark">Retour au catalogue</Link>
      </div>
    </div>
  )

  const equips = Object.entries(EQUIPEMENTS_ICONS).filter(([k]) => (res.equipements || []).includes(k))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(28px,4vw,48px) var(--pad)' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--muted)', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--muted)' }}>Accueil</Link>
          <span className="material-icons" style={{ fontSize: 14 }}>chevron_right</span>
          <Link href="/residences" style={{ color: 'var(--muted)' }}>Résidences</Link>
          <span className="material-icons" style={{ fontSize: 14 }}>chevron_right</span>
          <span style={{ color: 'var(--ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{res.titre}</span>
        </div>

        <div className="detail-grid">
          {/* Left */}
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: 36 }}>
              <Gallery photos={res.photos || []} titre={res.titre}/>
            </div>

            {/* Title + meta */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>{res.type_bien}</span>
                {res.featured && <span className="badge badge-gold"><span className="material-icons" style={{ fontSize: 11 }}>star</span>À la une</span>}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '-.025em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: 12 }}>
                {res.titre}
              </h1>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontSize: 14 }}>
                <span className="material-icons" style={{ fontSize: 16 }}>location_on</span>
                {[res.quartier, res.commune, res.ville].filter(Boolean).join(', ')}
              </span>
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }}/>

            {res.description && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-.015em', marginBottom: 14 }}>À propos</h2>
                <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.75 }}>{res.description}</p>
              </div>
            )}

            {equips.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-.015em', marginBottom: 16 }}>Équipements</h2>
                <div className="equip-grid">
                  {equips.map(([k, eq]) => (
                    <div key={k} className="equip-item">
                      <span className="material-icons equip-icon">{eq.icon}</span>
                      {eq.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localisation & itinéraire */}
            {(res.quartier || res.commune) && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-.015em', marginBottom: 6 }}>
                  Localisation
                </h2>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className="material-icons" style={{ fontSize: 15 }}>location_on</span>
                  {[res.quartier, res.commune, res.ville].filter(Boolean).join(', ')}
                  <span style={{ marginLeft: 6, fontSize: 11, fontStyle: 'italic' }}>· Autorisez la géolocalisation pour l'itinéraire</span>
                </p>
                <MapView
                  quartier={res.quartier}
                  commune={res.commune}
                  ville={res.ville}
                  title={res.titre}
                  height={320}
                />
              </div>
            )}

            {/* Tarifs — sans caution */}
            {[res.prix_nuit, res.prix_journee, res.prix_semaine, res.prix_mois].some(Boolean) && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-.015em', marginBottom: 16 }}>Tarifs</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {[
                    { label: 'Nuit',    val: res.prix_nuit },
                    { label: 'Journée', val: res.prix_journee },
                    { label: 'Semaine', val: res.prix_semaine },
                    { label: 'Mois',    val: res.prix_mois },
                  ].filter(t => t.val).map(t => (
                    <div key={t.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '16px 20px' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{t.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--ink)', letterSpacing: '-.02em' }}>{formatPrix(t.val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — booking */}
          <div>
            <BookingCard residence={res}/>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div style={{ marginTop: 'clamp(56px,8vw,96px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
              <div>
                <div className="section-label">Vous pourriez aimer</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 400, letterSpacing: '-.02em' }}>Résidences similaires</h2>
              </div>
              <Link href="/residences" className="btn btn-outline">Voir tout</Link>
            </div>
            <div className="grid-3">
              {similar.map((r, i) => <ResidenceCard key={r.id} residence={r} index={i}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
