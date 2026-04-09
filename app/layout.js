// SERVER COMPONENT — pas de 'use client'
import './globals.css'
import ClientShell from './ClientShell'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newhorizon-ci.com'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'New Horizon — Résidences meublées premium à Abidjan',
    template: '%s | New Horizon',
  },
  description:
    "Trouvez et réservez des résidences meublées haut de gamme à Abidjan, Côte d'Ivoire. Studios, appartements, villas disponibles à Cocody, Plateau, Marcory et plus. Réponse WhatsApp en moins de 5 minutes.",
  keywords: [
    "résidence meublée Abidjan",
    "location appartement Côte d'Ivoire",
    "location courte durée Abidjan",
    "villa meublée Cocody",
    "studio Plateau Abidjan",
    "New Horizon résidences",
  ],
  authors: [{ name: 'New Horizon', url: BASE_URL }],
  creator: 'New Horizon',
  publisher: 'New Horizon',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'fr_CI',
    url: BASE_URL,
    siteName: 'New Horizon',
    title: "New Horizon — Résidences meublées premium à Abidjan",
    description: "Studios, appartements et villas meublés disponibles dans tous les quartiers d'Abidjan. Réservation directe sur WhatsApp, sans frais cachés.",
    images: [{ url: '/hero/hero-1.jpg', width: 1200, height: 630, alt: 'New Horizon — Résidences meublées à Abidjan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "New Horizon — Résidences meublées à Abidjan",
    description: "Studios, appartements et villas meublés à Abidjan. Réservation WhatsApp en 2 minutes.",
    images: ['/hero/hero-1.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-180.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json"/>
        <meta name="theme-color" content="#FF7A1A"/>
        <link rel="apple-touch-icon" href="/icon-180.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="New Horizon"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        <script dangerouslySetInnerHTML={{__html:`
          (function(){
            var s=localStorage.getItem('as-theme');
            var p=window.matchMedia('(prefers-color-scheme: dark)').matches;
            if(s==='dark'||(s===null&&p)) document.documentElement.classList.add('dark');
          })();
        `}}/>
        <script dangerouslySetInnerHTML={{__html:`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}}/>
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
