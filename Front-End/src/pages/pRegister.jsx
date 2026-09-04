import { useState } from "react";

import { FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Header from "../components/Header";
import MedidorForcaSenha from "../components/MedidorForcaSenha";
import { Link, useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";
import { avaliarForcaSenha } from "../utils/senha";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleRegister(e) {
      e.preventDefault();
      setErro("");

      if (!username || !email || !password || !confirmarSenha) {
        setErro("Preencha todos os campos.");
        return;
      }

      if (password !== confirmarSenha) {
        setErro("As senhas não coincidem.");
        return;
      }

      if (avaliarForcaSenha(password).nivel !== "forte") {
        setErro("Sua senha precisa ser forte: pelo menos 8 caracteres, com maiúsculas, minúsculas, números e símbolos.");
        return;
      }

      setCarregando(true);
      try {
        const resposta = await fetchAPI("/auth/register", {
          method: "POST",
          body: JSON.stringify({ username, email, password }),
        });

        if (resposta.Error) {
          setErro(resposta.Error);
          return;
        }

        navigate("/pLogin");
      } catch (err) {
        setErro(err.message || "Não foi possível conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    }

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center">
          <form onSubmit={handleRegister} className="flex flex-col bg-[#203A43] gap-6 border-[#757897] border-3 w-[75%] p-5 rounded-2xl md:w-[35%] md:m-2">
            <div className="text-white lg:p-0.5 md:flex flex-col items-center">
              <h1 className="text-3xl font-bold">Registre-se</h1>
              <span>Bem-Vindo(a) :D</span>
            </div>
            

            <div className="flex items-center flex-col gap-5">
              {erro && <span className="text-red-400 text-sm">{erro}</span>}
              <div className="flex flex-col">
                <span className="text-gray-200 items-start">Seu Nome:</span>
                <input
                  type="text"
                  placeholder="Fulano"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="placeholder-gray-500 bg-[#1F263F] p-2 focus:outline-none rounded-[10px] text-gray-300"
                />
              </div>


              <div className="flex flex-col">
                <span className="text-gray-200 items-start">Seu Email:</span>
                <input
                  type="email"
                  placeholder="usuario@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="placeholder-gray-500 bg-[#1F263F] p-2 focus:outline-none rounded-[10px] text-gray-300"
                />
              </div>


              <div className="flex flex-col">
                <span className="text-gray-200">Sua Senha:</span>
                <input
                  type="password"
                  placeholder="••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="placeholder-gray-500 bg-[#1F263F] items-center p-2 focus:outline-none rounded-[10px] text-gray-300"
                />
                <MedidorForcaSenha senha={password} />
              </div>


              <div className="flex flex-col">
                <span className="text-gray-200">Confirme Sua Senha:</span>
                <input
                  type="password"
                  placeholder="••••••••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="placeholder-gray-500 bg-[#1F263F] p-2 focus:outline-none rounded-[10px] text-gray-300"
                />
                <Link to="/pLogin" className="text-gray-200 text-[10px] hover:underline">Já tem uma conta? Entre aqui!</Link>
              </div>


              <button type="submit" disabled={carregando} className="px-5 py-2 bg-[#303A65] border-2 border-[#4B598E] rounded-[10px] font-bold text-gray-200 cursor-pointer">
                {carregando ? "Enviando..." : "Entrar"}
              </button>
            </div>


            <div className="flex gap-5 justify-center">
              <FaXTwitter className="text-gray-400  bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer" />
              <FaInstagram className="text-gray-400 bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer" />
              <FaFacebookF className="text-gray-400 bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer" />
              <FaGoogle className="text-gray-400    bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer" />
            </div>
          </form>
        </div>
      </div>
    );
}

export default Register;