import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ReactNode } from "react";

import Header from "./components/header";
import Footer from "./components/footer";

import Home from "./pages/cliente/home";
import Catalogo from "./pages/cliente/catalogo";
import Carrinho from "./pages/cliente/carrinho";
import Produto from "./pages/cliente/produto";

import Cliente from "./pages/cliente/cliente";
import ClientePerfil from "./pages/cliente/clientePerfil";
import ClientePedidos from "./pages/cliente/clientePedidos";
import ClienteEnderecos from "./pages/cliente/clienteEnderecos";
import ClienteSenha from "./pages/cliente/clienteSenha";
import ClienteContatos from "./pages/cliente/clienteContatos";

import Admin from "./pages/admin/admin";
import Login from "./pages/login";
import NotFound from "./pages/notFound";


function hasAuth() {
  const token = localStorage.getItem("auth_token");
  const auth = localStorage.getItem("auth");
  return Boolean(token || auth);
}

function hasRole(requiredRole: string) {
  try {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return false;

    const auth = JSON.parse(authRaw);

    const tipo = auth?.user?.tipo || auth?.tipo;

    return String(tipo).toLowerCase() === requiredRole.toLowerCase();
  } catch {
    return false;
  }
}

function RequireAdmin({ children }: { children: ReactNode }) {
  if (!hasAuth()) return <Navigate to="/login" replace />;

  if (!hasRole("administrador")) return <Navigate to="/" replace />;

  return children;
}

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login";

  return (
    <div className="app">
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/produtos" element={<Catalogo />} />

        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/produto/:id_produto" element={<Produto />} />

        <Route path="/perfil" element={<ClientePerfil />} />
        <Route path="/pedidos" element={<ClientePedidos />} />
        <Route path="/enderecos" element={<ClienteEnderecos />} />
        <Route path="/contatos" element={<ClienteContatos />} />
        <Route path="/senha" element={<ClienteSenha />} />

        <Route path="/cliente" element={<Cliente />}>
          <Route index element={<ClientePerfil />} />
          <Route path="pedidos" element={<ClientePedidos />} />
          <Route path="enderecos" element={<ClienteEnderecos />} />
          <Route path="contatos" element={<ClienteContatos />} />
          <Route path="senha" element={<ClienteSenha />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;