'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { SITE } from '@/lib/config'
import Icon from '@/components/ui/Icon'

const FAQ = [
  {
    cat: 'Réservation',
    icon: 'event_available',
    color: '#FF7A1A',
    bg: 'rgba(255,122,26,.08)',
    border: 'rgba(255,122,26,.2)',
    items: [
      { q: 'Comment réserver une résidence ?', a: 'La réservation se fait directement via WhatsApp. Trouvez la résidence qui vous convient, cliquez sur « Réserver par WhatsApp » et envoyez votre demande avec vos dates. Notre équipe vous confirme la disponibilité en moins de 30 minutes.' },
      { q: "Qu'est-ce que la caution et comment est-elle calculée ?", a: "La caution représente 20% du tarif de base. Elle est réglée avant votre arrivée pour confirmer votre réservation. Les 80% restants sont payés directement sur place à votre arrivée. La caution vous est intégralement remboursée à votre départ si la résidence est rendue en bon état." },
      { q: 'Puis-je annuler ma réservation ?', a: "Les conditions d'annulation sont à discuter directement avec notre équipe sur WhatsApp. En général, une annulation effectuée plus de 48h avant l'arrivée permet un remboursement partiel de la caution. Contactez-nous dès que possible en cas d'imprévu." },
      { q: 'Quels modes de paiement sont acceptés ?', a: "La caution peut être réglée via Mobile Money (Orange Money, MTN Mobile Money), virement bancaire ou en espèces. Le solde est réglé sur place en espèces ou Mobile Money. Nous ne prenons pas encore en charge les cartes bancaires en ligne." },
    ],
  },
  {
    cat: 'Les résidences',
    icon: 'apartment',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,.08)',
    border: 'rgba(124,58,237,.2)',
    items: [
      { q: 'Les photos sont-elles authentiques ?', a: "Toutes les photos publiées sur Allons Somo sont vérifiées par notre équipe avant publication. Nous nous engageons à ce que les photos correspondent fidèlement à la réalité. Si vous constatez un écart significatif, contactez-nous immédiatement." },
      { q: 'Les équipements listés sont-ils toujours disponibles ?', a: "Oui, les équipements indiqués dans chaque annonce (wifi, climatisation, etc.) sont ceux présents dans la résidence au moment de la publication. En cas de panne ou d'absence, contactez le gérant ou notre support." },
      { q: 'Puis-je visiter la résidence avant de réserver ?', a: "Dans certains cas, des visites sont possibles. Contactez-nous par WhatsApp pour en discuter. Nous pouvons également organiser une visite virtuelle par appel vidéo." },
    ],
  },
  {
    cat: 'Compte & données',
    icon: 'person',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,.08)',
    border: 'rgba(14,165,233,.2)',
    items: [
      { q: "Ai-je besoin d'un compte pour réserver ?", a: "Non, aucun compte n'est nécessaire. La réservation se fait entièrement via WhatsApp. Vous nous communiquez vos informations directement dans la conversation." },
      { q: 'Comment sont protégées mes données personnelles ?', a: "Vos informations partagées via WhatsApp sont traitées conformément à notre politique de confidentialité. Elles sont utilisées uniquement pour la gestion de votre réservation et ne sont jamais revendues à des tiers." },
    ],
  },
]

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (open && contentRef.current) setHeight(contentRef.current.scrollHeight)
    else setHeight(0)
  }, [open])

  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${open ? 'rgba(255,122,26,.25)' : 'var(--border)'}`,
        background: open ? 'rgba(255,122,26,.02)' : 'var(--white)',
        boxShadow: open ? '0 8px 32px rgba(15,14,12,.08)' : '0 1px 4px rgba(15,14,12,.04)',
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        marginBottom: 8,
        overflow: 'hidden',
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'both',
      }}
      className="faq-item"
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
        aria-expanded={open}
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
          color: open ? '#FF7A1A' : 'var(--ink)',
          lineHeight: 1.45, transition: 'color .2s', flex: 1,
        }}>{item.q}</span>
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'rgba(255,122,26,.12)' : 'var(--surface, #F7F6F3)',
          border: `1px solid ${open ? 'rgba(255,122,26,.3)' : 'var(--border)'}`,
          transition: 'all .25s',
        }}>
          <Icon n="expand_more" size={17} style={{
            color: open ? '#FF7A1A' : 'var(--subtle)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
          }}/>
        </div>
      </button>

      <div style={{
        height: height,
        overflow: 'hidden',
        transition: 'height .3s cubic-bezier(.4,0,.2,1)',
      }}>
        <div ref={contentRef} style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          <p style={{
            fontSize: 14, color: 'var(--muted)', lineHeight: 1.85,
            paddingTop: 16, margin: 0,
          }}>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

function SectionBadge({ section }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      marginBottom: 20, padding: '10px 18px',
      borderRadius: 14, background: 'var(--white)',
      border: `1px solid ${section.border}`,
      boxShadow: '0 2px 8px rgba(15,14,12,.05)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: section.bg,
      }}>
        <Icon n={section.icon} size={17} color={section.color}/>
      </div>
      <span style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 700,
        color: 'var(--ink)', letterSpacing: '.01em',
      }}>
        {section.cat}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 600, color: section.color,
        background: section.bg, border: `1px solid ${section.border}`,
        borderRadius: 99, padding: '2px 9px',
      }}>
        {section.items.length}
      </span>
    </div>
  )
}

export default function AidePage() {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .faq-item { animation: fadeUp .4s both; }
        .section-nav-btn { transition: all .2s; }
        .section-nav-btn:hover { transform: translateY(-1px); }
        .btn-wa { display:inline-flex; align-items:center; gap:8px; padding:13px 24px; border-radius:12px; background:#25D366; color:#fff; font-weight:700; font-size:14px; text-decoration:none; transition:all .2s; }
        .btn-wa:hover { background:#1ebe5d; transform:translateY(-1px); box-shadow:0 6px 20px rgba(37,211,102,.3); }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--bg, #F7F6F3)' }}>

        {/* ── Hero ── */}
        <div style={{
          padding: 'clamp(96px,11vw,148px) var(--pad, 24px) clamp(52px,7vw,80px)',
          background: 'var(--white)',
          borderBottom: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Accent line top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, transparent, #FF7A1A 40%, #FFAA5A 60%, transparent)',
            opacity: .35,
          }}/>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 55% 80% at 95% 40%, rgba(255,122,26,.06) 0%, transparent 65%)',
          }}/>

          <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, opacity: .6 }}>
              <Link href="/" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>Accueil</Link>
              <Icon n="chevron_right" size={13} style={{ color: 'var(--muted)' }}/>
              <span style={{ fontSize: 12, color: '#FF7A1A', fontWeight: 600 }}>Centre d'aide</span>
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(255,122,26,.07)', border: '1px solid rgba(255,122,26,.18)',
              marginBottom: 20,
            }}>
              <Icon n="help_outline" size={12} color={'#FF7A1A'}/>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#FF7A1A' }}>
                Centre d'aide
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.3rem,5.5vw,3.8rem)',
              fontWeight: 400, fontStyle: 'italic',
              color: 'var(--ink)', lineHeight: 1.06, marginBottom: 16,
            }}>
              Questions <em style={{ color: '#FF7A1A', fontStyle: 'normal' }}>fréquentes</em>
            </h1>

            <p style={{ fontSize: 15.5, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 480, marginBottom: 32 }}>
              Retrouvez les réponses aux questions les plus fréquentes.
              Pour tout autre renseignement, notre équipe est disponible sur WhatsApp.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
                <Icon n="chat" size={17}/>
                Contactez-nous sur WhatsApp
              </a>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                background: 'var(--bg)', border: '1px solid var(--border)',
                fontSize: 12, color: 'var(--muted)', fontWeight: 500,
              }}>
                <Icon n="bolt" size={13} color={'#22C55E'}/>
                Réponse en &lt; 30 min
              </div>
            </div>
          </div>
        </div>

        {/* ── Nav sections sticky ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'var(--white)', borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            maxWidth: 860, margin: '0 auto',
            padding: '0 var(--pad, 24px)',
            display: 'flex', gap: 4, overflowX: 'auto',
            scrollbarWidth: 'none',
          }}>
            {FAQ.map((s, i) => (
              <button
                key={i}
                className="section-nav-btn"
                onClick={() => {
                  const el = document.getElementById(`section-${i}`)
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveSection(i)
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '14px 16px', whiteSpace: 'nowrap',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  color: activeSection === i ? s.color : 'var(--muted)',
                  borderBottom: `2px solid ${activeSection === i ? s.color : 'transparent'}`,
                  transition: 'all .2s',
                }}
              >
                <Icon n={s.icon} size={14} color={activeSection === i ? s.color : 'var(--muted)'}/>
                {s.cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── FAQ Content ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(48px,7vw,72px) var(--pad, 24px) 96px' }}>
          {FAQ.map((section, si) => (
            <div key={si} id={`section-${si}`} style={{ marginBottom: 56, scrollMarginTop: 60 }}>
              <SectionBadge section={section} />
              {section.items.map((item, i) => (
                <FaqItem key={i} item={item} index={i} />
              ))}
            </div>
          ))}

          {/* ── CTA final ── */}
          <div style={{
            marginTop: 16,
            borderRadius: 24,
            overflow: 'hidden',
            background: 'var(--white)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 40px rgba(15,14,12,.07)',
          }}>
            {/* Top accent */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #25D366, #16A34A)' }}/>

            <div style={{ padding: 'clamp(36px,5vw,52px)', textAlign: 'center' }}>
              <div style={{
                width: 60, height: 60, borderRadius: 18, margin: '0 auto 20px',
                background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon n="support_agent" size={28} color={'#16A34A'}/>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,3vw,1.6rem)',
                fontWeight: 400, fontStyle: 'italic',
                color: 'var(--ink)', marginBottom: 10,
              }}>Vous n'avez pas trouvé votre réponse ?</h3>

              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
                Notre équipe répond sur WhatsApp en moins de 30 minutes, 7j/7.
              </p>

              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Bonjour, j'ai une question concernant vos résidences.")}`}
                target="_blank" rel="noopener" className="btn-wa"
                style={{ fontSize: 14 }}>
                <Icon n="chat" size={18}/>
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
