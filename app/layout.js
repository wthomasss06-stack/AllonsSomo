'use client'
import './globals.css'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '@/lib/config'

// ── New Horizon Logo (thème-adaptatif) ─────────────────────────
// inkColor: couleur des éléments noirs (adapte au mode)
// force: 'dark' | 'light' | null (auto)
export function Logo({ size = 44, force = null, hero = false }) {
  // En mode hero (fond sombre) ou dark → lettre N en blanc
  // En mode clair → lettre N en noir
  const ink = hero || force === 'dark' ? '#FFFFFF' : 'var(--ink)'
  const accent = '#FF8C42'
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
  { href: '/contact',    label: 'Contact' },
  { href: '/aide',       label: 'Aide' },
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
            {isHeroMode ? <LogoHero size={44}/> : <Logo size={44}/>}
          </Link>
          <ul className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}><Link href={href} className={pathname===href?'active':''}>{label}</Link></li>
            ))}
          </ul>
          <div className="nav-actions">
            {/* Dark mode toggle — masqué sur mobile via CSS, visible dans le burger */}
            <button className="theme-toggle" onClick={toggle} aria-label="Changer le thème" title={dark ? 'Mode clair' : 'Mode sombre'}>
              <span className="material-icons" style={{fontSize:18}}>{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="nav-burger" onClick={() => setMenuOpen(o=>!o)} aria-label="Menu">
              <span className="material-icons" style={{fontSize:20}}>{menuOpen?'close':'menu'}</span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav${menuOpen?' open':''}`}>
        <Logo size={44}/>
        <button className="mobile-nav-close" onClick={() => setMenuOpen(false)}>
          <span className="material-icons" style={{fontSize:20}}>close</span>
        </button>
        <ul className="mobile-nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname===href?'active':''}>
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
          <li>
            <button onClick={toggle} style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',fontSize:17,fontWeight:600,color:'var(--muted)',borderRadius:'var(--r-md)',width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer'}}>
              <span className="material-icons" style={{fontSize:20}}>{dark ? 'light_mode' : 'dark_mode'}</span>
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
        height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,150,58,.35) 30%, rgba(201,150,58,.35) 70%, transparent)',
      }}/>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--pad)', position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(200px,28%,320px) 1fr 1fr 1fr',
          gap: 'clamp(32px,5vw,64px)',
          paddingBottom: 'clamp(40px,6vw,72px)',
        }} className="footer-main-grid">

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Logo size={48}/>
            </div>
            <p style={{fontSize:14,lineHeight:1.7,color:'var(--footer-muted)',marginBottom:24,maxWidth:260}}>{SITE.tagline}</p>

            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:99,background:'var(--surface)',border:'1px solid var(--footer-border)',marginBottom:24}}>
              <span className="material-icons" style={{fontSize:14,color:'var(--gold)'}}>place</span>
              <span style={{fontSize:11,color:'var(--footer-text)',fontWeight:600,letterSpacing:'.04em'}}>Abidjan, Côte d'Ivoire</span>
            </div>

            <div style={{display:'flex',gap:8,marginBottom:28}}>
              {[
                { href: SITE.facebook, icon: 'facebook', label: 'Facebook' },
                { href: `https://wa.me/${wa}`, icon: 'chat', label: 'WhatsApp', green: true },
                { href: `mailto:${SITE.email}`, icon: 'mail', label: 'Email' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener" aria-label={s.label}
                  style={{
                    width:40,height:40,borderRadius:12,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    background:s.green?'rgba(37,211,102,.08)':'var(--surface)',
                    border:`1px solid ${s.green?'rgba(37,211,102,.2)':'var(--footer-border)'}`,
                    color:s.green?'#16A34A':'var(--footer-text)',
                    transition:'all .18s',
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--sh-sm)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
                  <span className="material-icons" style={{fontSize:17}}>{s.icon}</span>
                </a>
              ))}
            </div>

            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener"
              style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:99,background:'#25D366',color:'#fff',fontSize:13,fontWeight:600,boxShadow:'0 4px 20px rgba(37,211,102,.25)',transition:'all .18s',textDecoration:'none'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(37,211,102,.35)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(37,211,102,.25)'}}>
              <span className="material-icons" style={{fontSize:16}}>chat</span>
              Réserver via WhatsApp
            </a>
          </div>

          {/* Navigation column */}
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:20}}>Navigation</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:4}}>
              {[
                { href: '/', label: 'Accueil', icon: 'home' },
                { href: '/residences', label: 'Toutes les résidences', icon: 'apartment' },
                { href: '/a-propos', label: 'À propos', icon: 'info' },
                { href: '/aide', label: "Centre d'aide (FAQ)", icon: 'help_outline' },
                { href: '/contact', label: 'Nous contacter', icon: 'contact_support' },
                { href: '/cookies', label: 'Politique Cookies', icon: 'policy' },
              ].map(({ href, label, icon }) => (
                <li key={href}>
                  <Link href={href} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',color:'var(--footer-muted)',fontSize:14,transition:'color .15s',borderBottom:'1px solid var(--footer-border)'}}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>
                    <span className="material-icons" style={{fontSize:14,color:'rgba(201,150,58,.6)'}}>{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quartiers column */}
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:20}}>Nos quartiers</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:4}}>
              {['Cocody','Plateau','Marcory','Yopougon','Treichville','Adjamé'].map(q => (
                <li key={q}>
                  <Link href={`/residences?ville=Abidjan&q=${q}`} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',color:'var(--footer-muted)',fontSize:14,transition:'color .15s',borderBottom:'1px solid var(--footer-border)'}}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>
                    <span className="material-icons" style={{fontSize:13,color:'rgba(201,150,58,.5)'}}>place</span>
                    {q}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Carte column */}
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:20}}>Contact</div>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener"
                style={{display:'flex',alignItems:'flex-start',gap:10,color:'var(--footer-muted)',fontSize:13,textDecoration:'none',transition:'color .15s'}}
                onMouseEnter={e=>e.currentTarget.style.color='#16A34A'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>
                <span className="material-icons" style={{fontSize:15,marginTop:1,color:'#16A34A'}}>chat</span>
                <span>WhatsApp<br/><span style={{fontSize:11,color:'var(--subtle)'}}>Réponse rapide</span></span>
              </a>
              <a href={`mailto:${SITE.email}`}
                style={{display:'flex',alignItems:'flex-start',gap:10,color:'var(--footer-muted)',fontSize:13,textDecoration:'none',transition:'color .15s'}}
                onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>
                <span className="material-icons" style={{fontSize:15,marginTop:1,color:'var(--gold)'}}>mail</span>
                <span>{SITE.email}<br/><span style={{fontSize:11,color:'var(--subtle)'}}>Support 24h/7j</span></span>
              </a>
            </div>
            <div style={{marginTop:24}}>
              <Link href="/contact" style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:12,background:'var(--surface)',border:'1px solid var(--footer-border)',color:'var(--footer-muted)',fontSize:13,textDecoration:'none',transition:'color .15s'}}
                onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--footer-muted)'}>
                <span className="material-icons" style={{fontSize:16,color:'var(--gold)'}}>map</span>
                Voir la carte &amp; nous trouver
              </Link>
            </div>
          </div>
        </div>

        <div style={{height:1,background:'var(--footer-border)',margin:'0 0 24px'}}/>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,paddingBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <span style={{fontSize:12,color:'var(--footer-muted)'}}>© {year} New Horizon · Tous droits réservés</span>
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--footer-border)',display:'inline-block'}}/>
            <span style={{fontSize:12,color:'var(--footer-muted)',display:'flex',alignItems:'center',gap:5}}><span className="material-icons" style={{fontSize:13}}>place</span>Abidjan, Côte d'Ivoire</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:20}}>
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
      position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',
      background:'var(--white)',border:'1px solid var(--border)',
      borderRadius:'var(--r-xl)',padding:'16px 20px',
      display:'flex',alignItems:'center',gap:12,
      boxShadow:'var(--sh-xl)',zIndex:8000,
      width:'calc(100vw - 32px)',maxWidth:540,
      animation:'fadeUp .35s var(--ease) both',flexWrap:'wrap',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:10,flex:'1 1 240px',minWidth:0}}>
        <span className="material-icons" style={{fontSize:20,color:'var(--gold)',flexShrink:0}}>cookie</span>
        <p style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.5,margin:0}}>
          Nous utilisons des cookies.{' '}
          <Link href="/cookies" style={{color:'var(--ink)',textDecoration:'underline',textUnderlineOffset:2}}>En savoir plus</Link>
        </p>
      </div>
      <div style={{display:'flex',gap:8,width:'100%'}}>
        <button className="btn btn-outline" onClick={refuse} style={{flex:1,padding:'9px 16px',fontSize:13}}>Refuser</button>
        <button className="btn btn-dark" onClick={accept} style={{flex:1,padding:'9px 16px',fontSize:13}}>Accepter</button>
      </div>
    </div>
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
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{__html:`
          (function(){
            var s=localStorage.getItem('as-theme');
            var p=window.matchMedia('(prefers-color-scheme: dark)').matches;
            if(s==='dark'||(s===null&&p)) document.documentElement.classList.add('dark');
          })();
        `}}/>
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
