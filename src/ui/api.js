const BASE = import.meta.env.VITE_API_BASE || 'https://or-hayeladim.onrender.com'
function authHeaders(){ const t=localStorage.getItem('token'); return t?{'Authorization':`Bearer ${t}`}:{} }
async function j(r){ if(!r.ok) throw new Error(await r.text()); return r.json() }

export async function register(email,password){ return j(await fetch(`${BASE}/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})) }
export async function login(email,password){ return j(await fetch(`${BASE}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})) }

export async function listFamilies(){ return j(await fetch(`${BASE}/families`,{headers:{...authHeaders()}})) }
export async function createFamily(data){ return j(await fetch(`${BASE}/families`,{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:JSON.stringify(data)})) }

export async function listMembers(){ return j(await fetch(`${BASE}/members`,{headers:{...authHeaders()}})) }
export async function createMember(data){ return j(await fetch(`${BASE}/members`,{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:JSON.stringify(data)})) }

export async function listInvoices(){ return j(await fetch(`${BASE}/invoices`,{headers:{...authHeaders()}})) }
export async function createInvoice(data){ return j(await fetch(`${BASE}/invoices`,{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:JSON.stringify(data)})) }
export function invoicePdfUrl(id){ return `${BASE}/invoices/${id}/pdf` }

export async function summary(){ return j(await fetch(`${BASE}/reports/summary`,{headers:{...authHeaders()}})) }

export async function listBanks(){ return j(await fetch(`${BASE}/banks`,{headers:{...authHeaders()}})) }
export async function createBank(data){ return j(await fetch(`${BASE}/banks`,{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:JSON.stringify(data)})) }

export async function listPayments(invoice_id){ const url=invoice_id?`${BASE}/payments?invoice_id=${invoice_id}`:`${BASE}/payments`; return j(await fetch(url,{headers:{...authHeaders()}})) }
export async function createPayment(data){ return j(await fetch(`${BASE}/payments`,{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:JSON.stringify(data)})) }

export async function memberAccount(memberId){ return j(await fetch(`${BASE}/members/${memberId}/account`,{headers:{...authHeaders()}})) }

export { BASE }
