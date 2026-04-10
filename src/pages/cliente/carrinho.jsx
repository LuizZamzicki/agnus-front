import { useState, useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import "../../css/cliente/carrinho.css";

function Carrinho() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const id_usuario = 1;

    const BASE_URL = "http://localhost:3000/";

    // 🔒 Helper seguro pra JSON
    const safeJson = async (res) => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            console.error("❌ Resposta não é JSON:", text);
            return null;
        }
    };

    async function carregarCarrinho() {
        try {
            setLoading(true);

            // 🛒 Carrinho
            const carrinhoRes = await fetch(`${BASE_URL}carts?id_usuario=${id_usuario}`);
            const carrinhos = await safeJson(carrinhoRes);

            if (!carrinhos?.length) {
                setCart([]);
                return;
            }

            const carrinho = carrinhos[0];

            // 📦 Itens
            const itensRes = await fetch(`${BASE_URL}cart-items/${carrinho.id_carrinho}`);
            const itens = await safeJson(itensRes);

            if (!itens?.length) {
                setCart([]);
                return;
            }

            // 📚 Catálogo
            const catalogoRes = await fetch(`${BASE_URL}products/catalog`);
            const catalogoData = await safeJson(catalogoRes);
            const catalogo = catalogoData?.data || catalogoData || [];

            const cacheProdutos = {};

            const itensCompletos = await Promise.all(
                itens.map(async (item) => {

                    let produto = catalogo.find(p =>
                        Number(p.id_produto) === Number(item.id_produto)
                    );

                    let nomeCor = item.id_produto_cor;
                    let nomeTamanho = item.id_produto_grade;
                    let imagem = null;

                    if (produto?.id_produto) {

                        if (!cacheProdutos[produto.id_produto]) {

                            const [coresRes, gradesRes, fotosRes] = await Promise.all([
                                fetch(`${BASE_URL}product-colors/${produto.id_produto}`),
                                fetch(`${BASE_URL}product-grades/${produto.id_produto}`),
                                fetch(`${BASE_URL}product-photos/${produto.id_produto}`)
                            ]);

                            const coresData = await safeJson(coresRes);
                            const gradesData = await safeJson(gradesRes);
                            const fotosData = await safeJson(fotosRes);

                            const cores = Array.isArray(coresData) ? coresData : coresData?.data || [];
                            const grades = Array.isArray(gradesData) ? gradesData : gradesData?.data || [];
                            const fotos = Array.isArray(fotosData) ? fotosData : fotosData?.data || [];

                            cacheProdutos[produto.id_produto] = {
                                cores,
                                grades,
                                fotos
                            };
                        }

                        const { cores, grades, fotos } = cacheProdutos[produto.id_produto];

                        const corObj = cores.find(c =>
                            Number(c.id_produto_cor) === Number(item.id_produto_cor)
                        );

                        if (corObj) nomeCor = corObj.nome;

                        const gradeObj = grades.find(g =>
                            Number(g.id_produto_grade) === Number(item.id_produto_grade)
                        );

                        if (gradeObj) nomeTamanho = gradeObj.nome;

                        const foto = fotos.find(f =>
                            Number(f.id_produto_cor) === Number(item.id_produto_cor)
                        );

                        if (foto) {
                            imagem = `${BASE_URL}${foto.caminho_url}`;
                        }
                    }

                    return {
                        ...item,
                        nome_produto: produto?.nome || "Produto",
                        nome_cor: nomeCor,
                        nome_tamanho: nomeTamanho,
                        img: imagem
                    };
                })
            );

            setCart(itensCompletos);

        } catch (err) {
            console.error("🔥 ERRO AO CARREGAR CARRINHO:", err);
            setCart([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarCarrinho();
    }, []);

    async function alterarQtd(item, tipo) {
        const novaQtd =
            tipo === "add"
                ? item.quantidade + 1
                : item.quantidade - 1;

        if (novaQtd < 1) return;

        await fetch(`${BASE_URL}cart-items/${item.id_carrinho_item}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidade: novaQtd })
        });

        carregarCarrinho();
    }

    async function removerItem(id) {
        if (!window.confirm("Remover este produto?")) return;

        await fetch(`${BASE_URL}cart-items/${id}`, {
            method: "DELETE"
        });

        carregarCarrinho();
    }

    async function finalizarCompra() {
        await fetch(`${BASE_URL}pedidos/finalizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario })
        });

        alert("Compra finalizada!");
        carregarCarrinho();
    }

    const subtotal = cart.reduce(
        (acc, item) =>
            acc + Number(item.preco_unitario) * item.quantidade,
        0
    );

    if (loading) return <p style={{ padding: 40 }}>Carregando...</p>;

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <h1>SEU CARRINHO ESTÁ VAZIO</h1>
                <span><ShoppingBag size={60} /></span>
                <Link to="/catalogo" className="empty-btn">Ver Catálogo</Link>
            </div>
        );
    }

    return (
        <div className="cart-page">

            <Link to="/catalogo" className="back-link">
                ← Continuar comprando
            </Link>

            <h1>CARRINHO</h1>

            <div className="cart-container">

                <div className="cart-items">
                    {cart.map(item => (
                        <div className="cart-item" key={item.id_carrinho_item}>

                            {item.img && (
                                <img src={item.img} alt={item.nome_produto} />
                            )}

                            <div className="cart-info">
                                <h3>{item.nome_produto}</h3>

                                <span>
                                    Cor: {item.nome_cor} • Tam: {item.nome_tamanho}
                                </span>

                                <div className="qtd">
                                    <button onClick={() => alterarQtd(item, "remove")}>-</button>
                                    <span>{item.quantidade}</span>
                                    <button onClick={() => alterarQtd(item, "add")}>+</button>
                                </div>
                            </div>

                            <div className="cart-price">
                                <span>
                                    R$ {(item.preco_unitario * item.quantidade).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2
                                    })}
                                </span>

                                <Trash2
                                    className="delete"
                                    onClick={() => removerItem(item.id_carrinho_item)}
                                />
                            </div>

                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>RESUMO</h2>

                    <div className="summary-line">
                        <span>Subtotal</span>
                        <span>
                            R$ {subtotal.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </span>
                    </div>

                    <hr />

                    <div className="summary-total">
                        <span>TOTAL</span>
                        <strong>
                            R$ {subtotal.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </strong>
                    </div>

                    <button className="finish-btn" onClick={finalizarCompra}>
                        FINALIZAR COMPRA
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Carrinho;