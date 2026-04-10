import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";

import Contato from "./pages/cliente/contato";
import Home from "./pages/cliente/home";
import Catalogo from "./pages/cliente/catalogo";
import Carrinho from "./pages/cliente/carrinho";
import Produto from "./pages/cliente/produto";

import Admin from "./pages/admin/admin";
import Login from "./pages/login";
import { ReactNode } from "react";

function hasAuth() {
  try {
    const token = localStorage.getItem("auth_token");
    const authRaw = localStorage.getItem("auth");
    return Boolean(token || authRaw);
  } catch {
    return false;
  }
}

function hasRole(requiredRole: string) {
  try {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return false;
    const auth = JSON.parse(authRaw);
    return auth.tipo === requiredRole;
  } catch {
    return false;
  }
}

function RequireAdmin({ children }: { children: ReactNode }) {
  if (!hasAuth()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole("administrador")) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {!isAdminPage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/produto/:id_produto" element={<Produto />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
      </Routes>

      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;