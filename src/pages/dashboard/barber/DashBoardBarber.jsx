import { useState, useContext } from "react";
import { LogOut } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

import ServiceForm from "../../../components/barber/ServiceForm";
import ServiceList from "../../../components/barber/ServiceList";

import AgendaForm from "../../../components/barber/AgendaForm";
import AgendaList from "../../../components/barber/AgendaList";

import BookingList from "../../../components/barber/BookingList";

export default function DashboardBarber() {
  const { signOut } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("home");
  const [services, setServices] = useState([]);
  const [agenda, setAgenda] = useState([]);

  const [bookings] = useState([
    {
      id: "1",
      client: "João Silva",
      service: "Corte de cabelo",
      price: 25,
      date: "2025-01-23",
      time: "10:00",
    },

    {
      id: "2",
      client: "Matheus Henrique",
      service: "Corte de cabelo",
      price: 25,
      date: "2025-01-23",
      time: "11:00",
    },

    {
      id: "3",
      client: "Lucas Rocha",
      service: "Barba",
      price: 15,
      date: "2025-01-23",
      time: "13:00",
    },
  ]);

  function handleAddService(service) {
    setServices((prev) => [...prev, service]);
  }

  function handleDeleteService(id) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard da Barbearia</h1>
          <p className="text-zinc-400">
            Gerencie seus serviços, agenda e clientes
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

      {/* Abas */}
      <nav className="flex gap-6 border-b border-zinc-800 mb-8">
        {[
          { key: "home", label: "Visão Geral" },
          { key: "services", label: "Serviços" },
          { key: "agenda", label: "Agenda" },
          { key: "bookings", label: "Agendamentos" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === tab.key
                ? "text-amber-500 border-b-2 border-amber-500"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Conteúdo */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {activeTab === "home" && (
          <>
            <h2 className="text-lg font-medium mb-4">Resumo do dia</h2>
            <p className="text-zinc-400 text-sm">
              Aqui você verá os agendamentos de hoje e um resumo da barbearia.
            </p>
          </>
        )}

        {activeTab === "services" && (
          <>
            <h2 className="text-lg font-medium mb-4">Serviços</h2>

            <ServiceForm onAdd={handleAddService} />

            <ServiceList services={services} onDelete={handleDeleteService} />
          </>
        )}

        {activeTab === "agenda" && (
          <>
            <h2 className="text-lg font-medium mb-4">Agenda</h2>

            <AgendaForm agenda={agenda} onChange={setAgenda} />

            <AgendaList agenda={agenda} onChange={setAgenda} />
          </>
        )}

        {activeTab === "bookings" && (
          <>
            <h2 className="text-lg font-medium mb-4">Agendamentos de hoje</h2>

            <BookingList bookings={bookings} />
          </>
        )}
      </section>
    </section>
  );
}
