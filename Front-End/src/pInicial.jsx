import { useState } from "react";

//import imgs/componentes
import { CiHeart } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import Header from "./components/Header";
import Livros from "./assets/img/livros.png"


function App() {
    return (
      <div className="">
        <Header />

        <section className="my-25 flex items-center gap-5 px-5 justify-between">
          <div className="flex flex-col gap-4 w-125">
            <p className="border border- py-2 px-4 flex items-center text-[16px] text-[#4693DA] rounded-4xl w-fit">
              <CiHeart className="text-2xl"/>
              Troque livros de forma inteligente!
            </p>
            <h1 className="text-3xl font-bold">
              Encontre o Seu Próximo{" "}
              <span className="bg-linear-to-r from-[#3B7389] to-[#38C4FD] bg-clip-text text-transparent text-3xl">
                Livro Favorito!
              </span>
            </h1>

            <p>
              Deslize, combine e troque livros com outros apaixonados pela
              leitura. Uma nova forma de descobrir histórias incríveis.
            </p>

            <div className="flex gap-5">
              <a href="" className="py-2 px-5 rounded-2xl text-white flex items-center gap-2 bg-[#2A6183]">Começar a Trocar <FaArrowRight /></a>
              <a href="" className="py-2 px-5 rounded-2xl text-white bg-[#89B8FF]">Ver Loja</a>
            </div>
          </div>
          <img
            src={Livros}
            alt=""
            className="w-120 bg-[#E0E0E0] p-5 rounded-4xl shadow-xl/30"
          />
        </section>
      </div>
    );
}

export default App;