'use client'
import { Cookie, RotateCcw } from 'lucide-react'

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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 66 }}>

      {/* Header */}
      <div style={{
        padding: 'clamp(72px,10vw,120px) var(--pad) clamp(48px,6vw,72px)',
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(201,150,58,.35) 30%, rgba(201,150,58,.35) 70%, transparent)' }}/>
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-label">Légal</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 12 }}>
            Politique de <em style={{ color: 'var(--gold)' }}>cookies</em>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Dernière mise à jour : 3 avril 2025</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(40px,6vw,72px) var(--pad) 88px' }}>
        {SECTIONS.map((section, i) => (
          <div key={i} style={{
            marginBottom: 24,
            padding: 'clamp(20px,3vw,30px)',
            borderRadius: 20,
            background: 'var(--white)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(15,14,12,.04)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 16, right: 20,
              fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400, fontStyle: 'italic',
              color: 'var(--border)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            }}>{i + 1}</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 400, fontStyle: 'italic',
              color: 'var(--ink)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 7, height: 7, background: 'var(--gold)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}/>
              {section.titre}
            </h2>
            <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.85 }}>
              {section.contenu.split('\n').map((line, li) => (
                <p key={li} style={{ marginBottom: line === '' ? 8 : 4 }}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        ))}

        {/* Preferences reset */}
        <div style={{
          padding: 'clamp(20px,3vw,30px)', borderRadius: 22,
          background: 'var(--white)',
          border: '1px solid rgba(201,150,58,.25)',
          display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(201,150,58,.08)', border: '1px solid rgba(201,150,58,.2)',
          }}>
            <Cookie size={26} style={{ color: 'var(--gold)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 5 }}>Gérer vos préférences</div>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
              Vous pouvez modifier vos préférences de cookies à tout moment en effaçant le localStorage de votre navigateur.
            </p>
          </div>
          <button onClick={() => { localStorage.removeItem('as-cookies'); window.location.reload() }} className="btn btn-outline" style={{ fontSize: 12, whiteSpace: 'nowrap', gap: 6 }}>
            <RotateCcw size={14} />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}
