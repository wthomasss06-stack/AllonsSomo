'use client'
import { useState, useEffect, useRef } from 'react'
import Icon from '@/components/ui/Icon'

// Coordonnées hardcodées par commune / quartier d'Abidjan (fallback fiable)
const ABIDJAN_COORDS = {
  'cocody':         { lat: 5.3594, lng: -3.9731 },
  'plateau':        { lat: 5.3212, lng: -4.0142 },
  'marcory':        { lat: 5.2958, lng: -3.9773 },
  'yopougon':       { lat: 5.3370, lng: -4.0814 },
  'treichville':    { lat: 5.2978, lng: -4.0084 },
  'adjamé':         { lat: 5.3526, lng: -4.0183 },
  'adjame':         { lat: 5.3526, lng: -4.0183 },
  'koumassi':       { lat: 5.2780, lng: -3.9570 },
  'port-bouët':     { lat: 5.2637, lng: -3.9252 },
  'port-bouet':     { lat: 5.2637, lng: -3.9252 },
  'abobo':          { lat: 5.4115, lng: -4.0139 },
  'attécoubé':      { lat: 5.3453, lng: -4.0512 },
  'attecoube':      { lat: 5.3453, lng: -4.0512 },
  'riviera':        { lat: 5.3692, lng: -3.9456 },
  'angré':          { lat: 5.3767, lng: -3.9892 },
  'angre':          { lat: 5.3767, lng: -3.9892 },
  'deux-plateaux':  { lat: 5.3643, lng: -3.9842 },
  'bingerville':    { lat: 5.3567, lng: -3.8838 },
  'songon':         { lat: 5.2917, lng: -4.1917 },
  'abidjan':        { lat: 5.3364, lng: -4.0267 },
}

function resolveCoords(quartier, commune, ville) {
  const candidates = [quartier, commune, ville].filter(Boolean).map(s => s.toLowerCase().trim())
  for (const c of candidates) {
    if (ABIDJAN_COORDS[c]) return { ...ABIDJAN_COORDS[c], label: c }
  }
  // Essai Nominatim async (appelé séparément)
  return null
}

async function nominatimGeocode(q) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Abidjan, Côte d\'Ivoire')}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'fr' } }
    )
    const d = await r.json()
    if (d.length) return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) }
  } catch {}
  return null
}

function haversine(a, b) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const sin2 = x => Math.sin(x / 2) ** 2
  const c = sin2(dLat) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sin2(dLng)
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

