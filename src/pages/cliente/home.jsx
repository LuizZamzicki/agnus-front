import "../../css/cliente/home.css";
import hero from "../../img/hero.png";
import { Brush, Truck, Shield } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay } from "swiper/modules";

function Home() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtro, setFiltro] = useState("todos");
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3000/";

    // Função para carregar os produtos (alterada para Best Sellers)
    async function carregarProdutos(pag = 1) {
        try {
            // URL para pegar os produtos mais vendidos (Best Sellers)
            const url = `${BASE_URL}products/best-sellers?page=${pag}&limit=8`;

            const res = await fetch(url);
            const data = await res.json();

            const lista = Array.isArray(data.data) ? data.data : [];

            const produtosTratados = lista.map(prod => ({
                ...prod,
                imagens: (prod.imagens || []).map(img =>
                    `${BASE_URL}${img}`),
                categoria_id: prod.id_categoria
            }));

            setProdutos(produtosTratados);
            setTotalPaginas(data.pagination?.totalPages || 1);

        } catch (err) {
            console.error("Erro produtos:", err);
        }
    }

    // Função para carregar as categorias
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
    }, [pagina]);

    useEffect(() => {
        carregarCategorias();
    }, []);

    return (
        <main className="home">
            <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
                <div className="hero-text">
                    <span className="tag-home">SAÚDE • FÉ • PROPÓSITO</span>
                    <h1>
                        VISTA SUA FÉ.<br />
                        <span>SUPERE SEUS LIMITES.</span>
                    </h1>
                    <p>
                        Roupas fitness com identidade católica. Produção sob demanda,
                        exclusividade e consciência em cada peça.
                    </p>
                    <div className="hero-buttons">
                        <a className="btn-primary" href="#">VER COLEÇÃO</a>
                        <a className="btn-secondary" href="#">SAIBA MAIS</a>
                    </div>
                </div>
            </section>

            <section className="benefits">
                <div className="benefit"><span><Truck size={22} /></span>FRETE GRÁTIS ACIMA DE R$ 250</div>
                <div className="benefit"><span><Brush size={22} /></span>PRINT-ON-DEMAND EXCLUSIVO</div>
                <div className="benefit"><span><Shield size={22} /></span>PAGAMENTO 100% SEGURO</div>
            </section>

            <section className="best-sellers">
                <div className="section-title">
                    <span>DESTAQUES</span>
                    <h2>MAIS VENDIDOS</h2>
                </div>

                <div className="catalog-swiper">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={25}
                        slidesPerView={3}
                        loop={true}
                        autoplay={{ delay: 2500 }}
                        breakpoints={{ 320: { slidesPerView: 1 }, 600: { slidesPerView: 2 }, 900: { slidesPerView: 3 } }}
                    >
                        {produtos.map(prod => {
                            const imgPadrao = prod.imagens[0] || hero;
                            const imgHover = prod.imagens[1] || imgPadrao;

                            return (
                                <SwiperSlide key={prod.id_produto}>
                                    <div className="product-card">
                                        <div className="product-image">
                                            <img src={imgPadrao} className="img-default" />
                                            <img src={imgHover} className="img-hover" />
                                        </div>

                                        <div className="product-info">
                                            <h3>{prod.nome}</h3>
                                            <span>
                                                R$ {Number(prod.preco_base || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                        <div className="product-hover">
                                            <button onClick={() => navigate(`/produto/${prod.id_produto}`)}>
                                                VER PRODUTO
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </section>

            <section className="catalog">
                <div className="section-title">
                    <span>COLEÇÃO COMPLETA</span>
                    <h2>CATÁLOGO</h2>
                </div>

                <div className="catalog-filters">
                    <button
                        className={filtro === "todos" ? "active" : ""}
                        onClick={() => {
                            setFiltro("todos");
                            setPagina(1);
                        }}
                    >
                        TODOS
                    </button>

                    {categorias.map(cat => (
                        <button
                            key={cat.id_categoria}
                            className={Number(filtro) === cat.id_categoria ? "active" : ""}
                            onClick={() => {
                                setFiltro(cat.id_categoria);
                                setPagina(1);
                            }}
                        >
                            {cat.nome.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="catalog-grid-home">
                    {produtos.length > 0 ? (
                        produtos.map(prod => {
                            const imgPadrao = prod.imagens[0] || hero;
                            const imgHover = prod.imagens[1] || imgPadrao;

                            return (
                                <div className="product-card" key={prod.id_produto}>
                                    <div className="product-image">
                                        <img src={imgPadrao} className="img-default" />
                                        <img src={imgHover} className="img-hover" />
                                    </div>

                                    <div className="product-info">
                                        <h3>{prod.nome}</h3>
                                        <span>
                                            R$ {Number(prod.preco_base || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="product-hover">
                                        <button onClick={() => navigate(`/produto/${prod.id_produto}`)}>
                                            VER PRODUTO
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-products">Nenhum produto encontrado.</p>
                    )}
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

        </main>
    );
}

export default Home;