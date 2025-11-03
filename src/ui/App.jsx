import React, { useEffect, useState } from 'react'
import * as api from './api'

function useAuth(){ const [token,setToken]=useState(localStorage.getItem('token')); const doLogin=t=>{localStorage.setItem('token',t);setToken(t)}; const logout=()=>{localStorage.removeItem('token');setToken(null)}; return {token,doLogin,logout} }

function Login({ onLogged }){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false); const [err,setErr]=useState('')
  async function submit(kind){ try{ setLoading(true); setErr(''); if(kind==='register'){ await api.register(email,password) } const {access_token}=await api.login(email,password); onLogged(access_token) } catch(e){ setErr(String(e)) } finally{ setLoading(false) } }
  return (<div className="wrap"><div className="card" style={{maxWidth:560,margin:'10vh auto'}}><h2>ShulCloud-Lite — Acceso</h2><p className="muted">Usa “Crear admin y entrar” si aún no creaste usuario.</p><div className="row"><input className="ip col" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" className="ip col" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)}/></div>{err&&<p className="muted" style={{color:'#ffb4b4'}}>{err}</p>}<div className="row" style={{marginTop:12}}><button className="btn" onClick={()=>submit('login')} disabled={loading}>Entrar</button><button className="btn ghost" onClick={()=>submit('register')} disabled={loading}>Crear admin y entrar</button></div></div></div>)
}

function Topbar({ onLogout }){ return (<div className="top"><h3>Panel — ShulCloud-Lite</h3><div className="row"><a href="https://or-hayeladim.onrender.com/docs" target="_blank" rel="noreferrer" className="tag">/docs</a><button className="btn ghost" onClick={onLogout}>Salir</button></div></div>) }

function Dashboard(){ const [data,setData]=useState(null); const [err,setErr]=useState(''); useEffect(()=>{ api.summary().then(setData).catch(e=>setErr(String(e))) },[]); return (<div className="card"><h3>Resumen</h3>{err&&<p className="muted">{err}</p>}{!data?<p className="muted">Cargando…</p>:(<div className="grid"><div className="card"><b>Total facturado</b><div style={{fontSize:28}}>{data.total_invoices_eur?.toFixed(2)} €</div></div><div className="card"><b>Total donaciones</b><div style={{fontSize:28}}>{data.total_donations_eur?.toFixed(2)} €</div></div><div className="card"><b>Facturas abiertas</b><div style={{fontSize:28}}>{data.open_invoices}</div></div><div className="card"><b>Facturas pagadas</b><div style={{fontSize:28}}>{data.paid_invoices}</div></div></div>)}</div>) }

function Families({ goToMembers }){
  const [items,setItems]=useState([]); const [form,setForm]=useState({ family_name:'', address:'', city:'', country:'', phone:'' }); const [err,setErr]=useState('')
  async function load(){ try{ setItems(await api.listFamilies()) } catch(e){ setErr(String(e)) } } useEffect(()=>{ load() },[])
  async function create(){ try{ await api.createFamily(form); setForm({ family_name:'', address:'', city:'', country:'', phone:'' }); load() } catch(e){ setErr(String(e)) } }
  return (<div className="card"><div className="top"><h3>Familias</h3></div><div className="row">
    <input className="ip col" placeholder="Nombre de la familia" value={form.family_name} onChange={e=>setForm({...form, family_name:e.target.value})}/>
    <input className="ip col" placeholder="Dirección" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
    <input className="ip col" placeholder="Ciudad" value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/>
    <input className="ip col" placeholder="País" value={form.country} onChange={e=>setForm({...form, country:e.target.value})}/>
    <input className="ip col" placeholder="Teléfono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
    <button className="btn" onClick={create}>Crear</button></div>
    {err&&<p className="muted">{err}</p>}
    <table className="table" style={{marginTop:12}}><thead><tr><th>ID</th><th>Familia</th><th>Ciudad</th><th>País</th><th>Teléfono</th><th>Acciones</th></tr></thead>
    <tbody>{items.map(f=>(<tr key={f.id}><td>{f.id}</td><td>{f.family_name}</td><td>{f.city||'-'}</td><td>{f.country||'-'}</td><td>{f.phone||'-'}</td><td><span className="tag" onClick={()=>{ localStorage.setItem('prefill_family_id', String(f.id)); goToMembers() }}>Añadir miembro</span></td></tr>))}</tbody></table></div>)
}

