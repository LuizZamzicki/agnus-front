import "../../css/cliente/home.css";
import hero from "../../img/hero.png";
import { Brush, Truck, Shield } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

function Home() {

    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const res = await fetch("http://localhost:3000/products/catalog");
                const data = await res.json();

                const BASE_URL = "http://localhost:3000";

                const produtosTratados = data.map(prod => ({
                    ...prod,
                    imagens: (() => {
                        try {
                            return prod.imagens_json
                                ? JSON.parse(prod.imagens_json).map(img => BASE_URL + img)
                                : [];
                        } catch {
                            return [];
                        }
                    })()
                }));

                setProdutos(produtosTratados);

            } catch (err) {
                console.error(err);
            }
        }

        carregarProdutos();
    }, []);

    return (
        <main className="home">

            {/* HERO */}
            <section
                className="hero"
                style={{ backgroundImage: `url(${hero})` }}
            >
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

            {/* BENEFÍCIOS */}
            <section className="benefits">
                <div className="benefit">
                    <span><Truck size={22} /></span>
                    FRETE GRÁTIS ACIMA DE R$ 250
                </div>

                <div className="benefit">
                    <span><Brush size={22} /></span>
                    PRINT-ON-DEMAND EXCLUSIVO
                </div>

                <div className="benefit">
                    <span><Shield size={22} /></span>
                    PAGAMENTO 100% SEGURO
                </div>
            </section>

            {/* MAIS VENDIDOS (PEGANDO DO BACKEND) */}
            <section className="best-sellers">

                <div className="section-title">
                    <span>DESTAQUES</span>
                    <h2>MAIS VENDIDOS</h2>
                </div>

                <div className="best-grid">

                    {produtos.slice(0, 3).map(prod => (

                        <div className="best-product" key={prod.id_produto}>

                            <div className="product-image">
                                <img
                                    src={prod.imagens[0] || hero}
                                    alt={prod.nome}
                                    onError={(e) => e.target.src = hero}
                                />
                            </div>

                            <div className="product-info">
                                <h3>{prod.nome || prod.descricao}</h3>
                                <span>
                                    R$ {Number(prod.preco_base).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </div>

                        </div>

                    ))}

                </div>

            </section>

            {/* CATÁLOGO COM SWIPER */}
            <section className="catalog">

                <div className="section-title">
                    <span>COLEÇÃO COMPLETA</span>
                    <h2>CATÁLOGO</h2>
                </div>

                <div className="catalog-swiper">

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={4}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3500 }}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            600: { slidesPerView: 2 },
                            900: { slidesPerView: 3 },
                            1200: { slidesPerView: 4 }
                        }}
                    >

                        {produtos.map(prod => {

                            const imagens = Array.isArray(prod.imagens)
                                ? prod.imagens
                                : [];

                            return (
                                <SwiperSlide key={prod.id_produto}>

                                    <div className="product-card">

                                        <div className="product-image">

                                            <Swiper
                                                modules={[Autoplay]}
                                                slidesPerView={1}
                                                autoplay={{ delay: 2500 }}
                                            >

                                                {(imagens.length > 0 ? imagens : [hero]).map((img, i) => (
                                                    <SwiperSlide key={i}>
                                                        <img src={img} alt={prod.descricao} />
                                                    </SwiperSlide>
                                                ))}

                                            </Swiper>

                                        </div>

                                        <div className="product-info">
                                            <h3>{prod.descricao}</h3>
                                            <span>
                                                R$ {Number(prod.preco_base || 0).toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2
                                                })}
                                            </span>
                                        </div>

                                        <div className="product-hover">
                                            <button>ADICIONAR</button>
                                        </div>

                                    </div>

                                </SwiperSlide>
                            );
                        })}

                    </Swiper>

                </div>

            </section>

        </main>
    );
}

export default Home;