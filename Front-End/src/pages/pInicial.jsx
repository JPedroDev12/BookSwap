import { useState } from "react";
import { Link } from "react-router-dom";

// Importação de ícones e componentes
import { CiHeart } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer"
import Livros from "../assets/img/livros.png";
import { HiHeart } from "react-icons/hi";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoBagOutline } from "react-icons/io5";


function Inicial() {
  return (
    <div className="">
      <Header />

      <section className="my-25 flex items-center gap-5 px-5 justify-between">
        <div className="flex flex-col gap-4 text-3xl w-200">
          <p className="border border- py-2 px-4 flex items-center text-[16px] text-[#4693DA] rounded-4xl w-fit">
            <CiHeart className="text-2xl" />
            Troque livros de forma inteligente!
          </p>
          <h1 className="text-3xl font-bold">
            Encontre o Seu Próximo{" "}
            <span className="bg-linear-to-r from-[#3B7389] to-[#38C4FD] bg-clip-text text-transparent text-3xl">
              Livro Favorito!
            </span>
          </h1>

          <p className="text-base text-gray-6xl">
            Deslize, combine e troque livros com outros apaixonados pela
            leitura. Uma nova forma de descobrir histórias incríveis.
          </p>

          <div className="flex gap-5 text-base">
            {/* Botão corrigido usando Link para ir para a tela de login */}
            <Link 
              to="/pLogin" 
              className="py-2 px-5 rounded-2xl text-white flex items-center gap-2 bg-[#2A6183] hover:bg-[#1F4959] transition-colors"
            >
              Começar a Trocar <FaArrowRight />
            </Link>
            
            <a href="" className="py-2 px-5 rounded-2xl text-white bg-[#89B8FF]">
              Ver Loja
            </a>
          </div>
        </div>
        
        <img
          src={Livros}
          alt="Livros"
          className="w-120 bg-[#E0E0E0] p-5 rounded-4xl shadow-xl/30"
        />
      </section>

      <section className="px-10 flex flex-col gap-10 items-center">
        <h1 className="text-3xl font-bold flex gap-1">
          Por que escolher o <span className="text-[#3B7389]">BookSwap?</span>
        </h1>
        <span className="text-xl">Uma plataforma completa para amantes da leitura trocarem, comprarem e conectarem-se.</span>
      
        <div className="flex gap-5 justify-evenly p-8">
          <div className="border-gray-500 border-[1.2px] w-75 h-50 p-3 rounded-2xl">
                <div className="flex flex-col gap-2">
                  <CiHeart className="text-white text-4xl p-1.3 font-bold bg-[#2A6183] rounded-lg"/>
                  <h1 className="font-bold text-2xl">Sistema de Swapping</h1>
                  <span className="text-xl text-gray-700">Deslize para curtir ou passar livros. Quando ambos curtem, é um match para trocar!</span>
                  </div>
          </div>
          <div className="border-gray-500 border-[1.2px] w-75 h-50 p-3 rounded-2xl">
                <div className="flex flex-col gap-2">
                  <IoChatbubbleOutline className="text-white text-4xl p-1.3 font-bold bg-[#2A6183] rounded-lg"/>
                  <h1 className="font-bold text-2xl">Chat Integrado</h1>
                  <span className="text-xl text-gray-700">Converse com outros leitores, combine trocas e faça nova amizades literárias.</span>
                  </div>
          </div>
          <div className="border-gray-500 border-[1.2px] w-75 h-50 p-3 rounded-2xl">
                <div className="flex flex-col gap-2">
                  <IoBagOutline className="text-white text-4xl p-1.3 font-bold bg-[#2A6183] rounded-lg"/>
                  <h1 className="font-bold text-2xl">Loja Completa</h1>
                  <span className="text-xl text-gray-700">Explore nossa loja com milhares de livros disponíveis para compra imediata.</span>
                  </div>
          </div>
        </div>

      </section>

      <Footer/>

    </div>
  );
}

export default Inicial;