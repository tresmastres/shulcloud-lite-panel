import { Routes, Route, Link } from "react-router-dom";
import Families from "./components/Families.jsx";
import Members from "./components/Members.jsx";
import Invoices from "./components/Invoices.jsx";
import Banks from "./components/Banks.jsx";
import Payments from "./components/Payments.jsx";
import Account from "./components/Account.jsx";

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 10, padding: 10, background: "#eee" }}>
        <Link to="/">Familias</Link>
        <Link to="/members">Miembros</Link>
        <Link to="/invoices">Facturas</Link>
        <Link to="/banks">Bancos</Link>
        <Link to="/payments">Cobros</Link>
      </nav>

      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Families />} />
          <Route path="/members" element={<Members />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/banks" element={<Banks />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/account/:id" element={<Account />} />
        </Routes>
      </div>
    </div>
  );
}
