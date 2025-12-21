import { useState } from "react";
import { supabase } from "../../lib/supabase";
import InputRegister from "../../components/InputRegister";
import BackButton from "../../components/BackButton";

export default function BarberRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name,
      role: "barber",
    });

    if (profileError) {
      alert(profileError.message);
    } else {
      alert("Conta de barbeiro criada! Verifique seu email.");
    }

    setLoading(false);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-4 shadow-xl"
      >
        <h1 className="text-zinc-100 font-bold p-3">Criar conta (Barbeiro)</h1>

        <InputRegister
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
        />

        <InputRegister
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputRegister
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="mt-4 bg-amber-600 hover:bg-amber-500 text-zinc-900 font-semibold py-3 rounded-lg transition-all duration-200"
        >
          {loading ? "Criando..." : "Cadastrar"}
        </button>
      </form>
    </section>
  );
}
