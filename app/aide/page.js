// SERVER COMPONENT — pas de 'use client'
import PageClient from './PageClient'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newhorizon-ci.com'

export const metadata = {
  title: "Aide & FAQ — Réservation résidences New Horizon",
  description: "Tout ce que vous devez savoir sur la réservation chez New Horizon : caution, paiement, annulation, équipements, arrivée. FAQ complète disponible 24h/24.",
  alternates: { canonical: `${BASE_URL}/aide` },
  openGraph: {
    title: "Aide & FAQ — New Horizon Résidences",
    description: "Caution, paiement, annulation : toutes les réponses à vos questions sur nos résidences à Abidjan.",
  },
}

export default function Page() {
  return <PageClient />
}
