'use client'
import PWAInstallButton from '@/components/ui/PWAInstallButton'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '@/lib/config'

// ── Icônes SVG élégantes (stroke, 1.5px) ───────────────────────
const IC = {
  home: (s=16,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10.5z"/>
      <path d="M9 22V12h6v10"/>
    </svg>
  ),
  residences: (s=16,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <rect x="2" y="7" width="13" height="15" rx="1"/>
      <path d="M15 10h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-5"/>
      <path d="M6 11h4M6 15h4M6 19h4M17 14h1M17 18h1"/>
    </svg>
  ),
  apropos: (s=16,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 11v5M12 8v.5"/>
    </svg>
  ),
  contact: (s=16,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <path d="M21 5H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/>
      <path d="M3 6l9 7 9-7"/>
    </svg>
  ),
  aide: (s=16,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7M12 17.5v.5"/>
    </svg>
  ),
  cookies: (s=16,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <path d="M12 3a9 9 0 1 0 9 9"/>
      <path d="M12 3c0 2 1.5 3.5 3.5 3.5S19 5 19 3"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  pin: (s=14,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <path d="M12 2a7 7 0 0 1 7 7c0 4.5-7 13-7 13S5 13.5 5 9a7 7 0 0 1 7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  whatsapp: (s=16,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  theme_dark: (s=18,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  theme_light: (s=18,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  menu_open: (s=20,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" style={{display:'block',flexShrink:0}}>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  menu_close: (s=20,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" style={{display:'block',flexShrink:0}}>
      <line x1="5" y1="5" x2="19" y2="19"/>
      <line x1="19" y1="5" x2="5" y2="19"/>
    </svg>
  ),
  facebook: (s=17,c='currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M15 9h-2a1 1 0 0 0-1 1v2h3l-.5 3H12v5"/>
    </svg>
  ),
}

// Map href → icône
const NAV_ICON = {
  '/':           IC.home,
  '/residences': IC.residences,
  '/a-propos':   IC.apropos,
  '/contact':    IC.contact,
  '/aide':       IC.aide,
  '/cookies':    IC.cookies,
}




// ── New Horizon Logo (thème-adaptatif) ─────────────────────────
// inkColor: couleur des éléments noirs (adapte au mode)
// force: 'dark' | 'light' | null (auto)
export function Logo({ size = 44, force = null, hero = false }) {
  // En mode hero (fond sombre) ou dark → lettre N en blanc
  // En mode clair → lettre N en noir
  const ink = hero || force === 'dark' ? '#FFFFFF' : 'var(--ink)'
  const accent = '#FF7A1A'
  const textNew = hero || force === 'dark' ? '#FFFFFF' : '#000000'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="New Horizon logo"
    >
      <defs>
        <linearGradient id={`gradS-${force||'auto'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D3D3D3"/>
          <stop offset="100%" stopColor="#808080"/>
        </linearGradient>
        <linearGradient id={`gradB-${force||'auto'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A05A2C"/>
          <stop offset="100%" stopColor="#3E1E04"/>
        </linearGradient>
      </defs>
      <g transform="translate(40, 20)">
        {/* Lettre N */}
        <path d="M 120 140 L 180 140 L 220 280 L 220 140 L 260 140 L 210 320 L 150 320 L 110 180 L 110 320 L 70 320 Z" fill={ink}/>
        <polygon points="70,140 120,140 110,180" fill={ink}/>
        {/* Lettre H */}
        <path d="M 230 140 L 270 140 L 270 210 L 320 210 L 320 140 L 370 140 L 370 320 L 330 320 L 330 250 L 270 250 L 270 320 L 230 320 Z" fill={accent}/>
        <polygon points="230,140 270,140 250,170" fill={hero ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)'}/>
        <polygon points="320,140 370,140 340,170" fill={hero ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)'}/>
        {/* Accents décoratifs */}
        <path d="M 270 260 C 310 260, 340 230, 360 210 C 330 240, 300 280, 270 280 Z" fill={`url(#gradS-${force||'auto'})`}/>
        <path d="M 280 290 C 330 290, 360 320, 380 350 C 350 320, 310 310, 260 310 Z" fill={`url(#gradB-${force||'auto'})`}/>
        {/* Texte */}
        <text x="220" y="380" fontFamily="'DM Sans','Segoe UI',Arial,sans-serif" fontWeight="900" fontSize="36" textAnchor="middle" letterSpacing="2">
          <tspan fill={textNew}>NEW </tspan>
          <tspan fill={accent}>HORIZON</tspan>
        </text>
      </g>
    </svg>
  )
}

// Alias compatibilité
export function LogoHero({ size = 44 }) {
  return <Logo size={size} hero={true}/>
}
export function WordMark() { return null }

// ── Thème hook ─────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('as-theme')
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefer
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])
  const toggle = () => {
    setDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('as-theme', next ? 'dark' : 'light')
      return next
    })
  }
  return { dark, toggle }
}

