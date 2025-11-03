import React, { useEffect, useState } from 'react'
import * as api from './api'

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  function doLogin(t) { localStorage.setItem('token', t); setToken(t) }
  function logout(){ localStorage.removeItem('token'); setToken(null) }
  return { token, doLogin, logout }
}

function Login({ onLogged }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit(kind){
    try{
      setLoading(true); setErr('')
      if(kind==='register'){ await api.register(email, password) }
      const { access_token } = await api.login(email, password)
      onLogged(access_token)
    }catch(e){ setErr(String(e)) }
    finally{ setLoading(false) }
  }

  return (
    <div className="wrap">
      <div className="card" style={{maxWidth:560, margin:'10vh auto'}}>
        <h2>ShulCloud-Lite — Acceso</h2>
        <p className="muted">Conéctate a tu backend. Usa correos reales para recibir PDFs si configuraste SMTP.</p>
        <div className="row">
          <div className="col">
            <label>Email</label>
            <input className="ip" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@tu-dominio.org" />
          </div>
          <div className="col">
            <label>Contraseña</label>
            <input type="password" className="ip" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
        </div>
        {err && <p className="muted" style={{color:'#ffb4b4'}}>{err}</p>}
        <div className="row" style={{marginTop:12}}>
          <button className="btn" onClick={()=>submit('login')} disabled={loading}>Entrar</button>
          <button className="btn ghost" onClick={()=>submit('register')} disabled={loading}>Crear admin y entrar</button>
        </div>
      </div>
    </div>
  )
}

function Topbar({ onLogout }){
  return (
    <div className="top">
      <h3>Panel — ShulCloud-Lite</h3>
      <div className="row">
        <a href="https://or-hayeladim.onrender.com/docs" target="_blank" rel="noreferrer" className="tag">/docs</a>
        <button className="btn ghost" onClick={onLogout}>Salir</button>
      </div>
    </div>
  )
}

function Dashboard(){
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  useEffect(()=>{ api.summary().then(setData).catch(e=>setErr(String(e))) },[])
  return (
    <div className="card">
      <h3>Resumen</h3>
      {err && <p className="muted">{err}</p>}
      {!data ? <p className="muted">Cargando…</p> : (
        <div className="grid">
          <div className="card"><b>Total facturado</b><div style={{fontSize:28}}>{data.total_invoices_eur?.toFixed(2)} €</div></div>
          <div className="card"><b>Total donaciones</b><div style={{fontSize:28}}>{data.total_donations_eur?.toFixed(2)} €</div></div>
          <div className="card"><b>Facturas abiertas</b><div style={{fontSize:28}}>{data.open_invoices}</div></div>
          <div className="card"><b>Facturas pagadas</b><div style={{fontSize:28}}>{data.paid_invoices}</div></div>
        </div>
      )}
    </div>
  )
}

function Families(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ family_name:'', address:'', city:'', country:'', phone:'' })
  const [err, setErr] = useState('')
  async function load(){ try{ setItems(await api.listFamilies()) } catch(e){ setErr(String(e)) } }
  useEffect(()=>{ load() },[])
  async function create(){
    try{ await api.createFamily(form); setForm({ family_name:'', address:'', city:'', country:'', phone:'' }); load() }
    catch(e){ setErr(String(e)) }
  }
  return (
    <div className="card">
      <div className="top"><h3>Familias</h3></div>
      <div className="row">
        <input className="ip col" placeholder="Nombre de la familia" value={form.family_name} onChange={e=>setForm({...form, family_name:e.target.value})}/>
        <input className="ip col" placeholder="Dirección" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
        <input className="ip col" placeholder="Ciudad" value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/>
        <input className="ip col" placeholder="País" value={form.country} onChange={e=>setForm({...form, country:e.target.value})}/>
        <input className="ip col" placeholder="Teléfono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        <button className="btn" onClick={create}>Crear</button>
      </div>
      {err && <p className="muted">{err}</p>}
      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>ID</th><th>Familia</th><th>Ciudad</th><th>País</th><th>Teléfono</th></tr></thead>
        <tbody>{items.map(f=>(<tr key={f.id}><td>{f.id}</td><td>{f.family_name}</td><td>{f.city||'-'}</td><td>{f.country||'-'}</td><td>{f.phone||'-'}</td></tr>))}</tbody>
      </table>
    </div>
  )
}

