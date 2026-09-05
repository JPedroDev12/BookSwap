import { useState } from "react";
import { Link } from "react-router-dom";

import { CiHeart } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Livros from "../assets/img/livros.png";
import { HiHeart } from "react-icons/hi";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoBagOutline } from "react-icons/io5";


function Inicial() {
  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="overflow-x-hidden">
      <Header />

      <section className="my-12 md:my-25 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-5 px-5 justify-between max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 text-3xl w-full md:w-200 text-center md:text-left items-center md:items-start">
          <p className="border border-gray-300 py-2 px-4 flex items-center text-[16px] text-[#4693DA] rounded-4xl w-fit bg-white">
            <CiHeart className="text-2xl mr-1" />
            Troque livros de forma inteligente!
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Encontre o Seu Próximo{" "}
            <span className="bg-linear-to-r from-[#3B7389] to-[#38C4FD] bg-clip-text text-transparent block md:inline">
              Livro Favorito!
            </span>
          </h1>

          <p className="text-base text-gray-600 max-w-md md:max-w-none">
            Deslize, combine e troque livros com outros apaixonados pela
            leitura. Uma nova forma de descobrir histórias incríveis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 text-base w-full sm:w-auto">
            <Link 
              to={usuario ? "/swapping" : "/pLogin"} 
              className="py-3 md:py-2 px-5 rounded-2xl text-white flex items-center justify-center gap-2 bg-[#2A6183] hover:bg-[#1F4959] transition-colors w-full sm:w-auto"
            >
              Começar a Trocar <FaArrowRight />
            </Link>
            
            <Link to="/loja" className="py-3 md:py-2 px-5 rounded-2xl text-white bg-[#89B8FF] text-center w-full sm:w-auto">
              Ver Loja
            </Link>
          </div>
        </div>
        
        <img
          src={Livros}
          alt="Livros"
          className="w-full max-w-xs md:max-w-none md:w-120 bg-[#E0E0E0] p-5 rounded-4xl shadow-xl/30"
        />
      </section>

      <section className="px-6 md:px-10 py-12 flex flex-col gap-10 items-center text-center">
        <h1 className="text-3xl font-bold flex flex-col sm:flex-row gap-1 justify-center">
          Por que escolher o <span className="text-[#3B7389]">BookSwap?</span>
        </h1>
        <span className="text-lg md:text-xl text-gray-600 max-w-2xl">
          Uma plataforma completa para amantes da leitura trocarem, comprarem e conectarem-se.
        </span>
      
        <div className="flex flex-col lg:flex-row gap-6 justify-center p-2 md:p-8 w-full max-w-6xl">
          <div className="border-gray-300 border-[1.2px] w-full lg:w-75 min-h-56 p-5 rounded-2xl text-left bg-white shadow-xs">
            <div className="flex flex-col gap-2">
              <CiHeart className="text-white text-4xl p-1.5 font-bold bg-[#2A6183] rounded-lg w-10 h-10"/>
              <h1 className="font-bold text-xl md:text-2xl mt-2">Sistema de Swapping</h1>
              <span className="text-base text-gray-600">Deslize para curtir ou passar livros. Quando ambos curtem, é um match para trocar!</span>
            </div>
          </div>

          <div className="border-gray-300 border-[1.2px] w-full lg:w-75 min-h-56 p-5 rounded-2xl text-left bg-white shadow-xs">
            <div className="flex flex-col gap-2">
              <IoChatbubbleOutline className="text-white text-4xl p-1.5 font-bold bg-[#2A6183] rounded-lg w-10 h-10"/>
              <h1 className="font-bold text-xl md:text-2xl mt-2">Chat Integrado</h1>
              <span className="text-base text-gray-600">Converse com outros leitores, combine trocas e faça novas amizades literárias.</span>
            </div>
          </div>

          <div className="border-gray-300 border-[1.2px] w-full lg:w-75 min-h-56 p-5 rounded-2xl text-left bg-white shadow-xs">
            <div className="flex flex-col gap-2">
              <IoBagOutline className="text-white text-4xl p-1.5 font-bold bg-[#2A6183] rounded-lg w-10 h-10"/>
              <h1 className="font-bold text-xl md:text-2xl mt-2">Loja Completa</h1>
              <span className="text-base text-gray-600">Explore nossa loja com milhares de livros disponíveis para compra imediata.</span>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

export default Inicial;
