import { useEffect, useState } from "react";
import api from "../services/api";
import PartidoCard from "../components/PartidoCard";

function Quiniela() {
  const [partidos, setPartidos] = useState([]);
  const [pronosticos, setPronosticos] = useState({});
  const [concurso, setConcurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const [resPartidos, resMios, resConcurso] = await Promise.all([
        api.get("/partidos"),
        api.get("/pronosticos/mios"),
        api.get("/concursos/activo")
      ]);
      setPartidos(resPartidos.data);
      setConcurso(resConcurso.data);

      // Mapear mis pronósticos ya guardados
      const mapa = {};
      resMios.data.forEach((p) => {
        const id = p.partidoId?._id || p.partidoId;
        mapa[id] = p.pronostico;
      });
      setPronosticos(mapa);
    } catch (err) {
      setAviso("Error al cargar los partidos");
    } finally {
      setCargando(false);
    }
  };

  const guardar = async (partidoId, pronostico) => {
    try {
      await api.post("/pronosticos", { partidoId, pronostico });
      setPronosticos((prev) => ({ ...prev, [partidoId]: pronostico }));
      setAviso("✅ Pronóstico guardado");
      setTimeout(() => setAviso(""), 2000);
    } catch (err) {
      setAviso(err.response?.data?.msg || "Error al guardar");
      setTimeout(() => setAviso(""), 3000);
    }
  };

  if (cargando) return <p className="text-slate-400">Cargando partidos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-1">
        {concurso ? concurso.nombre : "Quiniela"}
      </h1>
      <p className="text-slate-400 mb-6">Elige L (local), E (empate) o V (visitante)</p>

      {aviso && (
        <div className="bg-blue-500/20 border border-blue-500 text-blue-300 text-sm rounded-lg p-3 mb-4">
          {aviso}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partidos.map((p) => (
          <PartidoCard
            key={p._id}
            partido={p}
            seleccion={pronosticos[p._id]}
            onPronostico={guardar}
          />
        ))}
      </div>
    </div>
  );
}

export default Quiniela;