// ── Page Loader ───────────────────────────────────────────────
function PageLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const prev = useRef(null)
  const minTimer = useRef(null)
  const navTimer = useRef(null)

  // Initial page load — show loader, hide after min 1.4s
  useEffect(() => {
    minTimer.current = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => setVisible(false), 600)
    }, 1400)
    return () => clearTimeout(minTimer.current)
  }, [])

  // Navigation between pages — show briefly
  useEffect(() => {
    if (prev.current === null) { prev.current = pathname; return }
    if (prev.current === pathname) return
    prev.current = pathname
    setVisible(true)
    setLeaving(false)
    clearTimeout(navTimer.current)
    navTimer.current = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => setVisible(false), 500)
    }, 900)
    return () => clearTimeout(navTimer.current)
  }, [pathname])

  // Trigger on link clicks
  useEffect(() => {
    const fn = (e) => {
      const a = e.target.closest('a[href]')
      if (!a) return
      const h = a.getAttribute('href')
      if (!h || h.startsWith('http') || h.startsWith('#') || h.startsWith('mailto')) return
      setVisible(true); setLeaving(false)
    }
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
      background: '#0A0A08',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
      width: '100%', height: '100%', boxSizing: 'border-box',
      margin: 0, padding: 0,
      opacity: leaving ? 0 : 1,
      transition: leaving ? 'opacity 0.55s cubic-bezier(.4,0,.2,1)' : 'none',
      pointerEvents: leaving ? 'none' : 'all',
    }}>
      {/* Logo NH animé */}
      <div style={{
        animation: 'loaderPulse 1.6s ease-in-out infinite',
        transformOrigin: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 80, height: 80, flexShrink: 0,
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="80" height="80"
          style={{ display: 'block', flexShrink: 0 }}>
          <rect width="500" height="500" rx="100" fill="#1a1a17"/>
          <g transform="translate(40,20)">
            <path d="M 120 140 L 180 140 L 220 280 L 220 140 L 260 140 L 210 320 L 150 320 L 110 180 L 110 320 L 70 320 Z" fill="#FFFFFF"/>
            <polygon points="70,140 120,140 110,180" fill="#FFFFFF"/>
            <path d="M 230 140 L 270 140 L 270 210 L 320 210 L 320 140 L 370 140 L 370 320 L 330 320 L 330 250 L 270 250 L 270 320 L 230 320 Z" fill="#FF7A1A"/>
            <polygon points="230,140 270,140 250,170" fill="rgba(255,255,255,0.25)"/>
            <polygon points="320,140 370,140 340,170" fill="rgba(255,255,255,0.25)"/>
          </g>
        </svg>
      </div>

      {/* Barre de progression animée */}
      <div style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg, #FF7A1A, #FFB347)',
          animation: 'loaderBar 1.4s cubic-bezier(.4,0,.2,1) forwards',
        }}/>
      </div>

      {/* Texte */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)', margin: 0,
        animation: 'loaderFade 0.8s ease forwards',
      }}>New Horizon</p>

      <style>{`
        @keyframes loaderPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
        @keyframes loaderBar {
          0% { width: 0%; }
          40% { width: 60%; }
          70% { width: 82%; }
          100% { width: 100%; }
        }
        @keyframes loaderFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/',           label: 'Accueil',    icon: IC.home },
  { href: '/residences', label: 'Résidences', icon: IC.residences },
  { href: '/a-propos',   label: 'À propos',   icon: IC.apropos },
  { href: '/contact',    label: 'Contact',    icon: IC.contact },
  { href: '/aide',       label: 'Aide',       icon: IC.aide },
]

function Navbar({ isHero }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { dark, toggle } = useTheme()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn(); window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isHeroMode = isHero && !scrolled

  return (
    <>
      <nav className={`nav${isHeroMode ? ' hero-transparent' : ''}${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            {isHeroMode ? <LogoHero size={80}/> : <Logo size={80}/>}
          </Link>
          <ul className="nav-links">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <li key={href}>
                <Link href={href} className={pathname===href?'active':''}>
                  {icon(14)}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            {/* Dark mode toggle — masqué sur mobile via CSS, visible dans le burger */}
            <button className="theme-toggle" onClick={toggle} aria-label="Changer le thème" title={dark ? 'Mode clair' : 'Mode sombre'}>
              {dark ? IC.theme_light(18) : IC.theme_dark(18)}
            </button>
            <button className="nav-burger" onClick={() => setMenuOpen(o=>!o)} aria-label="Menu">
              {menuOpen ? IC.menu_close(20) : IC.menu_open(20)}
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav${menuOpen?' open':''}`}>
        <Logo size={80}/>
        <button className="mobile-nav-close" onClick={() => setMenuOpen(false)}>
          {IC.menu_close(20)}
        </button>
        <ul className="mobile-nav-links">
          {NAV_LINKS.map(({ href, label, icon }) => (
            <li key={href}>
              <Link href={href} className={pathname===href?'active':''}>
                {icon(18)}
                {label}
              </Link>
            </li>
          ))}
          <li style={{marginTop:12}}>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener"
              style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',fontSize:17,fontWeight:600,color:'var(--gold)',borderRadius:'var(--r-md)'}}>
              {IC.whatsapp(20,'var(--gold)')}Contacter sur WhatsApp
            </a>
          </li>
          <li>
            <button onClick={toggle} style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',fontSize:17,fontWeight:600,color:'var(--muted)',borderRadius:'var(--r-md)',width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer'}}>
              {dark ? IC.theme_light(20) : IC.theme_dark(20)}
              {dark ? 'Mode clair' : 'Mode sombre'}
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}


// ── WhatsApp hook (récupère depuis API) ────────────────────────
function useWhatsApp() {
  const [wa, setWa] = useState(SITE.whatsapp)
  useEffect(() => {
    fetch('/api/map-settings').then(r=>r.json()).then(d=>{ if(d.whatsapp) setWa(d.whatsapp) }).catch(()=>{})
  }, [])
  return wa
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear()
  const wa = useWhatsApp()

  return (
    <footer style={{
      background: 'var(--footer-bg)',
      borderTop: '1px solid var(--footer-border)',
      paddingTop: 'clamp(56px,8vw,96px)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background .25s, border-color .25s',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 'var(--pad)', right: 'var(--pad)',
        height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,122,26,.35) 30%, rgba(255,122,26,.35) 70%, transparent)',
      }}/>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--pad)', position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(200px,28%,320px) 1fr 1fr',
          gap: 'clamp(32px,5vw,64px)',
          paddingBottom: 'clamp(40px,6vw,72px)',
        }} className="footer-main-grid">

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Logo size={100}/>
            </div>
            <p style={{fontSize:14,lineHeight:1.7,color:'var(--footer-muted)',marginBottom:24,maxWidth:260}}>{SITE.tagline}</p>

            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:99,background:'var(--surface)',border:'1px solid var(--footer-border)',marginBottom:24}}>
              <span style={{display:'flex',alignItems:'center'}}>{IC.pin(14,'var(--gold)')}</span>
              <span style={{fontSize:11,color:'var(--footer-text)',fontWeight:600,letterSpacing:'.04em'}}>Abidjan, Côte d'Ivoire</span>
            </div>

            <div style={{display:'flex',gap:8,marginBottom:28}}>
              {[
                { href: SITE.facebook, ico: IC.facebook, label: 'Facebook' },
                { href: `https://wa.me/${wa}`, ico: IC.whatsapp, label: 'WhatsApp', green: true },
                { href: `mailto:${SITE.email}`, ico: IC.contact, label: 'Email' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener" aria-label={s.label}
                  style={{
                    width:40,height:40,borderRadius:12,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    background:s.green?'rgba(255,122,26,.08)':'var(--surface)',
                    border:`1px solid ${s.green?'rgba(255,122,26,.2)':'var(--footer-border)'}`,
                    color:s.green?'var(--gold)':'var(--footer-text)',
                    transition:'all .18s',
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--sh-sm)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
                  {s.ico(17)}
                </a>
              ))}
            </div>

            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener"
              style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:99,background:'#25D366',color:'#fff',fontSize:13,fontWeight:600,boxShadow:'0 4px 20px rgba(37,211,102,.25)',transition:'all .18s',textDecoration:'none'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(37,211,102,.35)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(37,211,102,.25)'}}>
              {IC.whatsapp(16,'#fff')}
              Réserver via WhatsApp
            </a>
          </div>

          {/* Navigation column */}
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:20}}>Navigation</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:4}}>
              {[
                { href: '/',           label: 'Accueil',               icon: IC.home },
                { href: '/residences', label: 'Toutes les résidences', icon: IC.residences },
                { href: '/a-propos',   label: 'À propos',              icon: IC.apropos },
                { href: '/aide',       label: "Centre d'aide (FAQ)",  icon: IC.aide },
                { href: '/contact',    label: 'Nous contacter',        icon: IC.contact },
                { href: '/cookies',    label: 'Politique Cookies',     icon: IC.cookies },
              ].map(({ href, label, icon }) => (
                <li key={href}>
                  <Link href={href} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',color:'var(--footer-muted)',fontSize:14,transition:'color .15s',borderBottom:'1px solid var(--footer-border)'}}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>
                    <span style={{color:'rgba(255,122,26,.7)',flexShrink:0}}>{icon(14,'rgba(255,122,26,.7)')}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quartiers column — fin grid */}
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:20}}>Nos quartiers</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:4}}>
              {['Cocody','Plateau','Marcory','Yopougon','Treichville','Adjamé'].map(q => (
                <li key={q}>
                  <Link href={`/residences?ville=Abidjan&q=${q}`} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',color:'var(--footer-muted)',fontSize:14,transition:'color .15s',borderBottom:'1px solid var(--footer-border)'}}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>
                    <span style={{color:'rgba(255,122,26,.5)',flexShrink:0}}>{IC.pin(13,'rgba(255,122,26,.5)')}</span>
                    {q}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div style={{height:1,background:'var(--footer-border)',margin:'0 0 24px'}}/>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,paddingBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <span style={{fontSize:12,color:'var(--footer-muted)'}}>© {year} New Horizon · Tous droits réservés</span>
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--footer-border)',display:'inline-block'}}/>
            <span style={{fontSize:12,color:'var(--footer-muted)',display:'flex',alignItems:'center',gap:5}}><span style={{display:'flex',alignItems:'center'}}>{IC.pin(13,'var(--footer-muted)')}</span>Abidjan, Côte d'Ivoire</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
            <PWAInstallButton/>
            <Link href="/cookies" style={{fontSize:12,color:'var(--footer-muted)',transition:'color .15s'}}
              onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>Cookies</Link>
            <Link href="/aide" style={{fontSize:12,color:'var(--footer-muted)',transition:'color .15s'}}
              onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>Aide</Link>
            <Link href="/admin" style={{fontSize:12,color:'rgba(128,128,128,.08)',transition:'color .4s'}}
              onMouseEnter={e=>e.currentTarget.style.color='var(--footer-muted)'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(128,128,128,.08)'}>·</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-main-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .footer-main-grid { grid-template-columns: 1fr !important; } }
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
    <div style={{
      position:'fixed',
      bottom:'max(16px, env(safe-area-inset-bottom, 0px))',
      left:'50%',
      transform:'translateX(-50%)',
      width:'calc(100vw - 32px)',
      maxWidth:520,
      background:'var(--white)',border:'1px solid var(--border)',
      borderRadius:'var(--r-xl)',padding:'12px 14px',
      boxShadow:'var(--sh-xl)',zIndex:8000,
      animation:'fadeUp .35s var(--ease) both',
    }}>
      <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:10}}>
        <span className="material-icons" style={{fontSize:17,color:'var(--gold)',flexShrink:0,marginTop:1}}>cookie</span>
        <p style={{fontSize:12,color:'var(--ink-2)',lineHeight:1.5,margin:0}}>
          Nous utilisons des cookies pour améliorer votre expérience.{' '}
          <Link href="/cookies" style={{color:'var(--ink)',textDecoration:'underline',textUnderlineOffset:2,whiteSpace:'nowrap'}}>En savoir plus</Link>
        </p>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="btn btn-outline" onClick={refuse} style={{flex:1,padding:'8px 10px',fontSize:12,minWidth:0}}>Refuser</button>
        <button className="btn btn-dark" onClick={accept} style={{flex:1,padding:'8px 10px',fontSize:12,minWidth:0}}>Accepter</button>
      </div>
    </div>
  )
}

// ── Client Shell (nav + footer autour du contenu) ────────────
export default function ClientShell({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isHeroPage = pathname === '/'
  return (
    <>
      <PageLoader/>
      {!isAdmin && <Navbar isHero={isHeroPage}/>}
      <main style={{minHeight:'100vh', position:'relative', zIndex:0, isolation:'isolate'}}>{children}</main>
      {!isAdmin && <Footer/>}
      {!isAdmin && <CookieBanner/>}
    </>
  )
}
