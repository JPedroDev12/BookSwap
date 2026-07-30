import { Link } from "react-router-dom";
import { useState } from "react";

//Importação de icones
import { FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaRedditAlien } from "react-icons/fa";

function Footer() {
        return (
          <div className="items-center bg-linear-to-l from-[#0F2027] via-[#203A43] to-[#2C5364]">
            <div className="flex justify-around py-12">
              <div className="flex flex-col gap-3">
                <h1 className="font-bold text-xl text-white">📚 BookSwap</h1>
                <span className="text-gray-300 w-110">
                  Uma plataforma para amantes da leitura trocarem, comprarem e
                  descobrirem novos livros.
                </span>

                <div className="flex gap-5 items-center text-white">
                  <FaInstagram className="bg-gray-500/55 p-2 text-4xl rounded-4xl cursor-pointer" />
                  <BsTwitterX className="bg-gray-500/55 p-2 text-4xl rounded-4xl cursor-pointer" />
                  <FaFacebook className="bg-gray-500/55 p-2 text-4xl rounded-4xl cursor-pointer" />
                  <FaYoutube className="bg-gray-500/55 p-2 text-4xl rounded-4xl cursor-pointer" />
                  <FaGithub className="bg-gray-500/55 p-2 text-4xl rounded-4xl cursor-pointer" />
                  <FaRedditAlien className="bg-gray-500/55 p-2 text-4xl rounded-4xl cursor-pointer" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-xl text-white">Plataformas</h1>
                <div className="flex flex-col text-gray-400">
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    Swapping
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    Loja
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    BookSwap Plus
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    Swapping
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-xl text-white">Empresa</h1>
                <div className="flex flex-col text-gray-400">
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    Sobre
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    Criadores
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    Portfólio
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300"
                  >
                    Serviços
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <h1 className="text-white font-bold text-xl">
                  Fique Atualizado
                </h1>
                <span className="text-gray-400">
                  Receba novidades e recomendações de livros
                </span>

                <div>
                  <input
                    type="email"
                    placeholder="Seu Email"
                    className="bg-gray-300 p-2 rounded-l-2xl"
                  />
                  <button
                    type="button"
                    className="bg-[#2BA9E8] p-2 text-white rounded-r-2xl top-5 cursor-pointer"
                  >
                    Inscrever
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5 mx-10 items-center flex justify-between">
              <span className="text-gray-300 text-[12px]">
                @2025 BookSwap - Todos os direitos reservados
              </span>
              <div className="flex gap-2">
                <Link className="text-gray-300 text-[14px] hover:text-white transition-colors duration-300">Termos</Link>
                <Link className="text-gray-300 text-[14px] hover:text-white transition-colors duration-300">Privacidade</Link>
              </div>
            </div>
          </div>
        );
};

export default Footer
