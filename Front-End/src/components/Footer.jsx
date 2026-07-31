import { Link } from "react-router-dom";
import { useState } from "react";

import { FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaRedditAlien } from "react-icons/fa";

function Footer() {
        return (
          <div className="items-center bg-linear-to-l from-[#0F2027] via-[#203A43] to-[#2C5364]">
            <div className="flex flex-col md:flex-row justify-around py-12 px-6 md:px-0 gap-10 md:gap-0 text-center md:text-left">
              <div className="flex flex-col gap-3 items-center md:items-start">
                <h1 className="font-bold text-xl text-white">📚 BookSwap</h1>
                <span className="text-gray-300 max-w-full md:w-md">
                  Uma plataforma para amantes da leitura trocarem, comprarem e
                  descobrirem novos livros.
                </span>

                <div className="flex gap-4 flex-wrap justify-center md:justify-start items-center text-white mt-2">
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
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
                  >
                    Swapping
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
                  >
                    Loja
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
                  >
                    BookSwap Plus
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
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
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
                  >
                    Sobre
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
                  >
                    Criadores
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
                  >
                    Portfólio
                  </Link>
                  <Link
                    to=""
                    className="hover:text-gray-200 transition-colors duration-300 py-1 md:py-0"
                  >
                    Serviços
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center md:items-start">
                <h1 className="text-white font-bold text-xl">
                  Fique Atualizado
                </h1>
                <span className="text-gray-400 text-sm max-w-xs">
                  Receba novidades e recomendações de livros
                </span>

                <div className="flex w-full justify-center md:justify-start">
                  <input
                    type="email"
                    placeholder="Seu Email"
                    className="bg-gray-300 p-2 rounded-l-2xl text-gray-800 focus:outline-none w-44 sm:w-auto"
                  />
                  <button
                    type="button"
                    className="bg-[#2BA9E8] p-2 text-white font-semibold rounded-r-2xl cursor-pointer"
                  >
                    Inscrever
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5 mx-4 md:mx-10 flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
              <span className="text-gray-300 text-[12px]">
                @2025 BookSwap - Todos os direitos reservados
              </span>
              <div className="flex gap-4">
                <Link className="text-gray-300 text-[14px] hover:text-white transition-colors duration-300">
                  Termos
                </Link>
                <Link className="text-gray-300 text-[14px] hover:text-white transition-colors duration-300">
                  Privacidade
                </Link>
              </div>
            </div>
          </div>
        );
};

export default Footer;
