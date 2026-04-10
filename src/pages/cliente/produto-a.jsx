import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import "../../css/cliente/produto.css";
import { fetchJsonPaginado } from "../../utils/pagination";
import { formatarMoeda, normalizarProduto, obterInicial } from "../../utils/produtos";

function normalizarCategoria(item, index = 0) {
  return {
    id: item?.id ?? item?.id_categoria ?? item?.categoria_id ?? `categoria-${index}`,
    nome: item?.nome ?? item?.categoria ?? item?.categoria_nome ?? "-",
  };
}

async function buscarProdutoPorId(id, signal) {
  const respostaDireta = await fetch(`/products/${id}`, { signal });
  const dataDireta = await respostaDireta.json().catch(() => null);

  if (respostaDireta.ok && dataDireta) {
    return Array.isArray(dataDireta) ? dataDireta[0] : dataDireta;
  }

  const respostaLista = await fetchJsonPaginado("/products", {
    page: 1,
    limit: 50,
    signal,
  });

  if (!respostaLista.response.ok) {
    return null;
  }

  return (
    respostaLista.data.find((item) => String(item?.id ?? item?.id_produto) === String(id)) || null
  );
}

function Produto() {
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [corAtiva, setCorAtiva] = useState(null);
  const [gradeAtiva, setGradeAtiva] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    const abortController = new AbortController();

    async function carregarDetalhe() {
      setLoading(true);
      setErro("");

      try {
        const rawProduto = await buscarProdutoPorId(id, abortController.signal);

        if (!rawProduto) {
          setErro("Produto nao encontrado.");
          return;
        }

        const produtoNormalizado = normalizarProduto(rawProduto);
        setProduto(produtoNormalizado);

        try {
          const respostaCategorias = await fetchJsonPaginado("/categories", {
            page: 1,
            limit: 100,
            signal: abortController.signal,
          });
          setCategorias(
            respostaCategorias.response.ok
              ? respostaCategorias.data.map((item, index) => normalizarCategoria(item, index))
              : []
          );
        } catch {
          setCategorias([]);
        }

        const primeiraCor = produtoNormalizado.cores[0] || null;
        const primeiraGrade = produtoNormalizado.grades[0] || null;

        setCorAtiva(primeiraCor?.id ?? null);
        setGradeAtiva(primeiraGrade?.id ?? null);

        const fotosIniciais =
          primeiraCor?.fotos?.length > 0 ? primeiraCor.fotos : produtoNormalizado.fotos;
        setImagemAtiva(fotosIniciais[0] || "");
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro("Erro ao carregar o produto.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarDetalhe();
    return () => abortController.abort();
  }, [id]);

  const corSelecionada = useMemo(
    () => produto?.cores?.find((item) => item.id === corAtiva) || null,
    [produto, corAtiva]
  );

  const gradeSelecionada = useMemo(
    () => produto?.grades?.find((item) => item.id === gradeAtiva) || null,
    [produto, gradeAtiva]
  );

  const imagensExibidas = useMemo(() => {
    if (!produto) return [];
    if (corSelecionada?.fotos?.length) return corSelecionada.fotos;
    return produto.fotos;
  }, [produto, corSelecionada]);

  useEffect(() => {
    if (!imagensExibidas.length) {
      setImagemAtiva("");
      return;
    }

    if (!imagemAtiva || !imagensExibidas.includes(imagemAtiva)) {
      setImagemAtiva(imagensExibidas[0]);
    }
  }, [imagensExibidas, imagemAtiva]);

  const precoFinal = useMemo(() => {
    if (!produto) return 0;
    const acrescimoCor = Number(corSelecionada?.acrescimo ?? 0);
    const acrescimoGrade = Number(gradeSelecionada?.acrescimo ?? 0);
    return produto.preco + acrescimoCor + acrescimoGrade;
  }, [produto, corSelecionada, gradeSelecionada]);

  function incrementarQuantidade() {
    setQuantidade((valorAtual) => valorAtual + 1);
  }

  function decrementarQuantidade() {
    setQuantidade((valorAtual) => Math.max(1, valorAtual - 1));
  }

  function obterCategoriaNome() {
    if (!produto) return "Sem categoria";
    const categoriaEncontrada = categorias.find((item) => String(item.id) === String(produto.categoriaId));
    return categoriaEncontrada?.nome || produto.categoriaNome || "Sem categoria";
  }

  if (loading) {
    return (
      <main className="produto-detalhe">
        <div className="produto-alert">Carregando produto...</div>
      </main>
    );
  }

  if (erro || !produto) {
    return (
      <main className="produto-detalhe">
        <div className="produto-alert produto-alert--error">{erro || "Produto nao encontrado."}</div>
        <Link className="produto-back" to="/produtos">
          <ArrowLeft size={16} />
          Voltar para produtos
        </Link>
      </main>
    );
  }

  const estrelas = Math.round(produto.mediaAvaliacao || 0);

  return (
    <main className="produto-detalhe">
      <Link className="produto-back" to="/produtos">
        <ArrowLeft size={16} />
        Voltar para produtos
      </Link>

      <section className="produto-hero">
        <div className="produto-gallery">
          <div className="produto-gallery__thumbs">
            {imagensExibidas.map((imagem, index) => (
              <button
                key={`${imagem}-${index}`}
                type="button"
                className={`thumb ${imagemAtiva === imagem ? "is-active" : ""}`}
                onClick={() => setImagemAtiva(imagem)}
              >
                <img src={imagem} alt={`${produto.nome} ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="produto-gallery__main">
            {imagemAtiva ? (
              <img src={imagemAtiva} alt={produto.nome} />
            ) : (
              <div className="produto-gallery__placeholder">
                <span>{obterInicial(produto.nome)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="produto-info-panel">
          <div className="produto-header">
            <div>
              <small className="produto-categoria">{obterCategoriaNome()}</small>
              <h1>{produto.nome}</h1>
            </div>
          </div>

          <div className="produto-rating">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star key={item} size={14} className={item <= estrelas ? "is-filled" : ""} />
            ))}
            <small>
              {produto.mediaAvaliacao.toFixed(1)} ({produto.totalAvaliacoes} avaliacoes)
            </small>
          </div>

          <p className="produto-preco">{formatarMoeda(precoFinal)}</p>

          {produto.cores.length > 0 && (
            <div className="produto-variacao">
              <span>Cores</span>
              <div className="variacao-cores">
                {produto.cores.map((cor) => (
                  <button
                    key={cor.id}
                    type="button"
                    className={`cor-chip ${corAtiva === cor.id ? "is-active" : ""}`}
                    onClick={() => setCorAtiva(cor.id)}
                  >
                    <span className="cor-dot" style={{ backgroundColor: cor.tonalidade }} />
                    {cor.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {produto.grades.length > 0 && (
            <div className="produto-variacao">
              <span>Tamanhos</span>
              <div className="variacao-grades">
                {produto.grades.map((grade) => (
                  <button
                    key={grade.id}
                    type="button"
                    className={`grade-chip ${gradeAtiva === grade.id ? "is-active" : ""}`}
                    onClick={() => setGradeAtiva(grade.id)}
                  >
                    {grade.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="produto-acoes">
            <div className="quantidade">
              <button type="button" className="qty-btn" onClick={decrementarQuantidade}>
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(event) => setQuantidade(Math.max(1, Number(event.target.value) || 1))}
              />
              <button type="button" className="qty-btn" onClick={incrementarQuantidade}>
                +
              </button>
            </div>

            <button type="button" className="cta-comprar cta-comprar--dourado">
              <ShoppingBag size={16} />
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </section>

      <section className="produto-descricao">
        <h2>Descricao</h2>
        <p>{produto.descricao || "Descricao do produto ainda nao informada."}</p>
      </section>
    </main>
  );
}

export default Produto;
