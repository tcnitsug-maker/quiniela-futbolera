import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [ranking, setRanking] = useState([]);

  // Cargar el ranking público al abrir la página
  useEffect(() => {
    api.get("/auth/ranking")
      .then((res) => setRanking(res.data))
      .catch(() => {});
  }, []);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  const medalla = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">

        {/* Columna izquierda: Login */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <h1 className="text-3xl font-extrabold text-center text-white mb-1">⚽ Quiniela 2026</h1>
          <p className="text-center text-slate-400 mb-6">Inicia sesión para jugar</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={enviar} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              required
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
            >
              {cargando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-blue-400 font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>

        {/* Columna derecha: Tabla pública */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-extrabold text-white mb-4 text-center">🏆 Tabla General</h2>

          {ranking.length === 0 ? (
            <p className="text-slate-400 text-center py-6">Aún no hay jugadores registrados</p>
          ) : (
            <div className="overflow-hidden rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2 px-2 font-semibold">#</th>
                    <th className="text-left py-2 px-2 font-semibold">Jugador</th>
                    <th className="text-center py-2 px-2 font-semibold">Aciertos</th>
                    <th className="text-right py-2 px-2 font-semibold">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((u, i) => (
                    <tr key={u._id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-2 px-2 font-bold">{medalla(i)}</td>
                      <td className="py-2 px-2 font-semibold text-white">{u.nombre}</td>
                      <td className="py-2 px-2 text-center text-green-400 font-bold">{u.aciertos ?? 0}</td>
                      <td className="py-2 px-2 text-right">
                        <span className="bg-slate-700 text-blue-400 font-bold px-2 py-1 rounded-full">
                          {u.puntos}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-center text-slate-500 text-xs mt-4">
            {ranking.length} jugador{ranking.length === 1 ? "" : "es"} registrado{ranking.length === 1 ? "" : "s"}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
