const BASE = import.meta.env.VITE_API_BASE || 'https://or-hayeladim.onrender.com'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export async function register(email, password) {
  const r = await fetch(`${BASE}/auth/register`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function login(email, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function listFamilies() {
  const r = await fetch(`${BASE}/families`, { headers: { ...authHeaders() } })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function createFamily(data) {
  const r = await fetch(`${BASE}/families`, {
    method:'POST',
    headers:{'Content-Type':'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function listMembers() {
  const r = await fetch(`${BASE}/members`, { headers: { ...authHeaders() } })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function createMember(data) {
  const r = await fetch(`${BASE}/members`, {
    method:'POST',
    headers:{'Content-Type':'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function listInvoices() {
  const r = await fetch(`${BASE}/invoices`, { headers: { ...authHeaders() } })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function createInvoice(data) {
  const r = await fetch(`${BASE}/invoices`, {
    method:'POST',
    headers:{'Content-Type':'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export function invoicePdfUrl(id) {
  return `${BASE}/invoices/${id}/pdf`
}

export async function summary() {
  const r = await fetch(`${BASE}/reports/summary`, { headers: { ...authHeaders() } })
  if(!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function listBanks() {
  const r = await fetch(`${BASE}/banks`, { headers: { ...authHeaders() } })
  if(!r.ok) throw new Error(await r.text()); return r.json()
}

export async function createBank(data) {
  const r = await fetch(`${BASE}/banks`, {
    method:'POST',
    headers:{'Content-Type':'application/json', ...authHeaders()},
    body: JSON.stringify(data)
  })
  if(!r.ok) throw new Error(await r.text()); return r.json()
}

export async function listPayments(invoice_id) {
  const url = invoice_id ? `${BASE}/payments?invoice_id=${invoice_id}` : `${BASE}/payments`
  const r = await fetch(url, { headers:{ ...authHeaders() } })
  if(!r.ok) throw new Error(await r.text()); return r.json()
}

export async function createPayment(data) {
  const r = await fetch(`${BASE}/payments`, {
    method:'POST',
    headers:{'Content-Type':'application/json', ...authHeaders()},
    body: JSON.stringify(data)
  })
  if(!r.ok) throw new Error(await r.text()); return r.json()
}

export async function memberAccount(memberId){
  const r = await fetch(`${BASE}/members/${memberId}/account`, { headers:{ ...authHeaders() } })
  if(!r.ok) throw new Error(await r.text()); return r.json()
}

