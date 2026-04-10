import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/cliente/produto.css";

function Produto() {
    const { id_produto } = useParams();
    const BASE_URL = "http://localhost:3000/";
    const navigate = useNavigate();

    const [produto, setProduto] = useState(null);
    const [imagens, setImagens] = useState([]);
    const [cores, setCores] = useState([]);
    const [tamanhos, setTamanhos] = useState([]);
    const [relacionados, setRelacionados] = useState([]);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [corSelecionada, setCorSelecionada] = useState(null);
    const [loading, setLoading] = useState(true);

    const adicionarCarrinho = async () => {

        if (!Number.isInteger(tamanhoSelecionado) || !Number.isInteger(corSelecionada)) {
            alert("Selecione tamanho e cor válidos!");
            return;
        }

        try {
            const id_usuario = 1;

            // 🔥 BUSCAR CARRINHO
            const res = await fetch(`${BASE_URL}carts?id_usuario=${id_usuario}`);
            const carrinhos = await res.json();

            let carrinho;

            if (!Array.isArray(carrinhos) || carrinhos.length === 0) {
                console.log("Criando novo carrinho...");

                const novo = await fetch(`${BASE_URL}carts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_usuario })
                });

                carrinho = await novo.json();
            } else {
                carrinho = carrinhos[0];
            }

            // 🔥 VALIDAÇÃO CRÍTICA
            if (!carrinho || !carrinho.id_carrinho) {
                console.error("Carrinho inválido:", carrinho);
                alert("Erro ao obter carrinho");
                return;
            }

            const preco = Number(produto.preco_base ?? produto.preco ?? 0);

            const payload = {
                id_carrinho: Number(carrinho.id_carrinho),
                id_produto_cor: Number(corSelecionada),
                id_produto_grade: Number(tamanhoSelecionado),
                quantidade: 1,
                preco_unitario: preco
            };

            console.log("🚀 PAYLOAD:", payload);

            // 🔥 ENVIO
            const response = await fetch(`${BASE_URL}cart-items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro API:", data);
                alert(data.message || "Erro ao adicionar item");
                return;
            }

            alert("Produto adicionado ao carrinho!");

        } catch (err) {
            console.error("Erro geral:", err);
            alert("Erro ao adicionar ao carrinho");
        }
    };

    useEffect(() => {
        async function carregarProduto() {
            try {
                const resProduto = await fetch(`${BASE_URL}products/${id_produto}`);
                const dataProduto = await resProduto.json();
                setProduto(dataProduto);

                const resImagens = await fetch(`${BASE_URL}product-photos/${id_produto}`);
                const dataImagens = await resImagens.json();
                setImagens((dataImagens || []).map(img => `${BASE_URL}${img.caminho_url}`));

                const resCores = await fetch(`${BASE_URL}product-colors/${id_produto}`);
                const dataCores = await resCores.json();
                setCores(Array.isArray(dataCores) ? dataCores : dataCores.data || []);

                const resGrades = await fetch(`${BASE_URL}product-grades/${id_produto}`);
                const dataGrades = await resGrades.json();
                setTamanhos(Array.isArray(dataGrades) ? dataGrades : dataGrades.data || []);

                const resTodos = await fetch(`${BASE_URL}products/catalog`);
                const todosProdutos = (await resTodos.json()).data || [];

                const relacionadosFiltrados = todosProdutos
                    .filter(p =>
                        p.id_produto !== dataProduto.id_produto &&
                        (
                            p.id_categoria === dataProduto.id_categoria ||
                            p.nome.toLowerCase().includes(
                                dataProduto.nome.split(" ")[0].toLowerCase()
                            )
                        )
                    )
                    .slice(0, 4);

                setRelacionados(relacionadosFiltrados);

            } catch (err) {
                console.error("Erro ao carregar produto:", err);
            } finally {
                setLoading(false);
            }
        }

        carregarProduto();
    }, [id_produto]);

    if (loading) return <p>Carregando produto...</p>;
    if (!produto) return <p>Produto não encontrado.</p>;

    const imgPadrao = imagens[0] || null;

    return (
        <div className="produto-page">

            <div className="produto-container">

                <div className="produto-img">
                    <div className="thumbs">
                        {imagens.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() =>
                                    setImagens([img, ...imagens.filter(i => i !== img)])
                                }
                                className={img === imgPadrao ? "active" : ""}
                            />
                        ))}
                    </div>

                    <div className="img-main">
                        {imgPadrao && <img src={imgPadrao} alt={produto.nome} />}
                    </div>
                </div>

                <div className="produto-info">

                    {produto.mais_vendido && (
                        <span className="badge">MAIS VENDIDO</span>
                    )}

                    <h1>{produto.nome}</h1>

                    <h2>
                        R$ {Number(produto.preco_base ?? produto.preco).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                        })}
                    </h2>

                    <p>{produto.descricao}</p>

                    {tamanhos.length > 0 && (
                        <div className="produto-opcao">
                            <span>TAMANHO</span>
                            <div className="opcoes">
                                {tamanhos.map(t => (
                                    <button
                                        key={t.id_produto_grade}
                                        className={tamanhoSelecionado === t.id_produto_grade ? "active" : ""}
                                        onClick={() => setTamanhoSelecionado(Number(t.id_produto_grade))}
                                    >
                                        {t.nome}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {cores.length > 0 && (
                        <div className="produto-opcao">
                            <span>COR</span>
                            <div className="opcoes">
                                {cores.map(c => (
                                    <button
                                        key={c.id_produto_cor}
                                        className={corSelecionada === c.id_produto_cor ? "active" : ""}
                                        onClick={() => setCorSelecionada(Number(c.id_produto_cor))}
                                    >
                                        {c.nome}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="btn-comprar" onClick={adicionarCarrinho}>
                        ADICIONAR AO CARRINHO
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Produto;