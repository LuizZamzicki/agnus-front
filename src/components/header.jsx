import { Search, User, ShoppingBag } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

import "../css/cliente/app.css"
import "../css/cliente/header.css"
import logo2 from "../img/logoAgnus.png";


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
                <Link to="/catalogo" className="nav-link">Catálogo</Link>
                <Link to="/produtos" className="nav-link">Camisetas</Link>
                <Link to="/produtos" className="nav-link">Regatas</Link>
                <Link to="/contato" className="nav-link">Leggings</Link>
            </nav>

            <nav className="opcoes_header">
                <Link to="/carrinho" className="nav-link"><Search size={22} /></Link>
                <Link to="/carrinho" className="nav-link"><User size={22} /></Link>
                <Link to="/carrinho" className="nav-link"><ShoppingBag size={22} /></Link>
            </nav>
        </header >
    )
}

export default Header;