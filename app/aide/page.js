'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SITE } from '@/lib/config'

const FAQ = [
  {
    cat: 'Réservation',
    icon: 'event_available',
    items: [
      { q: 'Comment réserver une résidence ?', a: 'La réservation se fait directement via WhatsApp. Trouvez la résidence qui vous convient, cliquez sur "Réserver par WhatsApp" et envoyez votre demande avec vos dates. Notre équipe vous confirme la disponibilité en moins de 30 minutes.' },
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
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid var(--border)',
      borderTopColor: open ? 'rgba(201,168,76,.25)' : 'rgba(255,255,255,.08)',
      borderBottomColor: 'rgba(0,0,0,.4)',
      background: open
        ? 'linear-gradient(160deg, rgba(201,168,76,.08), rgba(154,120,48,.03))'
        : 'linear-gradient(160deg, var(--bg-surface-2) 0%, var(--bg-surface) 100%)',
      boxShadow: open
        ? 'inset 0 1px 0 rgba(201,168,76,.12), 0 8px 28px rgba(0,0,0,.45)'
        : 'inset 0 1px 0 rgba(255,255,255,.07), 0 3px 12px rgba(0,0,0,.35)',
      transition: 'all .25s cubic-bezier(.4,0,.2,1)',
      marginBottom: 10,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, fontStyle: 'italic', color: open ? 'var(--gold-light)' : 'var(--text)', lineHeight: 1.3, transition: 'color .2s' }}>{item.q}</span>
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open
            ? 'linear-gradient(175deg, #E8C96A 0%, #C9A84C 50%, #9A7830 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,.07), rgba(0,0,0,.1))',
          border: '1px solid',
          borderColor: open ? 'rgba(154,120,48,.55)' : 'var(--border)',
          borderTopColor: open ? 'rgba(245,224,152,.35)' : 'rgba(255,255,255,.09)',
          boxShadow: open
            ? 'inset 0 1px 0 rgba(255,255,255,.35), 0 4px 12px rgba(201,168,76,.35)'
            : 'inset 0 1px 0 rgba(255,255,255,.07), 0 2px 6px rgba(0,0,0,.35)',
          transition: 'all .22s',
        }}>
          <span className="material-icons" style={{ fontSize: 16, color: open ? '#180E00' : 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>expand_more</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 22px 20px', borderTop: '1px solid rgba(0,0,0,.25)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.04)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.82, paddingTop: 16 }}>{item.a}</p>
        </div>
      )}
    </div>
  )
}

export default function AidePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', paddingTop: 66 }}>

      {/* Header */}
      <div style={{
        padding: '60px clamp(20px,4%,52px) 50px',
        background: 'linear-gradient(160deg, var(--bg-surface-2) 0%, var(--bg-deep) 100%)',
        borderBottom: '1px solid rgba(201,168,76,.12)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.4) 30%, rgba(245,224,152,.55) 50%, rgba(201,168,76,.4) 70%, transparent)', boxShadow: '0 0 12px rgba(201,168,76,.25)' }}/>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .5 }}/>
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-label">Centre d'aide</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 700, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.05, marginBottom: 14 }}>
            Questions <span style={{ background: 'linear-gradient(135deg, #F5E098, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>fréquentes</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 540 }}>
            Retrouvez les réponses aux questions les plus fréquentes. Pour tout autre renseignement, notre équipe est disponible sur WhatsApp.
          </p>
          <div style={{ marginTop: 28 }}>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
              <span className="material-icons" style={{ fontSize: 18 }}>chat</span>
              Contactez-nous sur WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '56px clamp(16px,4%,40px) 88px' }}>
        {FAQ.map((section, si) => (
          <div key={si} style={{ marginBottom: 52 }}>
            {/* Section header — skeuo tab */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24,
              padding: '10px 18px', borderRadius: 14,
              background: 'linear-gradient(160deg, var(--bg-surface-2) 0%, var(--bg-surface) 100%)',
              border: '1px solid var(--border)', borderTopColor: 'rgba(255,255,255,.09)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.07), 0 4px 16px rgba(0,0,0,.4)',
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, rgba(201,168,76,.18), rgba(154,120,48,.07))', border: '1px solid rgba(201,168,76,.22)', borderTopColor: 'rgba(255,255,255,.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.07), 0 3px 10px rgba(0,0,0,.4)' }}>
                <span className="material-icons" style={{ fontSize: 18, color: 'var(--gold)' }}>{section.icon}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '.02em' }}>{section.cat}</span>
            </div>

            {section.items.map((item, i) => <FaqItem key={i} item={item}/>)}
          </div>
        ))}

        {/* Contact CTA — skeuo card */}
        <div style={{
          marginTop: 24, padding: '36px 32px', borderRadius: 24,
          background: 'linear-gradient(160deg, var(--bg-surface-2) 0%, var(--bg-surface) 100%)',
          border: '1px solid rgba(201,168,76,.2)',
          borderTopColor: 'rgba(255,255,255,.09)',
          borderBottomColor: 'rgba(0,0,0,.4)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 12px 40px rgba(0,0,0,.5)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.4) 30%, rgba(245,224,152,.55) 50%, rgba(201,168,76,.4) 70%, transparent)' }}/>

          <div style={{ width: 60, height: 60, borderRadius: 18, margin: '0 auto 20px', background: 'linear-gradient(160deg, rgba(94,232,150,.18), rgba(37,211,102,.07))', border: '1px solid rgba(94,232,150,.22)', borderTopColor: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 6px 20px rgba(0,0,0,.45)', animation: 'glowPulse 3s ease infinite' }}>
            <span className="material-icons" style={{ fontSize: 28, color: '#5EE896' }}>chat</span>
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, fontStyle: 'italic', color: 'var(--text)', marginBottom: 10 }}>Vous n'avez pas trouvé votre réponse ?</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
            Notre équipe répond sur WhatsApp en moins de 30 minutes, 7j/7.
          </p>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Bonjour, j'ai une question concernant vos résidences.")}`} target="_blank" rel="noopener" className="btn-wa" style={{ fontSize: 14, padding: '14px 32px' }}>
            <span className="material-icons" style={{ fontSize: 20 }}>chat</span>
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
