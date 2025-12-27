import { Trash2 } from "lucide-react";

export default function ServiceList({ services, onDelete }) {
  if (services.length === 0) {
    return (
      <p className="text-zinc-400 text-sm">Nenhum serviço cadastrado ainda.</p>
    );
  }

  function handleDelete(service) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o serviço "${service.name}"?`
    );

    if (!confirmed) return;

    onDelete(service.id);
  }

  return (
    <ul className="space-y-3">
      {services.map((service) => (
        <li
          key={service.id}
          className="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-lg p-4"
        >
          <div>
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-zinc-400">
              R$ {service.price.toFixed(2)} • {service.duration} min
            </p>
          </div>

          <button
            onClick={() => handleDelete(service)}
            className="text-zinc-400 hover:text-red-400 transition"
            title="Excluir serviço"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
