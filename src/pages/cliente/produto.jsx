import { useState } from "react";
import "../../css/cliente/produto.css";
import { Link } from "react-router-dom";

function Produto() {

    const produto = {
        nome: "CAMISETA FORTALEZA — FILIPENSES 4:13",
        preco: 129.90,
        descricao: "Camiseta dry-fit premium com estampa sutil de Filipenses 4:13. Tecido leve e respirável para treinos intensos.",
        imagens: ["/img/camisa-preta.png"],
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Preto", "Cinza Chumbo"]
    };

    const [tamanho, setTamanho] = useState(null);
    const [cor, setCor] = useState(null);

    return (
        <div className="produto-page">

            <div className="produto-container">

                <div className="produto-img">
                    <img src={produto.imagens[0]} alt="" />
                </div>

                <div className="produto-info">

                    <span className="badge">MAIS VENDIDO</span>

                    <h1>{produto.nome}</h1>

                    <h2>
                        R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </h2>

                    <p>{produto.descricao}</p>

                    <div className="produto-opcao">
                        <span>TAMANHO</span>
                        <div className="opcoes">
                            {produto.tamanhos.map(t => (
                                <button
                                    key={t}
                                    className={tamanho === t ? "active" : ""}
                                    onClick={() => setTamanho(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="produto-opcao">
                        <span>COR</span>
                        <div className="opcoes">
                            {produto.cores.map(c => (
                                <button
                                    key={c}
                                    className={cor === c ? "active" : ""}
                                    onClick={() => setCor(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="btn-comprar">
                        ADICIONAR AO CARRINHO
                    </button>

                    <div className="produto-extra">
                        <span>✔ Produção em até 7 dias úteis</span>
                        <span>🚚 Frete grátis acima de R$ 250</span>
                    </div>

                </div>

            </div>

            <div className="relacionados">
                <h3>PRODUTOS RELACIONADOS</h3>

                <div className="grid-relacionados">

                    <div className="card">
                        <img src="/img/camisa-branca.png" alt="" />
                        <p>Camiseta Leveza</p>
                        <span>R$ 119,90</span>
                    </div>

                    <div className="card">
                        <img src="/img/regata.png" alt="" />
                        <p>Regata Guerreiro</p>
                        <span>R$ 99,90</span>
                    </div>

                    <div className="card">
                        <img src="/img/shorts.png" alt="" />
                        <p>Shorts Performance</p>
                        <span>R$ 109,90</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Produto;