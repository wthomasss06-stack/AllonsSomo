import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://AlllonsSomo.pythonanywhere.com'

const DEFAULT = {
  lat:      5.3364,
  lon:     -4.0267,
  label:   "Abidjan, Côte d'Ivoire",
  zoom:     14,
  ville:   'Abidjan',
  whatsapp:'2250501862230',
}

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/map-settings`, { next: { revalidate: 60 } })
    if (!res.ok) return NextResponse.json(DEFAULT)
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json(DEFAULT)
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const adminKey = req.headers.get('X-Admin-Key') || ''
    const res = await fetch(`${API_URL}/api/map-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
