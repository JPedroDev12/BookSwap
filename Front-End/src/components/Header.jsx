import Logo from "../assets/img/logo.png"
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <header className="flex justify-between px-4 md:px-10 items-center bg-linear-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]">
                
                <div className="flex gap-2 items-center">
                    <img src={Logo} alt="Logo BookSwap" className="w-16 md:w-24" />
                    
                    <p className="font-bold text-white text-lg md:text-2xl leading-tight">
                        Book<br/>Swap
                    </p>
                </div>

                <Link to="/pLogin" className="px-4 py-1.5 md:px-6 md:py-2 border-white border-[1.5px] font-bold text-white text-base md:text-xl rounded-2xl">
                    Entrar
                </Link>
                
            </header>
        </div>
    )
}

export default Header
