import { useState } from "react";

//import imgs/componentes
import { FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Header from "../components/Header";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col bg-[#203A43] gap-6 border-[#757897] border-3 w-[75%] p-5 rounded-2xl md:w-[35%]">
          <div className="text-white lg:p-6.5 md:flex flex-col items-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <span>Olá Novamente :D</span>
          </div>

          <div className="flex items-center flex-col gap-5">
            <div className="flex flex-col">
              <span className="text-gray-200 items-start">Seu Email:</span>
              <input
                type="email"
                placeholder="usuario@gmail.com"
                className="placeholder-gray-500 bg-[#1F263F] p-2 focus:outline-none rounded-[10px] text-gray-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-200">Sua Senha:</span>
              <input type="password" placeholder="••••••••••••••" className="placeholder-gray-500 bg-[#1F263F] p-2 focus:outline-none rounded-[10px] text-gray-300"/>
              <Link to="/pRegister" className="text-gray-200 text-[10px] hover:underline">Não tem uma conta? Crie aqui!</Link>
              </div>

            <button className="px-5 py-2 bg-[#303A65] border-2 border-[#4B598E] rounded-[10px] font-bold text-gray-200 cursor-pointer">
              Entrar
            </button>
          </div>

          <div className="flex justify-around">
            <FaXTwitter className="text-gray-400  bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
            <FaInstagram className="text-gray-400 bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
            <FaFacebookF className="text-gray-400 bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
            <FaGoogle className="text-gray-400    bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
