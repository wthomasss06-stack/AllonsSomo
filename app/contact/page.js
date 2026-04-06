'use client'
import Link from 'next/link'
import { useState } from 'react'
import { SITE } from '@/lib/config'
import MapView from '@/components/ui/MapView'
import Icon from '@/components/ui/Icon'

const HQ = { quartier: null, commune: 'Plateau', ville: 'Abidjan' }

const CHANNELS = [
  {
    icon: 'chat', label: 'WhatsApp', sub: 'Canal le plus rapide',
    title: 'Réserver ou poser une question',
    desc: 'Réponse garantie en moins de 5 minutes. Disponible 7j/7.',
    cta: 'Écrire maintenant', color: '#25D366', bg: 'rgba(37,211,102,.07)', border: 'rgba(37,211,102,.18)',
    href: (wa) => `https://wa.me/${wa}?text=${encodeURIComponent('Bonjour ! Je voudrais des informations sur vos résidences.')}`,
  },
  {
    icon: 'mail', label: 'Email', sub: 'Demandes formelles',
    title: SITE.email,
    desc: 'Pour les demandes officielles, devis ou partenariats.',
    cta: 'Envoyer un email', color: '#FF7A1A', bg: 'rgba(255,122,26,.06)', border: 'rgba(255,122,26,.18)',
    href: () => `mailto:${SITE.email}`,
  },
  {
    icon: 'facebook', label: 'Facebook', sub: 'Actualités',
    title: 'Suivez-nous',
    desc: 'Nouvelles résidences, offres spéciales et photos exclusives.',
    cta: 'Voir la page', color: '#1877F2', bg: 'rgba(24,119,242,.06)', border: 'rgba(24,119,242,.18)',
    href: () => SITE.facebook,
  },
]

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
      padding: '14px 18px',
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{value}</div>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
          borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          background: copied ? '#22C55E' : 'var(--ink)', color: 'var(--bg)', border: 'none',
          transition: 'background .2s', flexShrink: 0, whiteSpace: 'nowrap',
        }}>
        <Icon n={copied ? 'check' : 'content_copy'} size={13}/>
        {copied ? 'Copié !' : 'Copier'}
      </button>
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        .ch-card { transition: transform .25s var(--ease), box-shadow .25s var(--ease), border-color .25s; }
        .ch-card:hover { transform: translateY(-6px); box-shadow: var(--sh-xl); }
      `}</style>

      {/* ── Hero ── */}
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
            Contact
          </div>
          <h1 className="page-hero-title">
            Parlons de votre<br/>
            <span className="accent">prochain</span>
            <br/><em>logement</em>
          </h1>
          <p className="page-hero-desc">
            Notre équipe est disponible 7j/7 sur WhatsApp.
            Réponse en moins de 5 minutes.
          </p>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour ! Je voudrais des informations sur vos résidences.')}`}
            target="_blank" rel="noopener" className="btn-wa" style={{ fontSize: 15, padding: '14px 28px' }}>
            <Icon n="chat" size={18}/>
            Écrire sur WhatsApp
          </a>
        </div>
      </div>

      {/* ── Channels Grid ── */}
      <div style={{ background: 'var(--bg)', padding: 'clamp(56px,8vw,96px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Nos canaux</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)',
            fontWeight: 400, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 48,
          }}>
            Choisissez votre moyen<br/><em>de contact</em>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 72 }}>
            {CHANNELS.map((ch, i) => (
              <a key={i} href={ch.href(SITE.whatsapp)} target={ch.href(SITE.whatsapp).startsWith('http') ? '_blank' : undefined}
                rel="noopener" className="ch-card contact-channel"
                style={{ borderColor: ch.border, background: 'var(--white)', animationDelay: `${i * 80}ms`, animation: 'fadeUp .4s both' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = ch.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = ch.border}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="contact-channel-icon" style={{ background: ch.bg, color: ch.color }}>
                    <Icon n={ch.icon} size={26}/>
                  </div>
                  <div>
                    <div className="contact-channel-label">{ch.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{ch.sub}</div>
                  </div>
                </div>
                <div className="contact-channel-title">{ch.title}</div>
                <div className="contact-channel-sub">{ch.desc}</div>
                <div className="contact-channel-arrow" style={{ color: ch.color }}>
                  {ch.cta}
                  <Icon n="arrow_forward" size={14}/>
                </div>
              </a>
            ))}
          </div>

          {/* Quick copy */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 12, marginBottom: 72 }}>
            <CopyField label="WhatsApp" value={`+${SITE.whatsapp}`}/>
            <CopyField label="Email" value={SITE.email}/>
          </div>

          {/* Map + info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(40px,6vw,64px)', alignItems: 'start',
          }}>
            <div>
              <div className="section-label" style={{ marginBottom: 14 }}>Notre zone</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)',
                fontWeight: 400, letterSpacing: '-.025em', marginBottom: 20,
              }}>
                Basé à <em>Abidjan</em>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28 }}>
                Nous couvrons toutes les communes d'Abidjan — Cocody, Plateau, Marcory,
                Yopougon, Treichville, Adjamé et bien plus encore.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {[
                  { icon: 'schedule', text: 'Réponse WhatsApp en moins de 5 min' },
                  { icon: 'location_city', text: 'Résidences dans toutes les communes' },
                  { icon: 'verified', text: 'Propriétés visitées et vérifiées' },
                  { icon: 'support_agent', text: 'Disponible 7j/7, de 7h à 22h' },
                ].map((x, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px', background: 'var(--white)',
                    border: '1px solid var(--border)', borderRadius: 14,
                  }}>
                    <Icon n={x.icon} size={18} color={'var(--gold)'} style={{ flexShrink: 0 }}/>
                    <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{x.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/aide" className="btn btn-outline">
                <Icon n="help_outline" size={17}/>
                Consulter la FAQ
              </Link>
            </div>

            <div>
              <div className="section-label" style={{ marginBottom: 14 }}>Carte en direct</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)',
                fontWeight: 400, letterSpacing: '-.025em', marginBottom: 20,
              }}>
                Trouvez-nous &<br/><em>planifiez votre visite</em>
              </h2>
              <MapView quartier={HQ.quartier} commune={HQ.commune} ville={HQ.ville} title="New Horizon — Abidjan" height={380}/>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>
                Autorisez la géolocalisation pour voir l'itinéraire depuis votre position.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: 'clamp(48px,7vw,80px) var(--pad)', background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: 'var(--cta-bg)', borderRadius: 'var(--r-2xl)',
          padding: 'clamp(48px,6vw,72px) var(--pad)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: 60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,26,.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#fff', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12 }}>
              Une question urgente ?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.4)', maxWidth: 400 }}>
              Notre équipe répond maintenant sur WhatsApp.
            </p>
          </div>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour ! Je voudrais des informations sur vos résidences.')}`}
            target="_blank" rel="noopener" className="btn-wa"
            style={{ position: 'relative', zIndex: 1, fontSize: 15, padding: '14px 28px' }}>
            <Icon n="chat" size={18}/>
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
