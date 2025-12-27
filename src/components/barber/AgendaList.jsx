import { Trash2 } from "lucide-react";

const dayLabels = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function AgendaList({ agenda, onChange }) {
  if (agenda.length === 0) {
    return (
      <p className="text-zinc-400 text-sm">Nenhum horário definido ainda.</p>
    );
  }

  function handleRemove(day, time) {
    const confirm = window.confirm(
      `Deseja remover o horário ${time} de ${dayLabels[day]}?`
    );

    if (!confirm) return;

    onChange((prev) =>
      prev
        .map((item) =>
          item.day === day
            ? {
                ...item,
                slots: item.slots.filter((slot) => slot !== time),
              }
            : item
        )
        // remove o dia se ficar sem horários
        .filter((item) => item.slots.length > 0)
    );
  }

  return (
    <div className="space-y-6">
      {agenda.map((item) => (
        <div
          key={item.day}
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-4"
        >
          <h3 className="font-medium mb-3">{dayLabels[item.day]}</h3>

          <div className="flex flex-wrap gap-2">
            {item.slots.map((time) => (
              <div
                key={time}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
              >
                <span>{time}</span>

                <button
                  onClick={() => handleRemove(item.day, time)}
                  className="text-zinc-400 hover:text-red-400 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
