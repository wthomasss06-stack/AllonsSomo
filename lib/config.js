// ── Config ALLONS SOMO ───────────────────────────────────────
export const SITE = {
  name:      'Allons Somo',
  tagline:   'Résidences premium en Côte d\'Ivoire',
  bio:       'Trouvez et réservez des résidences meublées à Abidjan, Côte d\'Ivoire.',
  whatsapp:  process.env.NEXT_PUBLIC_WHATSAPP || '2250789851090',
  email:     'contact@allons-somo.ci',
  instagram: 'https://instagram.com/allons_somo',
  tiktok:    'https://tiktok.com/@allons_somo',
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

export async function getResidences(params = {}) {
  try {
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(`${API_URL}/api/residences${qs ? '?' + qs : ''}`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function getResidence(id) {
  try {
    const res = await fetch(`${API_URL}/api/residences/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export function getWAReservation(residence) {
  const msg = encodeURIComponent(`Bonjour ! Je souhaite réserver la résidence "${residence.titre}" à ${residence.ville}. ${residence.label_prix_min}. Quelles sont les disponibilités ?`)
  return `https://wa.me/${SITE.whatsapp}?text=${msg}`
}

export function getWAContact(residence) {
  const msg = encodeURIComponent(`Bonjour, j'ai une question concernant la résidence "${residence.titre}".`)
  return `https://wa.me/${SITE.whatsapp}?text=${msg}`
}

export function formatPrix(n) {
  if (!n) return '—'
  return new Intl.NumberFormat('fr-FR').format(n) + ' XOF'
}

export const EQUIPEMENTS_ICONS = {
  wifi:              { icon: 'wifi',                   label: 'Wifi' },
  climatisation:     { icon: 'ac_unit',                label: 'Climatisation' },
  parking:           { icon: 'local_parking',          label: 'Parking' },
  cuisine_equipee:   { icon: 'kitchen',                label: 'Cuisine équipée' },
  piscine:           { icon: 'pool',                   label: 'Piscine' },
  television:        { icon: 'tv',                     label: 'Télévision' },
  machine_a_laver:   { icon: 'local_laundry_service',  label: 'Lave-linge' },
  balcon:            { icon: 'balcony',                label: 'Balcon' },
  gardien:           { icon: 'security',               label: 'Gardien' },
  groupe_electrogene:{ icon: 'bolt',                   label: 'Groupe élec.' },
}

export const VILLES = [
  'Abidjan',
]

export const TYPES_BIEN = ['studio','appartement','villa','duplex','chambre','maison']
