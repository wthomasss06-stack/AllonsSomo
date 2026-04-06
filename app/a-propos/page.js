'use client'
import Link from 'next/link'
import { SITE } from '@/lib/config'
import Icon from '@/components/ui/Icon'

const STATS = [
  { num: '2023', label: 'Fondée en', icon: 'calendar_today' },
  { num: '🇨🇮', label: 'Entreprise ivoirienne', icon: null },
  { num: '24h', label: 'Support disponible', icon: 'support_agent' },
  { num: '7j/7', label: 'Jours d&apos;ouverture', icon: 'schedule' },
]

const VALUES = [
  {
    icon: 'check_circle', title: 'Simplicité totale',
    desc: 'Pas de formulaire. Tout passe par WhatsApp. Trois actions : choisir, cliquer, réserver.',
  },
  {
    icon: 'handshake', title: 'Zéro intermédiaire',
    desc: 'Échanges directs, sans agences. Relation honnête et confiance immédiate.',
  },
  {
    icon: 'verified', title: 'Transparence',
    desc: 'Ce que vous voyez = ce que vous aurez. Photos réelles, prix affichés, conditions claires.',
  },
  {
    icon: 'place', title: 'Expérience locale',
    desc: 'Les meilleurs quartiers d’Abidjan, sélectionnés par une équipe ivoirienne.',
  },
]

const STEPS = [
  { num: '01', title: 'Vous explorez', desc: 'Des logements meublés avec des photos fidèles à la réalité.' },
  { num: '02', title: 'Vous contactez', desc: 'Un bouton → contact direct. Pas de formulaire compliqué.' },
  { num: '03', title: 'Vous confirmez', desc: 'Simple et rapide. Notre équipe répond en moins de 30 minutes.' },
  { num: '04', title: 'Vous emménagez', desc: 'La résidence est prête. Clés en main, meublée et climatisée.' },
]

