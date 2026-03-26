import { useState } from "react";
import "../../css/cliente/catalogo.css";
import { Filter } from "lucide-react";
import { Link } from "react-router-dom";

const productsData = [
    { id: 1, nome: "Camiseta Fortaleza", categoria: "Camisetas", preco: 129.9, tag: "MAIS VENDIDO", img: "/product-photos" },
    { id: 2, nome: "Camiseta Leveza", categoria: "Camisetas", preco: 119.9, tag: "NOVO", img: "/img/camisa-branca.png" },
    { id: 3, nome: "Regata Guerreiro", categoria: "Regatas", preco: 99.9, tag: "MAIS VENDIDO", img: "/img/regata.png" },
    { id: 4, nome: "Shorts Performance", categoria: "Shorts", preco: 109.9, img: "/img/shorts.png" },
    { id: 5, nome: "Legging Virtude", categoria: "Leggings", preco: 149.9, tag: "NOVO", img: "/img/legging.png" },
    { id: 6, nome: "Hoodie Refúgio", categoria: "Hoodies", preco: 189.9, img: "/img/hoodie.png" },
];

function Catalogo() {

    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("Todos");
    const [ordem, setOrdem] = useState("relevancia");

    const filtrarProdutos = () => {
        let produtos = [...productsData];

        produtos = produtos.filter(p =>
            p.nome.toLowerCase().includes(busca.toLowerCase())
        );

        if (categoria !== "Todos") {
            produtos = produtos.filter(p => p.categoria === categoria);
        }

        if (ordem === "menor") {
            produtos.sort((a, b) => a.preco - b.preco);
        } else if (ordem === "maior") {
            produtos.sort((a, b) => b.preco - a.preco);
        }

        return produtos;
    };

    const produtosFiltrados = filtrarProdutos();

    return (
        <div className="catalog-page">
            <section className="catalog-hero">
                <span>EXPLORE</span>
                <h1>CATÁLOGO</h1>
                <p>Encontre a peça perfeita que une fé e performance</p>
            </section>
            <div className="catalog-container">
                <aside className="catalog-sidebar">
                    <span><Filter size={22} className="filter-ico" />FILTROS</span>
                    <input
                        type="text"
                        placeholder="Descrição do produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <div className="filter-group">
                        <span>CATEGORIA</span>
                        <ul>
                            {["Todos", "Camisetas", "Regatas", "Shorts", "Leggings", "Hoodies"].map(cat => (
                                <li
                                    key={cat}
                                    className={categoria === cat ? "active" : ""}
                                    onClick={() => setCategoria(cat)}
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <span>ORDENAR POR</span>
                        <select onChange={(e) => setOrdem(e.target.value)}>
                            <option value="relevancia">Relevância</option>
                            <option value="menor">Menor preço</option>
                            <option value="maior">Maior preço</option>
                        </select>
                    </div>

                </aside>

                <section className="catalog-products">
                    <p className="catalog-count">
                        {produtosFiltrados.length} produtos encontrados
                    </p>
                    <div className="catalog-grid">
                        {produtosFiltrados.map(prod => (
                            <div className="product-card" key={prod.id}>

                                {prod.tag && (
                                    <span className={`tag ${prod.tag === "NOVO" ? "new" : ""}`}>
                                        {prod.tag}
                                    </span>
                                )}

                                <img src={prod.img} alt="" />

                                <h3>{prod.nome}</h3>
                                <span>
                                    R$ {prod.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </span>

                                <div className="product-hover">
                                    <Link to='/produto'><button>COMPRAR</button></Link>
                                </div>

                            </div>
                        ))}

                    </div>

                </section>

            </div>
        </div>
    );
}

export default Catalogo;