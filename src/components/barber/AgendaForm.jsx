import { useState } from "react";

export default function AgendaForm({ onChange }) {
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!day || !time) return;

    onChange((prev) => {
      const dayIndex = prev.findIndex((d) => d.day === day);

      // Se o dia ainda não existe
      if (dayIndex === -1) {
        return [...prev, { day, slots: [time] }];
      }

      // Se o horário já existe nesse dia, não adiciona
      if (prev[dayIndex].slots.includes(time)) {
        return prev;
      }

      // Adiciona horário ao dia existente
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        slots: [...updated[dayIndex].slots, time],
      };

      return updated;
    });

    setTime("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      <select
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm"
      >
        <option value="">Dia da semana</option>
        <option value="monday">Segunda</option>
        <option value="tuesday">Terça</option>
        <option value="wednesday">Quarta</option>
        <option value="thursday">Quinta</option>
        <option value="friday">Sexta</option>
        <option value="saturday">Sábado</option>
        <option value="sunday">Domingo</option>
      </select>

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm"
      />

      <button className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium px-6 rounded-lg transition">
        Adicionar horário
      </button>
    </form>
  );
}
