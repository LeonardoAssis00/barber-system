import { useState } from "react";

export default function ServiceForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  function formatPrice(value) {
    if (!value) return "";
    const number = Number(value.replace(",", "."));
    if (isNaN(number)) return "";
    return number.toFixed(2);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !price || !duration) return;

    onAdd({
      id: crypto.randomUUID(),
      name,
      price: Number(price), // 🔥 número puro
      duration: Number(duration),
    });

    setName("");
    setPrice("");
    setDuration("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      <input
        placeholder="Nome do serviço"
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Preço (ex: 25.00)"
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm"
        value={price}
        onChange={(e) => setPrice(e.target.value.replace(/[^0-9.,]/g, ""))}
        onBlur={() => setPrice(formatPrice(price))} // ✅ converte ao sair
      />

      <input
        type="number"
        placeholder="Duração (min)"
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button className="md:col-span-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium py-3 rounded-lg transition">
        Cadastrar serviço
      </button>
    </form>
  );
}
