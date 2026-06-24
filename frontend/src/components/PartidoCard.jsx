// Tarjeta de un partido. Si onPronostico se pasa, muestra botones L/E/V.
function PartidoCard({ partido, seleccion, onPronostico, bloqueado = false }) {
  const colorEstado = {
    pendiente: "border-blue-500",
    en_vivo: "border-red-500",
    finalizado: "border-green-500"
  }[partido.estado] || "border-slate-600";

  const opciones = [
    { valor: "1", label: "L", titulo: partido.local },
    { valor: "X", label: "E", titulo: "Empate" },
    { valor: "2", label: "V", titulo: partido.visitante }
  ];

  return (
    <div className={`bg-slate-800 rounded-xl p-4 border-l-4 ${colorEstado} shadow-lg ${bloqueado ? "opacity-70" : ""}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {partido.logoLocal && (
            <img src={partido.logoLocal} alt="" className="w-8 h-8 object-contain" />
          )}
          <span className="text-sm font-semibold truncate">{partido.local}</span>
        </div>

        <span className="text-xs text-slate-400 font-bold px-2">VS</span>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-semibold truncate text-right">{partido.visitante}</span>
          {partido.logoVisitante && (
            <img src={partido.logoVisitante} alt="" className="w-8 h-8 object-contain" />
          )}
        </div>
      </div>

      {bloqueado && (
        <div className="bg-amber-500/20 border border-amber-500 text-amber-300 text-xs rounded px-2 py-1 mb-2 text-center">
          🔒 Pronóstico bloqueado
        </div>
      )}

      {partido.estado === "pendiente" && onPronostico && (
        <div className="grid grid-cols-3 gap-2">
          {opciones.map((o) => (
            <button
              key={o.valor}
              onClick={() => onPronostico(partido._id, o.valor)}
              disabled={bloqueado}
              title={bloqueado ? "Este pronóstico está bloqueado" : o.titulo}
              className={`py-2 rounded-lg font-bold text-sm transition ${
                seleccion === o.valor
                  ? "bg-blue-600 text-white ring-2 ring-blue-400"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              } ${bloqueado ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {partido.estado === "en_vivo" && (
        <div className="text-center py-2 text-red-400 font-bold animate-pulse">
          🔴 EN VIVO {partido.golesLocal !== null && `· ${partido.golesLocal}-${partido.golesVisitante}`}
        </div>
      )}

      {partido.estado === "finalizado" && (
        <div className="text-center py-2">
          <span className="text-lg font-extrabold text-green-400">
            {partido.golesLocal}-{partido.golesVisitante}
          </span>
          <span className="text-xs text-slate-400 ml-2">Final</span>
        </div>
      )}
    </div>
  );
}

export default PartidoCard;
