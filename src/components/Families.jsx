import { useEffect, useState } from "react";
import { API } from "../api";

export default function Families() {
  const [families, setFamilies] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const load = async () => {
    const r = await API.get("/families");
    setFamilies(r.data);
  };

  const add = async () => {
    if (!name) return;
    await API.post("/families", { name, email });
    setName(""); setEmail("");
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Familias</h2>
      <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={add}>Añadir</button>
      <ul>
        {families.map(f => (
          <li key={f.id}>{f.name} — {f.email}</li>
        ))}
      </ul>
    </div>
  );
}
