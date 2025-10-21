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
    if (!title || !description) return;

    setIsLoading(true);
    try {
      await fetch('/api/missions/Create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ title, description, experienceReward: reward }]),
      });
      // Limpiar formulario y refrescar la página
      setTitle('');
      setDescription('');
      setReward(10);
      router.refresh();
    } catch (error) {
      console.error('Failed to create mission:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddDefaultMission = (mission: DefaultMission) => {
    setTitle(mission.title);
    setDescription(mission.description);
    setReward(mission.experienceReward);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Crear nueva misión</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la misión"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción..."
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex items-center gap-4">
              <label htmlFor="reward">Recompensa (XP):</label>
              <input
                type="number"
                id="reward"
                value={reward}
                onChange={(e) => setReward(Number(e.target.value))}
                className="p-2 border rounded w-24"
                min="5"
                step="5"
              />
          </div>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400">
            {isLoading ? 'Creando...' : 'Añadir Misión'}
          </button>
        </form>
         <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold">O elige una misión predeterminada:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {defaultMissions.map(m => (
                    <button key={m.id} onClick={() => handleAddDefaultMission(m)} className="px-3 py-1 bg-gray-200 text-sm rounded-full hover:bg-gray-300">
                        {m.title}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}
