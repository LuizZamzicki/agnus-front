import "../css/app.css"
import "../css/footer.css"
import { Instagram, Mail } from "lucide-react";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-menu">
                    <h5 className="escritaCentro">PRINT ON DEMAND</h5>
                    <h1 className="escritaPrincipal">Cada peça é feita para você</h1>
                    <p className="descricao">Sem estoque parado, sem desperdício.
                        Sua peça é produzida sob demanda com qualidade <br />premium e entregue
                        diretamente para você. Exclusividade com propósito.</p>
                    <div className="container-btn">
                        <a className="btn-compra" href="#">COMPRAR AGORA</a>
                    </div>

                </div>
                <div className="footer-rodape">
                    <div className="footer-baixo">
                        <div className="footer-desc">
                            <h3>AGNUS<span>†</span></h3>
                            <p>
                                Roupas fitness com identidade católica. Vista sua fé, supere seus
                                limites.
                            </p>
                        </div>
                        <div className="footer-links">
                            <h4>LINKS</h4>
                            <a href="#">Início</a>
                            <a href="#">Carrinho</a>
                            <a href="#">Minha Conta</a>
                        </div>
                        <div className="footer-contato">
                            <h4>CONTATO</h4>
                            <a href="#"><Instagram size={22} className="ico" /> agnus.fit</a>
                            <a href="#"><Mail size={22} className="ico" /> contato@agnus.fit</a>
                        </div>
                    </div>
                    <div className="footer-copy">
                        <p>
                            © 2026 AGNUS. Todos os direitos reservados. Print-on-demand —
                            produção consciente, sem desperdício.
                        </p>
                        <p className="developed">
                            Developed by
                            <a href="#" className="linkSocial"> Bruno Medeiros </a> and
                            <a href="#" className="linkSocial"> Luiz Zamzicki </a>
                        </p>
                    </div>
                </div>
            </div>

        </footer >
    )
}

export default Footer;