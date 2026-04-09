// SERVER COMPONENT — pas de 'use client'
import PageClient from './PageClient'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newhorizon-ci.com'

export const metadata = {
  title: "Toutes nos résidences meublées à Abidjan",
  description: "Parcourez toutes nos résidences meublées disponibles à Abidjan : Cocody, Plateau, Marcory, Yopougon, Riviera. Filtrez par commune, type de bien et budget. Réservation directe sur WhatsApp.",
  alternates: { canonical: `${BASE_URL}/residences` },
  openGraph: {
    title: "Toutes nos résidences meublées — New Horizon Abidjan",
    description: "Explorez notre catalogue complet de résidences meublées à Abidjan. Filtrez par quartier, type et budget.",
    images: [{ url: '/hero/hero-2.jpg', width: 1200, height: 630, alt: 'Résidences New Horizon Abidjan' }],
  },
}

export default function Page() {
  return <PageClient />
}
