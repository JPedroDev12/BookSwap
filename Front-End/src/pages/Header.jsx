import Logo from "../assets/img/logo.png"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
    const [usuario, setUsuario] = useState(null);

    const carregarUsuario = () => {
        const dadosUsuario = localStorage.getItem("user");
        if (dadosUsuario && dadosUsuario !== "undefined") {
            try {
                setUsuario(JSON.parse(dadosUsuario));
            } catch (err) {
                console.error("Erro ao ler usuário do localStorage:", dadosUsuario, err);
            }
        } else {
            setUsuario(null);
        }
    };

    useEffect(() => {
        carregarUsuario();

        // Escuta o evento disparado quando o perfil é atualizado
        window.addEventListener("usuarioAtualizado", carregarUsuario);

        // Escuta mudanças vindas de outras abas/janelas (bônus)
        window.addEventListener("storage", carregarUsuario);

        return () => {
            window.removeEventListener("usuarioAtualizado", carregarUsuario);
            window.removeEventListener("storage", carregarUsuario);
        };
    }, []);

    return (
        <div>
            <header className="flex justify-between px-4 md:px-10 items-center bg-linear-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]">
                
                <Link to={"/"}>
                    <div className="flex gap-2 items-center hover:cursor-pointer">
                        <img src={Logo} alt="Logo BookSwap" className="w-16 md:w-24" />
                    
                        <p className="font-bold text-white text-lg md:text-2xl leading-tight">
                            Book<br/>Swap
                        </p>
                    </div>
                </Link>

                {usuario ? (
                    <Link to="/pPerfil" className="flex items-center gap-3">
                        <span className="font-bold text-white text-base md:text-xl">
                            {usuario.nome || usuario.username || usuario.name || "Usuário"}
                        </span>
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white shrink-0 overflow-hidden">
                            {(usuario.fotoUrl || usuario.photo_url) && (
                                <img src={usuario.fotoUrl || usuario.photo_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                            )}
                        </div>
                    </Link>
                ) : (
                    <Link to="/pLogin" className="px-4 py-1.5 md:px-6 md:py-2 border-white border-[1.5px] font-bold text-white text-base md:text-xl rounded-2xl">
                        Entrar
                    </Link>
                )}
                
            </header>
        </div>
    )
}

export default Header