export default function AProposPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        .val-card { transition: transform .22s var(--ease), box-shadow .22s var(--ease); }
        .val-card:hover { transform: translateY(-4px); box-shadow: var(--sh-lg); }
        .step-line::after {
          content:'';position:absolute;left:21px;top:52px;bottom:-28px;
          width:1px;background:var(--border);
        }
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
            À propos
          </div>
          <h1 className="page-hero-title">
            Louez simplement,<br/>
            <em>sans stress</em><br/>
            <span className="accent">à Abidjan</span>
          </h1>
          <p className="page-hero-desc">
            New Horizon — une solution directe pour louer des résidences meublées
            en Côte d’Ivoire. Pas d’intermédiaires, pas de frais cachés.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/residences" className="btn btn-white">
              <Icon n="apartment" size={17}/>Voir les résidences
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
              <Icon n="chat" size={17}/>Nous contacter
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--pad)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {STATS.map((s, i) => (
              <div key={i} className="about-stat" style={{
                borderRadius: 0,
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                border: 'none',
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                padding: 'clamp(28px,4vw,48px) clamp(20px,3vw,36px)',
              }}>
                {s.icon && <Icon n={s.icon} size={20} color={'var(--gold)'} style={{ display: 'block', marginBottom: 12 }}/>}
                <div className="about-stat-num">{s.num}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notre objectif — split ── */}
      <div style={{ background: 'var(--white)', padding: 'clamp(64px,9vw,120px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(48px,7vw,96px)', alignItems: 'center' }}>
            <div style={{ animation: 'fadeUp .5s both' }}>
              <div className="section-label">Notre objectif</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.2rem)',
                fontWeight: 400, letterSpacing: '-.03em', lineHeight: 1.08,
                color: 'var(--ink)', marginBottom: 22,
              }}>
                Vous faire gagner<br/><em>du temps</em>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 20 }}>
                Trouver une bonne résidence à Abidjan peut vite devenir compliqué.
                Évitez les galères habituelles :
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {['Informations floues','Prix qui changent','Photos trompeuses'].map((x, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 99, background: 'rgba(220,38,38,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon n="close" size={13} color={'#DC2626'}/>
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--muted)' }}>{x}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }}/>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>Avec New Horizon :</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Photos fidèles à la réalité','Prix transparents et affichés','Réservation directe WhatsApp','Support disponible 7j/7'].map((x, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 99, background: 'rgba(22,163,74,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon n="check" size={13} color={'#16A34A'}/>
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{x}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual block */}
            <div style={{
              background: 'var(--ink)', borderRadius: 'var(--r-2xl)',
              padding: 'clamp(32px,5vw,56px)',
              display: 'flex', flexDirection: 'column', gap: 20,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,26,.15) 0%, transparent 70%)' }}/>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>
                  Notre mission
                </div>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,2.5vw,1.8rem)',
                  fontWeight: 400, color: '#fff', lineHeight: 1.3, letterSpacing: '-.02em', marginBottom: 24,
                }}>
                  "Rendre la location de résidences à Abidjan aussi simple qu’un message WhatsApp."
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { val: 'Simple', icon: 'flash_on' },
                    { val: 'Direct', icon: 'chat' },
                    { val: 'Fiable', icon: 'verified' },
                  ].map((t, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '8px 16px', borderRadius: 99,
                      background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
                      color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 600,
                    }}>
                      <Icon n={t.icon} size={14} color={'var(--gold)'}/>
                      {t.val}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Comment ça marche ── */}
      <div style={{ background: 'var(--bg)', padding: 'clamp(64px,9vw,120px) var(--pad)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(48px,7vw,80px)', alignItems: 'start' }}>
            <div>
              <div className="section-label">Le processus</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.2rem)',
                fontWeight: 400, letterSpacing: '-.03em', lineHeight: 1.08,
                color: 'var(--ink)', marginBottom: 20,
              }}>
                Comment<br/><em>ça marche ?</em>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 32 }}>
                De la recherche à l’emménagement, tout est pensé pour être rapide et sans stress.
              </p>
              <Link href="/aide" className="btn btn-dark">
                <Icon n="help_outline" size={17}/>FAQ complète
              </Link>
            </div>

            <div>
              {STEPS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 20, paddingBottom: i < STEPS.length - 1 ? 28 : 0,
                  position: 'relative',
                }}>
                  {i < STEPS.length - 1 && (
                    <div style={{ position: 'absolute', left: 21, top: 44, bottom: 0, width: 1, background: 'var(--border)' }}/>
                  )}
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--r-md)', flexShrink: 0, zIndex: 1,
                    background: 'var(--white)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 400, color: 'var(--gold)',
                    fontStyle: 'italic', boxShadow: 'var(--sh-sm)',
                  }}>{s.num}</div>
                  <div style={{ paddingTop: 10 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, letterSpacing: '-.01em', color: 'var(--ink)', marginBottom: 6 }}>{s.title}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Nos valeurs ── */}
      <div style={{ background: 'var(--white)', padding: 'clamp(64px,9vw,120px) var(--pad)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
            <div>
              <div className="section-label">Ce qui nous différencie</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.2rem)',
                fontWeight: 400, letterSpacing: '-.03em', color: 'var(--ink)',
              }}>
                Pourquoi nous<br/>choisir ?
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} className="val-card" style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)',
                padding: 'clamp(24px,3.5vw,36px)', display: 'flex', flexDirection: 'column', gap: 14,
                animation: 'fadeUp .4s both', animationDelay: `${i * 80}ms`,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'rgba(255,122,26,.07)', border: '1px solid rgba(255,122,26,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon n={v.icon} size={22} color={'var(--gold)'}/>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, letterSpacing: '-.02em', marginBottom: 8, color: 'var(--ink)', fontStyle: 'italic' }}>{v.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--muted)' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: 'clamp(64px,9vw,96px) var(--pad)', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: 'var(--cta-bg)', borderRadius: 'var(--r-2xl)',
          padding: 'clamp(48px,6vw,72px) var(--pad)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: 40, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,26,.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#fff', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12 }}>
              Prêt à trouver<br/>
              <em style={{ color: 'rgba(255,255,255,.38)' }}>votre prochaine résidence ?</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.38)', maxWidth: 400 }}>
              Parcourez notre catalogue et réservez directement par WhatsApp.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/residences" className="btn btn-white">
              <Icon n="apartment" size={17}/>Parcourir les résidences
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
              <Icon n="chat" size={17}/>WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
