'use client'
import './globals.css'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '@/lib/config'

// ── Logo ──────────────────────────────────────────────────────
export function Logo({ size = 36, dark = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill={dark ? '#fff' : '#0F0E0C'}/>
      <path d="M10 28 L16 14 L22 28" stroke={dark ? '#0F0E0C' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.2 23 L19.8 23" stroke={dark ? '#0F0E0C' : '#fff'} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M26 16 C26 13.8 27.6 12.5 29.5 12.5 C31.4 12.5 33 13.8 33 15.6 C33 17.4 31 18.2 29.5 19 C28 19.8 26 20.8 26 23.2 C26 25.6 27.8 27 30 27 C32.2 27 33.5 25.6 33.5 24" stroke={dark ? '#0F0E0C' : '#fff'} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function WordMark({ dark = false }) {
  return (
    <span style={{fontFamily:"'DM Serif Display', Georgia, serif",fontSize:20,fontWeight:400,color:dark?'#0F0E0C':'#0F0E0C',letterSpacing:'-.02em',lineHeight:1,display:'inline-flex',flexDirection:'column',gap:0}}>
      <span style={{fontSize:10,fontFamily:"'DM Sans', sans-serif",fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:dark?'#8A8784':'#8A8784',lineHeight:1,marginBottom:2}}>Allons</span>
      <span style={{fontStyle:'italic'}}>Somo</span>
    </span>
  )
}

export function LogoWhite({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.15)"/>
      <path d="M10 28 L16 14 L22 28" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.2 23 L19.8 23" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M26 16 C26 13.8 27.6 12.5 29.5 12.5 C31.4 12.5 33 13.8 33 15.6 C33 17.4 31 18.2 29.5 19 C28 19.8 26 20.8 26 23.2 C26 25.6 27.8 27 30 27 C32.2 27 33.5 25.6 33.5 24" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function WordMarkWhite() {
  return (
    <span style={{fontFamily:"'DM Serif Display', Georgia, serif",fontSize:20,fontWeight:400,color:'#fff',letterSpacing:'-.02em',lineHeight:1,display:'inline-flex',flexDirection:'column',gap:0}}>
      <span style={{fontSize:10,fontFamily:"'DM Sans', sans-serif",fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.5)',lineHeight:1,marginBottom:2}}>Allons</span>
      <span style={{fontStyle:'italic'}}>Somo</span>
    </span>
  )
}

// ── Page Loader ───────────────────────────────────────────────
function PageLoader() {
  const pathname = usePathname()
  const [w, setW] = useState(0)
  const [vis, setVis] = useState(false)
  const prev = useRef(pathname)
  const timer = useRef(null)

  useEffect(() => {
    if (prev.current !== pathname) {
      setW(100); const t = setTimeout(() => { setVis(false); setW(0); prev.current = pathname }, 400)
      return () => clearTimeout(t)
    }
  }, [pathname])

  useEffect(() => {
    const fn = (e) => {
      const a = e.target.closest('a[href]')
      if (!a) return
      const h = a.getAttribute('href')
      if (!h || h.startsWith('http') || h.startsWith('#') || h.startsWith('mailto')) return
      setVis(true); setW(25); let p = 25
      clearInterval(timer.current)
      timer.current = setInterval(() => { p = Math.min(p + Math.random() * 14, 80); setW(p) }, 200)
    }
    document.addEventListener('click', fn)
    return () => { document.removeEventListener('click', fn); clearInterval(timer.current) }
  }, [])

  return <div className="page-loader-bar" style={{ width:`${w}%`, opacity:vis?1:0 }}/>
}

// ── Nav ───────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/',           label: 'Accueil' },
  { href: '/residences', label: 'Résidences' },
  { href: '/a-propos',   label: 'À propos' },
  { href: '/aide',       label: 'Aide' },
]

function Navbar({ isHero }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn(); window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const dark = isHero && !scrolled
  return (
    <>
      <nav className={`nav${dark?' dark':''}${scrolled?' scrolled':''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            {dark ? <LogoWhite size={34}/> : <Logo size={34}/>}
            {dark ? <WordMarkWhite/> : <WordMark/>}
          </Link>
          <ul className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}><Link href={href} className={pathname===href?'active':''}>{label}</Link></li>
            ))}
          </ul>
          <div className="nav-actions">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn-wa" style={{padding:'8px 16px',fontSize:13}}>
              <span className="material-icons" style={{fontSize:15}}>chat</span>WhatsApp
            </a>
            <button className="nav-burger" onClick={() => setMenuOpen(o=>!o)} aria-label="Menu">
              <span className="material-icons" style={{fontSize:20}}>{menuOpen?'close':'menu'}</span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav${menuOpen?' open':''}`}>
        <div style={{display:'flex',alignItems:'center',gap:10}}><Logo size={34}/><WordMark/></div>
        <button className="mobile-nav-close" onClick={() => setMenuOpen(false)}>
          <span className="material-icons" style={{fontSize:20}}>close</span>
        </button>
        <ul className="mobile-nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname===href?'active':''} style={pathname===href?{background:'var(--surface)',color:'var(--ink)',fontWeight:600}:{}}>
                {label}
              </Link>
            </li>
          ))}
          <li style={{marginTop:12}}>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener"
              style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',fontSize:17,fontWeight:600,color:'#16A34A',borderRadius:'var(--r-md)'}}>
              <span className="material-icons" style={{fontSize:20}}>chat</span>Contacter sur WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}

// ── Footer Map ────────────────────────────────────────────────
function FooterMap() {
  const [settings, setSettings] = useState({ lat:5.3364, lon:-4.0267, label:"Abidjan, Côte d'Ivoire" })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch('/api/map-settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setReady(true) })
      .catch(() => setReady(true))
  }, [])

  const { lat, lon, label } = settings
  const d = 0.018
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-d},${lat-d*.65},${lon+d},${lat+d*.65}&layer=mapnik&marker=${lat},${lon}`
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`

  return (
    <div style={{marginTop:24}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
        <span className="material-icons" style={{fontSize:12,color:'var(--gold)'}}>location_on</span>Nous trouver
      </div>
      <div style={{borderRadius:12,overflow:'hidden',border:'1px solid var(--border)',background:'var(--bg)',opacity:ready?1:.5,transition:'opacity .4s'}}>
        <iframe
          src={mapSrc}
          width="100%" height="176"
          title="Localisation Allons Somo"
          loading="lazy"
          style={{display:'block',border:'none',filter:'grayscale(10%) contrast(1.02)'}}
        />
        <div style={{padding:'8px 12px',background:'var(--white)',display:'flex',alignItems:'center',gap:6,borderTop:'1px solid var(--border)'}}>
          <span className="material-icons" style={{fontSize:13,color:'var(--gold)',flexShrink:0}}>place</span>
          <span style={{fontSize:11,color:'var(--muted)',lineHeight:1.4,flex:1}}>{label}</span>
          <a href={osmLink} target="_blank" rel="noopener"
            style={{fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--subtle)',textDecoration:'none',flexShrink:0,transition:'color .15s'}}
            onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--subtle)'}>
            Agrandir ↗
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      paddingTop: 'clamp(56px,8vw,96px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gold accent line top */}
      <div style={{
        position: 'absolute', top: 0, left: 'var(--pad)', right: 'var(--pad)',
        height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,150,58,.35) 30%, rgba(201,150,58,.35) 70%, transparent)',
      }}/>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--pad)', position: 'relative' }}>

        {/* ── Main grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(200px,28%,320px) 1fr 1fr 1fr',
          gap: 'clamp(32px,5vw,64px)',
          paddingBottom: 'clamp(40px,6vw,72px)',
        }} className="footer-main-grid">

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Logo size={36}/><WordMark/>
            </div>
            <p style={{
              fontSize: 14, lineHeight: 1.7,
              color: 'var(--muted)',
              marginBottom: 24, maxWidth: 260,
            }}>{SITE.tagline}</p>

            {/* Location badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 99,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              marginBottom: 24,
            }}>
              <span style={{ fontSize: 14 }}>🇨🇮</span>
              <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '.04em' }}>
                Abidjan, Côte d'Ivoire
              </span>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
              {[
                { href: SITE.instagram, icon: 'photo_camera', label: 'Instagram' },
                { href: `https://wa.me/${SITE.whatsapp}`, icon: 'chat', label: 'WhatsApp', green: true },
                { href: `mailto:${SITE.email}`, icon: 'mail', label: 'Email' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener" aria-label={s.label}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: s.green ? 'rgba(37,211,102,.08)' : 'var(--bg)',
                    border: `1px solid ${s.green ? 'rgba(37,211,102,.2)' : 'var(--border)'}`,
                    color: s.green ? '#16A34A' : 'var(--ink-3)',
                    transition: 'all .18s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = s.green ? 'rgba(37,211,102,.14)' : 'var(--white)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--sh-sm)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = s.green ? 'rgba(37,211,102,.08)' : 'var(--bg)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                  <span className="material-icons" style={{ fontSize: 17 }}>{s.icon}</span>
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 99,
                background: '#25D366', color: '#fff',
                fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 4px 20px rgba(37,211,102,.25)',
                transition: 'all .18s', textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,.35)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,.25)' }}>
              <span className="material-icons" style={{ fontSize: 16 }}>chat</span>
              Réserver via WhatsApp
            </a>
          </div>

          {/* Navigation column */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: 20,
            }}>Navigation</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { href: '/', label: 'Accueil', icon: 'home' },
                { href: '/residences', label: 'Toutes les résidences', icon: 'apartment' },
                { href: '/a-propos', label: 'À propos', icon: 'info' },
                { href: '/aide', label: 'Centre d\'aide (FAQ)', icon: 'help_outline' },
                { href: '/cookies', label: 'Politique Cookies', icon: 'policy' },
              ].map(({ href, label, icon }) => (
                <li key={href}>
                  <Link href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 0', color: 'var(--muted)',
                    fontSize: 14, transition: 'color .15s',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                    <span className="material-icons" style={{ fontSize: 14, color: 'rgba(201,150,58,.6)' }}>{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nos quartiers column */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: 20,
            }}>Nos quartiers</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                'Cocody', 'Plateau', 'Marcory',
                'Yopougon', 'Treichville', 'Adjamé',
              ].map(q => (
                <li key={q}>
                  <Link href={`/residences?ville=Abidjan&q=${q}`} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 0', color: 'var(--muted)',
                    fontSize: 14, transition: 'color .15s',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                    <span className="material-icons" style={{ fontSize: 13, color: 'rgba(201,150,58,.5)' }}>place</span>
                    {q}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Carte column */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: 20,
            }}>Contact</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener"
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--muted)', fontSize: 13, textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#16A34A'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                <span className="material-icons" style={{ fontSize: 15, marginTop: 1, color: '#16A34A' }}>chat</span>
                <span>WhatsApp<br/><span style={{ fontSize: 11, color: 'var(--subtle)' }}>Réponse rapide</span></span>
              </a>
              <a href={`mailto:${SITE.email}`}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--muted)', fontSize: 13, textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                <span className="material-icons" style={{ fontSize: 15, marginTop: 1, color: 'var(--gold)' }}>mail</span>
                <span>{SITE.email}<br/><span style={{ fontSize: 11, color: 'var(--subtle)' }}>Support 24h/7j</span></span>
              </a>
            </div>

            {/* Carte */}
            <FooterMap/>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 24px' }}/>

        {/* ── Bottom bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          paddingBottom: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--subtle)' }}>
              © {year} Allons Somo · Tous droits réservés
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border)', display: 'inline-block' }}/>
            <span style={{ fontSize: 12, color: 'var(--subtle)' }}>
              Résidences premium en Côte d'Ivoire 🇨🇮
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/cookies" style={{ fontSize: 12, color: 'var(--subtle)', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ink-2)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--subtle)'}>
              Cookies
            </Link>
            <Link href="/aide" style={{ fontSize: 12, color: 'var(--subtle)', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ink-2)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--subtle)'}>
              Aide
            </Link>
            <Link href="/admin" style={{ fontSize: 12, color: 'rgba(15,14,12,.06)', transition: 'color .4s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--subtle)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(15,14,12,.06)'}>
              ·
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}


// ── Cookie Banner ─────────────────────────────────────────────
function CookieBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (!localStorage.getItem('as-cookies')) setTimeout(() => setVisible(true), 1800) }, [])
  if (!visible) return null
  const accept = () => { localStorage.setItem('as-cookies','accepted'); setVisible(false) }
  const refuse = () => { localStorage.setItem('as-cookies','refused');  setVisible(false) }
  return (
    <>
      <style>{`
        .cookie-banner {
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: var(--white); border: 1px solid var(--border);
          border-radius: var(--r-xl); padding: 16px 20px;
          display: flex; align-items: center; gap: 12;
          box-shadow: var(--sh-xl); z-index: 8000;
          width: calc(100vw - 32px); max-width: 540px;
          animation: fadeUp .35s var(--ease) both;
          flex-wrap: wrap;
        }
        .cookie-banner-text {
          display: flex; align-items: center; gap: 10px;
          flex: 1 1 240px; min-width: 0;
        }
        .cookie-banner-actions {
          display: flex; gap: 8px; flex-shrink: 0;
          width: 100%;
        }
        @media (min-width: 480px) {
          .cookie-banner-actions { width: auto; }
        }
        .cookie-banner-actions .btn {
          flex: 1;
        }
        @media (min-width: 480px) {
          .cookie-banner-actions .btn { flex: none; }
        }
      `}</style>
      <div className="cookie-banner">
        <div className="cookie-banner-text">
          <span className="material-icons" style={{fontSize:20,color:'var(--gold)',flexShrink:0}}>cookie</span>
          <p style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.5,margin:0}}>
            Nous utilisons des cookies.{' '}
            <Link href="/cookies" style={{color:'var(--ink)',textDecoration:'underline',textUnderlineOffset:2}}>En savoir plus</Link>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="btn btn-outline" onClick={refuse} style={{padding:'9px 16px',fontSize:13}}>Refuser</button>
          <button className="btn btn-dark" onClick={accept} style={{padding:'9px 16px',fontSize:13}}>Accepter</button>
        </div>
      </div>
    </>
  )
}

// ── Root Layout ───────────────────────────────────────────────
export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isHeroPage = pathname === '/'
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="Allons Somo — Résidences meublées premium en Côte d'Ivoire. Réservez facilement."/>
        <meta property="og:title" content="Allons Somo — Résidences premium CI"/>
        <title>Allons Somo — Résidences</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </head>
      <body>
        <PageLoader/>
        {!isAdmin && <Navbar isHero={isHeroPage}/>}
        <main style={{minHeight:'100vh'}}>{children}</main>
        {!isAdmin && <Footer/>}
        {!isAdmin && <CookieBanner/>}
      </body>
    </html>
  )
}
