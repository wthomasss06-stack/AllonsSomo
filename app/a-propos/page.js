'use client'
import Link from 'next/link'
import { SITE } from '@/lib/config'

// ── Value pillar card ─────────────────────────────────────────
function Pillar({ icon, title, desc, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: 'clamp(24px,3.5vw,36px)',
      display: 'flex', flexDirection: 'column', gap: 14,
      animation: `fadeUp .5s cubic-bezier(.22,.68,0,1.2) ${delay}ms both`,
      transition: 'box-shadow .2s, transform .2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(15,14,12,.08)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'rgba(201,150,58,.08)',
        border: '1px solid rgba(201,150,58,.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-icons" style={{ fontSize: 22, color: 'var(--gold)' }}>{icon}</span>
      </div>
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem,1.8vw,1.2rem)',
          fontWeight: 400, letterSpacing: '-.02em', marginBottom: 7,
          fontStyle: 'italic', color: 'var(--ink)',
        }}>{title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--muted)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ── How-it-works step ─────────────────────────────────────────
function HowStep({ num, title, desc, last = false }) {
  return (
    <div style={{ display: 'flex', gap: 20, marginBottom: last ? 0 : 28 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 13, flexShrink: 0,
        background: 'rgba(201,150,58,.08)',
        border: '1px solid rgba(201,150,58,.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 400,
        color: 'var(--gold)', fontStyle: 'italic',
      }}>{num}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5, color: 'var(--ink)' }}>{title}</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AProposPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: 'var(--white)',
        minHeight: 'clamp(320px,48vw,480px)',
        display: 'flex', alignItems: 'center',
        padding: 'clamp(100px,12vw,160px) var(--pad) clamp(60px,8vw,100px)',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(201,150,58,.05) 0%, transparent 70%)',
        }}/>
        <div style={{
          position: 'absolute', bottom: 0, left: 'var(--pad)', right: 'var(--pad)', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,150,58,.22) 30%, rgba(201,150,58,.22) 70%, transparent)',
        }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <div style={{ animation: 'fadeUp .6s cubic-bezier(.22,.68,0,1.2) both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(201,150,58,.07)', border: '1px solid rgba(201,150,58,.2)',
              marginBottom: 22,
            }}>
              <span className="material-icons" style={{ fontSize: 13, color: 'var(--gold)' }}>info</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                À propos
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem,6vw,4rem)',
              fontWeight: 400, color: 'var(--ink)',
              letterSpacing: '-.03em', lineHeight: 1.08,
              marginBottom: 22, maxWidth: 640,
            }}>
              Louez simplement,<br/>
              <em style={{ color: 'var(--gold)' }}>sans stress à Abidjan</em>
            </h1>

            <p style={{
              fontSize: 'clamp(15px,2vw,18px)', lineHeight: 1.75,
              color: 'var(--muted)', maxWidth: 500, marginBottom: 36,
            }}>
              Allons Somo, c'est une solution simple pour louer des résidences meublées
              à Abidjan, sans complications et sans perte de temps.
              Pas d'intermédiaires, pas de frais cachés.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/residences" className="btn btn-dark">
                <span className="material-icons" style={{ fontSize: 17 }}>apartment</span>
                Voir les résidences
              </Link>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
                <span className="material-icons" style={{ fontSize: 17 }}>chat</span>
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notre objectif ── */}
      <div style={{ background: 'var(--white)', padding: 'clamp(56px,9vw,96px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 'clamp(40px,6vw,72px)',
            alignItems: 'center',
          }}>
            <div>
              <div className="section-label">Notre objectif</div>
              <h2 className="section-title" style={{ marginBottom: 20, color: 'var(--ink)' }}>
                Vous faire gagner<br/><em>du temps</em>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 18 }}>
                Trouver une bonne résidence à Abidjan peut vite devenir compliqué.
                Évitez les galères habituelles :
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {['Informations floues','Prix qui changent','Photos trompeuses'].map((x, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="material-icons" style={{ fontSize: 16, color: '#DC2626' }}>close</span>
                    <span style={{ fontSize: 14, color: 'var(--muted)' }}>{x}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>Avec Allons Somo, tout est simple :</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Des résidences réelles','Des photos fidèles','Des prix transparents','Une réservation directe'].map((x, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="material-icons" style={{ fontSize: 16, color: '#16A34A' }}>check</span>
                    <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{x}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 24, padding: 'clamp(28px,4vw,48px)',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 1, overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(15,14,12,.05)',
            }}>
              {[
                { n: '2023',     label: 'Année de création', icon: 'calendar_today' },
                { n: '🇨🇮',      label: 'Entreprise ivoirienne', icon: null },
                { n: 'Abidjan', label: 'Ville couverte',     icon: 'place' },
                { n: '24h/7j',  label: 'Support disponible', icon: 'support_agent' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: 'clamp(20px,3vw,32px) clamp(16px,2.5vw,28px)',
                  background: i % 2 === 0 ? 'var(--white)' : 'var(--bg)',
                  borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  {s.icon && <span className="material-icons" style={{ fontSize: 20, color: 'var(--gold)', display: 'block', marginBottom: 8 }}>{s.icon}</span>}
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 400, letterSpacing: '-.02em', marginBottom: 4, color: 'var(--ink)' }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: 'var(--subtle)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Comment ça marche ── */}
      <div style={{ background: 'var(--bg)', padding: 'clamp(56px,9vw,96px) var(--pad)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 'clamp(40px,6vw,72px)',
            alignItems: 'start',
          }}>
            <div>
              <div className="section-label">Le processus</div>
              <h2 className="section-title" style={{ marginBottom: 12, color: 'var(--ink)' }}>
                Comment<br/><em>ça marche ?</em>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 32 }}>
                De la recherche à l'arrivée dans votre résidence,
                tout est pensé pour être rapide et sans stress.
              </p>
              <Link href="/aide" className="btn btn-outline" style={{ display: 'inline-flex' }}>
                <span className="material-icons" style={{ fontSize: 17 }}>help_outline</span>
                FAQ complète
              </Link>
            </div>

            <div style={{ paddingTop: 8 }}>
              <HowStep num="1" title="Vous explorez les résidences"
                desc="Des logements meublés, propres et prêts à vivre, avec des photos fidèles à la réalité." />
              <HowStep num="2" title="Vous cliquez sur WhatsApp"
                desc="Un bouton → vous êtes en contact direct. Pas de formulaire compliqué, tout passe par WhatsApp." />
              <HowStep num="3" title="Vous confirmez votre réservation"
                desc="Simple et rapide, sans processus compliqué. Notre équipe vous répond en moins de 30 minutes." />
              <HowStep num="4" title="Vous emménagez tranquillement"
                desc="La résidence est prête, vous arrivez sans stress. Clés en main, meublée et climatisée." last />
            </div>
          </div>
        </div>
      </div>

      {/* ── Pourquoi Allons Somo ── */}
      <div style={{ background: 'var(--white)', padding: 'clamp(56px,9vw,96px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,5vw,56px)' }}>
            <div className="section-label">Nos avantages</div>
            <h2 className="section-title" style={{ color: 'var(--ink)' }}>
              Pourquoi choisir<br/><em>Allons Somo ?</em>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: 18,
          }}>
            <Pillar icon="check_circle"
              title="Simplicité totale"
              desc="Pas de formulaire compliqué, tout passe par WhatsApp. Trois actions suffisent : choisir, cliquer, réserver."
              delay={0} />
            <Pillar icon="handshake"
              title="Zéro intermédiaire"
              desc="Vous échangez directement, sans passer par des agences. Relation directe, confiance immédiate."
              delay={80} />
            <Pillar icon="verified"
              title="Transparence"
              desc="Ce que vous voyez = ce que vous aurez. Photos réelles, prix affichés, conditions claires."
              delay={160} />
            <Pillar icon="place"
              title="Expérience locale"
              desc="Des résidences situées dans les meilleurs quartiers d'Abidjan, sélectionnées par une équipe ivoirienne."
              delay={240} />
          </div>
        </div>
      </div>

      {/* ── Notre présence + Vision ── */}
      <div style={{ background: 'var(--bg)', padding: 'clamp(56px,9vw,96px) var(--pad)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 'clamp(40px,6vw,64px)',
            alignItems: 'center',
          }}>
            <div>
              <div className="section-label">Notre présence</div>
              <h2 className="section-title" style={{ marginBottom: 20, color: 'var(--ink)' }}>
                Basé à<br/><em>Abidjan 🇨🇮</em>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: 'place',    text: 'Zones couvertes : Cocody, Riviera, Marcory (et plus à venir)' },
                  { icon: 'schedule', text: 'Réponse rapide via WhatsApp' },
                  { icon: 'public',   text: "Aujourd'hui à Abidjan, demain dans d'autres villes de CI" },
                ].map((x, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 18px', background: 'var(--white)',
                    border: '1px solid var(--border)', borderRadius: 14,
                  }}>
                    <span className="material-icons" style={{ fontSize: 18, color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>{x.icon}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink)' }}>{x.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-label">Notre vision</div>
              <h2 className="section-title" style={{ marginBottom: 16, color: 'var(--ink)' }}>
                Simple. Fiable.<br/><em>Local.</em>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)' }}>
                Développer un service simple et fiable pour la location
                de résidences meublées en Côte d'Ivoire.
                Aujourd'hui à Abidjan, demain dans d'autres villes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA final ── */}
      <div style={{ padding: 'clamp(56px,9vw,96px) var(--pad)', background: 'var(--white)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: 'var(--cta-bg)', borderRadius: 24,
          padding: 'clamp(48px,7vw,80px) var(--pad)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: 40, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,58,.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 400,
              fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#fff',
              letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12,
            }}>
              Prêt à trouver<br/>
              <em style={{ color: 'rgba(255,255,255,.45)' }}>votre prochaine résidence ?</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.42)', maxWidth: 400 }}>
              Parcourez notre catalogue et réservez directement par WhatsApp.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/residences" className="btn btn-white">
              <span className="material-icons" style={{ fontSize: 17 }}>apartment</span>
              Parcourez les résidences
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa">
              <span className="material-icons" style={{ fontSize: 17 }}>chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
