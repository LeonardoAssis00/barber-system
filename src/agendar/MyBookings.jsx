import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import BackButton from "../components/BackButton";

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login/user");
      return;
    }

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
        console.error(error);
      }

      setBookings(data || []);
      setLoading(false);
    }

    loadBookings();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Carregando agendamentos...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="absolute top-6 left-6">
        <BackButton />
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Meus agendamentos</h1>

        {bookings.length === 0 && (
          <p className="text-zinc-500 text-sm">
            Você ainda não possui agendamentos.
          </p>
        )}

        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2"
          >
            <p className="font-medium">{booking.barber_shops?.name}</p>

            <p className="text-sm text-zinc-400">
              Serviço: {booking.services?.name}
            </p>

            <p className="text-sm text-zinc-400">
              Data: {booking.date} às {booking.time}
            </p>

            <span
              className={`inline-block px-3 py-1 text-xs rounded-full ${
                booking.status === "confirmed"
                  ? "bg-green-600 text-green-100"
                  : booking.status === "canceled"
                  ? "bg-red-600 text-red-100"
                  : "bg-zinc-700 text-zinc-200"
              }`}
            >
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
