'use client'
import { useState } from 'react'
import { usePWAInstall } from '@/lib/usePWAInstall'

// ── PWAInstallButton ──────────────────────────────────────────
// Bouton "Installer l'app" dans le footer.
// - Android / Chrome / Edge / PC  → déclenche la bannière native
// - iOS / Safari                  → ouvre un tooltip avec les instructions
// - Déjà installé                 → bouton masqué

export default function PWAInstallButton() {
  const { canInstall, isIOS, isInstalled, install } = usePWAInstall()
  const [showIOSTip, setShowIOSTip] = useState(false)

  // Déjà installé → on n'affiche rien
  if (isInstalled) return null

  // Ni Android ni iOS → navigateur non compatible (Firefox desktop, etc.)
  if (!canInstall && !isIOS) return null

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>

      {/* ── Bouton principal ── */}
      <button
        onClick={isIOS ? () => setShowIOSTip((v) => !v) : install}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          borderRadius: 99,
          border: '1.5px solid var(--gold)',
          background: 'transparent',
          color: 'var(--gold)',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "var(--font-ui, 'DM Sans', sans-serif)",
          cursor: 'pointer',
          transition: 'all .18s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--gold)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--gold)'
        }}
        title="Installer l'application New Horizon"
      >
        {/* Icône téléchargement */}
        <span className="material-icons" style={{ fontSize: 16 }}>
          {isIOS ? 'ios_share' : 'download'}
        </span>
        Installer l'app
      </button>

      {/* ── Tooltip iOS ── */}
      {isIOS && showIOSTip && (
        <>
          {/* Backdrop pour fermer */}
          <div
            onClick={() => setShowIOSTip(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 998,
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 260,
            background: 'var(--ink)',
            color: '#fff',
            borderRadius: 14,
            padding: '16px 18px',
            fontSize: 13,
            lineHeight: 1.6,
            zIndex: 999,
            boxShadow: '0 8px 32px rgba(0,0,0,.25)',
          }}>
            {/* Flèche */}
            <div style={{
              position: 'absolute',
              bottom: -7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 14, height: 7,
              background: 'var(--ink)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}/>

            <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-icons" style={{ fontSize: 16, color: '#FF7A1A' }}>info</span>
              Ajouter à l'écran d'accueil
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'rgba(255,255,255,.85)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FF7A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700 }}>1</span>
                <span>Appuie sur <strong style={{color:'#fff'}}>Partager</strong> <span className="material-icons" style={{fontSize:13,verticalAlign:'middle'}}>ios_share</span> en bas de Safari</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FF7A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700 }}>2</span>
                <span>Sélectionne <strong style={{color:'#fff'}}>"Sur l'écran d'accueil"</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FF7A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700 }}>3</span>
                <span>Appuie sur <strong style={{color:'#fff'}}>"Ajouter"</strong></span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
