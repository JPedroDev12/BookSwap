import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaStar, FaRegStar, FaSearch } from "react-icons/fa";
import { IoSwapHorizontalOutline, IoCloseOutline } from "react-icons/io5";
import Header from "../components/Header";
import { fetchAPI } from "../api";
import { redimensionarImagem } from "../utils/imagem";

// Precisa bater com o ENUM da coluna `status` de user_book no banco.
const legendaCores = [
  { status: "Não Gostei", label: "Não Gostei", cor: "#E06467" },
  { status: "Gostei", label: "Gostei", cor: "#86D67D" },
  { status: "Lidos", label: "Lidos", cor: "#63A8DE" },
  { status: "Lendo", label: "Lendo", cor: "#D3AE56" },
  { status: "Quero ler", label: "Quero Ler", cor: "#C472E0" },
];

const corPorStatus = (status) =>
  legendaCores.find((item) => item.status === status)?.cor || "#4B5563";

function Perfil() {
  const navigate = useNavigate();
  const { id } = useParams();
  const inputFotoRef = useRef(null);
  const inputCapaRef = useRef(null);

  // Id do usuário logado (não muda quando visitamos o perfil de outra
  // pessoa) — usado só para decidir se este é "meu perfil" ou não.
  const meuUsuarioId = useMemo(() => {
    try {
      const dados = JSON.parse(localStorage.getItem("user")) || {};
      return dados.id;
    } catch {
      return undefined;
    }
  }, []);

  const [usuario, setUsuario] = useState(() => {
    const dadosUsuario = JSON.parse(localStorage.getItem("user")) || {};
    return {
      id: dadosUsuario.id,
      nome: dadosUsuario.nome || dadosUsuario.username || dadosUsuario.name || "Usuário",
      fotoUrl: dadosUsuario.photo_url || dadosUsuario.fotoUrl || "",
      sobreMim: dadosUsuario.description || dadosUsuario.sobreMim || "",
    };
  });

  const [editando, setEditando] = useState(false);
  const [formTemp, setFormTemp] = useState(usuario);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  // Importante: compara com o id de quem está logado, não com `usuario.id`
  // — depois que o perfil de outra pessoa termina de carregar, `usuario`
  // passa a representar os dados DELA, então comparar com `usuario.id`
  // faria esta checagem virar `true` por engano e liberaria edição.
  const ehMeuPerfil = !id || String(id) === String(meuUsuarioId);
  const idPerfilVisitado = id || meuUsuarioId;

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const resposta = await fetchAPI(`/users/${id}`);
        setUsuario({
          id: resposta.data.id,
          nome: resposta.data.username,
          fotoUrl: resposta.data.photo_url || "",
          sobreMim: resposta.data.description || "",
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (id && id !== String(meuUsuarioId)) {
      carregarPerfil();
    }
  }, [id, meuUsuarioId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleFotoClick = () => {
    if (editando) {
      inputFotoRef.current.click();
    }
  };

  const handleMudarFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArquivoSelecionado(file);
    setErro("");

    try {
      const dataUrl = await redimensionarImagem(file, 512, 0.82);
      setFormTemp((prev) => ({ ...prev, fotoUrl: dataUrl }));
    } catch (err) {
      setErro(err.message || "Não foi possível carregar a imagem selecionada.");
    }
  };

  const handleEditarClick = async () => {
    if (!editando) {
      setFormTemp(usuario);
      setErro("");
      setEditando(true);
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      await fetchAPI(`/users/${usuario.id}`, {
        method: "PUT",
        body: JSON.stringify({ username: formTemp.nome }),
      });

      let paginaExistente = null;
      try {
        const resposta = await fetchAPI(`/userPage/${usuario.id}`);
        paginaExistente = resposta.data;
      } catch (err) {
        paginaExistente = null;
      }

      const bodyPagina = {
        description: formTemp.sobreMim,
        photo_url: formTemp.fotoUrl,
      };

      if (paginaExistente) {
        await fetchAPI(`/userPage/${paginaExistente.id}`, {
          method: "PUT",
          body: JSON.stringify(bodyPagina),
        });
      } else {
        await fetchAPI(`/userPage`, {
          method: "POST",
          body: JSON.stringify({
            user_id: usuario.id,
            ...bodyPagina
          }),
        });
      }

      const usuarioAtualizado = { ...usuario, ...formTemp };
      setUsuario(usuarioAtualizado);

      const dadosAtuais = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...dadosAtuais,
          username: formTemp.nome,
          nome: formTemp.nome,
          photo_url: formTemp.fotoUrl,
          fotoUrl: formTemp.fotoUrl,
          description: formTemp.sobreMim,
          sobreMim: formTemp.sobreMim,
        })
      );

      window.dispatchEvent(new Event("usuarioAtualizado"));
      setEditando(false);
      setArquivoSelecionado(null);
    } catch (err) {
      console.error(err);
      setErro(err.message || "Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    setFormTemp(usuario);
    setArquivoSelecionado(null);
    setErro("");
    setEditando(false);
  };

  // ---------------------------------------------------------------------
  // Estante de livros do perfil
  // ---------------------------------------------------------------------
  const [livros, setLivros] = useState([]);
  const [carregandoLivros, setCarregandoLivros] = useState(false);
  const [erroLivros, setErroLivros] = useState("");
  const [trocasPorLivro, setTrocasPorLivro] = useState({}); // { book_id: trade_id }
  const [filtrosAtivos, setFiltrosAtivos] = useState(() => new Set());
  const [alternandoTroca, setAlternandoTroca] = useState(null); // book_id em andamento

  const carregarLivros = useCallback(async (userId) => {
    if (!userId) return;
    setCarregandoLivros(true);
    setErroLivros("");
    try {
      const resposta = await fetchAPI(`/userBook/${userId}`);
      setLivros(resposta.books || []);
    } catch (err) {
      console.error(err);
      setErroLivros("Não foi possível carregar os livros deste perfil.");
    } finally {
      setCarregandoLivros(false);
    }
  }, []);

  const carregarTrocas = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const resposta = await fetchAPI(`/bookTrades`);
      const minhas = (resposta.trades || []).filter((t) => t.owner_id === Number(userId));
      const mapa = {};
      minhas.forEach((t) => {
        mapa[t.book_id] = t.id;
      });
      setTrocasPorLivro(mapa);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (idPerfilVisitado) {
      carregarLivros(idPerfilVisitado);
      carregarTrocas(idPerfilVisitado);
    }
  }, [idPerfilVisitado, carregarLivros, carregarTrocas]);

  const estatisticas = useMemo(() => {
    const contagem = (status) => livros.filter((l) => l.status === status).length;
    return [
      { label: "Quero Ler", valor: contagem("Quero ler") },
      { label: "Lidos", valor: contagem("Lidos") },
      { label: "Lendo", valor: contagem("Lendo") },
      { label: "Não Gostei", valor: contagem("Não Gostei") },
      { label: "Avaliados", valor: livros.filter((l) => l.rating).length },
    ];
  }, [livros]);

  const livrosFiltrados = useMemo(() => {
    if (filtrosAtivos.size === 0) return livros;
    return livros.filter((l) => filtrosAtivos.has(l.status));
  }, [livros, filtrosAtivos]);

  const alternarFiltro = (status) => {
    setFiltrosAtivos((prev) => {
      const novo = new Set(prev);
      if (novo.has(status)) {
        novo.delete(status);
      } else {
        novo.add(status);
      }
      return novo;
    });
  };

  const mudarStatusLivro = async (userBookId, novoStatus) => {
    const anterior = livros;
    setLivros((prev) =>
      prev.map((l) => (l.user_book_id === userBookId ? { ...l, status: novoStatus } : l))
    );
    try {
      await fetchAPI(`/userBook/${userBookId}`, {
        method: "PUT",
        body: JSON.stringify({ status: novoStatus }),
      });
    } catch (err) {
      console.error(err);
      setLivros(anterior);
    }
  };

  const avaliarLivro = async (userBookId, nota) => {
    const livroAtual = livros.find((l) => l.user_book_id === userBookId);
    const novaNota = livroAtual?.rating === nota ? null : nota;
    const anterior = livros;
    setLivros((prev) =>
      prev.map((l) => (l.user_book_id === userBookId ? { ...l, rating: novaNota } : l))
    );
    try {
      await fetchAPI(`/userBook/${userBookId}`, {
        method: "PUT",
        body: JSON.stringify({ rating: novaNota }),
      });
    } catch (err) {
      console.error(err);
      setLivros(anterior);
    }
  };

  const removerLivro = async (userBookId) => {
    if (!window.confirm("Remover este livro do seu perfil?")) return;
    const anterior = livros;
    setLivros((prev) => prev.filter((l) => l.user_book_id !== userBookId));
    try {
      await fetchAPI(`/userBook/${userBookId}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      setErroLivros("Não foi possível remover o livro. Tente novamente.");
      setLivros(anterior);
    }
  };

  const alternarTrocaLivro = async (livro) => {
    setAlternandoTroca(livro.id);
    try {
      const tradeId = trocasPorLivro[livro.id];
      if (tradeId) {
        await fetchAPI(`/bookTrades/${tradeId}`, { method: "DELETE" });
        setTrocasPorLivro((prev) => {
          const novo = { ...prev };
          delete novo[livro.id];
          return novo;
        });
      } else {
        const resposta = await fetchAPI(`/bookTrades`, {
          method: "POST",
          body: JSON.stringify({ book_id: livro.id }),
        });
        const novoId = resposta.data?.id;
        setTrocasPorLivro((prev) => ({ ...prev, [livro.id]: novoId }));
      }
    } catch (err) {
      console.error(err);
      setErroLivros(err.message || "Não foi possível atualizar a oferta de troca.");
    } finally {
      setAlternandoTroca(null);
    }
  };

  const [modalAberto, setModalAberto] = useState(false);
  const [abaModal, setAbaModal] = useState("buscar"); // "buscar" | "novo"
  const [busca, setBusca] = useState("");
  const [catalogo, setCatalogo] = useState([]);
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(false);
  const [statusEscolhido, setStatusEscolhido] = useState("Quero ler");
  const [enviandoLivro, setEnviandoLivro] = useState(false);
  const [erroModal, setErroModal] = useState("");
  const [novoLivro, setNovoLivro] = useState({
    title: "",
    author: "",
    genre: "",
    cover_url: "",
    year_published: "",
    description: "",
  });

  const abrirModal = async () => {
    setModalAberto(true);
    setAbaModal("buscar");
    setBusca("");
    setStatusEscolhido("Quero ler");
    setErroModal("");
    if (catalogo.length === 0) {
      setCarregandoCatalogo(true);
      try {
        const resposta = await fetchAPI(`/books`);
        setCatalogo(resposta.books || []);
      } catch (err) {
        console.error(err);
        setErroModal("Não foi possível carregar o catálogo de livros.");
      } finally {
        setCarregandoCatalogo(false);
      }
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setNovoLivro({ title: "", author: "", genre: "", cover_url: "", year_published: "", description: "" });
  };

  const idsJaAdicionados = useMemo(() => new Set(livros.map((l) => l.id)), [livros]);

  // Deleta o livro permanentemente do banco (não apenas do perfil).
  // Só é permitido para livros criados pelo próprio usuário logado —
  // o backend também valida isso (403 caso contrário), então o botão
  // aqui é escondido/desabilitado apenas como reforço de UX.
  const [deletandoLivroId, setDeletandoLivroId] = useState(null);

  const deletarLivroPermanente = async (livroCatalogo) => {
    if (meuUsuarioId === undefined || Number(livroCatalogo.user_id) !== Number(meuUsuarioId)) return;

    const confirmado = window.confirm(
      `Tem certeza que deseja excluir "${livroCatalogo.title}" permanentemente?\n\nEsta ação apaga o livro do banco de dados para todos os usuários e não pode ser desfeita.`
    );
    if (!confirmado) return;

    setDeletandoLivroId(livroCatalogo.id);
    setErroModal("");
    try {
      await fetchAPI(`/books/${livroCatalogo.id}`, { method: "DELETE" });

      // Remove do catálogo do modal e, caso estivesse na própria estante,
      // remove de lá também (o backend já apagou o vínculo user_book).
      setCatalogo((prev) => prev.filter((b) => b.id !== livroCatalogo.id));
      setLivros((prev) => prev.filter((l) => l.id !== livroCatalogo.id));
      setTrocasPorLivro((prev) => {
        const novo = { ...prev };
        delete novo[livroCatalogo.id];
        return novo;
      });
    } catch (err) {
      console.error(err);
      setErroModal(err.message || "Não foi possível excluir este livro.");
    } finally {
      setDeletandoLivroId(null);
    }
  };

  const catalogoFiltrado = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return catalogo;
    return catalogo.filter(
      (b) =>
        b.title?.toLowerCase().includes(termo) ||
        b.author?.toLowerCase().includes(termo)
    );
  }, [catalogo, busca]);

  const adicionarLivroExistente = async (livroCatalogo) => {
    setEnviandoLivro(true);
    setErroModal("");
    try {
      const resposta = await fetchAPI(`/userBook`, {
        method: "POST",
        body: JSON.stringify({ book_id: livroCatalogo.id, status: statusEscolhido }),
      });
      setLivros((prev) => [
        {
          user_book_id: resposta.data.id,
          status: statusEscolhido,
          rating: null,
          ...livroCatalogo,
        },
        ...prev,
      ]);
      fecharModal();
    } catch (err) {
      console.error(err);
      setErroModal(err.message || "Não foi possível adicionar este livro.");
    } finally {
      setEnviandoLivro(false);
    }
  };

  const handleCapaNovoLivro = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await redimensionarImagem(file, 800, 0.82);
      setNovoLivro((prev) => ({ ...prev, cover_url: dataUrl }));
    } catch (err) {
      setErroModal(err.message || "Não foi possível carregar a imagem selecionada.");
    }
  };

  const criarLivroECadastrar = async (e) => {
    e.preventDefault();
    if (!novoLivro.title.trim()) {
      setErroModal("O título do livro é obrigatório.");
      return;
    }

    setEnviandoLivro(true);
    setErroModal("");
    try {
      const respostaLivro = await fetchAPI(`/books`, {
        method: "POST",
        body: JSON.stringify({
          title: novoLivro.title,
          author: novoLivro.author || null,
          genre: novoLivro.genre || null,
          cover_url: novoLivro.cover_url || null,
          description: novoLivro.description || null,
          year_published: novoLivro.year_published ? Number(novoLivro.year_published) : null,
          // Livro cadastrado direto pelo perfil fica só com o dono:
          // não deve aparecer no catálogo público da Loja.
          listed_in_store: false,
        }),
      });

      const livroCriado = respostaLivro.data;

      const respostaUserBook = await fetchAPI(`/userBook`, {
        method: "POST",
        body: JSON.stringify({ book_id: livroCriado.id, status: statusEscolhido }),
      });

      setLivros((prev) => [
        {
          user_book_id: respostaUserBook.data.id,
          status: statusEscolhido,
          rating: null,
          ...livroCriado,
        },
        ...prev,
      ]);
      setCatalogo((prev) => [livroCriado, ...prev]);
      fecharModal();
    } catch (err) {
      console.error(err);
      setErroModal(err.message || "Não foi possível cadastrar este livro.");
    } finally {
      setEnviandoLivro(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <section className="flex flex-col items-center gap-6 px-4 sm:px-6 md:px-10 py-8 md:py-6 text-center md:flex-row md:text-left md:gap-8">
        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
          <div 
            className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-full bg-white border-2 border-gray-400 shrink-0 overflow-hidden ${editando ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={handleFotoClick}
          >
            {(editando ? formTemp.fotoUrl : usuario.fotoUrl) && (
              <img
                src={editando ? formTemp.fotoUrl : usuario.fotoUrl}
                alt={usuario.nome}
                className="w-full h-full object-cover"
              />
            )}
            
            {editando && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                Trocar
              </div>
            )}
          </div>

          <input 
            type="file" 
            accept="image/*" 
            ref={inputFotoRef}
            className="hidden" 
            onChange={handleMudarFoto}
          />

          <div className="flex flex-col gap-2">
            {editando ? (
              <input
                type="text"
                value={formTemp.nome}
                onChange={(e) => setFormTemp((prev) => ({ ...prev, nome: e.target.value }))}
                className="text-2xl sm:text-3xl md:text-xl font-bold shrink-0 border border-gray-400 rounded-lg px-2 py-1 bg-transparent"
                placeholder="Seu nome"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl md:text-xl font-bold shrink-0">{usuario.nome}</h1>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:flex gap-x-4 gap-y-4 sm:gap-6 md:gap-0">
          {estatisticas.map((item, i) => (
            <div
              key={item.label}
              className={`flex flex-col gap-1 items-center px-2 md:px-4 ${
                i !== estatisticas.length - 1 ? "md:border-r md:border-gray-600" : ""
              }`}
            >
              <span className="text-gray-700 text-xs sm:text-sm">{item.label}</span>
              <span className="text-[#4693DA] font-bold text-lg">{item.valor}</span>
            </div>
          ))}
        </div>

        {ehMeuPerfil && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto md:ml-auto md:w-auto">
            {erro && <span className="text-red-500 text-xs self-center">{erro}</span>}

            <button
              type="button"
              onClick={handleEditarClick}
              disabled={salvando}
              className="flex items-center justify-center gap-2 text-sm text-gray-700 border border-gray-500 rounded-xl px-4 py-2 hover:bg-black/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              {editando ? (
                <>
                  <FaSave /> {salvando ? "Salvando..." : "Salvar"}
                </>
              ) : (
                <>
                  <FaEdit /> Editar Perfil
                </>
              )}
            </button>

            {editando && (
              <button
                type="button"
                onClick={handleCancelar}
                disabled={salvando}
                className="flex items-center justify-center gap-2 text-sm text-gray-500 border border-gray-400 rounded-xl px-4 py-2 hover:bg-black/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                <FaTimes /> Cancelar
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 text-sm text-red-500 px-4 py-2 border border-red-500 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Sair da Conta
            </button>
          </div>
        )}
      </section>

      <section className="flex flex-col lg:flex-row items-stretch gap-6 px-4 sm:px-6 md:px-10 pb-10">
        <div className="flex-1 bg-linear-to-br from-[#2C5364] to-[#0F2027] rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">
              Estante {filtrosAtivos.size > 0 && <span className="text-gray-400 font-normal text-sm">(filtrada)</span>}
            </h2>
            {erroLivros && <span className="text-red-400 text-xs">{erroLivros}</span>}
          </div>

          {carregandoLivros ? (
            <p className="text-gray-300 text-sm">Carregando livros...</p>
          ) : (
            <>
              {livrosFiltrados.length === 0 && (
                <p className="text-gray-400 text-sm mb-4">
                  {livros.length === 0
                    ? ehMeuPerfil
                      ? "Você ainda não adicionou nenhum livro. Use o botão abaixo para começar sua estante."
                      : "Este usuário ainda não adicionou nenhum livro."
                    : "Nenhum livro corresponde ao filtro selecionado."}
                </p>
              )}

              {(livrosFiltrados.length > 0 || ehMeuPerfil) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                  {livrosFiltrados.map((livro) => {
                const emTroca = Boolean(trocasPorLivro[livro.id]);
                return (
                  <div key={livro.user_book_id} className="flex flex-col gap-2 group">
                    <Link
                      to={`/livro/${livro.id}`}
                      className="relative aspect-2/3 rounded-lg overflow-hidden shadow-lg group-hover:scale-[1.03] transition-transform block"
                      style={{ backgroundColor: corPorStatus(livro.status) }}
                    >
                      {livro.cover_url && (
                        <img
                          src={livro.cover_url}
                          alt={livro.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span
                          className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/40 truncate max-w-[65%]"
                          title={livro.status}
                        >
                          {legendaCores.find((l) => l.status === livro.status)?.label || livro.status}
                        </span>

                        {ehMeuPerfil && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removerLivro(livro.user_book_id);
                            }}
                            className="text-white/80 hover:text-red-400 bg-black/40 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remover do perfil"
                          >
                            <FaTrash className="text-[10px]" />
                          </button>
                        )}
                      </div>

                      <span className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-semibold leading-tight drop-shadow">
                        {livro.title}
                      </span>
                    </Link>

                    <span className="text-gray-300 text-xs truncate">{livro.author || "Autor desconhecido"}</span>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((nota) => {
                        const Estrela = (livro.rating || 0) >= nota ? FaStar : FaRegStar;
                        return (
                          <button
                            key={nota}
                            type="button"
                            disabled={!ehMeuPerfil}
                            onClick={() => avaliarLivro(livro.user_book_id, nota)}
                            className={`text-[11px] ${ehMeuPerfil ? "cursor-pointer" : "cursor-default"} ${
                              (livro.rating || 0) >= nota ? "text-[#D3AE56]" : "text-gray-500"
                            }`}
                            title={ehMeuPerfil ? `Avaliar com ${nota} estrela(s)` : ""}
                          >
                            <Estrela />
                          </button>
                        );
                      })}
                    </div>

                    {ehMeuPerfil && (
                      <div className="flex items-center gap-1.5">
                        <select
                          value={livro.status}
                          onChange={(e) => mudarStatusLivro(livro.user_book_id, e.target.value)}
                          className="flex-1 text-[10px] bg-white/10 text-white border border-white/20 rounded-md px-1 py-0.5 cursor-pointer"
                        >
                          {legendaCores.map((item) => (
                            <option key={item.status} value={item.status} className="text-black">
                              {item.label}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => alternarTrocaLivro(livro)}
                          disabled={alternandoTroca === livro.id}
                          title={emTroca ? "Remover da troca" : "Ofertar para troca"}
                          className={`shrink-0 rounded-md p-1.5 border transition-colors cursor-pointer disabled:opacity-50 ${
                            emTroca
                              ? "bg-[#4693DA]/20 border-[#4693DA] text-[#4693DA]"
                              : "bg-white/10 border-white/20 text-gray-300 hover:text-white"
                          }`}
                        >
                          <IoSwapHorizontalOutline className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {ehMeuPerfil && (
                <button
                  type="button"
                  onClick={abrirModal}
                  className="aspect-2/3 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                >
                      <FaPlus className="text-2xl" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <aside className="w-full lg:w-80 shrink-0 bg-linear-to-b from-[#2C5364] to-[#0F2027] rounded-3xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold underline text-white underline-offset-4">Sobre Mim</h2>

          {editando ? (
            <textarea
              value={formTemp.sobreMim}
              onChange={(e) => setFormTemp((prev) => ({ ...prev, sobreMim: e.target.value }))}
              className="text-gray-200 text-[15px] leading-relaxed bg-transparent border border-white/30 rounded-lg p-2 resize-none min-h-25"
            />
          ) : (
            <p className="text-gray-200 text-[15px] leading-relaxed">
              {usuario.sobreMim || "Nenhuma descrição informada."}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-bold text-xl">Filtro</span>
              {filtrosAtivos.size > 0 && (
                <button
                  type="button"
                  onClick={() => setFiltrosAtivos(new Set())}
                  className="text-gray-400 hover:text-white text-xs underline cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {legendaCores.map((item) => {
                const ativo = filtrosAtivos.has(item.status);
                return (
                  <button
                    key={item.status}
                    type="button"
                    title={item.label}
                    onClick={() => alternarFiltro(item.status)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                      ativo ? "border-white scale-110" : "border-white/30 hover:border-white/60"
                    }`}
                    style={{ backgroundColor: item.cor }}
                  />
                );
              })}
            </div>
          </div>
        </aside>
      </section>

      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={fecharModal}
        >
          <div
            className="w-full max-w-lg bg-[#132C36] rounded-2xl p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Adicionar livro</h3>
              <button
                type="button"
                onClick={fecharModal}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
            </div>

            <div className="flex gap-2 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setAbaModal("buscar")}
                className={`text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  abaModal === "buscar" ? "bg-[#4693DA] text-white" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Buscar livro
              </button>
              <button
                type="button"
                onClick={() => setAbaModal("novo")}
                className={`text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  abaModal === "novo" ? "bg-[#4693DA] text-white" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Cadastrar novo livro
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Status na sua estante</label>
              <select
                value={statusEscolhido}
                onChange={(e) => setStatusEscolhido(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-2 py-1.5 text-sm cursor-pointer"
              >
                {legendaCores.map((item) => (
                  <option key={item.status} value={item.status} className="text-black">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {erroModal && <p className="text-red-400 text-xs">{erroModal}</p>}

            {abaModal === "buscar" ? (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por título ou autor..."
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-gray-400"
                  />
                </div>

                {carregandoCatalogo ? (
                  <p className="text-gray-300 text-sm">Carregando catálogo...</p>
                ) : catalogoFiltrado.length === 0 ? (
                  <p className="text-gray-400 text-sm">Nenhum livro encontrado. Tente cadastrar um novo.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                    {catalogoFiltrado.map((livro) => {
                      const jaAdicionado = idsJaAdicionados.has(livro.id);
                      const souCriador =
                        meuUsuarioId !== undefined && Number(livro.user_id) === Number(meuUsuarioId);
                      const deletando = deletandoLivroId === livro.id;
                      return (
                        <div
                          key={livro.id}
                          className="flex items-center gap-3 bg-white/5 rounded-lg p-2"
                        >
                          <div
                            className="w-8 h-11 rounded shrink-0 bg-gray-600 overflow-hidden"
                          >
                            {livro.cover_url && (
                              <img src={livro.cover_url} alt={livro.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{livro.title}</p>
                            <p className="text-gray-400 text-xs truncate">{livro.author || "Autor desconhecido"}</p>
                          </div>

                          {/* Deletar permanentemente: só aparece para quem criou o livro. */}
                          {souCriador && (
                            <button
                              type="button"
                              disabled={deletando || enviandoLivro}
                              onClick={() => deletarLivroPermanente(livro)}
                              title="Excluir livro permanentemente do banco de dados"
                              className="shrink-0 text-xs p-2 rounded-lg text-red-400 border border-red-500/40 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <FaTrash />
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={jaAdicionado || enviandoLivro || deletando}
                            onClick={() => adicionarLivroExistente(livro)}
                            className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[#4693DA] text-white hover:bg-[#357ab8] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {jaAdicionado ? "Adicionado" : "Adicionar"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={criarLivroECadastrar} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 text-xs">Título *</label>
                  <input
                    type="text"
                    value={novoLivro.title}
                    onChange={(e) => setNovoLivro((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-xs">Autor</label>
                    <input
                      type="text"
                      value={novoLivro.author}
                      onChange={(e) => setNovoLivro((prev) => ({ ...prev, author: e.target.value }))}
                      className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-xs">Gênero</label>
                    <input
                      type="text"
                      value={novoLivro.genre}
                      onChange={(e) => setNovoLivro((prev) => ({ ...prev, genre: e.target.value }))}
                      className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-xs">Ano de publicação</label>
                    <input
                      type="number"
                      value={novoLivro.year_published}
                      onChange={(e) => setNovoLivro((prev) => ({ ...prev, year_published: e.target.value }))}
                      className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-xs">Capa</label>
                    <button
                      type="button"
                      onClick={() => inputCapaRef.current.click()}
                      className="relative w-35 h-22 rounded-lg overflow-hidden bg-white/10 border border-white/20 border-dashed flex items-center justify-center text-gray-300 hover:bg-white/15 transition-colors cursor-pointer md:w-55"
                    >
                      {novoLivro.cover_url ? (
                        <img src={novoLivro.cover_url} alt="Capa selecionada" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] px-1 text-center">Escolher imagem</span>
                      )}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={inputCapaRef}
                      className="hidden"
                      onChange={handleCapaNovoLivro}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 text-xs">Descrição</label>
                  <textarea
                    value={novoLivro.description}
                    onChange={(e) => setNovoLivro((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm resize-none min-h-16"
                  />
                </div>
                <button
                  type="submit"
                  disabled={enviandoLivro}
                  className="mt-1 text-sm px-4 py-2 rounded-lg bg-[#4693DA] text-white hover:bg-[#357ab8] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {enviandoLivro ? "Cadastrando..." : "Cadastrar e adicionar ao perfil"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
