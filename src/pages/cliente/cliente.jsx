import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiUser, FiPackage, FiMapPin, FiPhone, FiLock, FiLogOut } from "react-icons/fi";

import "../../css/cliente.css";

function Cliente() {
    const navigate = useNavigate();
    const location = useLocation();

    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const user = auth?.user || {};

    const isGoogleUser =
        !!user?.google_id || !!user?.email?.includes("gmail");

    function handleLogout() {
        localStorage.removeItem("auth");
        localStorage.removeItem("auth_token");
        navigate("/login");
    }

    function isActive(path) {
        return location.pathname.startsWith(path);
    }

    return (
        <main className="perfil">
            <div className="perfil-container">

                <aside className="perfil-menu">

                    <Link
                        to=""
                        className={`menu-item ${location.pathname === "/cliente" ? "active" : ""}`}
                    >
                        <FiUser className="menu-icon" />
                        Meu Perfil
                    </Link>

                    <Link
                        to="pedidos"
                        className={`menu-item ${isActive("/cliente/pedidos") ? "active" : ""}`}
                    >
                        <FiPackage className="menu-icon" />
                        Meus Pedidos
                    </Link>

                    <Link
                        to="enderecos"
                        className={`menu-item ${isActive("/cliente/enderecos") ? "active" : ""}`}
                    >
                        <FiMapPin className="menu-icon" />
                        Endereços
                    </Link>

                    <Link
                        to="contatos"
                        className={`menu-item ${isActive("/cliente/contatos") ? "active" : ""}`}
                    >
                        <FiPhone className="menu-icon" />
                        Contatos
                    </Link>

                    {!isGoogleUser && (
                        <Link
                            to="senha"
                            className={`menu-item ${isActive("/cliente/senha") ? "active" : ""}`}
                        >
                            <FiLock className="menu-icon" />
                            Alterar Senha
                        </Link>
                    )}

                    <div className="menu-item logout" onClick={handleLogout}>
                        <FiLogOut className="menu-icon" />
                        Sair
                    </div>

                </aside>

                <section className="perfil-content">
                    <Outlet />
                </section>

            </div>
        </main>
    );
}

export default Cliente;