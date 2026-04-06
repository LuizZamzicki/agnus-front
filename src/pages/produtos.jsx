import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import "../css/produtos.css";
import { fetchJsonPaginado } from "../utils/pagination";
import { formatarMoeda, normalizarProduto, obterInicial } from "../utils/produtos";

const ORDENACOES = [
  { value: "", label: "Ordenar" },
  { value: "preco-asc", label: "Menor preco" },
  { value: "preco-desc", label: "Maior preco" },
  { value: "nome-asc", label: "Nome A-Z" },
  { value: "recente", label: "Mais recentes" },
];

const PAGINACAO_INICIAL = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

function normalizarCategoria(item, index = 0) {
  return {
    id: item?.id ?? item?.id_categoria ?? item?.categoria_id ?? `categoria-${index}`,
    nome: item?.nome ?? item?.categoria ?? item?.categoria_nome ?? "-",
  };
}

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState(PAGINACAO_INICIAL);

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [ordenar, setOrdenar] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [busca, categoria, precoMin, precoMax, ordenar]);

  useEffect(() => {
    const abortController = new AbortController();

    async function carregar() {
      setLoading(true);
      setErro("");

      try {
        const [produtosResult, categoriasResult] = await Promise.all([
          fetchJsonPaginado("/products/catalog", {
            page: currentPage,
            limit,
            signal: abortController.signal,
          }),
          fetchJsonPaginado("/categories", {
            page: 1,
            limit: 100,
            signal: abortController.signal,
          }),
        ]);

        if (!produtosResult.response.ok) {
          setErro(produtosResult.payload?.message || "Nao foi possivel carregar os produtos.");
          return;
        }

        setProdutos(produtosResult.data.map(normalizarProduto));
        setPagination(produtosResult.pagination);
        if (produtosResult.request.page !== currentPage) {
          setCurrentPage(produtosResult.request.page);
        }
        if (produtosResult.request.limit !== limit) {
          setLimit(produtosResult.request.limit);
        }

        if (categoriasResult.response.ok) {
          setCategorias(categoriasResult.data.map((item, index) => normalizarCategoria(item, index)));
        } else {
          setCategorias([]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro("Erro ao conectar com o servidor.");
        }
      } finally {
        setLoading(false);
      }
    }

    carregar();
    return () => abortController.abort();
  }, [currentPage, limit]);

  const produtosFiltrados = useMemo(() => {
    const min = precoMin === "" ? null : Number(precoMin);
    const max = precoMax === "" ? null : Number(precoMax);

    const resultado = produtos.filter((produto) => {
      const nome = produto.nome.toLowerCase();
      const termo = busca.trim().toLowerCase();
      const bateBusca = termo === "" || nome.includes(termo);

      const bateCategoria =
        categoria === "" ||
        String(produto.categoriaId) === categoria ||
        String(produto.categoriaNome).toLowerCase() === categoria.toLowerCase();

      const bateMin = min === null || (!Number.isNaN(min) && produto.preco >= min);
      const bateMax = max === null || (!Number.isNaN(max) && produto.preco <= max);

      return bateBusca && bateCategoria && bateMin && bateMax;
    });

    return resultado.sort((a, b) => {
      switch (ordenar) {
        case "preco-asc":
          return a.preco - b.preco;
        case "preco-desc":
          return b.preco - a.preco;
        case "nome-asc":
          return a.nome.localeCompare(b.nome, "pt-BR");
        case "recente": {
          const dataA = new Date(a.dataCriacao || 0).getTime();
          const dataB = new Date(b.dataCriacao || 0).getTime();
          return dataB - dataA;
        }
        default:
          return 0;
      }
    });
  }, [produtos, busca, categoria, precoMin, precoMax, ordenar]);

  function limparFiltros() {
    setBusca("");
    setCategoria("");
    setPrecoMin("");
    setPrecoMax("");
    setOrdenar("");
  }

  function obterNomeCategoria(produto) {
    const categoriaEncontrada = categorias.find((item) => String(item.id) === String(produto.categoriaId));
    return categoriaEncontrada?.nome || produto.categoriaNome || "Sem categoria";
  }

  return (
    <main className="product-listing">
      <section className="listing-topbar">
        <p className="listing-eyebrow">Colecao Agnus</p>
        <h1 className="listing-title">Produtos</h1>
        <p className="listing-subtitle">
          Visual da sua outra base aplicado aqui, com filtro por categoria e preco conectado ao seu backend.
        </p>
      </section>

      <section className="listing-filters">
        <div className="filter-row">
          <label className="filter-search" htmlFor="busca-produto">
            <Search size={18} />
            <input
              id="busca-produto"
              type="search"
              placeholder="Buscar por nome"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </label>

          <select className="filter-select" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
            <option value="">Categorias</option>
            {categorias.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.nome}
              </option>
            ))}
          </select>

          <div className="price-range">
            <input
              type="number"
              min="0"
              placeholder="Preco min"
              value={precoMin}
              onChange={(event) => setPrecoMin(event.target.value)}
            />
            <span>ate</span>
            <input
              type="number"
              min="0"
              placeholder="Preco max"
              value={precoMax}
              onChange={(event) => setPrecoMax(event.target.value)}
            />
          </div>

          <select className="filter-select" value={ordenar} onChange={(event) => setOrdenar(event.target.value)}>
            {ORDENACOES.map((item) => (
              <option key={item.value || "default"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="filter-actions">
            <button type="button" className="filter-button" onClick={limparFiltros}>
              <SlidersHorizontal size={16} />
              Limpar filtros
            </button>
          </div>
        </div>
      </section>

      <section className="listing-section">
        <div className="section-title-wrap">
          <h2 className="section-title">Resultados</h2>
          <small>
            Pagina {pagination.page} de {pagination.totalPages} | {pagination.total} produto(s) no total
          </small>
        </div>

        {loading && <div className="listing-alert">Carregando produtos...</div>}
        {!loading && erro && <div className="listing-alert listing-alert--error">{erro}</div>}

        {!loading && !erro && produtosFiltrados.length === 0 && (
          <div className="listing-empty">
            <p>Nenhum produto encontrado com os filtros selecionados.</p>
          </div>
        )}

        {!loading && !erro && produtosFiltrados.length > 0 && (
          <>
            <div className={produtosFiltrados.length === 1 ? "product-grid single-item" : "product-grid"}>
              {produtosFiltrados.map((produto) => {
                const imagem = produto.fotos[0] || "";
                const estrelas = Math.round(produto.mediaAvaliacao || 0);

                return (
                  <Link className="produto-card-link" to={`/produtos/${produto.id}`} key={produto.id}>
                    <article className="produto-card">
                      <div className="produto-card__media">
                        {imagem ? (
                          <img src={imagem} alt={produto.nome} loading="lazy" />
                        ) : (
                          <div className="produto-card__placeholder">
                            <span>{obterInicial(produto.nome)}</span>
                          </div>
                        )}
                      </div>

                      <div className="produto-info">
                        <small className="produto-categoria">{obterNomeCategoria(produto)}</small>
                        <p className="produto-nome">{produto.nome}</p>
                        <p className="produto-preco">{formatarMoeda(produto.preco)}</p>

                        <div className="produto-rating">
                          <div className="rating-stars" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map((item) => (
                              <Star key={item} size={14} className={item <= estrelas ? "is-filled" : ""} />
                            ))}
                          </div>
                          <small>
                            {produto.mediaAvaliacao.toFixed(1)} ({produto.totalAvaliacoes})
                          </small>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            <div className="listing-pagination">
              <div className="listing-pagination__meta">
                <select className="filter-select" value={limit} onChange={(event) => { setCurrentPage(1); setLimit(Number(event.target.value) || 12); }}>
                  <option value={12}>12 por pagina</option>
                  <option value={24}>24 por pagina</option>
                  <option value={36}>36 por pagina</option>
                </select>
                <span>{produtosFiltrados.length} item(ns) exibido(s) nesta pagina</span>
              </div>

              <div className="listing-pagination__actions">
                <button
                  type="button"
                  className="filter-button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPreviousPage}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="filter-button"
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={!pagination.hasNextPage}
                >
                  Proxima
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Produtos;
