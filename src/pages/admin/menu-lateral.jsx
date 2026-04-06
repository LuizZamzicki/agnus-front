import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  LayoutDashboard,
  List,
  LogOut,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

function obterMenuAtivo(pathname) {
  if (pathname.startsWith("/admin/dashboard")) return "dashboard";
  if (pathname.startsWith("/admin/usuarios")) return "usuarios";
  if (pathname.startsWith("/admin/categorias")) return "produtos-categoria";
  if (pathname.startsWith("/admin/pedidos")) return "pedidos";
  return "produtos-listar";
}

function caminhoPorMenu(menu) {
  switch (menu) {
    case "dashboard":
      return "/admin/dashboard";
    case "usuarios":
      return "/admin/usuarios";
    case "produtos-listar":
      return "/admin/produtos";
    case "produtos-categoria":
      return "/admin/categorias";
    case "pedidos":
      return "/admin/pedidos";
    default:
      return "/admin/produtos";
  }
}

function AdminMenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeMenu = obterMenuAtivo(location.pathname);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    if (activeMenu.startsWith("produtos")) {
      setExpandedMenu("produtos");
    }
  }, [activeMenu]);

  function irParaMenu(menu) {
    navigate(caminhoPorMenu(menu));
  }

  function toggleSubmenu(menu) {
    setExpandedMenu((prev) => (prev === menu ? null : menu));
  }

  function handleLogout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("auth_token");
    navigate("/login", { replace: true });
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__logo">
          <span className="admin-sidebar__logo-text">AG</span>
        </div>
        <h3>Agnus Admin</h3>
      </div>

      <nav className="admin-sidebar__nav">
        <button
          className={`admin-nav-item ${activeMenu === "dashboard" ? "active" : ""}`}
          onClick={() => irParaMenu("dashboard")}
        >
          <LayoutDashboard className="admin-nav-icon" size={20} />
          <span className="admin-nav-label">Dashboard</span>
        </button>

        <button
          className={`admin-nav-item ${activeMenu === "usuarios" ? "active" : ""}`}
          onClick={() => irParaMenu("usuarios")}
        >
          <Users className="admin-nav-icon" size={20} />
          <span className="admin-nav-label">Usuarios</span>
        </button>

        <div className="admin-nav-group">
          <button
            className={`admin-nav-item ${activeMenu?.startsWith("produtos") ? "active" : ""}`}
            onClick={() => toggleSubmenu("produtos")}
          >
            <Package className="admin-nav-icon" size={20} />
            <span className="admin-nav-label">Produtos</span>
            <span className={`admin-nav-arrow ${expandedMenu === "produtos" ? "open" : ""}`}>
              {">"}
            </span>
          </button>

          {expandedMenu === "produtos" && (
            <div className="admin-nav-submenu">
              <button
                className={`admin-nav-subitem ${activeMenu === "produtos-listar" ? "active" : ""}`}
                onClick={() => irParaMenu("produtos-listar")}
              >
                <List className="admin-subnav-icon" size={18} />
                <span className="admin-nav-label">Listar Produtos</span>
              </button>
              <button
                className={`admin-nav-subitem ${activeMenu === "produtos-categoria" ? "active" : ""}`}
                onClick={() => irParaMenu("produtos-categoria")}
              >
                <FolderOpen className="admin-subnav-icon" size={18} />
                <span className="admin-nav-label">Categoria</span>
              </button>
            </div>
          )}
        </div>

        <button
          className={`admin-nav-item ${activeMenu === "pedidos" ? "active" : ""}`}
          onClick={() => irParaMenu("pedidos")}
        >
          <ShoppingCart className="admin-nav-icon" size={20} />
          <span className="admin-nav-label">Pedidos</span>
        </button>
      </nav>

      <div className="admin-sidebar__footer">
        <button className="admin-nav-item logout" onClick={handleLogout}>
          <LogOut className="admin-nav-icon" size={20} />
          <span className="admin-nav-label">Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminMenuLateral;
