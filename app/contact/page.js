// SERVER COMPONENT — pas de 'use client'
import PageClient from './PageClient'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newhorizon-ci.com'

export const metadata = {
  title: "Nous contacter — New Horizon Abidjan",
  description: "Contactez New Horizon par WhatsApp, email ou téléphone. Disponibles 7j/7. Réponse garantie en moins de 5 minutes pour toutes vos questions sur nos résidences meublées à Abidjan.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contacter New Horizon — Résidences à Abidjan",
    description: "Disponibles 7j/7 sur WhatsApp. Réponse en moins de 5 minutes.",
  },
}

export default function Page() {
  return <PageClient />
}
