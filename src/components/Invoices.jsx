import { useEffect, useState } from "react";
import { API } from "../api";

export default function Invoices() {
  const [list, setList] = useState([]);
  const [member, setMember] = useState("");
  const [amount, setAmount] = useState("");

  const load = async () => {
    const r = await API.get("/invoices");
    setList(r.data);
  };

  const add = async () => {
    if (!member || !amount) return;
    await API.post("/invoices", { member_id: Number(member), amount_cents: Number(amount) * 100 });
    setMember(""); setAmount("");
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Facturas</h2>
      <input placeholder="ID miembro" value={member} onChange={e => setMember(e.target.value)} />
      <input placeholder="Importe (€)" value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={add}>Añadir</button>
      <ul>
        {list.map(i => (
          <li key={i.id}>
            Factura #{i.id} — {i.amount_cents/100}€ — {i.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
