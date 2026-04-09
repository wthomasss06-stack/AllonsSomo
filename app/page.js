// SERVER COMPONENT — pas de 'use client'
import PageClient from './PageClient'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newhorizon-ci.com'

export const metadata = {
  title: "New Horizon — Résidences meublées premium à Abidjan",
  description: "Trouvez et réservez des résidences meublées haut de gamme à Abidjan. Studios, appartements, villas à Cocody, Plateau, Marcory. Réponse WhatsApp en moins de 5 minutes.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "New Horizon — Résidences meublées premium à Abidjan",
    description: "Studios, appartements et villas meublés disponibles dans tous les quartiers d'Abidjan. Réservation directe sur WhatsApp, sans frais cachés.",
    images: [{ url: '/hero/hero-1.jpg', width: 1200, height: 630, alt: 'New Horizon Abidjan' }],
  },
}

export default function Page() {
  return <PageClient />
}
