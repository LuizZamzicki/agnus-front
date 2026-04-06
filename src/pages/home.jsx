import { Link } from "react-router-dom";
import "../css/home.css";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <h1>Vista sua fe. Supere seus limites.</h1>
        <p>
          Roupas fitness com identidade catolica. Treine com proposito e represente sua fe
          dentro e fora da academia.
        </p>

        <Link className="btn-principal" to="/produtos">
          Ver Produtos
        </Link>
      </section>

      <section className="produtos">
        <h2>Produtos em Destaque</h2>

        <div className="grid-produtos">
          <div className="produto">
            <img src="/img/camisa1.jpg" alt="Camisa Agnus" />
            <h3>Camiseta Agnus</h3>
            <p>R$ 79,90</p>
          </div>

          <div className="produto">
            <img src="/img/camisa2.jpg" alt="Camiseta Faith" />
            <h3>Camiseta Faith</h3>
            <p>R$ 79,90</p>
          </div>

          <div className="produto">
            <img src="/img/camisa3.jpg" alt="Camiseta Cross" />
            <h3>Camiseta Cross</h3>
            <p>R$ 79,90</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
