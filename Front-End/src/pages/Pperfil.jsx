import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { IoChatbubbleOutline, IoBagOutline } from "react-icons/io5";
import Logo from "../assets/img/logo.png";
import Header from "../components/Header";
import { fetchAPI } from "../api";

const legendaCores = [
  { cor: "#EF4444", label: "Não Gostei" },
  { cor: "#22C55E", label: "Gostei" },
  { cor: "#3B82F6", label: "Lidos" },
  { cor: "#D4A017", label: "Lendo" },
  { cor: "#D600D6", label: "Quero Ler" },
];

const estatisticas = [
  { label: "Quero Ler", valor: 0 },
  { label: "Lidos", valor: 0 },
  { label: "Lendo", valor: 0 },
  { label: "Não Gostei", valor: 0 },
  { label: "Avaliados", valor: 0 },
];

const livros = [];

function Perfil() {
  const navigate = useNavigate();
  const { id } = useParams();
  const inputFotoRef = useRef(null);

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

  const ehMeuPerfil = !id || id === String(usuario.id);

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

    if (id && id !== String(usuario.id)) {
      carregarPerfil();
    }
  }, [id, usuario.id]);

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

  // ✅ CORRIGIDO - Converte a imagem para Base64 em vez de usar blob URL
  const handleMudarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoSelecionado(file);

      const reader = new FileReader();
      reader.onload = () => {
        // reader.result já vem como string base64 (ex: "data:image/png;base64,...")
        setFormTemp((prev) => ({ ...prev, fotoUrl: reader.result }));
      };
      reader.onerror = () => {
        setErro("Não foi possível carregar a imagem selecionada.");
      };
      reader.readAsDataURL(file);
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {livros.map((livro, i) => (
              <div key={i} className="flex flex-col gap-2 cursor-pointer group">
                <div
                  className="aspect-2/3 rounded-lg flex items-end p-2 shadow-lg group-hover:scale-[1.03] transition-transform"
                  style={{ backgroundColor: livro.cor }}
                >
                  <span className="text-white text-[11px] font-semibold leading-tight drop-shadow">
                    {livro.titulo}
                  </span>
                </div>
                <span className="text-gray-300 text-xs truncate">{livro.autor}</span>
              </div>
            ))}

            {ehMeuPerfil && (
              <div className="aspect-2/3 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                <IoBagOutline className="text-3xl" />
              </div>
            )}
          </div>
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
            <span className="text-gray-300 font-bold text-xl">Filtro</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {legendaCores.map((item) => (
                <span
                  key={item.label}
                  title={item.label}
                  className="w-6 h-6 rounded-full border border-white/30"
                  style={{ backgroundColor: item.cor }}
                />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Perfil;