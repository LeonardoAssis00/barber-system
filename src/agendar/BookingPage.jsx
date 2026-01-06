import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [selectedService, setSelectedService] = useState(null);
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShop() {
      // 1. Buscar barbearia pelo slug
      const { data: shopData, error } = await supabase
        .from("barber_shops")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        setLoading(false);
        return;
      }

      setShop(shopData);

      // 2. Buscar serviços da barbearia
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("barber_shop_id", shopData.id)
        .order("created_at");

      setServices(servicesData || []);
      setLoading(false);
    }

    loadShop();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Carregando barbearia...
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

  function handleAction(serviceId) {
    if (!user) {
      navigate("/login/user");
      return;
    }

    setSelectedService(serviceId);
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">{shop.name}</h1>
          <p className="text-zinc-400 text-sm">
            Escolha um serviço para agendar
          </p>
        </header>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-zinc-400">{service.duration} min</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-amber-500 font-semibold">
                  R$ {service.price}
                </span>

                <button
                  onClick={() => handleAction(service.id)}
                  className="bg-amber-600 hover:bg-amber-500 text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  {user ? "Agendar" : "Entrar"}
                </button>
              </div>
            </div>
          ))}

          {selectedService && (
            <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <p className="text-sm text-amber-500 font-medium">
                Serviço selecionado
              </p>
              <p className="text-xs text-zinc-400">
                Próximo passo: escolher um horário disponível
              </p>
            </div>
          )}

          {services.length === 0 && (
            <p className="text-zinc-500 text-sm">Nenhum serviço cadastrado.</p>
          )}
        </div>
      </div>
    </section>
  );
}
