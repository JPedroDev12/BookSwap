import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoSend, IoSearch, IoArrowBack } from "react-icons/io5";
import Header from "../components/Header";
import { fetchAPI, socket } from "../api";

function iniciais(nome) {
  if (!nome) return "?";
  return nome.trim().charAt(0).toUpperCase();
}

function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const [contatos, setContatos] = useState([]);
  const [carregandoContatos, setCarregandoContatos] = useState(true);
  const [erroContatos, setErroContatos] = useState("");
  const [busca, setBusca] = useState("");
  const [contatoDireto, setContatoDireto] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const fimDasMensagens = useRef(null);

  useEffect(() => {
    if (!usuario?.id) {
      navigate("/pLogin");
    }
  }, [usuario, navigate]);

  const carregarContatos = useCallback(async () => {
    if (!usuario?.id) return;
    setCarregandoContatos(true);
    setErroContatos("");
    try {
      const resposta = await fetchAPI(`/chats/${usuario.id}`);
      setContatos(resposta.chats || []);
    } catch (err) {
      setErroContatos(err.message || "Não foi possível carregar suas conversas.");
    } finally {
      setCarregandoContatos(false);
    }
  }, [usuario]);

  useEffect(() => {
    carregarContatos();
  }, [carregarContatos]);

  const contatoDaLista = useMemo(
    () => contatos.find((c) => String(c.id) === String(id)) || null,
    [contatos, id]
  );

  // se a conversa foi aberta direto por um link (ex: modal de match) antes
  // da lista de contatos ainda ter sido recarregada, busca ela sozinha
  useEffect(() => {
    setContatoDireto(null);
    if (!id || !usuario?.id || contatoDaLista) return;

    fetchAPI(`/chats/single/${id}`)
      .then((resposta) => setContatoDireto(resposta.data))
      .catch((err) => setErro(err.message || "Não foi possível abrir essa conversa."));
  }, [id, usuario, contatoDaLista]);

  const contatoAtivo = contatoDaLista || contatoDireto;

  useEffect(() => {
    if (!id || !usuario?.id) return;

    setMensagens([]);
    setErro("");
    socket.emit("joinChat", { chat_id: Number(id), user_id: usuario.id });

    function aoReceberAntigas(antigas) {
      setMensagens(antigas || []);
    }
    function aoReceberNova(nova) {
      if (Number(nova.chat_id) === Number(id)) {
        setMensagens((atual) => [...atual, nova]);
      }
      carregarContatos();
    }
    function aoDarErro(mensagemErro) {
      setErro(mensagemErro);
    }

    socket.on("previousMessages", aoReceberAntigas);
    socket.on("receivedMessage", aoReceberNova);
    socket.on("chatError", aoDarErro);

    return () => {
      socket.emit("leaveChat", Number(id));
      socket.off("previousMessages", aoReceberAntigas);
      socket.off("receivedMessage", aoReceberNova);
      socket.off("chatError", aoDarErro);
    };
  }, [id, usuario, carregarContatos]);

  useEffect(() => {
    fimDasMensagens.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function enviarMensagem(e) {
    e.preventDefault();
    if (!texto.trim() || !id) return;

    socket.emit("sendMessage", {
      chat_id: Number(id),
      author_id: usuario.id,
      message: texto.trim(),
    });

    setTexto("");
  }

  const contatosFiltrados = contatos.filter((c) =>
    (c.other_username || "").toLowerCase().includes(busca.toLowerCase())
  );

  if (!usuario?.id) {
    return null;
  }

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col bg-[#EEEEEE]">
      <Header />

      <div className="flex-1 flex w-full max-w-6xl mx-auto md:my-6 md:rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        {/* contatos = usuários com quem deu match */}
        <aside
          className={`w-full md:w-80 shrink-0 bg-white border-r border-gray-200 flex-col ${
            id ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar conversa..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-[#4693DA]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {carregandoContatos ? (
              <p className="text-center text-sm text-gray-400 py-6">Carregando...</p>
            ) : erroContatos ? (
              <p className="text-center text-sm text-red-500 py-6 px-4">{erroContatos}</p>
            ) : contatosFiltrados.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6 px-4">
                Você ainda não deu match com ninguém. Curta livros no Swapping para começar a conversar.
              </p>
            ) : (
              contatosFiltrados.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate(`/chat/${c.id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    String(c.id) === String(id) ? "bg-blue-50" : ""
                  }`}
                >
                  {c.other_photo_url ? (
                    <img
                      src={c.other_photo_url}
                      alt={c.other_username}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#2A6183] text-white flex items-center justify-center font-bold shrink-0">
                      {iniciais(c.other_username)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1F4959] truncate">{c.other_username}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {c.last_message || "Vocês deram match! Diga oi 👋"}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* conversa ativa */}
        <section className={`flex-1 flex-col bg-[#EEEEEE] ${id ? "flex" : "hidden md:flex"}`}>
          {!id || !contatoAtivo ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm px-6 text-center">
              {erro || "Selecione uma conversa para começar."}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="md:hidden text-[#2A6183]"
                  aria-label="Voltar"
                >
                  <IoArrowBack className="text-xl" />
                </button>
                {contatoAtivo.other_photo_url ? (
                  <img
                    src={contatoAtivo.other_photo_url}
                    alt={contatoAtivo.other_username}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#2A6183] text-white flex items-center justify-center font-bold text-sm">
                    {iniciais(contatoAtivo.other_username)}
                  </div>
                )}
                <p className="font-semibold text-[#1F4959]">{contatoAtivo.other_username}</p>
              </div>

              {erro && (
                <div className="bg-red-50 border-b border-red-200 text-red-600 text-xs text-center py-2 px-4">
                  {erro}
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                {mensagens.map((m) => {
                  const minhaMsg = m.author_id === usuario.id;
                  return (
                    <div
                      key={m.id}
                      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm warp-break-words ${
                        minhaMsg
                          ? "self-end bg-[#2A6183] text-white rounded-br-sm"
                          : "self-start bg-white text-gray-800 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {m.message}
                    </div>
                  );
                })}
                <div ref={fimDasMensagens} />
              </div>

              <form
                onSubmit={enviarMensagem}
                className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200"
              >
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-[#4693DA]"
                />
                <button
                  type="submit"
                  disabled={!texto.trim()}
                  className="w-10 h-10 rounded-full bg-[#2A6183] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#1F4959] transition-colors shrink-0"
                  aria-label="Enviar"
                >
                  <IoSend />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Chat;
