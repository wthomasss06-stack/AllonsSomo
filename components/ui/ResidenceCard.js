'use client'
import { useState } from 'react'
import Link from 'next/link'
import { EQUIPEMENTS_ICONS, formatPrix } from '@/lib/config'

export default function ResidenceCard({ residence, index = 0 }) {
  const [imgErr, setImgErr] = useState(false)
  const photos = residence.photos || []
  const photo  = photos[0]
  const equips = (residence.equipements || []).slice(0, 3)

  const prix = residence.prix_nuit || residence.prix_journee || residence.prix_mensuel
  const prixUnit = residence.prix_nuit ? '/nuit' : residence.prix_journee ? '/j' : '/mois'

  return (
    <Link href={`/residences/${residence.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article
        className="res-card"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Image */}
        <div className="res-card-img">
          {photo && !imgErr
            ? <img src={photo} alt={residence.titre} onError={() => setImgErr(true)} loading="lazy"/>
            : (
              <div className="res-card-img-placeholder">
                <span className="material-icons" style={{ fontSize: 48, color: 'var(--border)' }}>apartment</span>
              </div>
            )
          }
          <div className="res-card-overlay"/>

          {/* Badges */}
          <div className="res-card-badges">
            <span className="badge badge-dark" style={{ textTransform: 'capitalize' }}>
              {residence.type_bien}
            </span>
            {residence.featured && (
              <span className="badge badge-gold">
                <span className="material-icons" style={{ fontSize: 11 }}>star</span>
                À la une
              </span>
            )}
          </div>

          {/* Price overlay */}
          {prix && (
            <div className="res-card-price-overlay">
              <div className="price-amount">{formatPrix(prix)}</div>
              <div className="price-unit">{prixUnit}</div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="res-card-body">
          <div className="res-card-location">
            <span className="material-icons" style={{ fontSize: 11, verticalAlign: 'middle', marginRight: 3 }}>location_on</span>
            {[residence.quartier, residence.commune, residence.ville].filter(Boolean).join(' · ')}
          </div>
          <h3 className="res-card-title">{residence.titre}</h3>

          {/* Equipment tags */}
          {equips.length > 0 && (
            <div className="res-card-tags">
              {equips.map(k => {
                const eq = EQUIPEMENTS_ICONS[k]
                if (!eq) return null
                return (
                  <span key={k} className="res-card-tag">
                    <span className="material-icons" style={{ fontSize: 12 }}>{eq.icon}</span>
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
