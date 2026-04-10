import { Search, User, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import "../css/cliente/app.css";
import "../css/cliente/header.css";
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
                {/* <Link to="/produtos" className="nav-link">Produtos</Link> */}
                {/* <Link to="/contato" className="nav-link">Contato</Link> */}

                <Link to="/admin" className="nav-link">Admin</Link>
            </nav>

            <nav className="opcoes_header">
                <Link to="/catalogo"><Search size={22} /></Link>
                <Link to="/login"><User size={22} /></Link>
                <Link to="/carrinho"><ShoppingBag size={22} /></Link>
            </nav>
        </header>
    );
}

export default Header;