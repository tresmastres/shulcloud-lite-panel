
import { Routes, Route, NavLink } from 'react-router-dom'
import Members from './components/Members.jsx'
import Invoices from './components/Invoices.jsx'
import Payments from './components/Payments.jsx'
import Banks from './components/Banks.jsx'
import Account from './components/Account.jsx'

function SidebarLink({ to, children }){
  return (
    <NavLink to={to} className={({isActive}) =>
      `block px-3 py-2 rounded-lg ${isActive ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'}`
    }>{children}</NavLink>
  )
}

export default function App(){
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <div className="text-xl font-bold mb-4 text-sky-700">ShulCloud Lite</div>
        <nav className="space-y-1">
          <SidebarLink to="/">Miembros</SidebarLink>
          <SidebarLink to="/invoices">Facturas</SidebarLink>
          <SidebarLink to="/payments">Cobros</SidebarLink>
          <SidebarLink to="/banks">Bancos</SidebarLink>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <Routes>
          <Route path="/" element={<Members />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/banks" element={<Banks />} />
          <Route path="/account/:id" element={<Account />} />
        </Routes>
      </main>
    </div>
  )
}
