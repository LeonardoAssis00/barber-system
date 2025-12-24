import { LogOut } from "lucide-react";

export default function DashboardBarber() {
  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      {/* Header */}
      <section className="flex justify-between p-3">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard da Barbearia</h1>
          <p className="text-zinc-400">
            Gerencie seus serviços, agenda e clientes
          </p>
        </header>

        <section>
          <button>
            <LogOut />
          </button>
        </section>
      </section>

      {/* Cards de resumo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm text-zinc-400">Serviços cadastrados</h2>
          <span className="text-2xl font-bold text-amber-500">0</span>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm text-zinc-400">Agendamentos hoje</h2>
          <span className="text-2xl font-bold text-amber-500">0</span>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm text-zinc-400">Clientes ativos</h2>
          <span className="text-2xl font-bold text-amber-500">0</span>
        </section>
      </section>

      {/* Área principal */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Seus serviços</h2>

        <section className="text-zinc-400 text-sm">
          Nenhum serviço cadastrado ainda.
        </section>
      </section>
    </section>
  );
}
