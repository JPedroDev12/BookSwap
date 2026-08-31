import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaUndo } from "react-icons/fa";
import { IoClose, IoChatbubbleOutline } from "react-icons/io5";
import { HiHeart } from "react-icons/hi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchAPI } from "../api";

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "0,00";
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Swapping() {
  const navigate = useNavigate();

  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const [fila, setFila] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [reagindo, setReagindo] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);
  const [matchesNaoVistos, setMatchesNaoVistos] = useState(0);
  const [match, setMatch] = useState(null);

  const chaveMatchesVistos = usuario?.id ? `matchesVistos_${usuario.id}` : null;

  useEffect(() => {
    if (!usuario?.id) {
      navigate("/pLogin");
    }
  }, [usuario, navigate]);

  const carregarFila = useCallback(async () => {
    if (!usuario?.id) return;

    setCarregando(true);
    setErro("");

    try {
      const [trocasResposta, reacoesResposta] = await Promise.all([
        fetchAPI("/bookTrades"),
        fetchAPI(`/swapping/${usuario.id}`).catch(() => ({ swappings: [] })),
      ]);

      const trocas = trocasResposta.trades || [];
      const jaReagidos = new Set(
        (reacoesResposta.swappings || []).map((s) => s.book_trade_id)
      );

      const disponiveis = trocas.filter(
        (troca) => troca.owner_id !== usuario.id && !jaReagidos.has(troca.id)
      );

      setFila(disponiveis);
    } catch (err) {
      setErro(err.message || "Não foi possível carregar os livros para troca.");
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  const carregarMatches = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      const resposta = await fetchAPI(`/matches/${usuario.id}`);
      const total = (resposta.matches || []).length;
      setTotalMatches(total);

      const vistos = Number(localStorage.getItem(chaveMatchesVistos)) || 0;
      setMatchesNaoVistos(Math.max(total - vistos, 0));
    } catch {
      // Notificações extras
    }
  }, [usuario, chaveMatchesVistos]);

  function abrirChat() {
    if (chaveMatchesVistos) {
      localStorage.setItem(chaveMatchesVistos, String(totalMatches));
    }
    setMatchesNaoVistos(0);
  }

  useEffect(() => {
    carregarFila();
    carregarMatches();
  }, [carregarFila, carregarMatches]);

  const cartaAtual = fila[0];

  async function reagir(action) {
    if (!cartaAtual || reagindo) return;

    setReagindo(true);
    try {
      const resposta = await fetchAPI("/swapping", {
        method: "POST",
        body: JSON.stringify({
          swapping_id: usuario.id,
          book_trade_id: cartaAtual.id,
          action,
        }),
      });

      setHistorico((antigo) => [...antigo, cartaAtual]);
      setFila((antigo) => antigo.slice(1));

      if (resposta.match) {
        setMatch({ username: cartaAtual.username, chat_id: resposta.chat_id });
        carregarMatches();
      }
    } catch (err) {
      setErro(err.message || "Não foi possível registrar sua reação.");
    } finally {
      setReagindo(false);
    }
  }

  async function desfazer() {
    if (!historico.length || reagindo) return;

    setReagindo(true);
    try {
      await fetchAPI(`/swapping/undo/${usuario.id}`, { method: "DELETE" });

      const ultimaCarta = historico[historico.length - 1];
      setHistorico((antigo) => antigo.slice(0, -1));
      setFila((antigo) => [ultimaCarta, ...antigo]);
    } catch (err) {
      setErro(err.message || "Não foi possível desfazer a última reação.");
    } finally {
      setReagindo(false);
    }
  }

  if (!usuario?.id) {
    return null;
  }

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col">
      <Header />

      <div className="flex items-center justify-between px-5 md:px-10 max-w-3xl mx-auto w-full mt-6">
        <Link
          to="/"
          className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-[#2A6183] shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Voltar"
        >
          <FaArrowRight className="rotate-180" />
        </Link>

        <h1 className="text-xl md:text-2xl font-bold text-[#1F4959]">Swapping</h1>

        <Link
          to="/chat"
          onClick={abrirChat}
          className="relative w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-[#2A6183] shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Abrir conversas"
        >
          <IoChatbubbleOutline className="text-xl" />
          {matchesNaoVistos > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E14848] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {matchesNaoVistos}
            </span>
          )}
        </Link>
      </div>

      <main className="flex-1 flex flex-col items-center px-5 py-8 gap-6">
        {erro && (
          <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="w-full max-w-sm h-105 rounded-3xl bg-gray-100 animate-pulse" />
        ) : (
          <>
            {cartaAtual ? (
              <div className="relative w-full max-w-sm">
                <div className="w-full h-105 rounded-3xl overflow-hidden border border-gray-200 shadow-xl/20 relative bg-gray-200">
                  {cartaAtual.cover_url ? (
                    <img
                      src={cartaAtual.cover_url}
                      alt={cartaAtual.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      Sem capa disponível
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/85 via-black/50 to-transparent text-white p-5 pt-16">
                    <p className="font-bold text-lg leading-tight">{cartaAtual.title}</p>
                    {(cartaAtual.author || cartaAtual.genre) && (
                      <p className="text-xs text-gray-200 mt-0.5">
                        {[cartaAtual.author, cartaAtual.genre].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {cartaAtual.description && (
                      <p className="text-sm text-gray-100 mt-2 line-clamp-2">
                        {cartaAtual.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-300 mt-2">
                      Ofertado por <span className="font-semibold">{cartaAtual.username}</span>
                      {Number(cartaAtual.price) > 0 && (
                        <> · R$ {formatarPreco(cartaAtual.price)}</>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => reagir("skip")}
                  disabled={reagindo}
                  className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-[#2A6183] hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  aria-label="Pular livro"
                  title="Pular"
                >
                  <FaArrowRight />
                </button>
              </div>
            ) : (
              <div className="max-w-sm w-full text-center flex flex-col items-center gap-3 py-16">
                <p className="text-2xl">📚</p>
                <h2 className="text-xl font-bold text-[#1F4959]">
                  Sem novos livros por enquanto
                </h2>
                <p className="text-gray-500 text-sm">
                  Volte mais tarde ou ofereça mais livros seus no perfil para atrair novas trocas.
                </p>
                {/* Garanta que este caminho seja idêntico ao "path" no seu arquivo App.jsx / Roteador */}
                <Link
                  to={`/pPerfil/${usuario.id}`}
                  className="mt-3 py-2 px-5 rounded-2xl text-white bg-[#2A6183] hover:bg-[#1F4959] transition-colors"
                >
                  Ir para o perfil
                </Link>
              </div>
            )}

            <div className="flex items-center gap-6">
              {cartaAtual && (
                <button
                  type="button"
                  onClick={() => reagir("dislike")}
                  disabled={reagindo}
                  className="w-14 h-14 rounded-full bg-white border-2 border-red-400 text-red-500 flex items-center justify-center text-2xl shadow-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
                  aria-label="Não curtir"
                >
                  <IoClose />
                </button>
              )}

              <button
                type="button"
                onClick={desfazer}
                disabled={reagindo || !historico.length}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 text-gray-500 flex items-center justify-center text-lg shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
                aria-label="Desfazer"
                title="Desfazer última reação"
              >
                <FaUndo />
              </button>

              {cartaAtual && (
                <button
                  type="button"
                  onClick={() => reagir("like")}
                  disabled={reagindo}
                  className="w-14 h-14 rounded-full bg-white border-2 border-[#3B7389] text-[#2A6183] flex items-center justify-center text-2xl shadow-sm hover:bg-blue-50 disabled:opacity-50 transition-colors"
                  aria-label="Curtir"
                >
                  <HiHeart />
                </button>
              )}
            </div>

            {cartaAtual && (
              <p className="text-sm text-gray-500">
                {fila.length} livro{fila.length === 1 ? "" : "s"} restante
                {fila.length === 1 ? "" : "s"} para avaliar
              </p>
            )}
          </>
        )}
      </main>

      {match && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-5 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-3">
            <HiHeart className="text-5xl text-[#E14848]" />
            <h2 className="text-2xl font-bold text-[#1F4959]">Deu Match!</h2>
            <p className="text-gray-600">
              Você e <span className="font-semibold">{match.username}</span> curtiram livros um do outro.
              Agora vocês podem combinar a troca.
            </p>
            <button
              type="button"
              onClick={() => setMatch(null)}
              className="mt-3 py-2 px-6 rounded-2xl text-white bg-[#2A6183] hover:bg-[#1F4959] transition-colors w-full"
            >
              Continuar Trocando
            </button>
            {match.chat_id && (
              <button
                type="button"
                onClick={() => {
                  abrirChat();
                  navigate(`/chat/${match.chat_id}`);
                }}
                className="py-2 px-6 rounded-2xl text-[#2A6183] border-2 border-[#2A6183] hover:bg-blue-50 transition-colors w-full"
              >
                Ir para o Chat
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Swapping;