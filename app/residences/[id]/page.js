'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Building2, MessageCircle, Shield, Star, MapPin,
  ChevronRight, ChevronLeft, SearchX, CreditCard,
  Wifi, Wind, Car, ChefHat, Waves, Tv, Shirt, ShieldCheck, Zap, Building,
} from 'lucide-react'
import { getResidence, getResidences, getWAReservation, formatPrix, EQUIPEMENTS_ICONS, SITE, fetchWhatsApp } from '@/lib/config'
import ResidenceCard from '@/components/ui/ResidenceCard'

const LUCIDE_EQUIP = { Wifi, Wind, Car, ChefHat, Waves, Tv, Shirt, Building, ShieldCheck, Zap }

// ── Gallery ───────────────────────────────────────────────────
function Gallery({ photos, titre }) {
  const [cur, setCur] = useState(0)
  const total = photos.length

  const prev = useCallback(() => setCur(c => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCur(c => (c + 1) % total), [total])

  useEffect(() => {
    const fn = e => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [prev, next])

  if (total === 0) return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
      <Building2 size={64} style={{ color: 'var(--border)' }} />
    </div>
  )

  if (total === 1) return (
    <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative', paddingBottom: '60%' }}>
      <img src={photos[0]} alt={titre} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
    </div>
  )

  return (
    <div>
      <div style={{ position: 'relative', borderRadius: 'var(--r-xl)', overflow: 'hidden', paddingBottom: '62%', background: 'var(--surface)', marginBottom: 8 }}>
        {photos.map((url, i) => (
          <img key={i} src={url} alt={`${titre} ${i+1}`} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: i === cur ? 1 : 0,
            transition: 'opacity .4s var(--ease)',
          }}/>
        ))}

        {/* Arrows */}
        {[{ fn: prev, Icon: ChevronLeft, side: 'left' }, { fn: next, Icon: ChevronRight, side: 'right' }].map(b => (
          <button key={b.side} onClick={b.fn} style={{
            position: 'absolute', [b.side]: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 5,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,.92)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', cursor: 'pointer', boxShadow: 'var(--sh-md)',
            transition: 'transform .15s, box-shadow .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; e.currentTarget.style.boxShadow = 'var(--sh-lg)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-50%)'; e.currentTarget.style.boxShadow = 'var(--sh-md)' }}>
            <b.Icon size={20} />
          </button>
        ))}

        <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 5, background: 'rgba(15,14,12,.7)', color: '#fff', padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
          {cur + 1} / {total}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {photos.slice(0, 6).map((url, i) => (
          <button key={i} onClick={() => setCur(i)} style={{
            flex: '0 0 80px', height: 56, borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'pointer',
            border: `2px solid ${i === cur ? 'var(--ink)' : 'transparent'}`,
            opacity: i === cur ? 1 : .55, transition: 'all .2s', padding: 0,
          }}>
            <img src={url} alt={`Thumb ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </button>
        ))}
      </div>
    </div>
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
    const msg = `Bonjour ! Je souhaite réserver "${residence.titre}" à ${residence.ville}.\n\nArrivée : ${date ? new Date(date).toLocaleDateString('fr-FR') : 'à définir'}\nDurée : ${nb} ${typeKey || firstKey || ''}\n${selected ? formatPrix(selected.prix) : ''}\n\nPuis-vous confirmer la disponibilité ?`
    return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`
  }

  if (!firstKey) return (
    <div className="booking-card" style={{ textAlign: 'center', color: 'var(--muted)' }}>
      <CreditCard size={36} style={{ color: 'var(--subtle)', display: 'block', margin: '0 auto 10px' }} />
      <p style={{ fontSize: 14 }}>Tarifs sur demande WhatsApp</p>
      <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Bonjour ! Je souhaite des informations sur la résidence \""+residence.titre+"\"")}`} target="_blank" rel="noopener" className="btn-wa" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
        <MessageCircle size={17} />
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
                color: (typeKey||firstKey) === k ? '#fff' : 'var(--ink-2)',
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

      {residence.montant_caution > 0 && (
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Shield size={14} style={{ flexShrink: 0 }} />
          Caution : {formatPrix(residence.montant_caution)}
        </p>
      )}

      <a href={buildWA()} target="_blank" rel="noopener" className="btn-wa" style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
        <MessageCircle size={18} />
        Réserver par WhatsApp
      </a>

      <button className="btn btn-outline" onClick={() => window.open(`https://wa.me/${SITE.whatsapp}`, '_blank')} style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
        Poser une question
      </button>
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

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 100, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--pad)' }}>
        <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--r-xl)', marginBottom: 32 }}/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skeleton" style={{ height: 40, width: '70%' }}/>
            <div className="skeleton" style={{ height: 18, width: '45%' }}/>
            <div className="skeleton" style={{ height: 18, width: '85%' }}/>
          </div>
          <div className="skeleton" style={{ height: 400, borderRadius: 'var(--r-xl)' }}/>
        </div>
      </div>
    </div>
  )

  if (!res) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', paddingTop: 64 }}>
      <div style={{ textAlign: 'center' }}>
        <SearchX size={64} style={{ color: 'var(--border)', display: 'block', margin: '0 auto 16px' }} />
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
          <ChevronRight size={14} />
          <Link href="/residences" style={{ color: 'var(--muted)' }}>Résidences</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{res.titre}</span>
        </div>

        <div className="detail-grid">
          {/* Left */}
          <div>
            <div style={{ marginBottom: 36 }}>
              <Gallery photos={res.photos || []} titre={res.titre} typeBien={res.type_bien}/>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>{res.type_bien}</span>
                    {res.featured && (
                      <span className="badge badge-gold">
                        <Star size={11} />
                        À la une
                      </span>
                    )}
                  </div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '-.025em', lineHeight: 1.1, color: 'var(--ink)' }}>
                    {res.titre}
                  </h1>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', color: 'var(--muted)', fontSize: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={16} />
                  {[res.quartier, res.commune, res.ville].filter(Boolean).join(', ')}
                </span>
              </div>
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
                  {equips.map(([k, eq]) => {
                    const EquipIcon = LUCIDE_EQUIP[eq.icon]
                    return (
                      <div key={k} className="equip-item">
                        {EquipIcon ? <EquipIcon size={18} className="equip-icon" /> : null}
                        {eq.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

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
                {res.montant_caution > 0 && (
                  <div style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,150,58,.2)', borderRadius: 'var(--r-md)', padding: '16px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Caution</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--gold)', letterSpacing: '-.02em' }}>{formatPrix(res.montant_caution)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — booking */}
          <div>
            <BookingCard residence={res}/>
          </div>
        </div>

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
