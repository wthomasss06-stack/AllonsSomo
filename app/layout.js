'use client'
import './globals.css'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '@/lib/config'

// ── Logo (adapté thème) ────────────────────────────────────────
export function Logo({ size = 36, forceLight = false }) {
  // forceLight = fond clair (logo foncé), sinon auto selon thème
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="currentColor"/>
      <path d="M10 28 L16 14 L22 28" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.2 23 L19.8 23" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M26 16 C26 13.8 27.6 12.5 29.5 12.5 C31.4 12.5 33 13.8 33 15.6 C33 17.4 31 18.2 29.5 19 C28 19.8 26 20.8 26 23.2 C26 25.6 27.8 27 30 27 C32.2 27 33.5 25.6 33.5 24" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function LogoHero({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.15)"/>
      <path d="M10 28 L16 14 L22 28" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.2 23 L19.8 23" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M26 16 C26 13.8 27.6 12.5 29.5 12.5 C31.4 12.5 33 13.8 33 15.6 C33 17.4 31 18.2 29.5 19 C28 19.8 26 20.8 26 23.2 C26 25.6 27.8 27 30 27 C32.2 27 33.5 25.6 33.5 24" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function WordMark({ hero = false }) {
  return (
    <span style={{fontFamily:"'DM Serif Display', Georgia, serif",fontSize:20,fontWeight:400,color:hero?'#fff':'var(--ink)',letterSpacing:'-.02em',lineHeight:1,display:'inline-flex',flexDirection:'column',gap:0}}>
      <span style={{fontSize:10,fontFamily:"'DM Sans', sans-serif",fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:hero?'rgba(255,255,255,.5)':'var(--muted)',lineHeight:1,marginBottom:2}}>Allons</span>
      <span style={{fontStyle:'italic'}}>Somo</span>
    </span>
  )
}

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
            {isHeroMode ? <LogoHero size={34}/> : <Logo size={34}/>}
            <WordMark hero={isHeroMode}/>
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
        <div style={{display:'flex',alignItems:'center',gap:10}}><Logo size={34}/><WordMark/></div>
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

// ── Footer Map ────────────────────────────────────────────────
function FooterMap() {
  const [settings, setSettings] = useState({ lat:5.3364, lon:-4.0267, label:"Abidjan, Côte d'Ivoire", ville:'Abidjan' })
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
      <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--footer-muted)',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
        <span className="material-icons" style={{fontSize:12,color:'var(--gold)'}}>location_on</span>Nous trouver
      </div>
      <div style={{borderRadius:12,overflow:'hidden',border:'1px solid var(--footer-border)',background:'var(--surface)',opacity:ready?1:.5,transition:'opacity .4s'}}>
        <a href={osmLink} target="_blank" rel="noopener" style={{display:'block',textDecoration:'none'}}>
          <iframe
            src={mapSrc}
            width="100%" height="176"
            title="Localisation Allons Somo"
            loading="lazy"
            style={{display:'block',border:'none',filter:'grayscale(10%) contrast(1.02)',pointerEvents:'none'}}
          />
        </a>
        <div style={{padding:'8px 12px',background:'var(--footer-bg)',display:'flex',alignItems:'center',gap:6,borderTop:'1px solid var(--footer-border)'}}>
          <span className="material-icons" style={{fontSize:13,color:'var(--gold)',flexShrink:0}}>place</span>
          <span style={{fontSize:11,color:'var(--footer-muted)',lineHeight:1.4,flex:1}}>{label}</span>
          <a href={osmLink} target="_blank" rel="noopener"
            style={{fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--gold)',textDecoration:'none',flexShrink:0}}>
            Agrandir ↗
          </a>
        </div>
      </div>
    </div>
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
              <Logo size={36}/><WordMark/>
            </div>
            <p style={{fontSize:14,lineHeight:1.7,color:'var(--footer-muted)',marginBottom:24,maxWidth:260}}>{SITE.tagline}</p>

            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:99,background:'var(--surface)',border:'1px solid var(--footer-border)',marginBottom:24}}>
              <span style={{fontSize:14}}>🇨🇮</span>
              <span style={{fontSize:11,color:'var(--footer-text)',fontWeight:600,letterSpacing:'.04em'}}>Abidjan, Côte d'Ivoire</span>
            </div>

            <div style={{display:'flex',gap:8,marginBottom:28}}>
              {[
                { href: SITE.instagram, icon: 'photo_camera', label: 'Instagram' },
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
            <FooterMap/>
          </div>
        </div>

        <div style={{height:1,background:'var(--footer-border)',margin:'0 0 24px'}}/>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,paddingBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <span style={{fontSize:12,color:'var(--footer-muted)'}}>© {year} Allons Somo · Tous droits réservés</span>
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--footer-border)',display:'inline-block'}}/>
            <span style={{fontSize:12,color:'var(--footer-muted)'}}>Résidences premium en Côte d'Ivoire 🇨🇮</span>
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
