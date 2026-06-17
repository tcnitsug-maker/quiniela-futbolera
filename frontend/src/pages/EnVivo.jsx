import { useEffect, useState } from "react";
import api from "../services/api";
import PartidoCard from "../components/PartidoCard";

function EnVivo() {
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = () => {
    api.get("/partidos")
      .then((res) => setPartidos(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar();
    // Refresca cada 30 segundos
    const intervalo = setInterval(cargar, 30000);
    return () => clearInterval(intervalo);
  }, []);

  if (cargando) return <p className="text-slate-400">Cargando...</p>;

  const enVivo = partidos.filter((p) => p.estado === "en_vivo");
  const finalizados = partidos.filter((p) => p.estado === "finalizado");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-6">📡 Partidos</h1>

      <h2 className="text-lg font-bold text-red-400 mb-3">🔴 En vivo</h2>
      {enVivo.length === 0 ? (
        <p className="text-slate-400 mb-6">No hay partidos en vivo ahora mismo.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {enVivo.map((p) => <PartidoCard key={p._id} partido={p} />)}
        </div>
      )}

      <h2 className="text-lg font-bold text-green-400 mb-3">🏁 Finalizados</h2>
      {finalizados.length === 0 ? (
        <p className="text-slate-400">Todavía no hay resultados finales.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {finalizados.map((p) => <PartidoCard key={p._id} partido={p} />)}
        </div>
      )}
    </div>
  );
}

export default EnVivo;
