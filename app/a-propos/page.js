'use client'
import Link from 'next/link'
import { SITE } from '@/lib/config'

// ── Value pillar card ─────────────────────────────────────────
function Pillar({ icon, title, desc, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: 'clamp(28px,4vw,40px)',
      display: 'flex', flexDirection: 'column', gap: 16,
      animation: `fadeUp .5s var(--ease) ${delay}ms both`,
      transition: 'box-shadow .2s, transform .2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-lg)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: 'var(--gold-pale)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-icons" style={{ fontSize: 24, color: 'var(--gold)' }}>{icon}</span>
      </div>
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,2vw,1.3rem)',
          fontWeight: 400, letterSpacing: '-.02em', marginBottom: 8,
          fontStyle: 'italic',
        }}>{title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-3)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ── Timeline step ─────────────────────────────────────────────
function Step({ year, title, desc, last = false }) {
  return (
    <div style={{ display: 'flex', gap: 24, position: 'relative' }}>
      {/* Line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--gold)', border: '3px solid var(--white)',
          boxShadow: '0 0 0 2px var(--gold)',
          flexShrink: 0, marginTop: 4,
        }}/>
        {!last && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 8, minHeight: 40 }}/>}
      </div>
      {/* Content */}
      <div style={{ paddingBottom: last ? 0 : 36 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '.14em',
          textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4,
        }}>{year}</div>
        <h4 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.05rem',
          fontWeight: 400, fontStyle: 'italic', marginBottom: 6,
        }}>{title}</h4>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-3)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ── Team member card ──────────────────────────────────────────
