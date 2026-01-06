import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const weekLabels = {
  sunday: "Dom",
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
};

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função de logout
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao sair:", error.message);
      return;
    }
    navigate("/login"); // redireciona após logout
  }

  useEffect(() => {
    async function loadData() {
      // 1️⃣ Buscar barbearia pelo slug
      const { data: shopData, error: shopError } = await supabase
        .from("barber_shops")
        .select("*")
        .eq("slug", slug)
        .single();

      if (shopError || !shopData) {
        setLoading(false);
        return;
      }

      setShop(shopData);

      // 2️⃣ Buscar serviços da barbearia
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("barber_shop_id", shopData.id)
        .order("created_at");

      setServices(servicesData || []);

      // 3️⃣ Buscar slots do barbeiro
      const { data: slotsData } = await supabase
        .from("barber_slots")
        .select("*")
        .eq("barber_shop_id", shopData.id);

      setSlots(slotsData || []);
      setLoading(false);
    }

    loadData();
  }, [slug]);

  async function loadBookings(date) {
    if (!shop) return;

    setSelectedDate(date);

    const { data } = await supabase
      .from("bookings")
      .select("time, status")
      .eq("barber_shop_id", shop.id)
      .eq("date", date)
      .neq("status", "canceled");

    setBookings(data || []);
  }

  function handleSelectDay(day) {
    setSelectedDay(day);

    const today = new Date();
    const target = new Date(today);

    while (
      target.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() !==
      day
    ) {
      target.setDate(target.getDate() + 1);
    }

    const formatted = target.toISOString().split("T")[0];
    loadBookings(formatted);
  }

  function handleSelectTime(time) {
    if (!user) {
      navigate(`/login/user?redirect=/agendar/${slug}`);
      return;
    }

    if (!selectedService) {
      alert("Selecione um serviço");
      return;
    }

    alert(
      `Agendamento:\n${selectedService.name}\n${weekLabels[selectedDay]} (${selectedDate}) - ${time}`
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Barbearia não encontrada
      </div>
    );
  }

  const availableDays = [...new Set(slots.map((s) => s.day_of_week))];
  const daySlots = slots.filter((s) => s.day_of_week === selectedDay);
  const bookedTimes = bookings.map((b) => b.time);

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header com botões */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{shop.name}</h1>

          <div className="flex gap-2">
            {user && (
              <>
                <button
                  onClick={() => navigate("/meus-agendamentos")}
                  className="text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
                >
                  Meus agendamentos
                </button>

                <button
                  onClick={signOut}
                  className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </>
            )}
          </div>
        </div>

        {/* Serviços */}
        <div className="space-y-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`w-full p-4 rounded-lg border text-left ${
                selectedService?.id === service.id
                  ? "border-amber-500 bg-zinc-800"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              <div className="flex justify-between">
                <span>{service.name}</span>
                <span className="text-amber-500">R$ {service.price}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dias */}
        {selectedService && (
          <div className="flex gap-2 overflow-x-auto">
            {availableDays.map((day) => (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedDay === day
                    ? "bg-amber-500 text-black"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {weekLabels[day]}
              </button>
            ))}
          </div>
        )}

        {/* Horários */}
        {selectedDay && (
          <div className="grid grid-cols-3 gap-3">
            {daySlots.map((slot) => {
              const isBooked = bookedTimes.includes(slot.start_time);

              return (
                <button
                  key={slot.id}
                  disabled={isBooked}
                  onClick={() => handleSelectTime(slot.start_time)}
                  className={`py-2 rounded-lg text-sm font-medium ${
                    isBooked
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-500 text-black"
                  }`}
                >
                  {slot.start_time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
