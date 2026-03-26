import "../../css/cliente/carrinho.css";
import { Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Carrinho() {
    const [cart, setCart] = useState([]);

    const alterarQtd = (id, tipo) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const novaQtd = tipo === "add" ? item.quantidade + 1 : item.quantidade - 1;
                return { ...item, quantidade: novaQtd < 1 ? 1 : novaQtd };
            }
            return item;
        }));
    };

    const removerItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <h1>SEU CARRINHO ESTÁ VAZIO</h1>

                <span><ShoppingBag size={60} /></span>
                <p>
                    Parece que você ainda não adicionou nada ao carrinho.
                </p>

                <Link to="/catalogo" className="empty-btn">Ver Catálogo</Link>

            </div>
        );
    }

    return (
        <div className="cart-page">

            <Link to="/catalogo" className="back-link">← Continuar comprando</Link>

            <h1>CARRINHO</h1>

            <div className="cart-container">

                <div className="cart-items">
                    {cart.map(item => (
                        <div className="cart-item" key={item.id}>

                            <img src={item.img} alt="" />

                            <div className="cart-info">
                                <h3>{item.nome}</h3>
                                <span>{item.variacao}</span>

                                <div className="qtd">
                                    <button onClick={() => alterarQtd(item.id, "remove")}>-</button>
                                    <span>{item.quantidade}</span>
                                    <button onClick={() => alterarQtd(item.id, "add")}>+</button>
                                </div>
                            </div>

                            <div className="cart-price">
                                <span>
                                    R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2
                                    })}
                                </span>

                                <Trash2
                                    size={18}
                                    className="delete"
                                    onClick={() => removerItem(item.id)}
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
                            R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="summary-line">
                        <span>Frete</span>
                        <span className="free">Grátis</span>
                    </div>

                    <hr />

                    <div className="summary-total">
                        <span>TOTAL</span>
                        <strong>
                            R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </strong>
                    </div>

                    <button className="finish-btn">FINALIZAR COMPRA</button>

                    <p className="obs">
                        Pagamento seguro · Produção em até 7 dias úteis
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Carrinho;