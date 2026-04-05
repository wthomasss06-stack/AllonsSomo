'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Logo, WordMark } from '@/app/layout'

const ADMIN_PASSWORD = 'Akaresi@225'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Already logged in?
    if (sessionStorage.getItem('as-admin') === ADMIN_PASSWORD) {
      router.replace('/admin/dashboard')
    }
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

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#0E1510',
      backgroundImage:`
        radial-gradient(ellipse 70% 60% at 80% 20%, rgba(200,112,58,.08) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 15% 80%, rgba(26,61,45,.6) 0%, transparent 60%),
        repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(200,112,58,.025) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(200,112,58,.025) 40px)
      `,
      padding:'24px',
    }}>
      <div style={{
        width:'100%', maxWidth:400,
        animation:'fadeUp .5s ease both',
      }}>
        {/* Logo & Brand */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
            <Logo size={52}/>
          </div>
          <h1 style={{
            fontFamily:'var(--font-ui)', fontSize:26, fontWeight:800,
            color:'#F5EDD8', letterSpacing:'-.02em', marginBottom:6,
          }}>
            Allons <span style={{fontStyle:'italic'}}>Somo</span>
          </h1>
          <p style={{ fontSize:12, color:'rgba(245,237,216,.4)', letterSpacing:'.06em', textTransform:'uppercase', fontFamily:'var(--font-ui)' }}>
            Espace Administration
          </p>
        </div>

        {/* Card */}
        <div style={{
          background:'rgba(24,31,26,.9)', border:'1px solid rgba(200,112,58,.18)',
          borderRadius:18, padding:'36px 32px',
          backdropFilter:'blur(20px)',
          boxShadow:'0 24px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(200,112,58,.06)',
        }}>
          <div style={{ marginBottom:28 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'6px 14px', borderRadius:999,
              background:'rgba(200,112,58,.1)', border:'1px solid rgba(200,112,58,.2)',
              fontFamily:'var(--font-ui)', fontSize:10, fontWeight:700,
              letterSpacing:'.1em', textTransform:'uppercase', color:'#C8703A',
              marginBottom:16,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#C8703A', display:'inline-block' }}/>
              Accès restreint
            </div>
            <h2 style={{ fontFamily:'var(--font-ui)', fontSize:18, fontWeight:700, color:'#F5EDD8', marginBottom:4 }}>
              Connexion admin
            </h2>
            <p style={{ fontSize:13, color:'rgba(245,237,216,.4)' }}>
              Entrez votre mot de passe pour accéder au tableau de bord.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Password field */}
            <div style={{ marginBottom:20 }}>
              <label style={{
                display:'block', fontFamily:'var(--font-ui)', fontSize:10, fontWeight:700,
                letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(245,237,216,.5)',
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
                    background:'rgba(14,21,16,.8)', border:`1px solid ${error ? 'rgba(252,165,165,.4)' : 'rgba(200,112,58,.22)'}`,
                    borderRadius:12, color:'#F5EDD8', fontSize:15,
                    fontFamily:'var(--font-body)', outline:'none',
                    transition:'border-color .2s',
                    letterSpacing: show ? 'normal' : '0.1em',
                  }}
                  onFocus={e => e.target.style.borderColor='rgba(200,112,58,.6)'}
                  onBlur={e => e.target.style.borderColor=error?'rgba(252,165,165,.4)':'rgba(200,112,58,.22)'}
                />
                <button type="button" onClick={() => setShow(s => !s)} style={{
                  position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'rgba(245,237,216,.35)', padding:4,
                  display:'flex', alignItems:'center',
                }}>
                  <span className="material-icons" style={{fontSize:18}}>{show ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {error && (
                <p style={{
                  marginTop:8, fontSize:12, color:'#FCA5A5',
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  <span className="material-icons" style={{fontSize:13}}>error_outline</span>
                  {error}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading || !password} style={{
              width:'100%', padding:'14px', borderRadius:12, border:'none',
              background: loading ? 'rgba(200,112,58,.5)' : 'linear-gradient(135deg, #C8703A, #D9844E)',
              color:'#fff', fontFamily:'var(--font-ui)', fontSize:13, fontWeight:800,
              letterSpacing:'.05em', textTransform:'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              transition:'all .2s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(200,112,58,.35)',
            }}>
              {loading ? (
                <>
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                  Connexion…
                </>
              ) : (
                <>
                  <span className="material-icons" style={{fontSize:16}}>lock_open</span>
                  Accéder au tableau de bord
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div style={{ textAlign:'center', marginTop:24 }}>
          <a href="/" style={{ fontSize:12, color:'rgba(245,237,216,.25)', textDecoration:'none', transition:'color .2s', fontFamily:'var(--font-ui)' }}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(245,237,216,.5)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(245,237,216,.25)'}>
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
