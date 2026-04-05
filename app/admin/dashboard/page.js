'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/app/layout'
import { API_URL } from '@/lib/config'

const ADMIN_PASSWORD = 'Akaresi@225'

// ─── Design tokens ────────────────────────────────────────────
const T = {
  bg:      '#FAFAF8',
  surface: '#FFFFFF',
  border:  '#E8E6E3',
  borderG: 'rgba(201,150,58,.25)',
  gold:    '#C9963A',
  goldL:   '#E8B458',
  ink:     '#0F0E0C',
  ink2:    '#2A2823',
  muted:   '#8A8784',
  dim:     '#C4C2BF',
  green:   '#16A34A',
  red:     '#DC2626',
  r:       14,
}

// ─── Input helpers ────────────────────────────────────────────
const IS = {
  width:'100%', padding:'10px 13px', borderRadius:10,
  background:'#FAFAF8', border:'1px solid #E8E6E3',
  color:'#0F0E0C', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none', transition:'border-color .18s',
}
function onF(e){ e.target.style.borderColor = 'rgba(201,150,58,.5)' }
function onB(e){ e.target.style.borderColor = '#E8E6E3' }

// ─── Stat card ────────────────────────────────────────────────
function Stat({ icon, value, label, accent = T.gold }) {
  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.r+2,
      padding:'20px 24px', display:'flex', alignItems:'center', gap:16,
      boxShadow:'0 1px 4px rgba(15,14,12,.04)',
    }}>
      <div style={{
        width:44, height:44, borderRadius:T.r, flexShrink:0,
        background:'rgba(201,150,58,.08)', border:'1px solid rgba(201,150,58,.18)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span className="material-icons" style={{fontSize:20,color:accent}}>{icon}</span>
      </div>
      <div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:28,fontWeight:400,color:T.ink,letterSpacing:'-.03em',lineHeight:1}}>{value}</div>
        <div style={{fontSize:11,color:T.muted,marginTop:4,fontFamily:"'DM Sans',sans-serif",letterSpacing:'.04em'}}>{label}</div>
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────
function Section({ title, icon, children, style={} }) {
  return (
    <div style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.r+2, padding:'22px', marginBottom:14, boxShadow:'0 1px 4px rgba(15,14,12,.04)', ...style}}>
      <div style={{display:'flex',alignItems:'center',gap:10,paddingBottom:16,marginBottom:18,borderBottom:`1px solid ${T.border}`}}>
        <div style={{width:34,height:34,borderRadius:T.r,background:'rgba(201,150,58,.08)',border:'1px solid rgba(201,150,58,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <span className="material-icons" style={{fontSize:16,color:T.gold}}>{icon}</span>
        </div>
        <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:15,fontWeight:400,color:T.ink,margin:0,fontStyle:'italic'}}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── Edit modal ───────────────────────────────────────────────
const VILLES = ['Abidjan']
const TYPES  = ['studio','appartement','villa','duplex','chambre','maison']
const EQUIP  = [
  {value:'wifi',label:'Wifi'},{value:'climatisation',label:'Clim.'},{value:'parking',label:'Parking'},
  {value:'cuisine_equipee',label:'Cuisine'},{value:'piscine',label:'Piscine'},{value:'television',label:'TV'},
  {value:'machine_a_laver',label:'Lave-linge'},{value:'balcon',label:'Balcon'},{value:'gardien',label:'Gardien'},
  {value:'groupe_electrogene',label:'Groupe élec.'},
]

