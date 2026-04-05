import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR   = join(process.cwd(), 'data')
const SETTINGS_F = join(DATA_DIR, 'map-settings.json')

const DEFAULT = {
  lat:   5.3364,
  lon:  -4.0267,
  label: 'Abidjan, Côte d\'Ivoire',
  zoom:  14,
}

function read() {
  try {
    if (!existsSync(SETTINGS_F)) return DEFAULT
    return { ...DEFAULT, ...JSON.parse(readFileSync(SETTINGS_F, 'utf8')) }
  } catch { return DEFAULT }
}

export async function GET() {
  return NextResponse.json(read())
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { lat, lon, label, zoom } = body
    if (lat == null || lon == null) {
      return NextResponse.json({ error: 'lat et lon sont requis.' }, { status: 400 })
    }
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
    const settings = {
      lat:   parseFloat(lat),
      lon:   parseFloat(lon),
      label: String(label || '').trim() || DEFAULT.label,
      zoom:  Number(zoom) || 14,
    }
    writeFileSync(SETTINGS_F, JSON.stringify(settings, null, 2))
    return NextResponse.json({ ok: true, ...settings })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