function Members({ goToInvoices }){
  const [items,setItems]=useState([]); const [form,setForm]=useState({ first_name:'', last_name:'', email:'', family_id:'', affiliation:'', birth_date:'' }); const [err,setErr]=useState('')
  async function load(){ try{ setItems(await api.listMembers()) } catch(e){ setErr(String(e)) } } useEffect(()=>{ load() },[])
  useEffect(()=>{ const pre=localStorage.getItem('prefill_family_id'); if(pre){ setForm(f=>({...f, family_id:pre})); localStorage.removeItem('prefill_family_id') } },[])
  async function create(){ try{ const payload={...form, family_id: form.family_id? Number(form.family_id): null}; await api.createMember(payload); setForm({ first_name:'', last_name:'', email:'', family_id:'', affiliation:'', birth_date:'' }); load() } catch(e){ setErr(String(e)) } }
  return (<div className="card"><div className="top"><h3>Miembros</h3></div><div className="row">
    <input className="ip col" placeholder="Nombre" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})}/>
    <input className="ip col" placeholder="Apellidos" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})}/>
    <input className="ip col" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
    <input className="ip col" placeholder="ID Familia (opcional)" value={form.family_id} onChange={e=>setForm({...form, family_id:e.target.value})}/>
    <input className="ip col" placeholder="Afiliación" value={form.affiliation} onChange={e=>setForm({...form, affiliation:e.target.value})}/>
    <input className="ip col" type="date" value={form.birth_date} onChange={e=>setForm({...form, birth_date:e.target.value})}/>
    <button className="btn" onClick={create}>Crear</button></div>
    {err&&<p className="muted">{err}</p>}
    <table className="table" style={{marginTop:12}}><thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Familia</th><th>Afiliación</th><th>Acciones</th></tr></thead>
    <tbody>{items.map(m=>(<tr key={m.id}>
      <td>{m.id}</td><td>{m.first_name} {m.last_name}</td><td>{m.email||'-'}</td><td>{m.family_id||'-'}</td><td>{m.affiliation||'-'}</td>
      <td className="row">
        <span className="tag" onClick={()=>{ if(m.family_id){ localStorage.setItem('prefill_family_id', String(m.family_id)); } }}>Añadir miembro</span>
        <span className="tag" onClick={()=>{ localStorage.setItem('prefill_member_id', String(m.id)); goToInvoices() }}>Crear factura</span>
        <span className="tag" onClick={async ()=>{ try{ const acc=await api.memberAccount(m.id); alert(`Saldo total: ${(acc.total_balance_cents/100).toFixed(2)}\n`+acc.invoices.map(i=>`#${i.invoice_id} ${i.status} ${(i.balance_cents/100).toFixed(2)}`).join('\n')) }catch(e){ alert(String(e)) } }}>Estado de cuenta</span>
      </td></tr>))}</tbody></table></div>)
}

function Banks(){
  const [items,setItems]=useState([]); const [form,setForm]=useState({ nombre:'', numero_cuenta:'', swift:'', activo:true }); const [err,setErr]=useState('')
  async function load(){ try{ setItems(await api.listBanks()) } catch(e){ setErr(String(e)) } } useEffect(()=>{ load() },[])
  async function create(){ try{ await api.createBank(form); setForm({ nombre:'', numero_cuenta:'', swift:'', activo:true }); load() } catch(e){ setErr(String(e)) } }
  return (<div className="card"><div className="top"><h3>Bancos</h3></div><div className="row">
    <input className="ip col" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})}/>
    <input className="ip col" placeholder="Número de cuenta" value={form.numero_cuenta} onChange={e=>setForm({...form, numero_cuenta:e.target.value})}/>
    <input className="ip col" placeholder="SWIFT" value={form.swift} onChange={e=>setForm({...form, swift:e.target.value})}/>
    <select className="ip col" value={String(form.activo)} onChange={e=>setForm({...form, activo: e.target.value==='true'})}><option value="true">Activo</option><option value="false">Inactivo</option></select>
    <button className="btn" onClick={create}>Crear</button></div>
    {err&&<p className="muted">{err}</p>}
    <table className="table" style={{marginTop:12}}><thead><tr><th>ID</th><th>Nombre</th><th>Cuenta</th><th>SWIFT</th><th>Activo</th></tr></thead>
    <tbody>{items.map(b=>(<tr key={b.id}><td>{b.id}</td><td>{b.nombre}</td><td>{b.numero_cuenta||'-'}</td><td>{b.swift||'-'}</td><td>{b.activo?'Sí':'No'}</td></tr>))}</tbody></table></div>)
}

