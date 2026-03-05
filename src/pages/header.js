import "../css/header.css"

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <h1>Agnus⨥</h1>
            </div>

            <nav className="menu_header">
                <a href="#">Home</a>
                <a href="#">Produtos</a>
                <a href="#">Contato</a>
                <a href="#">Sobre</a>
            </nav>

            <nav className="opcoes_header">
                <a href="#">Lupa</a>
                <a href="#">Conta</a>
                <a href="#">Sacola</a>
            </nav>
        </header>

    )
}

export default Header;