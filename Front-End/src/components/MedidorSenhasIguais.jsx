// Indicador visual de "as senhas coincidem?", no mesmo estilo do
// MedidorForcaSenha (barrinha + texto), pra manter a identidade visual
// do formulário de cadastro.

function MedidorSenhasIguais({ senha, confirmacao }) {
  if (!confirmacao) return null;

  const coincidem = senha === confirmacao;

  const estilo = coincidem
    ? { label: "As senhas coincidem", cor: "bg-green-500", texto: "text-green-400", largura: "w-full" }
    : { label: "As senhas não coincidem", cor: "bg-red-500", texto: "text-red-400", largura: "w-2/4" };

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${estilo.cor} ${estilo.largura}`} />
      </div>
      <span className={`text-xs font-semibold ${estilo.texto}`}>{estilo.label}</span>
    </div>
  );
}

export default MedidorSenhasIguais;