function Invoices(){
  const [items,setItems]=useState([])
  const [form,setForm]=useState({ member_id:'', issue_date:'', due_date:'', description:'', amount_cents:'', currency:'EUR' })
  const [banks,setBanks]=useState([])
  const [pay,setPay]=useState({ invoice_id:'', amount_cents:'', metodo:'efectivo', banco_id:'', fecha:'' })
  const [err,setErr]=useState('')
  async function load(){ try{ setItems(await api.listInvoices()) } catch(e){ setErr(String(e)) } }
  useEffect(()=>{ load(); api.listBanks().then(setBanks).catch(()=>{}) },[])
  useEffect(()=>{ const pre=localStorage.getItem('prefill_member_id'); if(pre){ setForm(f=>({...f, member_id:pre})); localStorage.removeItem('prefill_member_id') } },[])
  async function create(){ try{ const payload={...form, member_id:Number(form.member_id), amount_cents:Number(form.amount_cents)||0, due_date: form.due_date||null }; await api.createInvoice(payload); setForm({ member_id:'', issue_date:'', due_date:'', description:'', amount_cents:'', currency:'EUR' }); load() } catch(e){ setErr(String(e)) } }
  async function registerPayment(){ try{ const payload={ invoice_id:Number(pay.invoice_id), amount_cents:Number(pay.amount_cents), metodo:pay.metodo, banco_id: pay.banco_id? Number(pay.banco_id): null, fecha: pay.fecha||null }; await api.createPayment(payload); setPay({ invoice_id:'', amount_cents:'', metodo:'efectivo', banco_id:'', fecha:'' }); load() } catch(e){ setErr(String(e)) } }
  return (<div className="card"><div className="top"><h3>Facturas</h3></div><div className="row">
    <input className="ip col" placeholder="ID Miembro" value={form.member_id} onChange={e=>setForm({...form, member_id:e.target.value})}/>
    <input className="ip col" type="date" value={form.issue_date} onChange={e=>setForm({...form, issue_date:e.target.value})}/>
    <input className="ip col" type="date" value={form.due_date} onChange={e=>setForm({...form, due_date:e.target.value})}/>
    <input className="ip col" placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
    <input className="ip col" placeholder="Importe (cent)" value={form.amount_cents} onChange={e=>setForm({...form, amount_cents:e.target.value})}/>
    <select className="ip col" value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}><option>EUR</option><option>USD</option><option>ILS</option></select>
    <button className="btn" onClick={create}>Crear</button></div>
    {err&&<p className="muted">{err}</p>}
    <table className="table" style={{marginTop:12}}><thead><tr><th>ID</th><th>Factura</th><th>Miembro</th><th>Importe</th><th>Estado</th><th className="right">PDF</th></tr></thead>
    <tbody>{items.map(i=>(<tr key={i.id}><td>{i.id}</td><td>{i.full_number||'-'}</td><td>{i.member_id}</td><td>{(i.amount_cents/100).toFixed(2)} {i.currency}</td><td><span className="tag">{i.status}</span></td><td className="right"><a className="tag" href={api.invoicePdfUrl(i.id)} target="_blank" rel="noreferrer">Ver PDF</a></td></tr>))}</tbody></table>
    <div className="card" style={{marginTop:12}}><h4>Registrar cobro</h4><div className="row">
      <input className="ip col" placeholder="ID Factura" value={pay.invoice_id} onChange={e=>setPay({...pay, invoice_id:e.target.value})}/>
      <input className="ip col" placeholder="Importe (cent)" value={pay.amount_cents} onChange={e=>setPay({...pay, amount_cents:e.target.value})}/>
      <select className="ip col" value={pay.metodo} onChange={e=>setPay({...pay, metodo:e.target.value})}>
        <option value="efectivo">Efectivo</option><option value="tpv">TPV</option><option value="transferencia">Transferencia</option>
      </select>
      <select className="ip col" value={pay.banco_id} onChange={e=>setPay({...pay, banco_id:e.target.value})}>
        <option value="">Banco (opcional)</option>{banks.map(b=><option key={b.id} value={b.id}>{b.nombre}</option>)}
      </select>
      <input className="ip col" type="date" value={pay.fecha} onChange={e=>setPay({...pay, fecha:e.target.value})}/>
      <button className="btn" onClick={registerPayment}>Guardar cobro</button>
    </div></div></div>)
}

function App(){
  const {token,doLogin,logout}=useAuth(); const [tab,setTab]=useState('dashboard')
  if(!token) return <Login onLogged={doLogin} />
  const goToMembers=()=>setTab('members'); const goToInvoices=()=>setTab('invoices')
  return (<div className="wrap"><Topbar onLogout={logout}/>
    <div className="nav">{['dashboard','families','members','invoices','banks'].map(t=>(
      <a key={t} href="#" className={tab===t?'active':''} onClick={e=>{e.preventDefault(); setTab(t)}}>
        {t==='dashboard'?'Resumen': t==='families'?'Familias': t==='members'?'Miembros': t==='invoices'?'Facturas':'Bancos'}
      </a>))}</div>
    {tab==='dashboard'&&<Dashboard/>}
    {tab==='families'&&<Families goToMembers={goToMembers}/>}
    {tab==='members'&&<Members goToInvoices={goToInvoices}/>}
    {tab==='invoices'&&<Invoices/>}
    {tab==='banks'&&<Banks/>}
    <p className="muted mini" style={{marginTop:20}}>Base API: {import.meta.env.VITE_API_BASE || api.BASE}</p>
  </div>)
}

export default App
