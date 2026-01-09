import { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatTime(time) {
  if (!time) return "";

  return time.slice(0, 5); // HH:MM
}

export default function MyBookings() {
  const { user } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          date,
          time,
          status,
          services ( name, price ),
          barber_shops ( name )
        `
        )
        .eq("client_id", user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }

      setBookings(data || []);
      setLoading(false);
    }

    loadBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="text-sm text-zinc-400">
        Faça login para visualizar seus agendamentos.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-sm text-zinc-400">Carregando agendamentos...</div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="border border-zinc-800 rounded-lg p-4 text-sm text-zinc-400">
        Você ainda não possui agendamentos.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border border-zinc-800 rounded-xl p-4 bg-zinc-900 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-zinc-100">
              {booking.barber_shops?.name}
            </p>

            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                booking.status === "confirmed"
                  ? "bg-green-600/20 text-green-400"
                  : booking.status === "canceled"
                  ? "bg-red-600/20 text-red-400"
                  : "bg-zinc-700 text-zinc-200"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="text-sm text-zinc-400">
            <p>Serviço: {booking.services?.name}</p>
            <p>
              Data: {formatDate(booking.date)} às {formatTime(booking.time)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
