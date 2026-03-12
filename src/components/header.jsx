import { Route, Routes } from "react-router-dom";
import "../css/app.css"
import "../css/header.css"
import { Search, User, ShoppingBag } from "lucide-react";
import logo from "../img/logoAgnus.jpeg";
import logo2 from "../img/logoAgnus.png";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <Link className="logoInicio" to="/">
                    <img className="logoAgnusImg" src={logo2} alt="logo" />
                </Link>
            </div>

            <nav className="menu_header">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/produtos" className="nav-link">Produtos</Link>
                <Link to="/contato" className="nav-link">Contato</Link>
                <Link to="/sobre" className="nav-link">Sobre</Link>
            </nav>

            <nav className="opcoes_header">
                <a href="#"><Search size={22} /></a>
                <a href="#"><User size={22} /></a>
                <a href="#"><ShoppingBag size={22} /></a>
            </nav>
        </header >
    )
}

export default Header;