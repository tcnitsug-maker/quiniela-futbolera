import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Ranking() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get("/auth/ranking")
      .then((res) => setUsuarios(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="text-slate-400">Cargando ranking...</p>;

  const medalla = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-6">🏆 Tabla General</h1>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        {usuarios.length === 0 ? (
          <p className="text-slate-400 p-6 text-center">Sin jugadores todavía</p>
        ) : (
          <>
            {usuarios.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border-b-2 border-yellow-500 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{medalla(0)}</span>
                    <div>
                      <span className="font-extrabold text-lg text-yellow-300">{usuarios[0].nombre}</span>
                      <p className="text-xs text-yellow-200">👑 GANADOR</p>
                    </div>
                  </div>
                  <span className="bg-yellow-600 text-white font-bold text-lg px-4 py-2 rounded-full">
                    {usuarios[0].puntos} pts
                  </span>
                </div>
              </div>
            )}

            {usuarios.map((u, i) => (
              i > 0 && (
                <div
                  key={u._id}
                  className={`flex items-center justify-between px-5 py-3 border-b border-slate-700 ${
                    usuario?.nombre === u.nombre ? "bg-blue-600/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-center font-bold text-lg">{medalla(i)}</span>
                    <span className="font-semibold">{u.nombre}</span>
                  </div>
                  <span className="bg-slate-700 text-blue-400 font-bold text-sm px-3 py-1 rounded-full">
                    {u.puntos} pts
                  </span>
                </div>
              )
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Ranking;
