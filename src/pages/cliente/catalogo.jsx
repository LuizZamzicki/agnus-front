import { useState, useEffect } from "react";
import "../../css/cliente/catalogo.css";
import { Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Catalogo() {

    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("Todos");
    const [ordem, setOrdem] = useState("relevancia");

    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3000/";

    async function carregarProdutos(pag = 1) {
        try {

            let url = `${BASE_URL}products/catalog?page=${pag}&limit=12`;

            if (categoria !== "Todos") {
                url += `&id_categoria=${categoria}`;
            }

            if (busca) {
                url += `&search=${encodeURIComponent(busca)}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            const lista = Array.isArray(data) ? data : data.data || [];

            const produtosTratados = lista.map(prod => ({
                ...prod,
                imagens: (prod.imagens || []).map(img => `${BASE_URL}${img}`)
            }));

            setProdutos(produtosTratados);
            setTotalPaginas(data.pagination?.totalPages || 1);

        } catch (err) {
            console.error("Erro produtos:", err);
        }
    }

    async function carregarCategorias() {
        try {
            const res = await fetch(`${BASE_URL}categories`);
            const data = await res.json();
            setCategorias(data.data || []);
        } catch (err) {
            console.error("Erro categorias:", err);
        }
    }

    useEffect(() => {
        carregarProdutos(pagina);
    }, [pagina, categoria, busca]);

    useEffect(() => {
        carregarCategorias();
    }, []);

    const produtosOrdenados = [...produtos].sort((a, b) => {
        if (ordem === "menor") return a.preco_base - b.preco_base;
        if (ordem === "maior") return b.preco_base - a.preco_base;
        return 0;
    });

    return (
        <div className="catalog-page">

            <section className="catalog-hero">
                <span>EXPLORE</span>
                <h1>CATÁLOGO</h1>
                <p>Encontre a peça perfeita que une fé e performance</p>
            </section>

            <div className="catalog-container">

                <aside className="catalog-sidebar">
                    <span><Filter size={22} /> FILTROS</span>

                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        value={busca}
                        onChange={(e) => {
                            setBusca(e.target.value);
                            setPagina(1);
                        }}
                    />

                    <div className="filter-group">
                        <span>CATEGORIA</span>
                        <ul>
                            <li
                                className={categoria === "Todos" ? "active" : ""}
                                onClick={() => {
                                    setCategoria("Todos");
                                    setPagina(1);
                                }}
                            >
                                Todos
                            </li>

                            {categorias.map(cat => (
                                <li
                                    key={cat.id_categoria}
                                    className={Number(categoria) === cat.id_categoria ? "active" : ""}
                                    onClick={() => {
                                        setCategoria(cat.id_categoria);
                                        setPagina(1);
                                    }}
                                >
                                    {cat.nome}
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
                        Página {pagina} de {totalPaginas}
                    </p>

                    <div className="catalog-grid">

                        {produtosOrdenados.map(prod => {

                            const imgPadrao = prod.imagens?.[0];
                            const imgHover = prod.imagens?.[1] || imgPadrao;

                            return (
                                <div className="product-card" key={prod.id_produto}>

                                    {prod.mais_vendido && (
                                        <span className="tag">MAIS VENDIDO</span>
                                    )}

                                    <div className="product-image">
                                        <img src={imgPadrao} className="img-default" />
                                        <img src={imgHover} className="img-hover" />
                                    </div>

                                    <div className="product-info">
                                        <h3>{prod.nome}</h3>
                                        <span>
                                            R$ {Number(prod.preco_base || 0).toLocaleString("pt-BR", {
                                                minimumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>

                                    <div className="product-hover">
                                        <button onClick={() => navigate(`/produto/${prod.id_produto}`)}>
                                            VER PRODUTO
                                        </button>
                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    <div className="pagination">
                        <button
                            disabled={pagina === 1}
                            onClick={() => setPagina(pagina - 1)}
                        >
                            ←
                        </button>

                        <span>{pagina} / {totalPaginas}</span>

                        <button
                            disabled={pagina === totalPaginas}
                            onClick={() => setPagina(pagina + 1)}
                        >
                            →
                        </button>
                    </div>

                </section>

            </div>
        </div>
    );
}

export default Catalogo;