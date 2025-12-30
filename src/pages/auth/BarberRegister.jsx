import { useState } from "react";
import { supabase } from "../../lib/supabase";
import InputRegister from "../../components/InputRegister";
import BackButton from "../../components/BackButton";
import { useNavigate } from "react-router-dom";

export default function BarberRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para limpar o slug enquanto o usuário digita
  const formatSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Substitui espaços por hifen
      .replace(/[^\w-]+/g, ""); // Remove caracteres especiais
  };

  async function handleRegister(e) {
    e.preventDefault();

    const finalSlug = formatSlug(slug);

    if (!name.trim() || !shopName.trim() || !finalSlug) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);

    try {
      // 1. PRÉ-VERIFICAÇÃO: Evita erro 500 verificando se o slug já existe
      const { data: existingShop, error: checkError } = await supabase
        .from("barber_shops")
        .select("slug")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (checkError) throw new Error("Erro ao validar link único.");

      if (existingShop) {
        alert(
          "Este link já está em uso. Escolha outro nome para sua barbearia."
        );
        setLoading(false);
        return;
      }

      // 2. SIGNUP: Envia os dados para o Auth e para o Trigger do banco
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            role: "barber",
            shop_name: shopName.trim(),
            slug: finalSlug,
          },
        },
      });

      if (authError) throw authError;

      // 3. SUCESSO
      alert(
        "Conta e Barbearia criadas! Verifique seu e-mail para confirmar o acesso."
      );
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
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
        <div className="mb-2">
          <h1 className="text-zinc-100 text-xl font-bold">Criar conta</h1>
          <p className="text-zinc-500 text-sm">Painel do Barbeiro</p>
        </div>

        <InputRegister
          type="text"
          placeholder="Seu Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <InputRegister
          type="text"
          placeholder="Nome da Barbearia"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500 ml-2">
            Seu link: barbearia.com/{formatSlug(slug) || "..."}
          </label>
          <InputRegister
            type="text"
            placeholder="Ex: barbearia-do-bairro"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <hr className="border-zinc-800 my-2" />

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
          className="mt-4 bg-amber-600 hover:bg-amber-500 text-zinc-900 font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Processando..." : "Cadastrar Barbearia"}
        </button>
      </form>
    </section>
  );
}
