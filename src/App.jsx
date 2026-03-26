import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Contato from "./pages/cliente/contato";
import Home from "./pages/cliente/home";
import Catalogo from "./pages/cliente/catalogo";
import Carrinho from "./pages/cliente/carrinho"
import Produto from "./pages/cliente/produto"

function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/produto" element={<Produto />} />
      </Routes>

      <main style={{ flex: 1 }}>

      </main>

      <Footer />
    </div>
  );
}

export default App; 