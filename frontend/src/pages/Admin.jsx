import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { usuario } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");
  const [golesForm, setGolesForm] = useState({});

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const { data } = await api.get("/partidos");
      setPartidos(data);
    } catch {
      setAviso("Error al cargar partidos");
    } finally {
      setCargando(false);
    }
  };

  if (usuario && usuario.rol !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const guardarResultado = async (partidoId) => {
    const { golesLocal, golesVisitante } = golesForm[partidoId] || {};
    
    if (golesLocal === undefined || golesVisitante === undefined) {
      setAviso("❌ Ingresa goles en ambos campos");
      return;
    }

    try {
      await api.put(`/partidos/${partidoId}/resultado`, { 
        golesLocal: parseInt(golesLocal), 
        golesVisitante: parseInt(golesVisitante) 
      });
      setAviso("✅ Resultado guardado y puntos recalculados");
      setGolesForm({});
      cargar();
      setTimeout(() => setAviso(""), 2500);
    } catch (err) {
      setAviso(err.response?.data?.msg || "Error al guardar");
      setTimeout(() => setAviso(""), 3000);
    }
  };

  const limpiar = async (partidoId) => {
    try {
      await api.delete(`/partidos/${partidoId}/resultado`);
      setAviso("✅ Resultado eliminado");
      setGolesForm({});
      cargar();
      setTimeout(() => setAviso(""), 2500);
    } catch (err) {
      setAviso("Error al limpiar");
      setTimeout(() => setAviso(""), 3000);
    }
  };

  if (cargando) return <p className="text-slate-400">Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-1">🛠️ Panel de Administrador</h1>
      <p className="text-slate-400 mb-6">
        Ingresa los goles de cada equipo. Al guardar, los puntos se recalculan automáticamente.
      </p>

      {aviso && (
        <div className="bg-blue-500/20 border border-blue-500 text-blue-300 text-sm rounded-lg p-3 mb-4">
          {aviso}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {partidos.map((p) => (
          <div key={p._id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className="font-bold text-white">
                {p.casillero}. {p.local} vs {p.visitante}
              </span>
              {p.estado === "finalizado" ? (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">
                  ✅ Finalizado · {p.golesLocal}-{p.golesVisitante}
                </span>
              ) : (
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                  ⏳ Pendiente
                </span>
              )}
            </div>

            {p.estado === "pendiente" ? (
              <div className="flex items-end gap-2">
                <div>
                  <label className="text-xs text-slate-400">Goles {p.local}</label>
                  <input
                    type="number"
                    min="0"
                    value={golesForm[p._id]?.golesLocal ?? ""}
                    onChange={(e) =>
                      setGolesForm({
                        ...golesForm,
                        [p._id]: {
                          ...golesForm[p._id],
                          golesLocal: e.target.value
                        }
                      })
                    }
                    className="w-16 bg-slate-700 text-white rounded-lg px-2 py-1 border border-slate-600 text-center"
                    placeholder="0"
                  />
                </div>

                <span className="text-white font-bold">-</span>

                <div>
                  <label className="text-xs text-slate-400">Goles {p.visitante}</label>
                  <input
                    type="number"
                    min="0"
                    value={golesForm[p._id]?.golesVisitante ?? ""}
                    onChange={(e) =>
                      setGolesForm({
                        ...golesForm,
                        [p._id]: {
                          ...golesForm[p._id],
                          golesVisitante: e.target.value
                        }
                      })
                    }
                    className="w-16 bg-slate-700 text-white rounded-lg px-2 py-1 border border-slate-600 text-center"
                    placeholder="0"
                  />
                </div>

                <button
                  onClick={() => guardarResultado(p._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1 rounded-lg transition"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div>
                <p className="text-slate-300 mb-2">
                  Resultado: <span className="font-bold text-green-400">{p.golesLocal}-{p.golesVisitante}</span>
                </p>
                <button
                  onClick={() => limpiar(p._id)}
                  className="text-sm text-red-400 hover:text-red-300 font-bold"
                >
                  🗑️ Borrar resultado
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
