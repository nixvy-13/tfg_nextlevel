// app/components/NewMissionForm.tsx
"use client";

import { DefaultMission } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function NewMissionForm({ defaultMissions }: { defaultMissions: DefaultMission[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsLoading(true);
    // ... (resto de la lógica) ...
  };
  
  const handleAddDefaultMission = (mission: DefaultMission) => {
    // ... (resto de la lógica) ...
  }

  return (
    // Tarjeta del formulario con fondo y borde oscuro
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">Crear nueva misión</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estilos para los campos de texto: fondo oscuro, borde sutil y foco neón */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la misión"
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción..."
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            rows={3}
          />
          <div className="flex items-center gap-4">
              <label htmlFor="reward" className="font-medium">Recompensa (XP):</label>
              <input
                type="number"
                id="reward"
                value={reward}
                onChange={(e) => setReward(Number(e.target.value))}
                className="p-2 bg-slate-700 border border-slate-600 rounded w-24 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                min="5"
                step="5"
              />
          </div>
          {/* Botón primario con estilo neón */}
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:text-slate-400">
            {isLoading ? 'Creando...' : 'Añadir Misión'}
          </button>
        </form>
         <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="font-semibold text-slate-300">O elige una misión predeterminada:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {/* Botones secundarios con estilo oscuro */}
                {defaultMissions.map(m => (
                    <button key={m.id} onClick={() => handleAddDefaultMission(m)} className="px-3 py-1 bg-slate-700 text-sm rounded-full hover:bg-slate-600 transition-colors">
                        {m.title}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}
