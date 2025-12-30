import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import InputRegister from "../../components/InputRegister";
import BackButton from "../../components/BackButton";

export default function BarberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // 🔽 BUSCAR PROFILE APÓS LOGIN
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      alert("Erro ao carregar perfil do usuário");
      setLoading(false);
      return;
    }

    if (profile.role !== "barber") {
      alert("Esta conta não é de barbeiro");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // ✅ LOGIN COMPLETO
    navigate("/dashboard/barber");
    setLoading(false);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-4 shadow-xl"
      >
        <h1 className="text-xl font-semibold text-zinc-100 p-3">
          Login da Barbearia
        </h1>

        <InputRegister
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputRegister
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
