import { useEffect, useState } from "react";
import api from "../services/api";
import PartidoCard from "../components/PartidoCard";

function Quiniela() {
  const [partidos, setPartidos] = useState([]);
  const [pronosticos, setPronosticos] = useState({});
  const [statusPronosticos, setStatusPronosticos] = useState({});
  const [concurso, setConcurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");
  const [bloqueando, setBloqueando] = useState(false);

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
      const statusMap = {};
      resMios.data.forEach((p) => {
        const id = p.partidoId?._id || p.partidoId;
        mapa[id] = p.pronostico;
        statusMap[id] = p.status || "active";
      });
      setPronosticos(mapa);
      setStatusPronosticos(statusMap);
    } catch (err) {
      setAviso("Error al cargar los partidos");
    } finally {
      setCargando(false);
    }
  };

  const guardar = async (partidoId, pronostico) => {
    // Validar que no esté bloqueado
    if (statusPronosticos[partidoId] === "locked") {
      setAviso("❌ Este pronóstico está bloqueado");
      setTimeout(() => setAviso(""), 3000);
      return;
    }

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

  const bloquearPronosticos = async () => {
    setBloqueando(true);
    try {
      const res = await api.post("/pronosticos/lock");
      setAviso(`✅ ${res.data.bloqueados} pronósticos bloqueados correctamente`);
      
      // Actualizar estado de todos los pronósticos a "locked"
      const newStatus = {};
      Object.keys(statusPronosticos).forEach((id) => {
        newStatus[id] = "locked";
      });
      setStatusPronosticos(newStatus);
      
      setTimeout(() => setAviso(""), 4000);
    } catch (err) {
      setAviso(err.response?.data?.msg || "Error al bloquear pronósticos");
      setTimeout(() => setAviso(""), 3000);
    } finally {
      setBloqueando(false);
    }
  };

  const todosBloqueados = Object.values(statusPronosticos).every(s => s === "locked");
  const todosTienenPronostico = Object.keys(pronosticos).length === partidos.length;

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

      {todosBloqueados && (
        <div className="bg-amber-500/20 border border-amber-500 text-amber-300 text-sm rounded-lg p-3 mb-4">
          🔒 Todos tus pronósticos están bloqueados y no pueden ser modificados
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {partidos.map((p) => (
          <PartidoCard
            key={p._id}
            partido={p}
            seleccion={pronosticos[p._id]}
            onPronostico={guardar}
            bloqueado={statusPronosticos[p._id] === "locked"}
          />
        ))}
      </div>

      {!todosBloqueados && todosTienenPronostico && (
        <div className="mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={bloquearPronosticos}
            disabled={bloqueando}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {bloqueando ? "Bloqueando..." : "✅ Confirmar y bloquear pronósticos"}
          </button>
          <p className="text-slate-400 text-sm mt-2">
            Una vez confirmado, no podrás cambiar tus pronósticos
          </p>
        </div>
      )}
    </div>
  );
}

export default Quiniela;
