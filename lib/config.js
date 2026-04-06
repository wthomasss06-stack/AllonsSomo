// ── Config NEW HORIZON ───────────────────────────────────────
export const SITE = {
  name:      'New Horizon',
  tagline:   'Résidences premium en Côte d\'Ivoire',
  bio:       'Trouvez et réservez des résidences meublées à Abidjan, Côte d\'Ivoire.',
  whatsapp:  process.env.NEXT_PUBLIC_WHATSAPP || '2250789851090',
  email:     'Uaka9729@gmail.com',
  facebook:  'https://www.facebook.com/share/1DGfjrqWPc/',
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

export function getWAReservation(residence, options = {}) {
  const { dateArrivee, duree, unite, total } = options
  let msg = `Bonjour ! Je souhaite réserver la résidence *${residence.titre}*`
  if (residence.commune) msg += ` à ${residence.commune}, ${residence.ville}`
  else if (residence.ville) msg += ` à ${residence.ville}`
  msg += '.\n'
  if (dateArrivee) msg += `\n📅 Date d'arrivée : ${dateArrivee}`
  if (duree && unite) msg += `\n⏱ Durée : ${duree} ${unite}`
  if (total) msg += `\n💰 Total estimé : ${formatPrix(total)}`
  if (!dateArrivee && residence.label_prix_min) msg += `\n💰 Tarif : ${residence.label_prix_min}`
  msg += '\n\nQuelles sont les disponibilités ?'
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`
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

export const COMMUNES = [
  'Cocody','Plateau','Marcory','Yopougon','Treichville',
  'Adjamé','Koumassi','Port-Bouët','Abobo','Attécoubé',
  'Riviera','Angré','Deux-Plateaux','Bingerville','Songon',
]

// Legacy alias
export const VILLES = COMMUNES

// Récupère le numéro WhatsApp depuis les paramètres admin (client-side)
let _cachedWA = null
export async function fetchWhatsApp() {
  if (_cachedWA) return _cachedWA
  try {
    const r = await fetch('/api/map-settings')
    const d = await r.json()
    if (d.whatsapp) { _cachedWA = d.whatsapp; return d.whatsapp }
  } catch {}
  return SITE.whatsapp
}

export const TYPES_BIEN = ['studio','appartement','villa','duplex','chambre','maison']
