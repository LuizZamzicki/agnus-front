import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { fetchJsonPaginado } from "../../utils/pagination";
import { apiFetch, getAuthHeaders } from "./admin-api";

const PAGINACAO_INICIAL = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

function normalizarUsuario(item, index = 0) {
  return {
    id: item?.id_usuario ?? item?.id ?? item?.user_id ?? `usuario-${index}`,
    nome:
      item?.nome ??
      item?.nome_usuario ??
      item?.usuario_nome ??
      item?.name ??
      item?.username ??
      "-",
    email: item?.email ?? item?.email_usuario ?? item?.user_email ?? "-",
    tipo: item?.tipo ?? item?.role ?? item?.perfil ?? "-",
    dataCriacao: item?.data_criacao ?? item?.created_at ?? item?.dataCadastro ?? null,
  };
}

function formatarDataUsuario(valor) {
  if (!valor) return "-";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "-";

  return data.toLocaleDateString("pt-BR");
}

function formatarTipoUsuario(valor) {
  if (!valor || valor === "-") return "-";

  const mapa = {
    administrador: "Administrador",
    admin: "Administrador",
    cliente: "Cliente",
    usuario: "Usuario",
    user: "Usuario",
  };

  return mapa[String(valor).toLowerCase()] ?? String(valor);
}

function AdminUsuarioLista() {
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  const [usuariosError, setUsuariosError] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosBuscaFiltro, setUsuariosBuscaFiltro] = useState("");
  const [usuariosTipoFiltro, setUsuariosTipoFiltro] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(PAGINACAO_INICIAL);

  useEffect(() => {
    setCurrentPage(1);
  }, [usuariosBuscaFiltro, usuariosTipoFiltro]);

  useEffect(() => {
    let ativo = true;

    async function carregarUsuarios() {
      setUsuariosError("");
      setUsuariosLoading(true);

      try {
        const { response, payload, data, pagination: meta, request } = await fetchJsonPaginado("/users", {
          page: currentPage,
          limit,
          headers: getAuthHeaders(),
          fetcher: apiFetch,
        });

        if (!response.ok) {
          if (ativo) setUsuariosError(payload?.message || "Erro ao carregar usuarios.");
          return;
        }

        if (ativo) {
          setUsuarios(data.map((item, index) => normalizarUsuario(item, index)));
          setPagination(meta);
          if (request.page !== currentPage) {
            setCurrentPage(request.page);
          }
          if (request.limit !== limit) {
            setLimit(request.limit);
          }
        }
      } catch {
        if (ativo) setUsuariosError("Erro ao conectar no servidor.");
      } finally {
        if (ativo) setUsuariosLoading(false);
      }
    }

    carregarUsuarios();
    return () => {
      ativo = false;
    };
  }, [currentPage, limit]);

  const tiposDisponiveis = useMemo(() => {
    return [...new Set(usuarios.map((usuario) => usuario.tipo).filter((tipo) => tipo && tipo !== "-"))];
  }, [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    const busca = usuariosBuscaFiltro.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const bateBusca =
        !busca ||
        String(usuario.id).toLowerCase().includes(busca) ||
        usuario.nome.toLowerCase().includes(busca) ||
        usuario.email.toLowerCase().includes(busca) ||
        formatarTipoUsuario(usuario.tipo).toLowerCase().includes(busca);

      const bateTipo = usuariosTipoFiltro === "todos" || usuario.tipo === usuariosTipoFiltro;
      return bateBusca && bateTipo;
    });
  }, [usuarios, usuariosBuscaFiltro, usuariosTipoFiltro]);

  return (
    <div className="admin-products-list">
      <div className="admin-products-header">
        <div className="admin-list-filters">
          <input
            data-cy="usuario-busca"
            type="search"
            className="admin-form-input admin-list-filter-input"
            placeholder="Buscar por ID, nome, email ou tipo"
            value={usuariosBuscaFiltro}
            onChange={(e) => setUsuariosBuscaFiltro(e.target.value)}
          />
          <select
            data-cy="usuario-filtro-tipo"
            className="admin-form-input admin-list-filter-select"
            value={usuariosTipoFiltro}
            onChange={(e) => setUsuariosTipoFiltro(e.target.value)}
          >
            <option value="todos">Todos os tipos</option>
            {tiposDisponiveis.map((tipo) => (
              <option key={tipo} value={tipo}>
                {formatarTipoUsuario(tipo)}
              </option>
            ))}
          </select>
          <select
            data-cy="usuario-limit"
            className="admin-form-input admin-list-filter-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value) || 10)}
          >
            <option value={10}>10 por pagina</option>
            <option value={20}>20 por pagina</option>
            <option value={30}>30 por pagina</option>
          </select>
        </div>
      </div>

      {usuariosLoading ? (
        <div className="admin-products-empty">
          <Users size={48} />
          <p>Carregando usuarios...</p>
        </div>
      ) : usuariosError ? (
        <div className="admin-products-empty">
          <Users size={48} />
          <p>{usuariosError}</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="admin-products-empty">
          <Users size={48} />
          <p>Nenhum usuario encontrado</p>
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="admin-products-empty">
          <Users size={48} />
          <p>Nenhum usuario encontrado para os filtros informados.</p>
        </div>
      ) : (
        <>
          <div className="admin-products-table-wrapper">
            <table data-cy="usuario-tabela" className="admin-products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr data-cy={`usuario-linha-${usuario.id}`} key={usuario.id}>
                    <td data-cy="usuario-id">
                      {usuario.id}
                    </td>

                    <td
                      data-cy="usuario-nome"
                      className="admin-products-nome"
                    >
                      {usuario.nome}
                    </td>

                    <td data-cy="usuario-email">
                      {usuario.email}
                    </td>

                    <td data-cy="usuario-tipo">
                      {formatarTipoUsuario(usuario.tipo)}
                    </td>

                    <td data-cy="usuario-cadastro">
                      {formatarDataUsuario(usuario.dataCriacao)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div data-cy="usuario-paginacao" className="admin-list-pagination">
            <div className="admin-list-pagination__meta">
              <div className="admin-form-input admin-list-pagination__status">
                Pagina {pagination.page} de {pagination.totalPages}
              </div>
              <span>{pagination.total} usuario(s) no total</span>
            </div>

            <div className="admin-products-acoes">
              <button
                data-cy="usuario-anterior"
                className="admin-btn-novo"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.hasPreviousPage}
              >
                Anterior
              </button>
              <button
                data-cy="usuario-proxima"
                className="admin-btn-novo"
                onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={!pagination.hasNextPage}
              >
                Proxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminUsuarioLista;
