import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, profile, loading } = useContext(AuthContext);

  // Enquanto carrega a sessão/perfil
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Carregando...
      </div>
    );
  }

  // Se não estiver logado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o perfil ainda não carregou
  if (!profile) {
    return <Navigate to="/" replace />;
  }

  // Se o tipo de usuário não for permitido
  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Tudo ok → libera acesso
  return children;
}
