'use client'
import Link from 'next/link'
import { useState } from 'react'
import { SITE } from '@/lib/config'
import MapView from '@/components/ui/MapView'

// Siège / bureau central
const HQ = { quartier: null, commune: 'Plateau', ville: 'Abidjan' }

function ContactCard({ icon, label, value, href, sub, color = 'var(--gold)' }) {
  return (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 16,
        background: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 'clamp(20px,3vw,28px)',
        textDecoration: 'none', color: 'inherit',
        transition: 'transform .2s, box-shadow .2s, border-color .2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--sh-md)'; e.currentTarget.style.borderColor = 'var(--subtle)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: `${color}14`, border: `1px solid ${color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-icons" style={{ fontSize: 22, color }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2vw,1.15rem)', fontWeight: 400, color: 'var(--ink)', marginBottom: 3 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>}
      </div>
    </a>
  )
}

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
      padding: '12px 16px',
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{value}</div>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
          borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          background: copied ? '#22C55E' : 'var(--ink)', color: 'var(--bg)', border: 'none',
          transition: 'background .2s', flexShrink: 0,
        }}>
        <span className="material-icons" style={{ fontSize: 14 }}>{copied ? 'check' : 'content_copy'}</span>
        {copied ? 'Copié !' : 'Copier'}
      </button>
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }`}</style>

      {/* ── Hero ── */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(100px,12vw,160px) var(--pad) clamp(48px,7vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(255,140,66,.05) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ animation: 'fadeUp .5s both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(255,140,66,.07)', border: '1px solid rgba(255,140,66,.2)',
              marginBottom: 22,
            }}>
              <span className="material-icons" style={{ fontSize: 13, color: '#FF7A1A' }}>contact_support</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#FF7A1A' }}>Contact</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,5.5vw,4rem)',
              fontWeight: 400, letterSpacing: '-.03em', lineHeight: 1.08,
              marginBottom: 18, maxWidth: 600,
            }}>
              Parlons de votre<br/><em style={{ color: '#FF7A1A' }}>prochain logement</em>
            </h1>

            <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'var(--muted)', maxWidth: 480, lineHeight: 1.7 }}>
              Notre équipe répond rapidement — WhatsApp est le canal le plus rapide.
              On est là pour vous aider à trouver le logement parfait.
            </p>
          </div>
        </div>
      </div>

      {/* ── Contenu principal ── */}
      <div style={{ background: 'var(--bg)', padding: 'clamp(48px,7vw,80px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Cartes contact */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16, marginBottom: 'clamp(48px,7vw,72px)',
          }}>
            <ContactCard
              icon="chat" label="WhatsApp — Réponse rapide"
              value="Réserver ou poser une question"
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour ! Je voudrais des informations sur vos résidences.')}`}
              sub="Réponse en moins de 5 minutes" color="#25D366"
            />
            <ContactCard
              icon="mail" label="Email"
              value={SITE.email}
              href={`mailto:${SITE.email}`}
              sub="Pour toute demande formelle" color="#FF7A1A"
            />
            <ContactCard
              icon="facebook" label="Facebook"
              value="Nous suivre & contacter"
              href={SITE.facebook}
              sub="Actualités et nouvelles résidences" color="#1877F2"
            />
          </div>

          {/* Map + infos zone */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px,5vw,56px)',
            alignItems: 'start',
          }}>

            {/* Carte interactive */}
            <div>
              <div className="section-label" style={{ marginBottom: 16 }}>Notre zone de couverture</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 400, letterSpacing: '-.02em', marginBottom: 20 }}>
                Basé à<br/><em>Abidjan</em>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
                Nous couvrons toutes les communes d'Abidjan — Cocody, Plateau, Marcory,
                Yopougon, Treichville, Adjamé, et bien plus encore.
                Partagez votre localisation pour que nous trouvions la résidence la plus proche de vous.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {[
                  { icon: 'schedule', text: 'Réponse WhatsApp en moins de 5 min' },
                  { icon: 'location_city', text: 'Résidences dans toutes les communes' },
                  { icon: 'verified', text: 'Propriétés visitées et vérifiées' },
                  { icon: 'support_agent', text: 'Disponible 7j/7, de 7h à 22h' },
                ].map((x, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', background: 'var(--white)',
                    border: '1px solid var(--border)', borderRadius: 12,
                  }}>
                    <span className="material-icons" style={{ fontSize: 18, color: '#FF7A1A', flexShrink: 0 }}>{x.icon}</span>
                    <span style={{ fontSize: 14, color: 'var(--ink)' }}>{x.text}</span>
                  </div>
                ))}
              </div>

              {/* FAQ link */}
              <Link href="/aide" className="btn btn-outline" style={{ display: 'inline-flex' }}>
                <span className="material-icons" style={{ fontSize: 17 }}>help_outline</span>
                Consulter la FAQ
              </Link>
            </div>

            {/* Carte temps réel — zone d'Abidjan */}
            <div>
              <div className="section-label" style={{ marginBottom: 16 }}>Carte en direct</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 400, letterSpacing: '-.02em', marginBottom: 20 }}>
                Trouvez-nous &<br/><em>planifiez votre visite</em>
              </h2>
              <MapView
                quartier={HQ.quartier}
                commune={HQ.commune}
                ville={HQ.ville}
                title="New Horizon — Abidjan"
                height={380}
              />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>
                Autorisez la géolocalisation pour voir l'itinéraire depuis votre position actuelle.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA final ── */}
      <div style={{ background: 'var(--white)', padding: 'clamp(48px,7vw,80px) var(--pad)', borderTop: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: 'var(--cta-bg)', borderRadius: 24,
          padding: 'clamp(40px,6vw,64px) var(--pad)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 28, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: 40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,140,66,.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', color: '#fff', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 10 }}>
              Vous avez une question ?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.42)', maxWidth: 380 }}>
              Notre équipe est disponible maintenant sur WhatsApp.
            </p>
          </div>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour ! Je voudrais des informations sur vos résidences.')}`}
            target="_blank" rel="noopener" className="btn-wa"
            style={{ position: 'relative', zIndex: 1, fontSize: 15, padding: '14px 28px' }}>
            <span className="material-icons" style={{ fontSize: 18 }}>chat</span>
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
