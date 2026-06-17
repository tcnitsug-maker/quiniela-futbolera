import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ nombre: "", correo: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setCargando(true);
    try {
      // El backend devuelve el usuario + token al registrar
      const { data } = await api.post("/auth/registrar", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Error al registrarse");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-700">
        <h1 className="text-3xl font-extrabold text-center text-white mb-1">📝 Crear cuenta</h1>
        <p className="text-center text-slate-400 mb-6">Únete a la quiniela</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={enviar} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
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
            placeholder="Contraseña (mín. 6 caracteres)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={cargando}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
          >
            {cargando ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-blue-400 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
