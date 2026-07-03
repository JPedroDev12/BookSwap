import Logo from "../assets/img/logo.png"
import { Link } from "react-router-dom";
import Login from "../pages/pLogin"

function Header() {
    return (
        <div className="">
            <header className="flex justify-between px-5 items-center bg-linear-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]">
                <div className="flex gap-2 items-center">
                    <img src={Logo} alt="" className="w-23" />
                    <p className="font-bold text-white text-2xl">Book<br/>Swap</p>
                </div>
                <Link to="/pLogin" className="px-5 py-2 border-white border-[1.5px] font-bold text-white text-2xl rounded-2xl">Entrar</Link>
            </header>
        </div>
    )
}

export default Header