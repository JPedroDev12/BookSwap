import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBook,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchAPI } from "../api";
import { redimensionarImagem } from "../utils/imagem";

const FORM_VAZIO = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  year_published: "",
  cover_url: "",
  description: "",
  price: "",
};

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "0,00";
  return numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Loja() {
  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");

  const [busca, setBusca] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("Todos");

  const [modalAberto, setModalAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState(null); // null = criando
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const [excluindoId, setExcluindoId] = useState(null);
  const inputCapaRef = useRef(null);

  async function carregarLivros() {
    setCarregando(true);
    setErroLista("");
    try {
      const resposta = await fetchAPI("/books?in_store=true");
      setLivros(resposta.books || []);
    } catch (err) {
      setErroLista(err.message || "Não foi possível carregar os livros da loja.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarLivros();
  }, []);

  const generos = useMemo(() => {
    const unicos = new Set(livros.map((l) => l.genre).filter(Boolean));
    return ["Todos", ...unicos];
  }, [livros]);

  const livrosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return livros.filter((livro) => {
      const bateGenero = generoFiltro === "Todos" || livro.genre === generoFiltro;
      const bateBusca =
        !termo ||
        livro.title?.toLowerCase().includes(termo) ||
        livro.author?.toLowerCase().includes(termo);
      return bateGenero && bateBusca;
    });
  }, [livros, busca, generoFiltro]);

  function abrirModalCriar() {
    setLivroEditando(null);
    setForm(FORM_VAZIO);
    setErroForm("");
    setModalAberto(true);
  }

  function abrirModalEditar(livro) {
    setLivroEditando(livro);
    setForm({
      title: livro.title || "",
      author: livro.author || "",
      genre: livro.genre || "",
      isbn: livro.isbn || "",
      year_published: livro.year_published || "",
      cover_url: livro.cover_url || "",
      description: livro.description || "",
      price: livro.price ?? "",
    });
    setErroForm("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;
    setModalAberto(false);
    setLivroEditando(null);
    setForm(FORM_VAZIO);
    setErroForm("");
  }

  async function handleCapaChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await redimensionarImagem(file, 800, 0.82);
      setForm((p) => ({ ...p, cover_url: dataUrl }));
    } catch (err) {
      setErroForm(err.message || "Não foi possível carregar a imagem selecionada.");
    }
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErroForm("");

    if (!form.title.trim()) {
      setErroForm("O título do livro é obrigatório.");
      return;
    }

    setSalvando(true);
    try {
      const body = {
        title: form.title.trim(),
        author: form.author.trim() || null,
        genre: form.genre.trim() || null,
        isbn: form.isbn.trim() || null,
        year_published: form.year_published ? Number(form.year_published) : null,
        cover_url: form.cover_url.trim() || null,
        description: form.description.trim() || null,
        price: form.price !== "" ? Number(form.price) : 0,
        // Livro criado pela própria Loja sempre entra no catálogo público.
        listed_in_store: true,
      };

      if (livroEditando) {
        await fetchAPI(`/books/${livroEditando.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await fetchAPI("/books", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      await carregarLivros();
      fecharModal();
    } catch (err) {
      setErroForm(err.message || "Não foi possível salvar o livro. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(livro) {
    if (!window.confirm(`Remover "${livro.title}" da loja?`)) return;

    setExcluindoId(livro.id);
    try {
      await fetchAPI(`/books/${livro.id}`, { method: "DELETE" });
      setLivros((prev) => prev.filter((l) => l.id !== livro.id));
    } catch (err) {
      alert(err.message || "Não foi possível remover o livro.");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <section className="px-4 sm:px-6 md:px-10 py-10 flex flex-col items-center text-center gap-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          Nossa <span className="text-[#4693DA]">Loja</span>
        </h1>
        <p className="text-gray-600 max-w-xl">
          Explore nossa coleção de livros cadastrados pela comunidade BookSwap.
        </p>
      </section>

      <section className="px-4 sm:px-6 md:px-10 max-w-6xl w-full mx-auto flex flex-col gap-6 flex-1">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 bg-gray-100 border border-gray-300 rounded-2xl px-4 py-2">
            <FaSearch className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por título ou autor..."
              className="bg-transparent focus:outline-none w-full text-sm"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={generoFiltro}
              onChange={(e) => setGeneroFiltro(e.target.value)}
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm bg-white cursor-pointer focus:outline-none"
            >
              {generos.map((genero) => (
                <option key={genero} value={genero}>
                  {genero}
                </option>
              ))}
            </select>

            {usuario?.is_admin ? (
              <button
                type="button"
                onClick={abrirModalCriar}
                className="flex items-center gap-2 bg-[#2A6183] hover:bg-[#1F4959] transition-colors text-white text-sm font-semibold px-4 py-2 rounded-2xl cursor-pointer whitespace-nowrap"
              >
                <FaPlus /> Adicionar Livro
              </button>
            ) : null}
          </div>
        </div>

        {erroLista && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {erroLista}
          </div>
        )}

        {carregando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pb-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 animate-pulse">
                <div className="aspect-2/3 rounded-xl bg-gray-200" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : livrosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-gray-500 py-20">
            <FaBook className="text-4xl" />
            <p>Nenhum livro encontrado com esses filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pb-16">
            {livrosFiltrados.map((livro) => {
              const donoDoLivro = usuario && livro.user_id === usuario.id;
              return (
                <div key={livro.id} className="flex flex-col gap-2 group">
                  <Link to={`/livro/${livro.id}`} className="relative aspect-2/3 rounded-xl overflow-hidden bg-gray-200 shadow-sm block">
                    {livro.cover_url ? (
                      <img
                        src={livro.cover_url}
                        alt={livro.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaBook className="text-3xl" />
                      </div>
                    )}

                    <span className="absolute bottom-2 left-2 bg-[#2A6183] text-white text-xs font-bold px-2 py-1 rounded-lg">
                      R$ {formatarPreco(livro.price)}
                    </span>

                    {donoDoLivro && (
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            abrirModalEditar(livro);
                          }}
                          title="Editar"
                          className="bg-white/90 hover:bg-white text-[#2A6183] p-1.5 rounded-full shadow cursor-pointer"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleExcluir(livro);
                          }}
                          disabled={excluindoId === livro.id}
                          title="Excluir"
                          className="bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow cursor-pointer disabled:opacity-50"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    )}
                  </Link>

                  <Link to={`/livro/${livro.id}`} className="text-sm font-semibold truncate hover:underline" title={livro.title}>
                    {livro.title}
                  </Link>
                  {livro.author && (
                    <span className="text-xs text-gray-500 truncate -mt-1.5">{livro.author}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />

      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
          onClick={fecharModal}
        >
          <form
            onSubmit={handleSalvar}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {livroEditando ? "Editar Livro" : "Adicionar Livro"}
              </h2>
              <button
                type="button"
                onClick={fecharModal}
                className="text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {erroForm && (
              <span className="text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {erroForm}
              </span>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-gray-700 sm:col-span-2">
                Título*
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4693DA]"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Autor
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4693DA]"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Gênero
                <input
                  type="text"
                  value={form.genre}
                  onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4693DA]"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-gray-700">
                ISBN
                <input
                  type="text"
                  value={form.isbn}
                  onChange={(e) => setForm((p) => ({ ...p, isbn: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4693DA]"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Ano de Publicação
                <input
                  type="number"
                  value={form.year_published}
                  onChange={(e) => setForm((p) => ({ ...p, year_published: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4693DA]"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Preço (R$)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4693DA]"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Capa
                <button
                  type="button"
                  onClick={() => inputCapaRef.current.click()}
                  className="relative w-74 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-300 border-dashed flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer md:w-55"
                >
                  {form.cover_url ? (
                    <img src={form.cover_url} alt="Capa selecionada" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] px-1 text-center">Escolher imagem</span>
                  )}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputCapaRef}
                  className="hidden"
                  onChange={handleCapaChange}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-gray-700 sm:col-span-2">
                Descrição
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4693DA] resize-none min-h-20"
                />
              </label>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={fecharModal}
                disabled={salvando}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 rounded-xl bg-[#2A6183] hover:bg-[#1F4959] text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {salvando ? "Salvando..." : livroEditando ? "Salvar Alterações" : "Adicionar Livro"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Loja;
