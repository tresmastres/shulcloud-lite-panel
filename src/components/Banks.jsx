import { useEffect, useState } from "react";
import { API } from "../api";

export default function Banks() {
  const [banks, setBanks] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const r = await API.get("/banks");
    setBanks(r.data);
  };

  const add = async () => {
    if (!name) return;
    await API.post("/banks", { nombre: name });
    setName("");
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Bancos</h2>
      <input placeholder="Nombre del banco" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={add}>Añadir</button>
      <ul>
        {banks.map(b => (
          <li key={b.id}>{b.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
