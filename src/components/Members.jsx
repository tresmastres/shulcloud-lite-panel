import { useEffect, useState } from "react";
import { API } from "../api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const load = async () => {
    const r = await API.get("/members");
    setMembers(r.data);
  };

  const add = async () => {
    if (!first || !last) return;
    await API.post("/members", { first_name: first, last_name: last });
    setFirst(""); setLast("");
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Miembros</h2>
      <input placeholder="Nombre" value={first} onChange={e => setFirst(e.target.value)} />
      <input placeholder="Apellido" value={last} onChange={e => setLast(e.target.value)} />
      <button onClick={add}>Añadir</button>
      <ul>
        {members.map(m => (
          <li key={m.id}>{m.first_name} {m.last_name}</li>
        ))}
      </ul>
    </div>
  );
}
