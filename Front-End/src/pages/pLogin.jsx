import { useState } from "react";

//import imgs/componentes
import { FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    if (!email || !password) {
      setErro("Preencha email e senha.");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (resposta.Error) {
        setErro(resposta.Error);
        return;
      }

      localStorage.setItem("token", resposta.token);

      // Busca a página de perfil (foto e descrição) desse usuário.
      // Se ele nunca salvou nada ainda, a rota responde com data: null — nesse caso seguimos sem elas.
      let userPage = {};
      try {
        const paginaResposta = await fetchAPI(`/userPage/${resposta.data.id}`);
        if (paginaResposta.data) {
          userPage = {
            photo_url: paginaResposta.data.photo_url || "",
            description: paginaResposta.data.description || "",
          };
        }
      } catch (err) {
        // Erro inesperado ao buscar a página, segue só com os dados do user
      }

      const usuarioCompleto = { ...resposta.data, ...userPage };
      localStorage.setItem("user", JSON.stringify(usuarioCompleto));
      navigate("/");
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
        <form onSubmit={handleLogin} className="flex flex-col bg-[#203A43] gap-6 border-[#757897] border-3 w-[75%] p-5 rounded-2xl md:w-[35%]">
          <div className="text-white lg:p-6.5 md:flex flex-col items-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <span>Olá Novamente :D</span>
          </div>

          <div className="flex items-center flex-col gap-5">
            {erro && <span className="text-red-400 text-sm">{erro}</span>}
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
                className="placeholder-gray-500 bg-[#1F263F] p-2 focus:outline-none rounded-[10px] text-gray-300"
              />
              <Link to="/pRegister" className="text-gray-200 text-[10px] hover:underline mt-1">Não tem uma conta? Crie aqui!</Link>
              </div>

            <button type="submit" disabled={carregando} className="px-5 py-2 bg-[#303A65] border-2 border-[#4B598E] rounded-[10px] font-bold text-gray-200 cursor-pointer">
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </div>

          <div className="flex justify-around">
            <FaXTwitter className="text-gray-400  bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
            <FaInstagram className="text-gray-400 bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
            <FaFacebookF className="text-gray-400 bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
            <FaGoogle className="text-gray-400    bg-gray-600/55 text-4xl p-2 rounded-2xl cursor-pointer"/>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