function Members(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', family_id:'', affiliation:'', birth_date:'', anniversary:'', yahrzeit:'' })
  const [err, setErr] = useState('')
  async function load(){ try{ setItems(await api.listMembers()) } catch(e){ setErr(String(e)) } }
  useEffect(()=>{ load() },[])
  async function create(){
    const payload = { ...form, family_id: form.family_id? Number(form.family_id): null }
    try{ await api.createMember(payload); setForm({ first_name:'', last_name:'', email:'', family_id:'', affiliation:'', birth_date:'', anniversary:'', yahrzeit:'' }); load() }
    catch(e){ setErr(String(e)) }
  }
  return (
    <div className="card">
      <div className="top"><h3>Miembros</h3></div>
      <div className="row">
        <input className="ip col" placeholder="Nombre" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})}/>
        <input className="ip col" placeholder="Apellidos" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})}/>
        <input className="ip col" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="ip col" placeholder="ID Familia (opcional)" value={form.family_id} onChange={e=>setForm({...form, family_id:e.target.value})}/>
        <input className="ip col" placeholder="Afiliación" value={form.affiliation} onChange={e=>setForm({...form, affiliation:e.target.value})}/>
        <input className="ip col" type="date" value={form.birth_date} onChange={e=>setForm({...form, birth_date:e.target.value})}/>
        <input className="ip col" type="date" value={form.anniversary} onChange={e=>setForm({...form, anniversary:e.target.value})}/>
        <input className="ip col" type="date" value={form.yahrzeit} onChange={e=>setForm({...form, yahrzeit:e.target.value})}/>
        <button className="btn" onClick={create}>Crear</button>
      </div>
      {err && <p className="muted">{err}</p>}
      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Familia</th><th>Afiliación</th></tr></thead>
        <tbody>{items.map(m=>(<tr key={m.id}><td>{m.id}</td><td>{m.first_name} {m.last_name}</td><td>{m.email||'-'}</td><td>{m.family_id||'-'}</td><td>{m.affiliation||'-'}</td></tr>))}</tbody>
      </table>
    </div>
  )
}

function Invoices(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ member_id:'', issue_date:'', due_date:'', description:'', amount_cents:'', currency:'EUR' })
  const [err, setErr] = useState('')
  async function load(){ try{ setItems(await api.listInvoices()) } catch(e){ setErr(String(e)) } }
  useEffect(()=>{ load() },[])
  async function create(){
    const payload = { ...form, member_id:Number(form.member_id), amount_cents:Number(form.amount_cents)||0, due_date: form.due_date||null }
    try{ await api.createInvoice(payload); setForm({ member_id:'', issue_date:'', due_date:'', description:'', amount_cents:'', currency:'EUR' }); load() }
    catch(e){ setErr(String(e)) }
  }
  return (
    <div className="card">
      <div className="top"><h3>Facturas</h3></div>
      <div className="row">
        <input className="ip col" placeholder="ID Miembro" value={form.member_id} onChange={e=>setForm({...form, member_id:e.target.value})}/>
        <input className="ip col" type="date" value={form.issue_date} onChange={e=>setForm({...form, issue_date:e.target.value})}/>
        <input className="ip col" type="date" value={form.due_date} onChange={e=>setForm({...form, due_date:e.target.value})}/>
        <input className="ip col" placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        <input className="ip col" placeholder="Importe (cent)" value={form.amount_cents} onChange={e=>setForm({...form, amount_cents:e.target.value})}/>
        <select className="ip col" value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}>
          <option>EUR</option><option>USD</option><option>ILS</option>
        </select>
        <button className="btn" onClick={create}>Crear</button>
      </div>
      {err && <p className="muted">{err}</p>}
      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>ID</th><th>Factura</th><th>Miembro</th><th>Importe</th><th>Estado</th><th className="right">PDF</th></tr></thead>
        <tbody>{items.map(i=>(
          <tr key={i.id}>
            <td>{i.id}</td>
            <td>{i.full_number || '-'}</td>
            <td>{i.member_id}</td>
            <td>{(i.amount_cents/100).toFixed(2)} {i.currency}</td>
            <td><span className="tag">{i.status}</span></td>
            <td className="right"><a className="tag" href={api.invoicePdfUrl(i.id)} target="_blank" rel="noreferrer">Ver PDF</a></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function App(){
  const { token, doLogin, logout } = useAuth()
  const [tab, setTab] = useState('dashboard')

  if(!token) return <Login onLogged={doLogin} />

  return (
    <div className="wrap">
      <Topbar onLogout={logout} />
      <div className="nav">
        {['dashboard','families','members','invoices'].map(t=> (
          <a key={t} href="#" className={tab===t?'active':''} onClick={(e)=>{e.preventDefault(); setTab(t)}}>
            {t==='dashboard'?'Resumen': t==='families'?'Familias': t==='members'?'Miembros':'Facturas'}
          </a>
        ))}
      </div>

      {tab==='dashboard' && <Dashboard />}
      {tab==='families' && <Families />}
      {tab==='members' && <Members />}
      {tab==='invoices' && <Invoices />}

      <p className="muted mini" style={{marginTop:20}}>Base API: {import.meta.env.VITE_API_BASE || 'https://or-hayeladim.onrender.com'}</p>
    </div>
  )
}

export default App
