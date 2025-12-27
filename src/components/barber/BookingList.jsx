export default function BookingList({ bookings }) {
  if (bookings.length === 0) {
    return (
      <p className="text-zinc-400 text-sm">Nenhum agendamento para hoje.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => (
        <li
          key={booking.id}
          className="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-lg p-4"
        >
          <div>
            <p className="font-medium">{booking.client}</p>
            <p className="text-sm text-zinc-400">
              {booking.service} • {booking.time}
            </p>
          </div>

          <span className="text-amber-500 font-medium">
            R$ {booking.price.toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
}
