import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/");
  };

  const links = [
    { to: "/dashboard", label: "Inicio" },
    { to: "/quiniela", label: "Quiniela" },
    { to: "/ranking", label: "Ranking" },
    { to: "/envivo", label: "En Vivo" }
  ];

  // Agregar Admin solo si el usuario es administrador
  if (usuario?.rol === "admin") {
    links.push({ to: "/admin", label: "🛠️ Admin" });
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <span className="text-xl font-extrabold text-white">⚽ MUNDIAL 2026</span>

        <div className="flex items-center gap-1 flex-wrap">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                location.pathname === l.to
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">
            {usuario?.nombre} · <span className="text-blue-400 font-bold">{usuario?.puntos ?? 0} pts</span>
          </span>
          <button
            onClick={salir}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
