// SERVER COMPONENT — generateMetadata dynamique par résidence
import PageClient from './PageClient'
import { getResidence } from '@/lib/config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newhorizon-ci.com'
const SITE_NAME = 'New Horizon'

export async function generateMetadata({ params }) {
  const { id } = await params
  const r = await getResidence(id)

  if (!r) {
    return {
      title: `Résidence introuvable | ${SITE_NAME}`,
      description: "Cette résidence n'est pas disponible ou a été supprimée.",
    }
  }

  const location = [r.commune, r.ville].filter(Boolean).join(', ')
  const type = r.type_bien
    ? r.type_bien.charAt(0).toUpperCase() + r.type_bien.slice(1)
    : 'Résidence'
  const prix = r.label_prix_min ? ` · À partir de ${r.label_prix_min}` : ''
  const title = `${r.titre} — ${type} meublé à ${location}`
  const description = `${type} meublé${r.type_bien === 'villa' ? 'e' : ''} à ${location}${prix}. Climatisé, équipé, disponible sur réservation WhatsApp. Réponse en moins de 5 minutes.`

  return {
    title,
    description,
    keywords: [r.titre, type, location, "résidence meublée Côte d'Ivoire", SITE_NAME],
    alternates: { canonical: `${BASE_URL}/residences/${id}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/residences/${id}`,
      siteName: SITE_NAME,
      locale: 'fr_CI',
      type: 'website',
      ...(r.images?.[0] && {
        images: [{ url: r.images[0], alt: r.titre, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(r.images?.[0] && { images: [r.images[0]] }),
    },
  }
}

export default function Page() {
  return <PageClient />
}
