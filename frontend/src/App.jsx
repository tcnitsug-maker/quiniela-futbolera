import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Quiniela from "./pages/Quiniela";
import Ranking from "./pages/Ranking";
import EnVivo from "./pages/EnVivo";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function Privado({ children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/" replace />;
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Privado><Dashboard /></Privado>} />
        <Route path="/quiniela" element={<Privado><Quiniela /></Privado>} />
        <Route path="/ranking" element={<Privado><Ranking /></Privado>} />
        <Route path="/envivo" element={<Privado><EnVivo /></Privado>} />
        <Route path="/admin" element={<Privado><Admin /></Privado>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
