import { useEffect, useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Members from './components/Members.jsx'
import Invoices from './components/Invoices.jsx'
import Payments from './components/Payments.jsx'
import Banks from './components/Banks.jsx'
import Account from './components/Account.jsx'
import Login from './components/Login.jsx'
import Families from './components/Families.jsx'
import { API } from './api'

function SidebarLink({ to, children }){
  return (
    <NavLink to={to} className={({isActive}) =>
      `block px-3 py-2 rounded-lg ${isActive ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'}`
    }>{children}</NavLink>
  )
}

export default function App(){
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null))

  function handleLogin(tok){
    setToken(tok)
  }

  function handleLogout(){
    localStorage.removeItem('token')
    delete API.defaults.headers.common['Authorization']
    setToken(null)
  }

  if (!token){
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-60 bg-white border-r p-4 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-slate-700">Panel</h1>
          <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-slate-600">Salir</button>
        </div>
        <SidebarLink to="/">Familias</SidebarLink>
        <SidebarLink to="/members">Miembros</SidebarLink>
        <SidebarLink to="/invoices">Facturas</SidebarLink>
        <SidebarLink to="/payments">Cobros</SidebarLink>
        <SidebarLink to="/banks">Bancos</SidebarLink>
      </aside>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Families />} />
          <Route path="/members" element={<Members />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/banks" element={<Banks />} />
          <Route path="/account/:id" element={<Account />} />
        </Routes>
      </main>
    </div>
  )
}
