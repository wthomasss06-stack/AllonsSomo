'use client'
import { useState, useEffect } from 'react'

// ── usePWAInstall ─────────────────────────────────────────────
// Gère l'enregistrement du Service Worker + l'événement beforeinstallprompt
// Retourne : { canInstall, isIOS, isInstalled, install }

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled,    setIsInstalled]    = useState(false)
  const [isIOS,          setIsIOS]          = useState(false)

  useEffect(() => {
    // Enregistrement du Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Détection iOS (Safari ne supporte pas beforeinstallprompt)
    const ua = navigator.userAgent
    const ios = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua)
    setIsIOS(ios)

    // Déjà installé ? (mode standalone = lancé depuis l'écran d'accueil)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    setIsInstalled(standalone)

    // Écoute de l'événement natif Android/Chrome/Edge/PC
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Si l'app vient d'être installée
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setDeferredPrompt(null)
  }

  return {
    canInstall:  !!deferredPrompt,   // Android / Chrome / Edge / PC
    isIOS,                           // iOS → on affiche les instructions manuelles
    isInstalled,
    install,
  }
}
