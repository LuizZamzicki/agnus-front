import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/login.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const tipo = searchParams.get("tipo");
    const errorParam = searchParams.get("error");
    const success = searchParams.get("success");
    const redirectMessage = sessionStorage.getItem("auth_redirect_message");

    if (redirectMessage) {
      setError(redirectMessage);
      sessionStorage.removeItem("auth_redirect_message");
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else if (token && tipo) {
      if (tipo === "administrador") {
        localStorage.setItem("auth", JSON.stringify({ token, tipo }));
        localStorage.setItem("auth_token", token);

        const url = new URL(window.location);
        url.searchParams.delete("token");
        url.searchParams.delete("tipo");
        url.searchParams.delete("success");
        window.history.replaceState(null, "", url);
        navigate("/admin", { replace: true });
      } else if (tipo === "cliente") {
        localStorage.setItem("auth", JSON.stringify({ token, tipo }));
        localStorage.setItem("auth_token", token);

        const url = new URL(window.location);
        url.searchParams.delete("token");
        url.searchParams.delete("tipo");
        url.searchParams.delete("success");
        window.history.replaceState(null, "", url);
        navigate("/home", { replace: true });
      } else {
        setError("Tipo de usuario nao permitido.");
      }
    } else if (success) {
      setError("");
    }
  }, [searchParams, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.message || "Falha no login.");
        return;
      }

      const userType = data?.tipo;
      if (userType !== "administrador") {
        setError("Acesso restrito a administradores.");
        return;
      }

      const token = data?.token || data?.access_token || data?.accessToken;
      localStorage.setItem("auth", JSON.stringify(data));
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("Erro ao conectar no servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${API_BASE}/auth/google`;
  }

  return (
    <main className="login">
      <section className="login-panel">
        <div className="login-brand">
          <span className="login-eyebrow">Agnus Admin</span>
          <h1>Entrar</h1>
          <p>Use suas credenciais para acessar o painel.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="voce@agnus.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="login-label">Senha</label>
          <input
            className="login-input"
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <button className="login-btn ghost" type="button" onClick={handleGoogleLogin}>
          Entrar com Google
        </button>
      </section>
    </main>
  );
}

export default Login;
