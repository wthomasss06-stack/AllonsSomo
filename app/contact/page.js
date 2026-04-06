'use client'
import Link from 'next/link'
import { useState } from 'react'
import { SITE } from '@/lib/config'
import MapView from '@/components/ui/MapView'
import Icon from '@/components/ui/Icon'

const HQ = { quartier: null, commune: 'Plateau', ville: 'Abidjan' }

const COMMUNES = [
  'Cocody', 'Plateau', 'Marcory', 'Yopougon',
  'Treichville', 'Adjamé', 'Abobo', 'Koumassi', 'Port-Bouët',
]

const STATS = [
  { icon: 'bolt', value: '< 5 min', label: 'Temps de réponse', color: '#25D366' },
  { icon: 'location_city', value: '9+', label: 'Communes couvertes', color: '#FF7A1A' },
  { icon: 'verified', value: '100%', label: 'Propriétés vérifiées', color: '#7C3AED' },
  { icon: 'schedule', value: '7j/7', label: 'Disponibilité équipe', color: '#0EA5E9' },
]

function ContactCard({ icon, label, value, href, sub, color = '#FF7A1A', badge }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel="noopener"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 20,
        background: 'var(--white)',
        border: `1px solid ${hovered ? color + '40' : 'var(--border)'}`,
        borderRadius: 20, padding: 'clamp(22px,3vw,30px)',
        textDecoration: 'none', color: 'inherit',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 16px 48px ${color}18` : '0 2px 8px rgba(15,14,12,.05)',
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Colored top accent on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: color, opacity: hovered ? 1 : 0,
        transition: 'opacity .25s',
      }}/>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 50, height: 50, borderRadius: 15, flexShrink: 0,
          background: color + '12', border: `1px solid ${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon n={icon} size={23} style={{ color }}/>
        </div>
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#25D366',
            background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.2)',
            borderRadius: 99, padding: '3px 10px',
          }}>{badge}</span>
        )}
      </div>

      <div>
        <div style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6,
        }}>{label}</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2vw,1.15rem)',
          fontWeight: 400, color: 'var(--ink)', marginBottom: 4,
        }}>{value}</div>
        {sub && <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>{sub}</div>}
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 12, fontWeight: 700, color,
        opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all .25s',
      }}>
        Ouvrir <Icon n="arrow_forward" size={13}/>
      </div>
    </a>
  )
}

