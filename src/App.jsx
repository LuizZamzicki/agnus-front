import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Contato from "./pages/contato";
import Home from "./pages/home";

function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>

      <main style={{ flex: 1 }}>

      </main>

      <Footer />
    </div>
  );
}

export default App; 