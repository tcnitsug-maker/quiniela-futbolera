import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { usuario } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");

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

  // Solo admin puede ver esta página
  if (usuario && usuario.rol !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const guardarResultado = async (partidoId, resultado) => {
    try {
      await api.put(`/partidos/${partidoId}/resultado`, { resultado });
      setAviso("✅ Resultado guardado y puntos recalculados");
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
      setAviso("Resultado eliminado");
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
        Elige el ganador de cada partido. Al guardar, los puntos se recalculan automáticamente.
      </p>

      {aviso && (
        <div className="bg-blue-500/20 border border-blue-500 text-blue-300 text-sm rounded-lg p-3 mb-4">
          {aviso}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {partidos.map((p) => {
          const opciones = [
            { valor: "1", label: `Gana ${p.local}` },
            { valor: "X", label: "Empate" },
            { valor: "2", label: `Gana ${p.visitante}` }
          ];
          return (
            <div key={p._id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <span className="font-bold text-white">
                  {p.casillero}. {p.local} vs {p.visitante}
                </span>
                {p.estado === "finalizado" ? (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">
                    Finalizado · Resultado: {p.resultado}
                  </span>
                ) : (
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                    Pendiente
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                {opciones.map((o) => (
                  <button
                    key={o.valor}
                    onClick={() => guardarResultado(p._id, o.valor)}
                    className={`py-2 rounded-lg text-sm font-bold transition ${
                      p.resultado === o.valor
                        ? "bg-green-600 text-white ring-2 ring-green-400"
                        : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {p.estado === "finalizado" && (
                <button
                  onClick={() => limpiar(p._id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Borrar resultado
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;
