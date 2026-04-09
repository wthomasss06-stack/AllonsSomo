// SERVER COMPONENT — pas de 'use client'
import PageClient from './PageClient'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newhorizon-ci.com'

export const metadata = {
  title: "À propos de New Horizon",
  description: "Découvrez New Horizon, entreprise ivoirienne fondée en 2023. Notre mission : vous donner accès aux plus belles résidences meublées à Abidjan, avec un service transparent et disponible 7j/7.",
  alternates: { canonical: `${BASE_URL}/a-propos` },
  openGraph: {
    title: "À propos de New Horizon",
    description: "Entreprise ivoirienne fondée en 2023. Résidences meublées haut de gamme à Abidjan, disponibles 7j/7.",
  },
}

export default function Page() {
  return <PageClient />
}
