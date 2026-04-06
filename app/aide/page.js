'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SITE } from '@/lib/config'
import Icon from '@/components/ui/Icon'

const FAQ = [
  {
    cat: 'Réservation',
    icon: 'event_available',
    items: [
      { q: 'Comment réserver une résidence ?', a: 'La réservation se fait directement via WhatsApp. Trouvez la résidence qui vous convient, cliquez sur « Réserver par WhatsApp » et envoyez votre demande avec vos dates. Notre équipe confirme la disponibilité en moins de 30 minutes.' },
      { q: "Qu'est-ce que la caution ?", a: "La caution représente 20% du tarif de base. Elle est réglée avant votre arrivée pour confirmer votre réservation. Les 80% restants sont payés sur place à votre arrivée. La caution est intégralement remboursée à votre départ si la résidence est rendue en bon état." },
      { q: 'Puis-je annuler ma réservation ?', a: "Les conditions d'annulation sont à discuter avec notre équipe sur WhatsApp. En général, une annulation plus de 48h avant l'arrivée permet un remboursement partiel de la caution." },
      { q: 'Quels modes de paiement sont acceptés ?', a: "La caution peut être réglée via Mobile Money (Orange Money, MTN MoMo), virement bancaire ou en espèces. Le solde est réglé sur place. Les cartes bancaires en ligne ne sont pas encore disponibles." },
    ],
  },
  {
    cat: 'Les résidences',
    icon: 'apartment',
    items: [
      { q: 'Les photos sont-elles authentiques ?', a: "Toutes les photos publiées sont vérifiées par notre équipe avant publication. Nous nous engageons à ce que les photos correspondent fidèlement à la réalité. En cas d'écart, contactez-nous immédiatement." },
      { q: 'Les équipements listés sont-ils disponibles ?', a: "Oui, les équipements indiqués (wifi, climatisation, etc.) sont ceux présents dans la résidence au moment de la publication. En cas de panne, contactez le gérant ou notre support." },
      { q: 'Puis-je visiter avant de réserver ?', a: "Dans certains cas, des visites sont possibles. Contactez-nous par WhatsApp pour en discuter. Nous pouvons également organiser une visite virtuelle par appel vidéo." },
    ],
  },
  {
    cat: 'Compte & données',
    icon: 'person',
    items: [
      { q: "Ai-je besoin d'un compte pour réserver ?", a: "Non, aucun compte n'est nécessaire. La réservation se fait entièrement via WhatsApp. Vous nous communiquez vos informations directement dans la conversation." },
      { q: 'Comment sont protégées mes données ?', a: "Vos informations partagées via WhatsApp sont utilisées uniquement pour la gestion de votre réservation et ne sont jamais revendues à des tiers." },
    ],
  },
]

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item-v2${open ? ' open' : ''}`}>
      <button className="faq-trigger-v2" onClick={() => setOpen(o => !o)}>
        <span className="faq-q-v2">{item.q}</span>
        <div className="faq-icon-v2">
          <Icon n={open ? 'remove' : 'add'} size={16}/>
        </div>
      </button>
      {open && (
        <div className="faq-answer-v2" style={{ animation: 'fadeUp .2s both' }}>
          {item.a}
        </div>
      )}
    </div>
  )
}

export default function AidePage() {
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
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
            Centre d'aide
          </div>
          <h1 className="page-hero-title">
            Questions<br/><em>fréquentes</em>
          </h1>
          <p className="page-hero-desc">
            Retrouvez les réponses aux questions les plus posées.
            Pour tout autre renseignement, écrivez-nous sur WhatsApp.
          </p>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa" style={{ fontSize: 15 }}>
            <Icon n="chat" size={18}/>
            Contacter sur WhatsApp
          </a>
        </div>
      </div>

      {/* ── Section tabs ── */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 64, zIndex: 100, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--pad)', display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FAQ.map((section, i) => (
            <button key={i} onClick={() => setActiveSection(i)} style={{
              flexShrink: 0, padding: '18px 20px', fontSize: 13, fontWeight: 600,
              color: activeSection === i ? 'var(--ink)' : 'var(--muted)',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: `2px solid ${activeSection === i ? 'var(--ink)' : 'transparent'}`,
              transition: 'color .15s, border-color .15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon n={section.icon} size={15}/>
              {section.cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── FAQ Content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,7vw,80px) var(--pad)', display: 'grid', gridTemplateColumns: '1fr min(680px, 100%)', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>

        {/* Sidebar navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="hide-mobile">
          {FAQ.map((section, i) => (
            <button key={i} onClick={() => setActiveSection(i)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px', borderRadius: 'var(--r-md)',
              background: activeSection === i ? 'var(--ink)' : 'var(--white)',
              color: activeSection === i ? 'var(--bg)' : 'var(--ink-2)',
              border: `1px solid ${activeSection === i ? 'var(--ink)' : 'var(--border)'}`,
              fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all .15s', textAlign: 'left',
            }}>
              <Icon n={section.icon} size={17} color={activeSection === i ? 'var(--gold)' : 'var(--muted)'}/>
              {section.cat}
              <span style={{ marginLeft: 'auto', fontSize: 11, opacity: .6 }}>{section.items.length}</span>
            </button>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }}/>

          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Bonjour, j'ai une question.")}`}
            target="_blank" rel="noopener" className="btn-wa" style={{ width: '100%', justifyContent: 'center' }}>
            <Icon n="chat" size={16}/>
            Contacter l'équipe
          </a>
        </div>

        {/* FAQ items */}
        <div key={activeSection} style={{ animation: 'fadeUp .25s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--r-md)',
              background: 'rgba(255,122,26,.08)', border: '1px solid rgba(255,122,26,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon n={FAQ[activeSection].icon} size={20} color={'var(--gold)'}/>
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-.02em', color: 'var(--ink)' }}>
                {FAQ[activeSection].cat}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
                {FAQ[activeSection].items.length} question{FAQ[activeSection].items.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div>
            {FAQ[activeSection].items.map((item, i) => <FaqItem key={i} item={item}/>)}
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: 48, padding: 'clamp(28px,4vw,40px)',
            borderRadius: 'var(--r-xl)',
            background: 'var(--white)', border: '1px solid var(--border)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold) 70%, transparent)', opacity: .4 }}/>
            <div style={{ width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px', background: 'rgba(37,211,102,.08)', border: '1px solid rgba(37,211,102,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="chat" size={24} color={'#16A34A'}/>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
              Notre équipe répond en moins de 30 minutes, 7j/7.
            </p>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Bonjour, j'ai une question concernant vos résidences.")}`}
              target="_blank" rel="noopener" className="btn-wa" style={{ padding: '13px 28px' }}>
              <Icon n="chat" size={17}/>
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
