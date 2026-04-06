'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/app/layout'
import Icon from '@/components/ui/Icon'

const ADMIN_PASSWORD = 'Akaresi@225'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lire le thème courant
    const stored = localStorage.getItem('as-theme')
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(stored ? stored === 'dark' : prefer)
    if (sessionStorage.getItem('as-admin') === ADMIN_PASSWORD) {
      router.replace('/admin/dashboard')
    }
    // Écouter les changements de thème
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('as-admin', password)
        router.push('/admin/dashboard')
      } else {
        setError('Mot de passe incorrect.')
        setLoading(false)
        setPassword('')
      }
    }, 600)
  }

  if (!mounted) return null

  // Tokens adaptatifs
  const bg        = dark ? '#0E1510' : '#F5F4F1'
  const cardBg    = dark ? 'rgba(24,31,26,.92)' : '#FFFFFF'
  const cardBorder= dark ? 'rgba(255,122,26,.18)' : 'rgba(255,122,26,.22)'
  const textMain  = dark ? '#F5EDD8' : '#0F0E0C'
  const textMuted = dark ? 'rgba(245,237,216,.4)' : '#8A8784'
  const inputBg   = dark ? 'rgba(14,21,16,.8)' : '#FAFAF8'
  const inputBorder = dark ? 'rgba(255,122,26,.22)' : '#D9D7D4'
  const subtleText= dark ? 'rgba(245,237,216,.25)' : 'rgba(15,14,12,.3)'

  const bgImage = dark
    ? `radial-gradient(ellipse 70% 60% at 80% 20%, rgba(255,122,26,.08) 0%, transparent 60%),
       radial-gradient(ellipse 50% 50% at 15% 80%, rgba(26,61,45,.6) 0%, transparent 60%),
       repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,122,26,.025) 40px),
       repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,122,26,.025) 40px)`
    : `radial-gradient(ellipse 70% 60% at 80% 20%, rgba(255,122,26,.06) 0%, transparent 60%),
       radial-gradient(ellipse 50% 50% at 15% 80%, rgba(255,122,26,.04) 0%, transparent 60%),
       repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,122,26,.018) 40px),
       repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,122,26,.018) 40px)`

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background: bg,
      backgroundImage: bgImage,
      padding:'24px',
      transition: 'background .3s',
    }}>
      <div style={{
        width:'100%', maxWidth:400,
        animation:'fadeUp .5s ease both',
      }}>
        {/* Logo & Brand */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
            <Logo size={68} force={dark ? 'dark' : 'light'}/>
          </div>
          <h1 style={{
            fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:400,
            color: textMain, letterSpacing:'-.02em', marginBottom:6,
            fontStyle:'italic',
          }}>
            New <span style={{color:'#FF7A1A'}}>Horizon</span>
          </h1>
          <p style={{ fontSize:12, color: textMuted, letterSpacing:'.06em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif" }}>
            Espace Administration
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius:18, padding:'36px 32px',
          backdropFilter:'blur(20px)',
          boxShadow: dark
            ? '0 24px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(255,122,26,.06)'
            : '0 12px 48px rgba(15,14,12,.08), 0 0 0 1px rgba(255,122,26,.08)',
          transition: 'background .3s, border-color .3s, box-shadow .3s',
        }}>
          <div style={{ marginBottom:28 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'6px 14px', borderRadius:999,
              background:'rgba(255,122,26,.1)', border:'1px solid rgba(255,122,26,.2)',
              fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700,
              letterSpacing:'.1em', textTransform:'uppercase', color:'#FF7A1A',
              marginBottom:16,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#FF7A1A', display:'inline-block' }}/>
              Accès restreint
            </div>
            <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:18, fontWeight:700, color: textMain, marginBottom:4 }}>
              Connexion admin
            </h2>
            <p style={{ fontSize:13, color: textMuted }}>
              Entrez votre mot de passe pour accéder au tableau de bord.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:20 }}>
              <label style={{
                display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700,
                letterSpacing:'.08em', textTransform:'uppercase', color: textMuted,
                marginBottom:8,
              }}>
                Mot de passe
              </label>
              <div style={{ position:'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  style={{
                    width:'100%', padding:'14px 48px 14px 16px',
                    background: inputBg,
                    border:`1px solid ${error ? 'rgba(252,165,165,.5)' : inputBorder}`,
                    borderRadius:12, color: textMain, fontSize:15,
                    fontFamily:"'DM Sans',sans-serif", outline:'none',
                    transition:'border-color .2s, background .3s',
                    letterSpacing: show ? 'normal' : '0.1em',
                    boxSizing:'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor='rgba(255,122,26,.6)'}
                  onBlur={e => e.target.style.borderColor=error?'rgba(252,165,165,.5)':inputBorder}
                />
                <button type="button" onClick={() => setShow(s => !s)} style={{
                  position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color: textMuted, padding:4,
                  display:'flex', alignItems:'center',
                }}>
                  <Icon n={show ? 'visibility_off' : 'visibility'} size={18}/>
                </button>
              </div>
              {error && (
                <p style={{
                  marginTop:8, fontSize:12, color:'#FCA5A5',
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  <Icon n="error_outline" size={13}/>
                  {error}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading || !password} style={{
              width:'100%', padding:'14px', borderRadius:12, border:'none',
              background: loading ? 'rgba(255,122,26,.5)' : 'linear-gradient(135deg, #FF7A1A, #FF9F3A)',
              color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:800,
              letterSpacing:'.05em', textTransform:'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              transition:'all .2s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(255,122,26,.35)',
            }}>
              {loading ? (
                <>
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                  Connexion…
                </>
              ) : (
                <>
                  <Icon n="lock_open" size={16}/>
                  Accéder au tableau de bord
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div style={{ textAlign:'center', marginTop:24 }}>
          <a href="/" style={{ fontSize:12, color: subtleText, textDecoration:'none', transition:'color .2s', fontFamily:"'DM Sans',sans-serif" }}
            onMouseEnter={e=>e.currentTarget.style.color=dark?'rgba(245,237,216,.5)':'rgba(15,14,12,.5)'}
            onMouseLeave={e=>e.currentTarget.style.color=subtleText}>
            ← Retour au site
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  )
}