export default function MapView({ quartier, commune, ville = 'Abidjan', title, height = 340 }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [phase, setPhase] = useState('init') // init | ready | located | error
  const [userPos, setUserPos] = useState(null)
  const [resPos, setResPos] = useState(null)
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [dark, setDark] = useState(false)
  const [geoError, setGeoError] = useState(false)

  // Suivre le thème
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    let mounted = true

    const loadLeaflet = () => new Promise(res => {
      if (window.L) { res(); return }
      if (!document.querySelector('#lf-css')) {
        const lnk = document.createElement('link')
        lnk.id = 'lf-css'
        lnk.rel = 'stylesheet'
        lnk.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(lnk)
      }
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.onload = res
      document.head.appendChild(s)
    })

    const init = async () => {
      try {
        await loadLeaflet()
        if (!mounted || !containerRef.current || mapRef.current) return
        const L = window.L

        // Résoudre coords résidence
        let pos = resolveCoords(quartier, commune, ville)
        if (!pos) {
          const q = [quartier, commune].filter(Boolean).join(' ')
          pos = await nominatimGeocode(q) || ABIDJAN_COORDS['abidjan']
        }
        if (!mounted) return
        setResPos(pos)

        // Créer la carte
        const map = L.map(containerRef.current, {
          center: [pos.lat, pos.lng],
          zoom: 15,
          zoomControl: true,
          attributionControl: false,
        })
        mapRef.current = map

        // Tuiles OSM
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map)
        L.control.attribution({ prefix: '© <a href="https://osm.org">OpenStreetMap</a>' }).addTo(map)

        // Marqueur résidence
        const resIcon = L.divIcon({
          html: `<div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:#FF8C42;transform:rotate(-45deg);
            border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.3);
          "></div>`,
          iconSize: [36, 36], iconAnchor: [18, 36], className: '',
        })
        L.marker([pos.lat, pos.lng], { icon: resIcon })
          .addTo(map)
          .bindPopup(`<b style="font-size:13px">${title || 'Résidence'}</b><br><span style="font-size:11px;color:#666">${[quartier, commune].filter(Boolean).join(', ')}</span>`)

        if (mounted) setPhase('ready')

        // Géolocalisation utilisateur
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude: lat, longitude: lng } }) => {
              if (!mounted || !mapRef.current) return
              const uPos = { lat, lng }
              setUserPos(uPos)

              // Marqueur utilisateur
              const userIcon = L.divIcon({
                html: `<div style="
                  width:18px;height:18px;background:#3B82F6;
                  border-radius:50%;border:3px solid #fff;
                  box-shadow:0 0 0 6px rgba(59,130,246,.25);
                "></div>`,
                iconSize: [18, 18], iconAnchor: [9, 9], className: '',
              })
              L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup('Vous êtes ici')

              // Distance à vol d'oiseau
              const d = haversine(uPos, pos)
              setDistance(d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`)

              // Essayer OSRM pour l'itinéraire réel
              let routeCoords = [[lat, lng], [pos.lat, pos.lng]]
              try {
                const osrm = await fetch(
                  `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${pos.lng},${pos.lat}?overview=full&geometries=geojson`,
                  { signal: AbortSignal.timeout(5000) }
                )
                const rd = await osrm.json()
                if (rd.routes?.[0]) {
                  routeCoords = rd.routes[0].geometry.coordinates.map(([lo, la]) => [la, lo])
                  const mins = Math.round(rd.routes[0].duration / 60)
                  setDuration(mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h${mins%60}`)
                }
              } catch {}

              // Tracé du trajet
              const line = L.polyline(routeCoords, {
                color: '#FF8C42', weight: 4, opacity: 0.8, dashArray: routeCoords.length === 2 ? '8,6' : null,
              }).addTo(map)
              map.fitBounds(line.getBounds(), { padding: [48, 48] })

              if (mounted) setPhase('located')
            },
            () => { if (mounted) setGeoError(true) },
            { timeout: 10000 }
          )
        }
      } catch {
        if (mounted) setPhase('error')
      }
    }

    init()
    return () => {
      mounted = false
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [quartier, commune, ville, title])

  const openNav = () => {
    if (!resPos) return
    const dest = `${resPos.lat},${resPos.lng}`
    const origin = userPos ? `${userPos.lat},${userPos.lng}` : ''
    window.open(
      origin
        ? `https://www.google.com/maps/dir/${origin}/${dest}`
        : `https://www.google.com/maps/search/?api=1&query=${dest}`,
      '_blank'
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, isolation: 'isolate' }}>
      <style>{`
        .lf-wrap .leaflet-container { border-radius: 16px !important; font-family: var(--font-ui); }
        ${dark ? '.lf-wrap .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(88%); }' : ''}
        .lf-wrap .leaflet-popup-content-wrapper { border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,.15); }
        @keyframes mapSpin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Carte */}
      <div className="lf-wrap" style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div ref={containerRef} style={{ height, width: '100%' }}/>

        {/* Overlay chargement */}
        {phase === 'init' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: 12,
            background: 'var(--surface)', zIndex: 500,
          }}>
            <Icon n="refresh" size={28} color={'#FF8C42'} style={{animation: 'mapSpin .9s linear infinite' }}/>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Chargement de la carte…</p>
          </div>
        )}

        {phase === 'error' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: 10,
            background: 'var(--surface)',
          }}>
            <Icon n="map" size={32} color={'var(--subtle)'}/>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Carte indisponible</p>
          </div>
        )}
      </div>

      {/* Légende + bouton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)' }}>
            <div style={{ width: 10, height: 10, background: '#FF8C42', borderRadius: '50%', flexShrink: 0 }}/>
            Résidence
          </div>
          {phase === 'located' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)' }}>
              <div style={{ width: 10, height: 10, background: '#3B82F6', borderRadius: '50%', flexShrink: 0 }}/>
              Vous
            </div>
          )}
          {distance && (
            <span style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon n="straighten" size={13}/>
              {distance}{duration && <> · <Icon n="directions_car" size={13} style={{marginLeft: 4 }}/>{duration}</>}
            </span>
          )}
          {geoError && phase !== 'located' && (
            <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
              Position non partagée
            </span>
          )}
        </div>

        <button onClick={openNav} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600,
          background: '#FF8C42', color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 3px 12px rgba(255,140,66,.35)',
          transition: 'transform .15s, box-shadow .15s',
          flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,140,66,.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(255,140,66,.35)' }}
        >
          <Icon n="directions" size={15}/>
          {userPos ? 'Démarrer l\'itinéraire' : 'Voir sur Google Maps'}
        </button>
      </div>
    </div>
  )
}
