import { useState, useContext, useEffect } from "react";
import { LogOut, Copy, ExternalLink } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

import ServiceForm from "../../../components/barber/ServiceForm";
import ServiceList from "../../../components/barber/ServiceList";
import AgendaForm from "../../../components/barber/AgendaForm";
import AgendaList from "../../../components/barber/AgendaList";
import BookingList from "../../../components/barber/BookingList";

export default function DashboardBarber() {
  const { signOut, profile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("home");
  const [services, setServices] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingAgenda, setLoadingAgenda] = useState(true);

  // Extração da barbearia
  const shop = profile?.barber_shops?.[0];

  // --- BUSCAR SERVIÇOS E AGENDA DO SUPABASE ---
  useEffect(() => {
    async function fetchData() {
      if (!shop?.id) return;

      try {
        // Busca Serviços
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("barber_shop_id", shop.id)
          .order("created_at", { ascending: true });

        setServices(servicesData || []);

        // Busca Horários da Agenda
        const { data: agendaData } = await supabase
          .from("barber_slots")
          .select("*")
          .eq("barber_shop_id", shop.id)
          .order("start_time", { ascending: true });

        setAgenda(agendaData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error.message);
      } finally {
        setLoadingServices(false);
        setLoadingAgenda(false);
      }
    }

    fetchData();
  }, [shop?.id]);

  // Funções de manipulação de Serviços
  function handleAddService(newService) {
    setServices((prev) => [...prev, newService]);
  }

  function handleDeleteService(id) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  // Funções de manipulação de Agenda
  function handleAddSlot(newSlot) {
    setAgenda((prev) => [...prev, newSlot]);
  }

  function handleDeleteSlot(id) {
    setAgenda((prev) => prev.filter((a) => a.id !== id));
  }

  const [bookings] = useState([
    {
      id: "1",
      client: "João Silva",
      service: "Corte de cabelo",
      price: 25,
      date: "2025-01-23",
      time: "10:00",
    },
  ]);

  const publicUrl = shop
    ? `${window.location.origin}/agendar/${shop.slug}`
    : "";

  function handleCopyLink() {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    alert("Link da barbearia copiado!");
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            {shop ? shop.name : "Dashboard da Barbearia"}
          </h1>
          <p className="text-zinc-400">
            Olá, {profile?.full_name || "Barbeiro"}! Gerencie seu negócio.
          </p>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition"
        >
          <LogOut size={18} />
          Sair
        </button>
      </header>

      <nav className="flex gap-6 border-b border-zinc-800 mb-8 overflow-x-auto">
        {[
          { key: "home", label: "Visão Geral" },
          { key: "services", label: "Serviços" },
          { key: "agenda", label: "Agenda" },
          { key: "bookings", label: "Agendamentos" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.key
                ? "text-amber-500 border-b-2 border-amber-500"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {activeTab === "home" && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium mb-2">Resumo do dia</h2>
            {shop ? (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Seu link de agendamento
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-zinc-400 hover:text-amber-500 transition"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-zinc-400 hover:text-amber-500 transition"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
                <div className="bg-zinc-950 p-3 rounded border border-zinc-800 select-all overflow-x-auto">
                  <p className="text-amber-500 font-mono text-sm">
                    {publicUrl}
                  </p>
                </div>
              </div>
            ) : (
              <p>Carregando barbearia...</p>
            )}
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Gerenciar Serviços</h2>
            <ServiceForm barberShopId={shop?.id} onAdd={handleAddService} />
            {loadingServices ? (
              <p className="text-zinc-500 text-sm">Carregando serviços...</p>
            ) : (
              <ServiceList services={services} onDelete={handleDeleteService} />
            )}
          </div>
        )}

        {activeTab === "agenda" && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Horários de Funcionamento</h2>
            {/* AgendaForm agora recebe o shopId e a função de adicionar */}
            <AgendaForm barberShopId={shop?.id} onAdd={handleAddSlot} />

            {loadingAgenda ? (
              <p className="text-zinc-500 text-sm">Carregando agenda...</p>
            ) : (
              <AgendaList agenda={agenda} onDelete={handleDeleteSlot} />
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <>
            <h2 className="text-lg font-medium mb-4">Agendamentos</h2>
            <BookingList bookings={bookings} />
          </>
        )}
      </main>
    </section>
  );
}