function EditModal({ adminKey, residenceId, onClose, onSaved }) {
  const [form, setForm] = useState(null)
  const [photos, setPhotos] = useState([])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/residences/${residenceId}`).then(r=>r.json()).then(data=>{
      setForm({
        titre:data.titre||'', type_bien:data.type_bien||'appartement',
        description:data.description||'', ville:data.ville||'Abidjan',
        commune:data.commune||'', quartier:data.quartier||'',
        nb_chambres:data.nb_chambres||1, nb_salles_de_bain:data.nb_salles_de_bain||1,
        capacite_personnes:data.capacite_personnes||2,
        prix_nuit:data.prix_nuit||'', prix_journee:data.prix_journee||'',
        prix_semaine:data.prix_semaine||'', prix_mois:data.prix_mois||'',
        featured:true, disponible:data.disponible!==false,
        equipements:data.equipements||[],
      })
    })
  }, [residenceId])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const toggleEq = v => setForm(f=>({...f,equipements:f.equipements.includes(v)?f.equipements.filter(e=>e!==v):[...f.equipements,v]}))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.titre.trim()){setErr('Le titre est requis.');return}
    setSaving(true); setErr('')
    try {
      const fd = new FormData()
      fd.append('admin_key',adminKey)
      Object.entries(form).forEach(([k,v])=>{
        if(k==='equipements') v.forEach(eq=>fd.append('equipements',eq))
        else if(k==='featured') fd.append(k,'on')
        else if(k==='disponible') fd.append(k,v?'on':'')
        else fd.append(k,v)
      })
      photos.forEach(p=>fd.append('photos',p))
      const res = await fetch(`${API_URL}/api/residences/${residenceId}/edit`,{method:'POST',body:fd})
      const data = await res.json()
      if(data.ok) onSaved()
      else setErr(data.error||'Erreur.')
    } catch { setErr('Erreur réseau.') }
    setSaving(false)
  }

  if (!form) return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,14,12,.5)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:32,height:32,border:`2px solid ${T.borderG}`,borderTopColor:T.gold,borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
    </div>
  )

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,14,12,.55)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:'100%',maxWidth:660,maxHeight:'90vh',overflowY:'auto',background:T.surface,border:`1px solid ${T.borderG}`,borderRadius:T.r+6,boxShadow:'0 24px 80px rgba(15,14,12,.2)'}}>
        <div style={{padding:'18px 24px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:16,fontWeight:400,color:T.ink,fontStyle:'italic',display:'flex',alignItems:'center',gap:8}}>
            <span className="material-icons" style={{fontSize:16,color:T.gold}}>edit</span>
            Modifier la résidence
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:T.dim,cursor:'pointer',display:'flex',alignItems:'center',padding:4,borderRadius:8}}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <form onSubmit={submit} style={{padding:'22px 24px',display:'flex',flexDirection:'column',gap:14}}>
          {err&&<div style={{padding:'10px 13px',borderRadius:9,background:'rgba(248,113,113,.1)',border:'1px solid rgba(248,113,113,.2)',color:T.red,fontSize:13}}>{err}</div>}
          <div>
            <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,marginBottom:5}}>Titre *</label>
            <input value={form.titre} onChange={e=>set('titre',e.target.value)} style={IS} onFocus={onF} onBlur={onB} required/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[['type_bien','Type',TYPES],['ville','Ville',VILLES]].map(([k,l,opts])=>(
              <div key={k}>
                <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,marginBottom:5}}>{l}</label>
                <select value={form[k]} onChange={e=>set(k,e.target.value)} style={{...IS,cursor:'pointer',appearance:'none'}}>
                  {opts.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[['commune','Commune'],['quartier','Quartier']].map(([k,l])=>(
              <div key={k}>
                <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,marginBottom:5}}>{l}</label>
                <input value={form[k]} onChange={e=>set(k,e.target.value)} style={IS} onFocus={onF} onBlur={onB}/>
              </div>
            ))}
          </div>
          <div>
            <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,marginBottom:5}}>Description</label>
            <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3} style={{...IS,resize:'vertical'}} onFocus={onF} onBlur={onB}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
            {[['prix_nuit','Nuit'],['prix_journee','Jour'],['prix_semaine','Semaine'],['prix_mois','Mois']].map(([k,l])=>(
              <div key={k}>
                <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:T.dim,marginBottom:5}}>{l}</label>
                <input type="number" value={form[k]} onChange={e=>set(k,e.target.value)} style={IS} placeholder="XOF" onFocus={onF} onBlur={onB}/>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {[['nb_chambres','Chambres'],['nb_salles_de_bain','Sdb'],['capacite_personnes','Capacité']].map(([k,l])=>(
              <div key={k}>
                <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:T.dim,marginBottom:5}}>{l}</label>
                <input type="number" min="0" value={form[k]} onChange={e=>set(k,Number(e.target.value))} style={IS} onFocus={onF} onBlur={onB}/>
              </div>
            ))}
          </div>
          <div>
            <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,marginBottom:8}}>Équipements</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {EQUIP.map(eq=>{
                const on=form.equipements.includes(eq.value)
                return (
                  <button key={eq.value} type="button" onClick={()=>toggleEq(eq.value)} style={{
                    padding:'5px 11px',borderRadius:8,cursor:'pointer',fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600,
                    background:on?'rgba(201,150,58,.1)':T.surface,
                    border:`1px solid ${on?'rgba(201,150,58,.4)':T.border}`,
                    color:on?T.gold:T.muted, transition:'all .13s',
                  }}>{eq.label}</button>
                )
              })}
            </div>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 11px',borderRadius:99,background:`${T.gold}10`,border:`1px solid ${T.gold}25`,color:T.gold,fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase'}}>
              <span className="material-icons" style={{fontSize:12}}>star</span>Prioritaire (auto)
            </div>
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:T.muted}}>
              <input type="checkbox" checked={form.disponible} onChange={e=>set('disponible',e.target.checked)} style={{accentColor:T.gold,width:14,height:14}}/>Disponible ✓
            </label>
          </div>
          <div>
            <label style={{display:'block',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,marginBottom:5}}>Nouvelles photos</label>
            <input type="file" accept="image/*" multiple onChange={e=>setPhotos(Array.from(e.target.files).slice(0,10))} style={{fontSize:12,color:T.muted}}/>
          </div>
          <div style={{display:'flex',gap:8,paddingTop:6}}>
            <button type="button" onClick={onClose} style={{flex:1,padding:'11px',borderRadius:10,border:`1px solid ${T.border}`,background:T.bg,color:T.muted,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:'pointer'}}>Annuler</button>
            <button type="submit" disabled={saving} style={{flex:2,padding:'11px',borderRadius:10,border:'none',background:saving?`${T.gold}60`:`linear-gradient(135deg,${T.gold},${T.goldL})`,color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,letterSpacing:'.04em',textTransform:'uppercase',cursor:saving?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
              {saving?'Enregistrement…':<><span className="material-icons" style={{fontSize:14}}>save</span>Enregistrer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Residences list ──────────────────────────────────────────
function ResidencesList({ adminKey, onAdd }) {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDel]    = useState(null)
  const [toggling, setTog]    = useState(null)
  const [editId, setEditId]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r=await fetch(`${API_URL}/api/residences`); setList(await r.json()) }
    catch { setList([]) }
    setLoading(false)
  }, [])

  useEffect(()=>{ load() },[load])

  const del = async (id, titre) => {
    if (!confirm(`Supprimer « ${titre} » ? Action irréversible.`)) return
    setDel(id)
    try { const fd=new FormData(); fd.append('admin_key',adminKey); await fetch(`${API_URL}/api/residences/${id}/delete`,{method:'POST',body:fd}); await load() }
    catch {}
    setDel(null)
  }

  const toggleD = async (id) => {
    setTog(id+'-d')
    try {
      const fd=new FormData(); fd.append('admin_key',adminKey)
      const r=await fetch(`${API_URL}/api/residences/${id}/toggle-disponible`,{method:'POST',body:fd})
      const d=await r.json(); setList(p=>p.map(x=>x.id===id?{...x,disponible:d.disponible}:x))
    } catch {}
    setTog(null)
  }

  const total    = list.length
  const featured = list.filter(r=>r.featured).length
  const villes   = [...new Set(list.map(r=>r.ville))].length

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:28}}>
        <Stat icon="apartment" value={total}    label="Résidences publiées" accent={T.gold}/>
        <Stat icon="star"      value={featured} label="En vedette"          accent={T.goldL}/>
        <Stat icon="place"     value={villes}   label="Villes couvertes"    accent={T.green}/>
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18,flexWrap:'wrap',gap:12}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,fontWeight:400,color:T.ink,margin:0,fontStyle:'italic'}}>
          Toutes les résidences
        </h2>
        <button onClick={onAdd} style={{
          display:'inline-flex',alignItems:'center',gap:7,padding:'9px 18px',borderRadius:10,border:'none',
          background:`linear-gradient(135deg,${T.gold},${T.goldL})`,
          color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,
          letterSpacing:'.05em',textTransform:'uppercase',cursor:'pointer',
          boxShadow:`0 4px 18px ${T.gold}30`,transition:'all .2s',
        }}
        onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
        onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
          <span className="material-icons" style={{fontSize:15}}>add_home</span>Publier
        </button>
      </div>

      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.r+2,overflow:'hidden'}}>
        {loading?(
          <div style={{padding:56,textAlign:'center'}}>
            <div style={{width:28,height:28,border:`2px solid ${T.borderG}`,borderTopColor:T.gold,borderRadius:'50%',animation:'spin .7s linear infinite',margin:'0 auto 10px'}}/>
            <p style={{fontSize:12,color:T.muted}}>Chargement…</p>
          </div>
        ):list.length===0?(
          <div style={{padding:'56px 28px',textAlign:'center'}}>
            <span className="material-icons" style={{fontSize:52,color:`${T.gold}25`,display:'block',marginBottom:12}}>apartment</span>
            <p style={{fontSize:13,color:T.muted,fontFamily:"'DM Sans',sans-serif"}}>Aucune résidence publiée.</p>
            <button onClick={onAdd} style={{marginTop:18,padding:'9px 22px',borderRadius:10,border:`1px solid ${T.borderG}`,background:`${T.gold}0c`,color:T.gold,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:'pointer'}}>
              Publier la première →
            </button>
          </div>
        ):(
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:T.bg}}>
                  {['Photo','Résidence','Prix min.','Statut','Actions'].map(h=>(
                    <th key={h} style={{padding:'11px 15px',textAlign:'left',fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,borderBottom:`1px solid ${T.border}`,whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map(r=>(
                  <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`,transition:'background .14s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(201,150,58,.03)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'12px 15px'}}>
                      {r.photos?.[0]?(
                        <img src={r.photos[0]} alt={r.titre} style={{width:60,height:46,objectFit:'cover',borderRadius:9,border:`1px solid ${T.borderG}`}}/>
                      ):(
                        <div style={{width:60,height:46,borderRadius:9,background:`${T.gold}0a`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <span className="material-icons" style={{fontSize:20,color:`${T.gold}30`}}>apartment</span>
                        </div>
                      )}
                    </td>
                    <td style={{padding:'12px 15px'}}>
                      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:14,fontWeight:400,color:T.ink,marginBottom:2,fontStyle:'italic'}}>{r.titre}</div>
                      <div style={{fontSize:11,color:T.muted,display:'flex',alignItems:'center',gap:3}}>
                        <span className="material-icons" style={{fontSize:11}}>place</span>
                        {r.commune?`${r.commune}, `:''}{r.ville} · {r.type_bien}
                      </div>
                    </td>
                    <td style={{padding:'12px 15px'}}>
                      <span style={{fontFamily:"'DM Serif Display',serif",fontSize:14,fontWeight:400,color:T.gold}}>{r.label_prix_min||'—'}</span>
                    </td>
                    <td style={{padding:'12px 15px'}}>
                      <div style={{display:'flex',flexDirection:'column',gap:4}}>
                        <div style={{
                          display:'inline-flex',alignItems:'center',gap:3,padding:'3px 9px',borderRadius:999,
                          background:`${T.goldL}18`,border:`1px solid ${T.goldL}40`,
                          color:T.goldL,fontSize:9,fontFamily:"'DM Sans',sans-serif",fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
                        }}>
                          <span className="material-icons" style={{fontSize:10}}>star</span>Prioritaire
                        </div>
                        <button onClick={()=>toggleD(r.id)} disabled={toggling===r.id+'-d'} style={{
                          display:'inline-flex',alignItems:'center',gap:3,padding:'3px 9px',borderRadius:999,
                          background:r.disponible?'rgba(22,163,74,.08)':'rgba(220,38,38,.06)',
                          border:`1px solid ${r.disponible?'rgba(22,163,74,.22)':'rgba(220,38,38,.18)'}`,
                          color:r.disponible?T.green:T.red,
                          fontSize:9,fontFamily:"'DM Sans',sans-serif",fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',cursor:'pointer',transition:'all .18s',
                        }}>
                          <span className="material-icons" style={{fontSize:10}}>{r.disponible?'check_circle':'cancel'}</span>
                          {r.disponible?'Disponible':'Indisponible'}
                        </button>
                      </div>
                    </td>
                    <td style={{padding:'12px 15px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
                        <a href={`/residences/${r.id}`} target="_blank" rel="noopener" style={{display:'inline-flex',alignItems:'center',gap:3,padding:'5px 9px',borderRadius:8,border:`1px solid ${T.borderG}`,background:`${T.gold}09`,color:T.gold,fontSize:10,fontFamily:"'DM Sans',sans-serif",fontWeight:600,textDecoration:'none',transition:'all .13s'}}
                          onMouseEnter={e=>e.currentTarget.style.background=`${T.gold}18`}
                          onMouseLeave={e=>e.currentTarget.style.background=`${T.gold}09`}>
                          <span className="material-icons" style={{fontSize:12}}>visibility</span>Voir
                        </a>
                        <button onClick={()=>setEditId(r.id)} style={{display:'inline-flex',alignItems:'center',gap:3,padding:'5px 9px',borderRadius:8,border:'1px solid rgba(147,197,253,.2)',background:'rgba(59,130,246,.06)',color:'rgba(147,197,253,.8)',fontSize:10,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:'pointer',transition:'all .13s'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(59,130,246,.15)';e.currentTarget.style.color='#93C5FD'}}
                          onMouseLeave={e=>{e.currentTarget.style.background='rgba(59,130,246,.06)';e.currentTarget.style.color='rgba(147,197,253,.8)'}}>
                          <span className="material-icons" style={{fontSize:12}}>edit</span>Modifier
                        </button>
                        <button onClick={()=>del(r.id,r.titre)} disabled={deleting===r.id} style={{display:'inline-flex',alignItems:'center',gap:3,padding:'5px 9px',borderRadius:8,border:'1px solid rgba(248,113,113,.2)',background:'rgba(248,113,113,.06)',color:'rgba(248,113,113,.7)',fontSize:10,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:deleting===r.id?'not-allowed':'pointer',transition:'all .13s'}}
                          onMouseEnter={e=>{if(deleting!==r.id){e.currentTarget.style.background='rgba(248,113,113,.14)';e.currentTarget.style.color=T.red}}}
                          onMouseLeave={e=>{e.currentTarget.style.background='rgba(248,113,113,.06)';e.currentTarget.style.color='rgba(248,113,113,.7)'}}>
                          {deleting===r.id?(
                            <span style={{width:11,height:11,border:'1.5px solid rgba(248,113,113,.3)',borderTopColor:T.red,borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/>
                          ):(
                            <span className="material-icons" style={{fontSize:12}}>delete</span>
                          )}
                          Suppr.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editId && <EditModal adminKey={adminKey} residenceId={editId} onClose={()=>setEditId(null)} onSaved={()=>{setEditId(null);load()}}/>}
    </>
  )
}

// ─── Add form ─────────────────────────────────────────────────
function AddForm({ adminKey, onSuccess }) {
  const EQUIP_FULL = [
    {value:'wifi',label:'Wifi',icon:'wifi'},{value:'climatisation',label:'Climatisation',icon:'ac_unit'},
    {value:'parking',label:'Parking',icon:'local_parking'},{value:'cuisine_equipee',label:'Cuisine équipée',icon:'kitchen'},
    {value:'piscine',label:'Piscine',icon:'pool'},{value:'television',label:'TV',icon:'tv'},
    {value:'machine_a_laver',label:'Lave-linge',icon:'local_laundry_service'},{value:'balcon',label:'Balcon',icon:'balcony'},
    {value:'gardien',label:'Gardien',icon:'security'},{value:'groupe_electrogene',label:'Groupe élec.',icon:'bolt'},
  ]
  const [form, setForm] = useState({
    titre:'', type_bien:'appartement', description:'', ville:'Abidjan',
    commune:'', quartier:'', nb_chambres:1, nb_salles_de_bain:1,
    capacite_personnes:2, prix_nuit:'', prix_journee:'', prix_semaine:'', prix_mois:'',
    featured:true, equipements:[]
  })
  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState(false)

  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const toggleEq = v => setForm(f=>({...f,equipements:f.equipements.includes(v)?f.equipements.filter(e=>e!==v):[...f.equipements,v]}))

  const handlePhotos = e => {
    const files = Array.from(e.target.files).slice(0,10)
    setPhotos(files); setPreviews(files.map(f=>URL.createObjectURL(f)))
  }

  const submit = async e => {
    e.preventDefault()
    if(!form.titre.trim()){setErr('Le titre est requis.');return}
    if(!form.prix_nuit&&!form.prix_journee&&!form.prix_semaine&&!form.prix_mois){setErr('Au moins un tarif requis.');return}
    setSaving(true); setErr('')
    try {
      const fd=new FormData(); fd.append('admin_key',adminKey)
      Object.entries(form).forEach(([k,v])=>{
        if(k==='equipements') v.forEach(eq=>fd.append('equipements',eq))
        else if(k==='featured') fd.append(k,'on')
        else fd.append(k,v)
      })
      photos.forEach(p=>fd.append('photos',p))
      const res=await fetch(`${API_URL}/api/residences/add`,{method:'POST',body:fd})
      const d=await res.json()
      if(d.ok){setOk(true);onSuccess()}
      else setErr(d.error||'Erreur.')
    } catch { setErr('Erreur réseau.') }
    setSaving(false)
  }

  if(ok) return (
    <div style={{textAlign:'center',padding:'80px 28px',animation:'fadeUp .35s ease'}}>
      <div style={{width:68,height:68,borderRadius:'50%',background:'rgba(22,163,74,.08)',border:'2px solid rgba(22,163,74,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
        <span className="material-icons" style={{fontSize:36,color:'#16A34A'}}>check_circle</span>
      </div>
      <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400,color:T.ink,marginBottom:8,fontStyle:'italic'}}>Résidence publiée !</h3>
      <p style={{fontSize:13,color:T.muted,marginBottom:24}}>Elle est maintenant visible sur le site.</p>
      <button onClick={()=>{setOk(false);setForm({titre:'',type_bien:'appartement',description:'',ville:'Abidjan',commune:'',quartier:'',nb_chambres:1,nb_salles_de_bain:1,capacite_personnes:2,prix_nuit:'',prix_journee:'',prix_semaine:'',prix_mois:'',featured:false,equipements:[]});setPhotos([]);setPreviews([])}}
        style={{padding:'10px 24px',borderRadius:10,border:`1px solid ${T.borderG}`,background:`${T.gold}0c`,color:T.gold,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:'pointer'}}>
        + Ajouter une autre
      </button>
    </div>
  )

  const inp = (label, key, type='text', opts={}) => (
    <div style={{marginBottom:16}}>
      <label style={{display:'block',fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:T.muted,marginBottom:6}}>{label}</label>
      <input type={type} value={form[key]} onChange={e=>set(key,type==='number'?Number(e.target.value):e.target.value)} {...opts}
        style={{...IS}} onFocus={onF} onBlur={onB}/>
    </div>
  )
  const sel = (label, key, opts) => (
    <div style={{marginBottom:16}}>
      <label style={{display:'block',fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:T.muted,marginBottom:6}}>{label}</label>
      <select value={form[key]} onChange={e=>set(key,e.target.value)} style={{...IS,cursor:'pointer',appearance:'none'}}>
        {opts.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
      </select>
    </div>
  )

  return (
    <form onSubmit={submit}>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400,color:T.ink,marginBottom:24,fontStyle:'italic'}}>Publier une résidence</h2>
      {err&&<div style={{padding:'10px 14px',borderRadius:10,background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.2)',color:T.red,fontSize:13,marginBottom:20,display:'flex',alignItems:'center',gap:7}}>
        <span className="material-icons" style={{fontSize:15}}>error_outline</span>{err}
      </div>}

      <Section title="Informations générales" icon="info">
        {inp('Titre *','titre','text',{placeholder:'Ex: Villa prestige Cocody 3ch',required:true})}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {sel('Type de bien','type_bien',TYPES)}
          {sel('Ville *','ville',VILLES)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {inp('Commune','commune','text',{placeholder:'Ex: Cocody'})}
          {inp('Quartier','quartier','text',{placeholder:'Ex: Riviera 3'})}
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:'block',fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:T.muted,marginBottom:6}}>Description</label>
          <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={4}
            placeholder="Décrivez la résidence, ses atouts, son accès…"
            style={{...IS,resize:'vertical',minHeight:90}} onFocus={onF} onBlur={onB}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:10,background:`${T.gold}08`,border:`1px solid ${T.gold}20`}}>
          <span className="material-icons" style={{fontSize:15,color:T.gold}}>star</span>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:T.gold}}>Prioritaire automatiquement — toutes les résidences sont mises en avant.</span>
        </div>
      </Section>

      <Section title="Capacité & pièces" icon="king_bed">
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          {inp('Chambres','nb_chambres','number',{min:0,max:20})}
          {inp('Salle de bain','nb_salles_de_bain','number',{min:0,max:10})}
          {inp('Personnes max','capacite_personnes','number',{min:1,max:50})}
        </div>
      </Section>

      {/* Tarifs sans caution */}
      <Section title="Tarifs (XOF)" icon="payments">
        <p style={{fontSize:11,color:T.dim,marginBottom:14}}>Au moins un tarif est requis.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
          {inp('Prix / nuit','prix_nuit','number',{min:0,step:500,placeholder:'0'})}
          {inp('Prix / journée','prix_journee','number',{min:0,step:500,placeholder:'0'})}
          {inp('Prix / semaine','prix_semaine','number',{min:0,step:1000,placeholder:'0'})}
          {inp('Prix / mois','prix_mois','number',{min:0,step:5000,placeholder:'0'})}
        </div>
      </Section>

      <Section title="Équipements" icon="home_repair_service">
        <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
          {EQUIP_FULL.map(eq=>{
            const active=form.equipements.includes(eq.value)
            return (
              <button key={eq.value} type="button" onClick={()=>toggleEq(eq.value)} style={{
                display:'inline-flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:8,
                border:`1px solid ${active?`${T.gold}50`:`${T.gold}18`}`,
                background:active?`${T.gold}14`:`${T.gold}06`,
                color:active?T.gold:T.muted,
                fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,cursor:'pointer',transition:'all .13s',
              }}>
                <span className="material-icons" style={{fontSize:13}}>{eq.icon}</span>{eq.label}
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Photos" icon="photo_library">
        <p style={{fontSize:11,color:T.dim,marginBottom:12}}>10 photos max · JPG, PNG, WEBP</p>
        <label style={{cursor:'pointer'}}>
          <div style={{border:`2px dashed ${T.borderG}`,borderRadius:12,padding:'26px 18px',textAlign:'center',background:`${T.gold}04`,transition:'all .18s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=`${T.gold}50`}
            onMouseLeave={e=>e.currentTarget.style.borderColor=T.borderG}>
            <span className="material-icons" style={{fontSize:34,color:`${T.gold}40`,display:'block',marginBottom:7}}>cloud_upload</span>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:T.muted,marginBottom:3}}>Cliquer pour sélectionner</p>
            <p style={{fontSize:11,color:T.dim}}>ou glisser-déposer</p>
          </div>
          <input type="file" multiple accept="image/*" onChange={handlePhotos} style={{display:'none'}}/>
        </label>
        {previews.length>0&&(
          <div style={{display:'flex',flexWrap:'wrap',gap:7,marginTop:12}}>
            {previews.map((url,i)=>(
              <div key={i} style={{position:'relative'}}>
                <img src={url} alt="" style={{width:76,height:58,objectFit:'cover',borderRadius:8,border:`1px solid ${T.borderG}`}}/>
                {i===0&&<div style={{position:'absolute',bottom:3,left:3,padding:'1px 5px',borderRadius:4,background:T.gold,fontSize:8,fontFamily:"'DM Sans',sans-serif",fontWeight:700,color:'#000'}}>Principal</div>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <button type="submit" disabled={saving} style={{
        width:'100%',padding:'14px',borderRadius:12,border:'none',
        background:saving?`${T.gold}50`:`linear-gradient(135deg,${T.gold},${T.goldL})`,
        color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,
        letterSpacing:'.05em',textTransform:'uppercase',cursor:saving?'not-allowed':'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        boxShadow:saving?'none':`0 6px 24px ${T.gold}30`,transition:'all .18s',
      }}>
        {saving?(
          <><span style={{width:16,height:16,border:'2px solid rgba(201,150,58,.2)',borderTopColor:T.gold,borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/>Publication…</>
        ):(
          <><span className="material-icons" style={{fontSize:17}}>publish</span>Publier la résidence</>
        )}
      </button>
    </form>
  )
}


// ─── MapPicker — carte cliquable Leaflet ──────────────────────
function MapPicker({ lat, lon, onMove }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (instanceRef.current) return // déjà initialisé

    // Charger Leaflet dynamiquement
    const loadLeaflet = async () => {
      if (!window.L) {
        // CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }
        // JS
        await new Promise(resolve => {
          const s = document.createElement('script')
          s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          s.onload = resolve
          document.head.appendChild(s)
        })
      }
      const L = window.L
      const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lon], 15)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      const goldIcon = L.divIcon({
        className: '',
        html: `<div style="width:22px;height:22px;border-radius:50%;background:#C9963A;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
        iconSize: [22,22], iconAnchor: [11,11],
      })

      const marker = L.marker([lat, lon], { icon: goldIcon, draggable: true }).addTo(map)
      marker.on('dragend', e => {
        const { lat: la, lng: ln } = e.target.getLatLng()
        onMove(parseFloat(la.toFixed(6)), parseFloat(ln.toFixed(6)))
      })
      map.on('click', e => {
        const { lat: la, lng: ln } = e.latlng
        marker.setLatLng([la, ln])
        onMove(parseFloat(la.toFixed(6)), parseFloat(ln.toFixed(6)))
      })

      instanceRef.current = map
      markerRef.current = marker
    }
    loadLeaflet()
  }, [])

  // Sync quand lat/lon changent depuis l'extérieur (géoloc ou champ texte)
  useEffect(() => {
    if (!markerRef.current || !instanceRef.current) return
    markerRef.current.setLatLng([lat, lon])
    instanceRef.current.setView([lat, lon], instanceRef.current.getZoom())
  }, [lat, lon])

  return <div ref={mapRef} style={{height:'100%',width:'100%'}}/>
}

// ─── Settings tab ─────────────────────────────────────────────
function SettingsTab() {
  const [settings, setSettings] = useState({
    lat: 5.3364, lon: -4.0267,
    label: "Abidjan, Côte d'Ivoire",
    zoom: 14,
    ville: 'Abidjan',
    whatsapp: '2250789851090',
  })
  const [saving, setSav]   = useState(false)
  const [msg, setMsg]      = useState('')
  const [err, setErr]      = useState('')
  const [preview, setPrev] = useState(false)
  const [locating, setLoc] = useState(false)

  useEffect(()=>{
    fetch('/api/map-settings').then(r=>r.json()).then(d=>setSettings(s=>({...s,...d}))).catch(()=>{})
  },[])

  const save = async () => {
    setSav(true); setMsg(''); setErr('')
    try {
      const adminKey = sessionStorage.getItem('as-admin') || ''
      const r=await fetch('/api/map-settings',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-Admin-Key':adminKey},
        body:JSON.stringify(settings)
      })
      const d=await r.json()
      if(d.ok) setMsg('Paramètres enregistrés avec succès.')
      else setErr(d.error||'Erreur.')
    } catch { setErr('Erreur réseau.') }
    setSav(false)
  }

  const setS = (k,v) => setSettings(s=>({...s,[k]:v}))

  // Géolocalisation du navigateur
  const geolocate = () => {
    if (!navigator.geolocation) { setErr('Géolocalisation non supportée par ce navigateur.'); return }
    setLoc(true); setErr('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setS('lat', parseFloat(pos.coords.latitude.toFixed(6)))
        setS('lon', parseFloat(pos.coords.longitude.toFixed(6)))
        setLoc(false)
        setMsg('Position récupérée ! Vérifiez sur la carte puis enregistrez.')
      },
      err => {
        setErr('Impossible de récupérer la position : ' + err.message)
        setLoc(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const mapSrc = (() => {
    const d=0.018; const {lat,lon}=settings
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-d},${lat-d*.65},${lon+d},${lat+d*.65}&layer=mapnik&marker=${lat},${lon}`
  })()

  const LBL = {display:'block',fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:T.dim,marginBottom:6}

  return (
    <div>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400,color:T.ink,marginBottom:24,fontStyle:'italic'}}>Paramètres du site</h2>

      {/* ── WhatsApp global ── */}
      <Section title="Contact WhatsApp" icon="whatsapp">
        <p style={{fontSize:13,color:T.muted,marginBottom:16,lineHeight:1.6}}>
          Ce numéro est utilisé sur tout le site pour les réservations et le contact. Format international sans <code style={{background:T.bg,padding:'1px 5px',borderRadius:5}}>+</code> ni espaces.
        </p>
        <div>
          <label style={LBL}>Numéro WhatsApp *</label>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <div style={{position:'relative',flex:1}}>
              <span className="material-icons" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontSize:16,color:'#25D366',pointerEvents:'none'}}>whatsapp</span>
              <input
                value={settings.whatsapp}
                onChange={e=>setS('whatsapp',e.target.value.replace(/\D/g,''))}
                style={{...IS,paddingLeft:34}}
                onFocus={onF} onBlur={onB}
                placeholder="2250789851090"
              />
            </div>
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank" rel="noopener"
                style={{display:'inline-flex',alignItems:'center',gap:5,padding:'10px 14px',borderRadius:10,border:'1px solid rgba(37,211,102,.25)',background:'rgba(37,211,102,.06)',color:'#25D366',fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap',flexShrink:0}}>
                <span className="material-icons" style={{fontSize:14}}>open_in_new</span>Tester
              </a>
            )}
          </div>
          <p style={{fontSize:11,color:T.dim,marginTop:6}}>Exemple : <strong style={{color:T.ink}}>2250789851090</strong> pour +225 07 89 85 10 90</p>
        </div>
      </Section>

      {/* ── Localisation ── */}
      <Section title="Localisation de la résidence principale" icon="location_on">
        <p style={{fontSize:13,color:T.muted,marginBottom:16,lineHeight:1.6}}>
          Ces informations définissent la carte affichée dans le pied de page du site.
        </p>

        {/* Ville + Libellé */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
          <div>
            <label style={LBL}>Ville *</label>
            <input value={settings.ville} onChange={e=>setS('ville',e.target.value)} style={IS} onFocus={onF} onBlur={onB} placeholder="Ex: Abidjan"/>
          </div>
          <div>
            <label style={LBL}>Libellé affiché</label>
            <input value={settings.label} onChange={e=>setS('label',e.target.value)} style={IS} onFocus={onF} onBlur={onB} placeholder="Ex: Cocody, Riviera 3 — Abidjan"/>
          </div>
        </div>

        {/* Carte interactive cliquable */}
        <div style={{marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <label style={{...LBL,marginBottom:0}}>Localisation — cliquez sur la carte pour pointer</label>
            <button type="button" onClick={geolocate} disabled={locating} style={{
              display:'inline-flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:9,
              border:`1px solid ${T.borderG}`,background:`${T.gold}08`,
              color:locating?T.dim:T.gold,
              fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,cursor:locating?'wait':'pointer',
              transition:'all .15s',
            }}>
              {locating?(
                <span style={{width:12,height:12,border:`1.5px solid ${T.borderG}`,borderTopColor:T.gold,borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/>
              ):(
                <span className="material-icons" style={{fontSize:14}}>my_location</span>
              )}
              {locating?'Localisation…':'Ma position'}
            </button>
          </div>
          <div style={{padding:'9px 12px',borderRadius:9,background:`${T.gold}08`,border:`1px solid ${T.gold}18`,marginBottom:10,fontSize:12,color:T.muted,display:'flex',gap:7,alignItems:'center'}}>
            <span className="material-icons" style={{fontSize:14,color:T.gold,flexShrink:0}}>info</span>
            <span>Cliquez n'importe où sur la carte pour déplacer le marqueur, ou utilisez <strong style={{color:T.ink}}>Ma position</strong> si vous êtes sur place.</span>
          </div>
          {/* Carte cliquable — Leaflet via CDN */}
          <div id="admin-map" style={{height:280,borderRadius:12,overflow:'hidden',border:`1px solid ${T.borderG}`,marginBottom:10,position:'relative'}}>
            <MapPicker lat={settings.lat} lon={settings.lon} onMove={(lat,lon)=>{setS('lat',lat);setS('lon',lon)}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div>
              <label style={LBL}>Latitude</label>
              <input type="number" step="any" value={settings.lat} onChange={e=>setS('lat',parseFloat(e.target.value)||0)} style={IS} onFocus={onF} onBlur={onB}/>
            </div>
            <div>
              <label style={LBL}>Longitude</label>
              <input type="number" step="any" value={settings.lon} onChange={e=>setS('lon',parseFloat(e.target.value)||0)} style={IS} onFocus={onF} onBlur={onB}/>
            </div>
          </div>
        </div>

        {/* Zoom */}
        <div style={{marginBottom:18}}>
          <label style={LBL}>Niveau de zoom (1–18)</label>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <input type="range" min={10} max={18} value={settings.zoom} onChange={e=>setS('zoom',Number(e.target.value))} style={{flex:1,accentColor:T.gold}}/>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:T.gold,minWidth:28,textAlign:'right'}}>{settings.zoom}</span>
          </div>
        </div>

        {/* Messages */}
        {msg&&<div style={{padding:'10px 14px',borderRadius:9,background:'rgba(74,222,128,.08)',border:'1px solid rgba(74,222,128,.2)',color:T.green,fontSize:13,display:'flex',alignItems:'center',gap:7,marginTop:14}}>
          <span className="material-icons" style={{fontSize:14}}>check_circle</span>{msg}
        </div>}
        {err&&<div style={{padding:'10px 14px',borderRadius:9,background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.2)',color:T.red,fontSize:13,display:'flex',alignItems:'center',gap:7,marginTop:14}}>
          <span className="material-icons" style={{fontSize:14}}>error_outline</span>{err}
        </div>}

        <button onClick={save} disabled={saving} style={{
          marginTop:16,display:'inline-flex',alignItems:'center',gap:7,padding:'11px 24px',borderRadius:10,border:'none',
          background:saving?`${T.gold}50`:`linear-gradient(135deg,${T.gold},${T.goldL})`,
          color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,
          letterSpacing:'.05em',textTransform:'uppercase',cursor:saving?'not-allowed':'pointer',
          boxShadow:saving?'none':`0 4px 16px ${T.gold}28`,transition:'all .18s',
        }}>
          {saving?(
            <><span style={{width:14,height:14,border:'2px solid rgba(201,150,58,.2)',borderTopColor:T.gold,borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/>Enregistrement…</>
          ):(
            <><span className="material-icons" style={{fontSize:15}}>save</span>Enregistrer</>
          )}
        </button>
      </Section>
    </div>
  )
}

// ─── TOP HEADER NAV ───────────────────────────────────────────
function AdminTopBar({ active, setActive, onLogout }) {
  const NAV = [
    { id:'residences', icon:'apartment',  label:'Résidences' },
    { id:'ajouter',    icon:'add_home',   label:'Publier'    },
    { id:'parametres', icon:'settings',   label:'Paramètres' },
  ]
  const [mobileMenuOpen, setMobMenu] = useState(false)

  return (
    <>
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        background:'rgba(255,255,255,.97)',
        borderBottom:`1px solid ${T.border}`,
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        boxShadow:'0 1px 0 rgba(15,14,12,.04)',
      }}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${T.gold},${T.goldL})`,opacity:.6}}/>
        <div style={{
          maxWidth:1400, margin:'0 auto',
          display:'flex', alignItems:'center', gap:0,
          height:60, padding:'0 clamp(16px,3vw,32px)',
        }}>
          <a href="/" style={{
            display:'flex', alignItems:'center', gap:10,
            textDecoration:'none', padding:'8px 12px', borderRadius:12,
            transition:'background .18s', flexShrink:0,
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(201,150,58,.06)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <Logo size={30}/>
            <div style={{lineHeight:1}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,fontWeight:400,color:T.ink,fontStyle:'italic'}}>Allons Somo</div>
              <div style={{fontSize:9,color:T.muted,fontFamily:"'DM Sans',sans-serif",letterSpacing:'.1em',textTransform:'uppercase',marginTop:2,display:'flex',alignItems:'center',gap:3}}>
                <span className="material-icons" style={{fontSize:9}}>arrow_back</span>Retour au site
              </div>
            </div>
          </a>
          <div style={{width:1,height:28,background:T.border,margin:'0 16px',flexShrink:0}}/>
          <div style={{
            padding:'4px 10px', borderRadius:8,
            background:'rgba(201,150,58,.08)', border:`1px solid rgba(201,150,58,.2)`,
            fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase',
            color:T.gold, flexShrink:0, fontFamily:"'DM Sans',sans-serif",
          }}>Administration</div>
          <div style={{flex:1}}/>
          <nav className="admin-top-nav" style={{display:'flex',alignItems:'center',gap:2}}>
            {NAV.map(tab => {
              const on = active === tab.id
              return (
                <button key={tab.id} onClick={()=>setActive(tab.id)} style={{
                  display:'flex', alignItems:'center', gap:7,
                  padding:'8px 14px', borderRadius:10,
                  border:`1px solid ${on ? T.borderG : 'transparent'}`,
                  background: on ? `rgba(201,150,58,.08)` : 'transparent',
                  color: on ? T.gold : T.muted,
                  fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600,
                  cursor:'pointer', transition:'all .16s',
                }}
                onMouseEnter={e=>{if(!on){e.currentTarget.style.background='rgba(15,14,12,.04)';e.currentTarget.style.color=T.ink2}}}
                onMouseLeave={e=>{if(!on){e.currentTarget.style.background='transparent';e.currentTarget.style.color=T.muted}}}>
                  <span className="material-icons" style={{fontSize:15,opacity:on?1:.65}}>{tab.icon}</span>
                  {tab.label}
                </button>
              )
            })}
          </nav>
          <div className="admin-top-nav" style={{width:1,height:28,background:T.border,margin:'0 12px'}}/>
          <div className="admin-top-nav" style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{
              display:'flex', alignItems:'center', gap:7,
              padding:'6px 12px', borderRadius:9,
              background:'rgba(22,163,74,.06)', border:'1px solid rgba(22,163,74,.15)',
            }}>
              <span style={{width:6,height:6,borderRadius:'50%',background:T.green,flexShrink:0,boxShadow:`0 0 5px rgba(22,163,74,.4)`}}/>
              <span style={{fontSize:11,color:T.green,fontFamily:"'DM Sans',sans-serif",fontWeight:600,letterSpacing:'.03em'}}>Connecté</span>
              <span style={{fontSize:9,color:'rgba(22,163,74,.5)',fontFamily:"'DM Sans',sans-serif"}}>Admin</span>
            </div>
            <button onClick={onLogout} style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'7px 12px', borderRadius:9,
              border:'none', cursor:'pointer',
              background:'rgba(220,38,38,.06)', color:'rgba(220,38,38,.55)',
              fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
              transition:'all .16s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,38,38,.12)';e.currentTarget.style.color=T.red}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,38,38,.06)';e.currentTarget.style.color='rgba(220,38,38,.55)'}}>
              <span className="material-icons" style={{fontSize:14}}>logout</span>
              Déconnexion
            </button>
          </div>
          <button className="admin-hamburger" onClick={()=>setMobMenu(o=>!o)} style={{
            display:'none', padding:8,
            background:'rgba(201,150,58,.08)', border:`1px solid rgba(201,150,58,.2)`,
            borderRadius:10, color:T.gold, cursor:'pointer',
          }}>
            <span className="material-icons">{mobileMenuOpen?'close':'menu'}</span>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div style={{
          position:'fixed', top:60, left:0, right:0, zIndex:190,
          background:'rgba(255,255,255,.98)', borderBottom:`1px solid ${T.border}`,
          backdropFilter:'blur(20px)', padding:'12px 16px 16px',
          boxShadow:'0 8px 32px rgba(15,14,12,.1)',
        }}>
          <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:14}}>
            {NAV.map(tab => {
              const on = active === tab.id
              return (
                <button key={tab.id} onClick={()=>{setActive(tab.id);setMobMenu(false)}} style={{
                  display:'flex', alignItems:'center', gap:11,
                  padding:'12px 14px', borderRadius:12,
                  border:`1px solid ${on ? T.borderG : 'transparent'}`,
                  background: on ? 'rgba(201,150,58,.08)' : 'transparent',
                  color: on ? T.gold : T.muted,
                  fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
                  cursor:'pointer', textAlign:'left', width:'100%',
                }}>
                  <span className="material-icons" style={{fontSize:17,opacity:on?1:.6}}>{tab.icon}</span>
                  {tab.label}
                </button>
              )
            })}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:12,borderTop:`1px solid ${T.border}`}}>
            <div style={{flex:1,display:'flex',alignItems:'center',gap:7,padding:'8px 12px',borderRadius:9,background:'rgba(22,163,74,.06)',border:'1px solid rgba(22,163,74,.15)'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:T.green,boxShadow:`0 0 5px rgba(22,163,74,.4)`}}/>
              <span style={{fontSize:12,color:T.green,fontWeight:600}}>Connecté</span>
              <span style={{fontSize:10,color:'rgba(22,163,74,.5)'}}>Admin</span>
            </div>
            <button onClick={onLogout} style={{
              display:'flex',alignItems:'center',gap:6,padding:'9px 14px',borderRadius:9,
              border:'none',cursor:'pointer',background:'rgba(220,38,38,.07)',
              color:'rgba(220,38,38,.7)',fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,
            }}>
              <span className="material-icons" style={{fontSize:15}}>logout</span>
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Dashboard ────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const [adminKey, setAdminKey] = useState('')
  const [active, setActive]     = useState('residences')
  const [mounted, setMounted]   = useState(false)

  useEffect(()=>{
    setMounted(true)
    const key=sessionStorage.getItem('as-admin')
    if(!key){router.replace('/admin');return}
    setAdminKey(key)
  },[router])

  const logout = () => { sessionStorage.removeItem('as-admin'); router.push('/admin') }

  const PAGES = {
    residences: { label:'Gestion des résidences', eyebrow:'Tableau de bord',  icon:'apartment', desc:'Gérez, publiez et mettez en avant vos résidences.' },
    ajouter:    { label:'Publier une résidence',  eyebrow:'Nouvelle résidence',icon:'add_home',  desc:'Ajoutez un nouveau bien à votre catalogue.' },
    parametres: { label:'Paramètres du site',     eyebrow:'Configuration',    icon:'settings',  desc:'WhatsApp, localisation et réglages généraux.' },
  }

  if (!mounted||!adminKey) return null

  const page = PAGES[active]

  return (
    <div style={{
      minHeight:'100vh', background:T.bg,
      fontFamily:"'DM Sans',sans-serif",
      paddingTop:60,
    }}>
      <AdminTopBar active={active} setActive={setActive} onLogout={logout}/>

      <div style={{
        background: T.surface,
        padding:'clamp(20px,3vw,32px) clamp(20px,4vw,40px) 0',
        borderBottom:`1px solid ${T.border}`,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
            <span className="material-icons" style={{fontSize:13,color:T.gold}}>{page.icon}</span>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:T.gold}}>{page.eyebrow}</span>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:14,paddingBottom:20}}>
            <div>
              <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(20px,3vw,28px)',fontWeight:400,color:T.ink,margin:0,fontStyle:'italic',letterSpacing:'-.02em',lineHeight:1.15}}>
                {page.label}
              </h1>
              <p style={{fontSize:13,color:T.muted,marginTop:5}}>{page.desc}</p>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {active==='residences' && (
                <button onClick={()=>setActive('ajouter')} style={{
                  display:'inline-flex',alignItems:'center',gap:7,padding:'9px 18px',borderRadius:10,border:'none',
                  background:`linear-gradient(135deg,${T.gold},${T.goldL})`,
                  color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,
                  letterSpacing:'.05em',textTransform:'uppercase',cursor:'pointer',
                  boxShadow:`0 4px 18px rgba(201,150,58,.3)`,transition:'all .2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                  <span className="material-icons" style={{fontSize:15}}>add_home</span>Publier
                </button>
              )}
              <a href="/" target="_blank" rel="noopener" style={{
                display:'inline-flex',alignItems:'center',gap:6,padding:'9px 14px',borderRadius:10,
                border:`1px solid ${T.border}`,background:T.bg,color:T.muted,
                fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,textDecoration:'none',transition:'all .15s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.color=T.ink}}
              onMouseLeave={e=>{e.currentTarget.style.background=T.bg;e.currentTarget.style.color=T.muted}}>
                <span className="material-icons" style={{fontSize:14}}>open_in_new</span>Voir le site
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{padding:'clamp(20px,3vw,36px) clamp(20px,4vw,40px)'}}>
        {active==='residences' && <ResidencesList adminKey={adminKey} onAdd={()=>setActive('ajouter')}/>}
        {active==='ajouter'    && <AddForm adminKey={adminKey} onSuccess={()=>setActive('residences')}/>}
        {active==='parametres' && <SettingsTab/>}
      </div>

      <style>{`
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        * { box-sizing:border-box; }
        .admin-top-nav     { display:flex !important; }
        .admin-hamburger   { display:none !important; }
        @media(max-width:768px){
          .admin-top-nav   { display:none !important; }
          .admin-hamburger { display:flex !important; }
        }
        select option { background:${T.surface}; color:${T.ink}; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity:1; }
        input[type=range] { height:4px; }
      `}</style>
    </div>
  )
}