function TeamCard({ initials, name, role, desc }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: 28, textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
        fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400,
        color: '#fff', fontStyle: 'italic', letterSpacing: '-.02em',
      }}>{initials}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, fontStyle: 'italic', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>{role}</div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-3)' }}>{desc}</p>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AProposPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* ── Hero section ── */}
      <div style={{
        background: 'var(--ink)',
        minHeight: 'clamp(340px, 50vw, 500px)',
        display: 'flex', alignItems: 'center',
        padding: 'clamp(100px,12vw,160px) var(--pad) clamp(60px,8vw,100px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative shapes */}
        <div style={{
          position: 'absolute', top: -80, right: -40,
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,150,58,.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: -100, left: '30%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,150,58,.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        {/* Gold line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 'var(--pad)', right: 'var(--pad)',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,150,58,.35) 30%, rgba(201,150,58,.35) 70%, transparent)',
        }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <div style={{ animation: 'fadeUp .6s var(--ease) both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(201,150,58,.12)', border: '1px solid rgba(201,150,58,.25)',
              marginBottom: 24,
            }}>
              <span className="material-icons" style={{ fontSize: 13, color: 'var(--gold)' }}>info</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                À propos
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 400, color: '#fff',
              letterSpacing: '-.03em', lineHeight: 1.08,
              marginBottom: 24, maxWidth: 680,
            }}>
              On facilite la vie<br/>
              <em style={{ color: 'rgba(255,255,255,.55)' }}>des résidents en CI</em>
            </h1>

            <p style={{
              fontSize: 'clamp(15px,2vw,18px)', lineHeight: 1.7,
              color: 'rgba(255,255,255,.45)',
              maxWidth: 520, marginBottom: 36,
            }}>
              Allons Somo est une plateforme ivoirienne de mise en relation entre
              propriétaires et locataires à Abidjan, avec une réservation directe et sans intermédiaire coûteux.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/residences" className="btn btn-white">
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

      {/* ── Mission ── */}
      <div style={{ background: 'var(--surface)', padding: 'clamp(56px,9vw,96px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(40px,6vw,72px)',
            alignItems: 'center',
          }}>
            <div>
              <div className="section-label">Notre mission</div>
              <h2 className="section-title" style={{ marginBottom: 20 }}>
                Louer simple,<br/><em>louer bien</em>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-3)', marginBottom: 16 }}>
                À Abidjan, trouver un logement de qualité,
                disponible rapidement et à prix honnête est encore trop compliqué.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-3)', marginBottom: 16 }}>
                Allons Somo simplifie ce parcours : des résidences sélectionnées,
                des photos réelles, des tarifs transparents, et une réservation
                directe par WhatsApp — sans frais cachés.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-3)' }}>
                Nous nous occupons de toute la logistique pour que vous puissiez
                simplement poser vos valises.
              </p>
            </div>

            {/* Stats highlight */}
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-2xl)',
              padding: 'clamp(28px,4vw,48px)',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 1, overflow: 'hidden',
              boxShadow: 'var(--sh-md)',
            }}>
              {[
                { n: '2023', label: 'Année de création', icon: 'calendar_today' },
                { n: '🇨🇮', label: 'Entreprise ivoirienne', icon: null, emoji: true },
                { n: 'Abidjan', label: 'Ville couverte', icon: 'place' },
                { n: '24h/7j', label: 'Support disponible', icon: 'support_agent' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: 'clamp(20px,3vw,32px) clamp(16px,2.5vw,28px)',
                  background: i % 2 === 0 ? 'var(--white)' : 'var(--surface)',
                  borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  {s.icon && <span className="material-icons" style={{ fontSize: 20, color: 'var(--gold)', display: 'block', marginBottom: 8 }}>{s.icon}</span>}
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    fontWeight: 400, letterSpacing: '-.02em', marginBottom: 4,
                  }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Nos valeurs ── */}
      <div style={{ padding: 'clamp(56px,9vw,96px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,5vw,56px)' }}>
            <div className="section-label">Ce qui nous guide</div>
            <h2 className="section-title">Nos valeurs</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            <Pillar
              icon="verified"
              title="Transparence totale"
              desc="Photos réelles, prix affichés, conditions claires. Ce que vous voyez est exactement ce que vous trouverez à votre arrivée."
              delay={0}
            />
            <Pillar
              icon="handshake"
              title="Relation directe"
              desc="Pas d'intermédiaire opaque. Vous réservez directement via WhatsApp, vous parlez à une vraie personne, vous savez à qui vous faites confiance."
              delay={80}
            />
            <Pillar
              icon="shield"
              title="Sécurité des transactions"
              desc="Votre caution est sécurisée à chaque étape. Notre processus de réservation protège aussi bien le locataire que le propriétaire."
              delay={160}
            />
            <Pillar
              icon="place"
              title="Ancrage local"
              desc="Nous sommes ivoiriens, nous connaissons les quartiers, les prix du marché et les attentes réelles des résidents en CI."
              delay={240}
            />
          </div>
        </div>
      </div>

      {/* ── Comment ça marche ── */}
      <div style={{ background: 'var(--surface)', padding: 'clamp(56px,9vw,96px) var(--pad)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(40px,6vw,72px)',
            alignItems: 'start',
          }}>
            <div>
              <div className="section-label">Le processus</div>
              <h2 className="section-title" style={{ marginBottom: 12 }}>
                Comment<br/><em>ça marche ?</em>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-3)', marginBottom: 32 }}>
                De la recherche à l'arrivée dans votre résidence, tout est pensé pour être rapide et sans stress.
              </p>
              <Link href="/aide" className="btn btn-outline" style={{ display: 'inline-flex' }}>
                <span className="material-icons" style={{ fontSize: 17 }}>help_outline</span>
                FAQ complète
              </Link>
            </div>

            <div style={{ paddingTop: 8 }}>
              {[
                { n: '01', title: 'Parcourez le catalogue', desc: 'Filtrez par ville, type de bien et budget. Chaque résidence a des photos réelles et des tarifs clairs.' },
                { n: '02', title: 'Contactez via WhatsApp', desc: 'Un message suffit. Notre équipe répond rapidement pour confirmer les disponibilités.' },
                { n: '03', title: 'Versez la caution sécurisée', desc: 'La caution bloque votre réservation. Elle est restituée intégralement à votre départ si tout est en ordre.' },
                { n: '04', title: 'Profitez de votre résidence', desc: 'Arrivez les clés en main. La résidence est prête, meublée et climatisée.' },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: i < arr.length - 1 ? 28 : 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: 'var(--gold-pale)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 400,
                    color: 'var(--gold)', fontStyle: 'italic',
                  }}>{step.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{step.title}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-3)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Notre histoire ── */}
      <div style={{ padding: 'clamp(56px,9vw,96px) var(--pad)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,5vw,64px)' }}>
            <div className="section-label">Notre parcours</div>
            <h2 className="section-title">
              L'histoire<br/><em>d'Allons Somo</em>
            </h2>
          </div>

          <div style={{ paddingLeft: 8 }}>
            <Step
              year="2023 — Naissance du projet"
              title="Un constat simple"
              desc="Face aux difficultés de trouver une location meublée de qualité à Abidjan sans passer par des agences opaques et coûteuses, l'idée d'Allons Somo naît. L'objectif : créer une plateforme directe, locale et transparente."
            />
            <Step
              year="2024 — Lancement à Abidjan"
              title="Les premières résidences en ligne"
              desc="Le catalogue se constitue avec un premier lot de résidences sélectionnées à Abidjan — Cocody, Marcory, Riviera. La réservation par WhatsApp devient la signature de l'expérience Allons Somo."
            />
            <Step
              year="2025 — Croissance"
              title="Structuration de l'offre"
              desc="Le catalogue s'enrichit. Le site est entièrement refait pour offrir une expérience premium : photos haute définition, filtres avancés, carte interactive. L'équipe s'agrandit."
            />
            <Step
              year="2026 — En cours"
              title="Enrichissement du catalogue"
              desc="Le catalogue continue de s'étoffer à Abidjan. L'ambition à moyen terme est de couvrir d'autres villes de Côte d'Ivoire avec la même exigence de qualité — quand le moment sera venu."
              last
            />
          </div>
        </div>
      </div>

      {/* ── CTA final ── */}
      <div style={{ padding: 'clamp(56px,9vw,96px) var(--pad)' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: 'var(--ink)', borderRadius: 'var(--r-2xl)',
          padding: 'clamp(48px,7vw,80px) var(--pad)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: 40, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,58,.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 400,
              fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#fff',
              letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 12,
            }}>
              Prêt à trouver<br/>
              <em style={{ color: 'rgba(255,255,255,.5)' }}>votre prochaine résidence ?</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.4)', maxWidth: 400 }}>
              Parcourez notre catalogue et réservez directement par WhatsApp.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/residences" className="btn btn-white">
              <span className="material-icons" style={{ fontSize: 17 }}>apartment</span>
              Explorer les résidences
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
