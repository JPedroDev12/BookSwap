import { avaliarForcaSenha } from "../utils/senha";

const ESTILO_POR_NIVEL = {
  fraca: { label: "Senha fraca", cor: "bg-red-500", texto: "text-red-400", largura: "w-1/3" },
  média: { label: "Senha média", cor: "bg-yellow-500", texto: "text-yellow-400", largura: "w-2/3" },
  forte: { label: "Senha forte", cor: "bg-green-500", texto: "text-green-400", largura: "w-full" },
};

function MedidorForcaSenha({ senha }) {
  if (!senha) return null;

  const { nivel, criterios } = avaliarForcaSenha(senha);
  const estilo = ESTILO_POR_NIVEL[nivel];

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${estilo.cor} ${estilo.largura}`} />
      </div>
      <span className={`text-xs font-semibold ${estilo.texto}`}>{estilo.label}</span>
      {nivel !== "forte" && (
        <span className="text-[11px] text-gray-400">
          Use pelo menos 8 caracteres, misturando maiúsculas, minúsculas, números e símbolos
          {!criterios.tamanhoMinimo ? " (faltam caracteres)" : ""}.
        </span>
      )}
    </div>
  );
}

export default MedidorForcaSenha;
