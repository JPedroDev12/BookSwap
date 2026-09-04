import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaBook, FaStar, FaRegStar, FaEdit, FaTimes, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Header from "../components/Header";
import { fetchAPI } from "../api";
import { redimensionarImagem } from "../utils/imagem";

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "0,00";
  return numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

function Livro() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [comprando, setComprando] = useState(false);
  const inputCapaRef = useRef(null);

  const carregarLivro = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await fetchAPI(`/books/${id}`);
      setLivro(resposta.data);
    } catch (err) {
      setErro(err.message || "Não foi possível carregar esse livro.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarLivro();
  }, [carregarLivro]);

  function abrirModalEditar() {
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
    setErroForm("");
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
      };

      await fetchAPI(`/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      await carregarLivro();
      setModalAberto(false);
    } catch (err) {
      setErroForm(err.message || "Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function handleComprar() {
    setComprando(true);
    setTimeout(() => setComprando(false), 2500);
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

  if (carregando) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-8 animate-pulse">
          <div className="w-full sm:w-64 aspect-2/3 rounded-2xl bg-gray-200 shrink-0" />
          <div className="flex-1 flex flex-col gap-3 pt-2">
            <div className="h-7 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
            <div className="h-24 bg-gray-200 rounded-lg w-full mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (erro || !livro) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-500">{erro || "Livro não encontrado."}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 text-[#2A6183] font-semibold hover:underline cursor-pointer"
          >
            <FaArrowLeft /> Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2A6183] transition-colors mb-6 cursor-pointer"
        >
          <FaArrowLeft /> Voltar
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-10">
          <div className="w-full max-w-[240px] mx-auto sm:mx-0 sm:w-64 shrink-0">
            <div className="aspect-2/3 rounded-2xl overflow-hidden shadow-lg bg-gray-200 relative">
              {livro.cover_url ? (
                <img src={livro.cover_url} alt={livro.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaBook className="text-4xl" />
                </div>
              )}

              {!usuario?.is_admin && Number(livro.price) > 0 && (
                <span className="absolute top-3 left-3 bg-[#2A6183] text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                  R$ {formatarPreco(livro.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4959] leading-tight">{livro.title}</h1>
              {(livro.author || livro.genre) && (
                <p className="text-sm text-gray-500 mt-1">
                  {[livro.author, livro.genre].filter(Boolean).join(" · ")}
                  {livro.year_published ? ` · ${livro.year_published}` : ""}
                </p>
              )}
              {livro.owner?.username && (
                <p className="text-xs text-gray-400 mt-1">
                  Cadastrado por{" "}
                  <Link to={`/pPerfil/${livro.owner.id}`} className="hover:underline text-gray-500">
                    {livro.owner.username}
                  </Link>
                </p>
              )}
            </div>

            {livro.description && (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{livro.description}</p>
            )}

            <div className="mt-auto pt-4 flex flex-col gap-4">
              {usuario?.is_admin ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-[#D3AE56]">
                      {[1, 2, 3, 4, 5].map((nota) => {
                        const cheia = Math.round(livro.average_rating || 0) >= nota;
                        const Estrela = cheia ? FaStar : FaRegStar;
                        return <Estrela key={nota} className="text-lg" />;
                      })}
                    </div>
                    <span className="text-xs text-gray-500">
                      {livro.average_rating
                        ? `${livro.average_rating.toFixed(1)} · ${livro.ratings_count} avaliação(ões)`
                        : "Ainda sem avaliações"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={abrirModalEditar}
                    className="w-full sm:w-auto self-start flex items-center justify-center gap-2 bg-[#2A6183] hover:bg-[#1F4959] transition-colors text-white font-semibold px-6 py-2.5 rounded-2xl cursor-pointer"
                  >
                    <FaEdit /> Editar Livro
                  </button>
                </>
              ) : (
                <>
                  {comprando && (
                    <div className="bg-blue-50 border border-blue-200 text-[#1F4959] text-sm rounded-xl px-4 py-2.5">
                      Em breve você vai poder comprar livros direto por aqui! 🚧
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleComprar}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4693DA] hover:bg-[#2A6183] transition-colors text-white font-semibold px-8 py-2.5 rounded-2xl cursor-pointer"
                  >
                    <FaShoppingCart /> Comprar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
              <h2 className="text-xl font-bold">Editar Livro</h2>
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

              <label className="flex flex-col gap-1 text-sm text-gray-700 sm:col-span-2">
                Capa
                <button
                  type="button"
                  onClick={() => inputCapaRef.current.click()}
                  className="relative w-20 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-300 border-dashed flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer"
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
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Livro;