function StatCard({ stat }) {
  return (
    <div style={{
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 22px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: stat.color + '12', border: `1px solid ${stat.color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon n={stat.icon} size={18} color={stat.color}/>
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{stat.value}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>{stat.label}</div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:none; } }
        .fade-up { animation: fadeUp .5s both; }
        .slide-in { animation: slideIn .5s both; }
        .commune-pill { transition: all .2s; }
        .commune-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
        .btn-wa { display:inline-flex; align-items:center; gap:8px; padding:13px 26px; border-radius:12px; background:#25D366; color:#fff; font-weight:700; font-size:14px; text-decoration:none; transition:all .2s; }
        .btn-wa:hover { background:#1ebe5d; transform:translateY(-1px); box-shadow:0 8px 24px rgba(37,211,102,.3); }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:11px 22px; border-radius:11px; font-weight:600; font-size:13.5px; text-decoration:none; transition:all .2s; }
        .btn-outline { background:var(--white); border:1px solid var(--border); color:var(--ink); }
        .btn-outline:hover { border-color:var(--subtle); transform:translateY(-1px); box-shadow:0 4px 12px rgba(15,14,12,.07); }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(100px,12vw,160px) var(--pad, 24px) clamp(52px,7vw,84px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 60% at 85% 50%, rgba(255,122,26,.06) 0%, transparent 70%)',
        }}/>
        {/* Decorative lines */}
        <div style={{
          position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)',
          width: 240, height: 240, borderRadius: '50%',
          border: '1px solid rgba(255,122,26,.07)', pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)',
          width: 320, height: 320, borderRadius: '50%',
          border: '1px solid rgba(255,122,26,.04)', pointerEvents: 'none',
        }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="fade-up">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, opacity: .55 }}>
              <Link href="/" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>Accueil</Link>
              <Icon n="chevron_right" size={13} style={{ color: 'var(--muted)' }}/>
              <span style={{ fontSize: 12, color: '#FF7A1A', fontWeight: 600 }}>Contact</span>
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(255,140,66,.07)', border: '1px solid rgba(255,140,66,.18)',
              marginBottom: 22,
            }}>
              <Icon n="contact_support" size={12} color={'#FF7A1A'}/>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#FF7A1A' }}>Contact</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.3rem,5.5vw,4.2rem)',
              fontWeight: 400, letterSpacing: '-.03em', lineHeight: 1.06,
              marginBottom: 20, maxWidth: 560,
            }}>
              Parlons de votre<br/>
              <em style={{ color: '#FF7A1A' }}>prochain logement</em>
            </h1>

            <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'var(--muted)', maxWidth: 460, lineHeight: 1.75, marginBottom: 36 }}>
              Notre équipe répond rapidement — WhatsApp est le canal le plus rapide.
              On est là pour vous aider à trouver le logement parfait.
            </p>

            {/* Stat pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '8px 15px', borderRadius: 99,
                  background: s.color + '0E', border: `1px solid ${s.color}25`,
                  animationDelay: `${i * 80 + 200}ms`,
                }} className="fade-up">
                  <Icon n={s.icon} size={13} color={s.color}/>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: s.color }}>{s.value}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenu principal ── */}
      <div style={{ background: 'var(--bg, #F7F6F3)', padding: 'clamp(52px,7vw,84px) var(--pad, 24px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Section label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 28,
          }}>
            <div style={{ height: 1, flex: 1, background: 'var(--border)' }}/>
            <span style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--muted)',
            }}>Canaux de contact</span>
            <div style={{ height: 1, flex: 1, background: 'var(--border)' }}/>
          </div>

          {/* Cartes contact */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 14, marginBottom: 'clamp(56px,8vw,80px)',
          }}>
            <ContactCard
              icon="chat" label="WhatsApp — Réponse rapide"
              value="Réserver ou poser une question"
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour ! Je voudrais des informations sur vos résidences.')}`}
              sub="Temps de réponse moyen : moins de 5 minutes"
              color="#25D366" badge="Le plus rapide"
            />
            <ContactCard
              icon="mail" label="Email"
              value={SITE.email}
              href={`mailto:${SITE.email}`}
              sub="Pour les demandes formelles et les partenariats"
              color="#FF7A1A"
            />
            <ContactCard
              icon="facebook" label="Facebook"
              value="Allons Somo"
              href={SITE.facebook}
              sub="Actualités, nouvelles résidences et promotions"
              color="#1877F2"
            />
          </div>

          {/* Map + infos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(36px,5vw,64px)',
            alignItems: 'start',
          }}>

            {/* Colonne gauche */}
            <div className="slide-in">
              <div style={{
                fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14,
              }}>Zone de couverture</div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem,3vw,2.2rem)',
                fontWeight: 400, letterSpacing: '-.02em', marginBottom: 6,
              }}>
                Basés à <em style={{ color: '#FF7A1A' }}>Abidjan</em>
              </h2>
              <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 28 }}>
                Nous couvrons toutes les communes d'Abidjan.
                Partagez votre localisation et nous trouvons la résidence la plus proche.
              </p>

              {/* Communes pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                {COMMUNES.map((c, i) => (
                  <span key={i} className="commune-pill" style={{
                    fontSize: 12, fontWeight: 600, color: '#FF7A1A',
                    background: 'rgba(255,122,26,.07)', border: '1px solid rgba(255,122,26,.18)',
                    borderRadius: 99, padding: '5px 13px', cursor: 'default',
                  }}>{c}</span>
                ))}
              </div>

              {/* Infos pratiques */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                {[
                  { icon: 'schedule', text: 'Réponse WhatsApp en moins de 5 min', color: '#25D366' },
                  { icon: 'verified', text: 'Propriétés visitées et vérifiées', color: '#FF7A1A' },
                  { icon: 'support_agent', text: 'Disponible 7j/7, de 7h à 22h', color: '#0EA5E9' },
                  { icon: 'payments', text: 'Orange Money & MTN Mobile Money acceptés', color: '#7C3AED' },
                ].map((x, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '13px 16px', background: 'var(--white)',
                    border: '1px solid var(--border)', borderRadius: 12,
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: x.color + '10', border: `1px solid ${x.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon n={x.icon} size={16} color={x.color}/>
                    </div>
                    <span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{x.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/aide" className="btn btn-outline">
                  <Icon n="help_outline" size={16}/>
                  Consulter la FAQ
                </Link>
                <Link href="/residences" className="btn btn-outline">
                  <Icon n="apartment" size={16}/>
                  Voir les résidences
                </Link>
              </div>
            </div>

            {/* Carte */}
            <div>
              <div style={{
                fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14,
              }}>Carte en direct</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem,3vw,2.2rem)',
                fontWeight: 400, letterSpacing: '-.02em', marginBottom: 20,
              }}>
                Trouvez-nous &<br/><em style={{ color: '#FF7A1A' }}>planifiez votre visite</em>
              </h2>

              <div style={{
                borderRadius: 20, overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 24px rgba(15,14,12,.07)',
              }}>
                <MapView
                  quartier={HQ.quartier}
                  commune={HQ.commune}
                  ville={HQ.ville}
                  title="Allons Somo — Abidjan"
                  height={400}
                />
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.65 }}>
                Autorisez la géolocalisation pour voir l'itinéraire depuis votre position actuelle.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA final ── */}
      <div style={{
        background: 'var(--white)',
        padding: 'clamp(52px,7vw,80px) var(--pad, 24px)',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0F0E0C 0%, #1A1917 100%)',
            borderRadius: 24, overflow: 'hidden',
            padding: 'clamp(44px,6vw,68px) clamp(32px,5vw,64px)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
            position: 'relative',
          }}>
            {/* Decorative glow */}
            <div style={{
              position: 'absolute', top: -60, right: 80, width: 300, height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,122,26,.15) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}/>
            <div style={{
              position: 'absolute', bottom: -40, left: 120, width: 200, height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,211,102,.08) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}/>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 99,
                background: 'rgba(37,211,102,.12)', border: '1px solid rgba(37,211,102,.25)',
                marginBottom: 16,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366' }}/>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#25D366', letterSpacing: '.08em' }}>
                  Équipe disponible maintenant
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400, fontSize: 'clamp(1.7rem,3.5vw,2.8rem)',
                color: '#fff', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12,
              }}>
                Vous avez une<br/>
                <em style={{ color: '#FF7A1A' }}>question ?</em>
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>
                Notre équipe est disponible maintenant sur WhatsApp.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour ! Je voudrais des informations sur vos résidences.')}`}
                target="_blank" rel="noopener" className="btn-wa"
                style={{ fontSize: 15, padding: '15px 30px' }}>
                <Icon n="chat" size={19}/>
                Écrire sur WhatsApp
              </a>
              <div style={{
                textAlign: 'center', fontSize: 11.5,
                color: 'rgba(255,255,255,.3)', fontWeight: 500,
              }}>
                Réponse garantie en moins de 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
