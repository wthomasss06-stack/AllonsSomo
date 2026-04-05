'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SITE } from '@/lib/config'

const FAQ = [
  {
    cat: 'Réservation',
    icon: 'event_available',
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
    items: [
      { q: 'Les photos sont-elles authentiques ?', a: "Toutes les photos publiées sur Allons Somo sont vérifiées par notre équipe avant publication. Nous nous engageons à ce que les photos correspondent fidèlement à la réalité. Si vous constatez un écart significatif, contactez-nous immédiatement." },
      { q: 'Les équipements listés sont-ils toujours disponibles ?', a: "Oui, les équipements indiqués dans chaque annonce (wifi, climatisation, etc.) sont ceux présents dans la résidence au moment de la publication. En cas de panne ou d'absence, contactez le gérant ou notre support." },
      { q: 'Puis-je visiter la résidence avant de réserver ?', a: "Dans certains cas, des visites sont possibles. Contactez-nous par WhatsApp pour en discuter. Nous pouvons également organiser une visite virtuelle par appel vidéo." },
    ],
  },
  {
    cat: 'Compte & données',
    icon: 'person',
    items: [
      { q: "Ai-je besoin d'un compte pour réserver ?", a: "Non, aucun compte n'est nécessaire. La réservation se fait entièrement via WhatsApp. Vous nous communiquez vos informations directement dans la conversation." },
      { q: 'Comment sont protégées mes données personnelles ?', a: "Vos informations partagées via WhatsApp sont traitées conformément à notre politique de confidentialité. Elles sont utilisées uniquement pour la gestion de votre réservation et ne sont jamais revendues à des tiers." },
    ],
  },
]

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${open ? 'rgba(201,150,58,.3)' : 'var(--border)'}`,
      background: open ? 'rgba(201,150,58,.03)' : 'var(--white)',
      boxShadow: open ? '0 4px 20px rgba(15,14,12,.06)' : '0 1px 3px rgba(15,14,12,.04)',
      transition: 'all .2s cubic-bezier(.4,0,.2,1)',
      marginBottom: 10,
      overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '17px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
          color: open ? '#C9963A' : 'var(--ink)',
          lineHeight: 1.4, transition: 'color .2s',
        }}>{item.q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'rgba(201,150,58,.1)' : 'var(--bg)',
          border: `1px solid ${open ? 'rgba(201,150,58,.3)' : 'var(--border)'}`,
          transition: 'all .2s',
        }}>
          <span className="material-icons" style={{
            fontSize: 16,
            color: open ? '#C9963A' : 'var(--subtle)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s',
          }}>expand_more</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, paddingTop: 14 }}>{item.a}</p>
        </div>
      )}
    </div>
  )
}

export default function AidePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Header — blanc/noir ── */}
      <div style={{
        padding: 'clamp(90px,10vw,140px) var(--pad) clamp(48px,6vw,72px)',
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Gold top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(201,150,58,.3) 30%, rgba(201,150,58,.3) 70%, transparent)',
        }}/>
        {/* Subtle radial bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 70% at 90% 50%, rgba(201,150,58,.04) 0%, transparent 70%)',
        }}/>

        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 99,
            background: 'rgba(201,150,58,.07)', border: '1px solid rgba(201,150,58,.2)',
            marginBottom: 18,
          }}>
            <span className="material-icons" style={{ fontSize: 13, color: '#C9963A' }}>help_outline</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C9963A' }}>Centre d'aide</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem,5vw,3.6rem)',
            fontWeight: 400, fontStyle: 'italic',
            color: 'var(--ink)',
            lineHeight: 1.08, marginBottom: 14,
          }}>
            Questions <em style={{ color: 'var(--gold)' }}>fréquentes</em>
          </h1>

          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 500, marginBottom: 28 }}>
            Retrouvez les réponses aux questions les plus fréquentes.
            Pour tout autre renseignement, notre équipe est disponible sur WhatsApp.
          </p>

          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
            <span className="material-icons" style={{ fontSize: 18 }}>chat</span>
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </div>

      {/* ── FAQ content ── */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(48px,7vw,72px) var(--pad) 88px' }}>
        {FAQ.map((section, si) => (
          <div key={si} style={{ marginBottom: 48 }}>
            {/* Section label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              marginBottom: 22, padding: '9px 16px',
              borderRadius: 12, background: 'var(--white)',
              border: '1px solid var(--border)',
              boxShadow: '0 1px 4px rgba(15,14,12,.04)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(201,150,58,.08)', border: '1px solid rgba(201,150,58,.2)',
              }}>
                <span className="material-icons" style={{ fontSize: 16, color: '#C9963A' }}>{section.icon}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--ink)', letterSpacing: '.02em' }}>
                {section.cat}
              </span>
            </div>

            {section.items.map((item, i) => <FaqItem key={i} item={item} />)}
          </div>
        ))}

        {/* Contact CTA */}
        <div style={{
          marginTop: 24, padding: 'clamp(32px,4vw,48px)',
          borderRadius: 24,
          background: 'var(--white)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(15,14,12,.06)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* Gold top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(201,150,58,.3) 30%, rgba(201,150,58,.3) 70%, transparent)',
          }}/>

          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 18px',
            background: 'rgba(94,232,150,.1)', border: '1px solid rgba(94,232,150,.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-icons" style={{ fontSize: 26, color: '#16A34A' }}>chat</span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 22,
            fontWeight: 400, fontStyle: 'italic',
            color: 'var(--ink)', marginBottom: 10,
          }}>Vous n'avez pas trouvé votre réponse ?</h3>

          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Notre équipe répond sur WhatsApp en moins de 30 minutes, 7j/7.
          </p>

          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Bonjour, j'ai une question concernant vos résidences.")}`}
            target="_blank" rel="noopener" className="btn-wa"
            style={{ fontSize: 14, padding: '13px 30px' }}>
            <span className="material-icons" style={{ fontSize: 19 }}>chat</span>
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
