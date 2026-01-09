export default function BookingList({ bookings }) {
  if (!bookings || bookings.length === 0) {
    return (
      <p className="text-zinc-400 text-sm">Nenhum agendamento encontrado.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => {
        const clientName = booking.client_name || "Cliente não identificado";

        const serviceName = booking.services?.name || "Serviço não informado";

        const servicePrice = booking.services?.price ?? 0;

        const formattedDate = new Date(booking.date).toLocaleDateString(
          "pt-BR"
        );

        const formattedTime = booking.time ? booking.time.slice(0, 5) : "--:--";

        return (
          <li
            key={booking.id}
            className="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-lg p-4"
          >
            <div>
              {/* CLIENTE */}
              <p className="font-medium text-zinc-100">{clientName}</p>

              {/* SERVIÇO + DATA + HORA */}
              <p className="text-sm text-zinc-400">
                {serviceName} • {formattedDate} às {formattedTime}
              </p>
            </div>

            {/* PREÇO */}
            <span className="text-amber-500 font-medium">
              R$ {servicePrice.toFixed(2)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
