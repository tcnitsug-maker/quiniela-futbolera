import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get("/pronosticos/dashboard")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="text-slate-400">Cargando...</p>;
  if (!data) return <p className="text-slate-400">No hay datos todavía.</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-6">
        Hola, {data.usuario.nombre} 👋
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5 text-center border-t-4 border-blue-500">
          <p className="text-slate-400 text-sm">Puntos</p>
          <p className="text-3xl font-extrabold text-blue-400">{data.usuario.puntos}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 text-center border-t-4 border-green-500">
          <p className="text-slate-400 text-sm">Aciertos</p>
          <p className="text-3xl font-extrabold text-green-400">{data.aciertos}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 text-center border-t-4 border-purple-500">
          <p className="text-slate-400 text-sm">Pronósticos</p>
          <p className="text-3xl font-extrabold text-purple-400">{data.totalPronosticos}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-3">Mis pronósticos</h2>
      {data.pronosticos.length === 0 ? (
        <p className="text-slate-400">Aún no has hecho pronósticos. Ve a la sección Quiniela.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.pronosticos.map((p, i) => {
            const etiqueta = { "1": "Local", "X": "Empate", "2": "Visitante" }[p.tuPronostico] || p.tuPronostico;
            const borde = p.acierto === true ? "border-green-500" : p.estado === "finalizado" ? "border-red-500" : "border-slate-600";
            return (
              <div key={i} className={`bg-slate-800 rounded-lg p-4 border-l-4 ${borde} flex items-center justify-between flex-wrap gap-2`}>
                <span className="font-semibold text-sm">{p.local} vs {p.visitante}</span>
                <span className="text-sm text-slate-300">Tu: <strong className="text-blue-400">{etiqueta}</strong></span>
                <span className="text-sm text-slate-300">Marcador: <strong>{p.marcador}</strong></span>
                <span>
                  {p.acierto === true && <span className="text-green-400 font-bold">✅ +3</span>}
                  {p.acierto === false && p.estado === "finalizado" && <span className="text-red-400 font-bold">❌</span>}
                  {p.estado !== "finalizado" && <span className="text-slate-500">⏳</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
