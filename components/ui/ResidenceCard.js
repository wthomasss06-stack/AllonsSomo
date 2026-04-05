'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Wifi, Wind, Car, ChefHat, Waves, Tv, Shirt,
  Building, ShieldCheck, Zap, Building2, MapPin, Star,
} from 'lucide-react'
import { EQUIPEMENTS_ICONS, formatPrix } from '@/lib/config'

const LUCIDE_EQUIP = { Wifi, Wind, Car, ChefHat, Waves, Tv, Shirt, Building, ShieldCheck, Zap }

export default function ResidenceCard({ residence, index = 0 }) {
  const [imgErr, setImgErr] = useState(false)
  const photos = residence.photos || []
  const photo  = photos[0]
  const equips = (residence.equipements || []).slice(0, 3)

  const prix = residence.prix_nuit || residence.prix_journee || residence.prix_mensuel
  const prixUnit = residence.prix_nuit ? '/nuit' : residence.prix_journee ? '/j' : '/mois'

  return (
    <Link href={`/residences/${residence.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="res-card" style={{ animationDelay: `${index * 60}ms` }}>
        <div className="res-card-img">
          {photo && !imgErr
            ? <img src={photo} alt={residence.titre} onError={() => setImgErr(true)} loading="lazy"/>
            : (
              <div className="res-card-img-placeholder">
                <Building2 size={48} style={{ color: 'var(--border)' }} />
              </div>
            )
          }
          <div className="res-card-overlay"/>
          <div className="res-card-badges">
            <span className="badge badge-dark" style={{ textTransform: 'capitalize' }}>{residence.type_bien}</span>
            <span className="badge badge-gold badge-priority">
              <Star size={10} />&nbsp;Prioritaire
            </span>
          </div>
          {prix && (
            <div className="res-card-price-overlay">
              <div className="price-amount">{formatPrix(prix)}</div>
              <div className="price-unit">{prixUnit}</div>
            </div>
          )}
        </div>
        <div className="res-card-body">
          <div className="res-card-location">
            <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
            {[residence.quartier, residence.commune, residence.ville].filter(Boolean).join(' · ')}
          </div>
          <h3 className="res-card-title">{residence.titre}</h3>
          {equips.length > 0 && (
            <div className="res-card-tags">
              {equips.map(k => {
                const eq = EQUIPEMENTS_ICONS[k]
                if (!eq) return null
                const EquipIcon = LUCIDE_EQUIP[eq.icon]
                return (
                  <span key={k} className="res-card-tag">
                    {EquipIcon ? <EquipIcon size={12} /> : null}
                    {eq.label}
                  </span>
                )
              })}
              {(residence.equipements || []).length > 3 && (
                <span className="res-card-tag">+{(residence.equipements).length - 3}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
