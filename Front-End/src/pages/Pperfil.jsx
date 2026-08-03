import { useState } from "react";
import { Link } from "react-router-dom";
 
// Ícones

import { FaEdit } from "react-icons/fa";
import { IoChatbubbleOutline, IoBagOutline } from "react-icons/io5";
import Logo from "../assets/img/logo.png";
 

// MOCK DE DADOS trocar pelos dados reais do usuário quando estiver logado API cade cade?

const usuario = {
  nome: "Usuario",
  fotoUrl: "", // se vazio mostra o círculo placeholder
  sobreMim:
    "Apaixonado(a) por ficção científica e fantasia. Sempre em busca de uma boa troca! Adoro conhecer novas histórias e trocar recomendações com outros leitores.",
  cores: ["#9CA3AF", "#EF4444", "#22C55E", "#3B82F6", "#F97316", "#A855F7"],
};
 
const estatisticas = [
  { label: "Quero Ler", valor: 15 },
  { label: "Lidos", valor: 7 },
  { label: "Lendo", valor: 1 },
  { label: "Não Gostei", valor: 2 },
  { label: "Avaliados", valor: 4 },
];
 
const livros = [
  { titulo: "O Ladrão de Raios", autor: "Rick Riordan", cor: "#2F5E4E" },
  { titulo: "O Mar de Monstros", autor: "Rick Riordan", cor: "#D8D06A" },
  { titulo: "O Espadachim de Carvão", autor: "Affonso Solano", cor: "#1B2B22" },
  { titulo: "O Espadachim de Carvão", autor: "Affonso Solano", cor: "#6C4FA1" },
  { titulo: "Os Assassinatos da Rua Morgue", autor: "Edgar Allan Poe", cor: "#3B1414" },
  { titulo: "A Verdade Sobre o Caso do Sr. Valdemar", autor: "Edgar Allan Poe", cor: "#C9A24B" },
  { titulo: "A Lâmina da Assassina", autor: "Sarah J. Maas", cor: "#1C1C1C" },
];
 
// HEADER como se estivesse logado rever futuramente, com o nome do usuário e a foto de perfil

function HeaderPerfil() {
  return (
    <header className="flex justify-between items-center px-8 py-3 bg-linear-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]">
      <div className="flex items-center gap-2">
        <img src={Logo} alt="BookSwap" className="w-10" />
        <p className="font-bold text-white text-lg leading-4">
          Book<br />Swap
        </p>
      </div>
 
      <nav className="flex gap-8 text-gray-200 text-[15px]">
        <Link to="/" className="hover:text-white transition-colors">Início</Link>
        <Link to="/loja" className="hover:text-white transition-colors">Loja</Link>
        <Link to="/swapping" className="hover:text-white transition-colors">Swapping</Link>
      </nav>
 
      <div className="flex items-center gap-4">
        <IoChatbubbleOutline className="text-white text-2xl bg-[#4C6B8A]/60 p-2 rounded-full w-9 h-9 cursor-pointer" />
        <span className="text-white text-[15px]">Usuario</span>
        <div className="w-9 h-9 rounded-full bg-white" />
      </div>
    </header>
  );
}
 
// PÁGINA DE PERFIL

function Perfil() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <HeaderPerfil />
 
      {/* Seção de perfil foto, nome, estatísticas e botão de editar */}

      <section className="flex items-center gap-8 px-10 py-10">
        <div className="w-24 h-24 rounded-full bg-white shrink-0 overflow-hidden">
          {usuario.fotoUrl && (
            <img src={usuario.fotoUrl} alt={usuario.nome} className="w-full h-full object-cover" />
          )}
        </div>
 
        <h1 className="text-3xl font-bold shrink-0">{usuario.nome}</h1>
 
        <div className="flex gap-6">
          {estatisticas.map((item, i) => (
            <div
              key={item.label}
              className={`flex flex-col items-center px-4 ${
                i !== estatisticas.length - 1 ? "border-r border-gray-600" : ""
              }`}
            >
              <span className="text-gray-300 text-sm">{item.label}</span>
              <span className="text-[#4693DA] font-bold text-lg">{item.valor}</span>
            </div>
          ))}
        </div>
 
        <button
          type="button"
          className="ml-auto flex items-center gap-2 text-sm text-gray-200 border border-gray-500 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <FaEdit /> Editar Perfil
        </button>
      </section>
 
      {/* Conteúdo principal livros amostra e sobre mim */}

      <section className="flex gap-6 px-10 pb-10">

        {/*  livros amostra*/}

        <div className="flex-1 bg-linear-to-br from-[#2C5364] to-[#0F2027] rounded-3xl p-6 shadow-xl/30">
          <div className="grid grid-cols-4 gap-5">
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
 
            {/* Espaço vazio / botão para adicionar livro novoo */}

            <div className="aspect-2/3 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer">
              <IoBagOutline className="text-3xl" />
            </div>
          </div>
        </div>
 
        {/* Sobre mim */}

        <aside className="w-80 shrink-0 bg-linear-to-b from-[#2C5364] to-[#0F2027] rounded-3xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold underline underline-offset-4">Sobre Mim</h2>
          <p className="text-gray-200 text-[15px] leading-relaxed">{usuario.sobreMim}</p>
 
          <div className="mt-auto pt-4 border-t border-white/10">
            <span className="text-gray-300 text-sm">cores que vão corresponder a os livros</span> {/* rever mudar de local arrumar igual no figma */}
            <div className="flex gap-2 mt-2">
              {usuario.cores.map((cor) => (
                <span
                  key={cor}
                  className="w-6 h-6 rounded-full border border-white/30"
                  style={{ backgroundColor: cor }}
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