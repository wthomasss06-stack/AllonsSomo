'use client'
import Icon from '@/components/ui/Icon'

const SECTIONS = [
  { titre: "1. Qu'est-ce qu'un cookie ?", contenu: "Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) lors de votre visite sur notre site. Il permet de mémoriser des informations sur votre navigation et d'améliorer votre expérience utilisateur." },
  { titre: "2. Les cookies que nous utilisons", contenu: "Nous utilisons uniquement des cookies strictement nécessaires au bon fonctionnement du site :\n\n• Cookie de préférence de thème (clair/sombre) : stocké localement dans votre navigateur pour mémoriser votre choix d'affichage.\n• Cookie d'acceptation : mémorise votre choix concernant notre bannière de cookies pour ne pas vous l'afficher à chaque visite.\n\nNous n'utilisons pas de cookies publicitaires, ni de traceurs tiers (Google Analytics, Facebook Pixel, etc.)." },
  { titre: "3. Cookies tiers", contenu: "Notre site intègre des liens vers WhatsApp pour la communication. En cliquant sur ces liens, vous êtes redirigé vers WhatsApp (Meta) qui peut collecter ses propres données selon sa politique de confidentialité. Nous vous encourageons à consulter la politique de Meta si vous souhaitez en savoir plus." },
  { titre: "4. Gestion de vos préférences", contenu: "Vous pouvez à tout moment :\n\n• Refuser ou supprimer les cookies en configurant votre navigateur (voir les paramètres de Firefox, Chrome, Safari, Edge).\n• Réinitialiser vos préférences en vidant le localStorage de votre navigateur.\n\nAttention : la désactivation de certains cookies peut affecter le fonctionnement du site (notamment la mémorisation du thème choisi)." },
  { titre: "5. Durée de conservation", contenu: "Les cookies que nous utilisons sont des cookies de session ou persistants avec une durée maximale de 12 mois. Ils sont automatiquement supprimés à l'expiration ou lors de la suppression manuelle depuis votre navigateur." },
  { titre: "6. Contact", contenu: "Pour toute question relative à notre politique de cookies ou à la protection de vos données personnelles :\n\n• Par email : contact@allons-somo.ci\n• Via WhatsApp : accessible depuis n'importe quelle page du site" },
]

export default function CookiesPage() {
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
          <div className="section-label">Légal</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 700, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.1, marginBottom: 12 }}>
            Politique de <span style={{ background: 'linear-gradient(135deg, #F5E098, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>cookies</span>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Dernière mise à jour : {'3 avril 2025'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '52px clamp(16px,4%,40px) 88px' }}>

        {SECTIONS.map((section, i) => (
          <div key={i} style={{
            marginBottom: 32,
            padding: '28px 30px',
            borderRadius: 20,
            background: 'linear-gradient(160deg, var(--bg-surface-2) 0%, var(--bg-surface) 100%)',
            border: '1px solid var(--border)',
            borderTopColor: 'rgba(255,255,255,.09)',
            borderBottomColor: 'rgba(0,0,0,.35)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.07), 0 4px 20px rgba(0,0,0,.4)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Number badge */}
            <div style={{
              position: 'absolute', top: 20, right: 20,
              fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, fontStyle: 'italic',
              color: 'rgba(201,168,76,.06)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            }}>{i + 1}</div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, fontStyle: 'italic',
              color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 8, height: 8, background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
                borderRadius: '50%', display: 'inline-block', flexShrink: 0,
                boxShadow: '0 0 8px rgba(201,168,76,.55)',
              }}/>
              {section.titre}
            </h2>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.85 }}>
              {section.contenu.split('\n').map((line, li) => (
                <p key={li} style={{ marginBottom: line === '' ? 8 : 4 }}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        ))}

        {/* Preferences reset CTA */}
        <div style={{
          padding: '30px', borderRadius: 22,
          background: 'linear-gradient(160deg, var(--bg-surface-2) 0%, var(--bg-surface) 100%)',
          border: '1px solid rgba(201,168,76,.2)',
          borderTopColor: 'rgba(255,255,255,.09)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.07), 0 8px 28px rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        }}>
          {/* Cookie icon — skeuo button */}
          <div style={{
            width: 52, height: 52, borderRadius: 15, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(160deg, rgba(201,168,76,.16), rgba(154,120,48,.07))',
            border: '1px solid rgba(201,168,76,.25)', borderTopColor: 'rgba(255,255,255,.1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 5px 18px rgba(0,0,0,.45)',
          }}>
            <Icon n="cookie" size={26} color={'var(--gold)'}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, fontStyle: 'italic', color: 'var(--text)', marginBottom: 5 }}>Gérer vos préférences</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Vous pouvez modifier vos préférences de cookies à tout moment en effaçant le localStorage de votre navigateur.
            </p>
          </div>
          <button onClick={() => { localStorage.removeItem('as-cookies'); window.location.reload() }} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
            background: 'linear-gradient(160deg, rgba(201,168,76,.14), rgba(154,120,48,.06))',
            border: '1px solid rgba(201,168,76,.28)', borderTopColor: 'rgba(255,255,255,.1)',
            color: 'var(--gold-light)', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700,
            letterSpacing: '.06em', textTransform: 'uppercase',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 3px 12px rgba(0,0,0,.4)',
            transition: 'all .2s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.5)'; e.currentTarget.style.background = 'linear-gradient(160deg, rgba(201,168,76,.22), rgba(154,120,48,.1))' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.28)'; e.currentTarget.style.background = 'linear-gradient(160deg, rgba(201,168,76,.14), rgba(154,120,48,.06))' }}>
            <Icon n="restart_alt" size={14}/>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}
