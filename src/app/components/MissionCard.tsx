// app/components/MissionCard.tsx
"use client";

import { Mission } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MissionCard({ mission }: { mission: Mission }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    // ... (resto de la lógica) ...
  };

  return (
    // Cambiamos el fondo según si la misión está completada o no
    <div className={`p-4 rounded-lg border transition-all ${
      mission.isCompleted 
        ? 'bg-transparent border-slate-800 text-slate-500' // Estilo para misiones completadas (atenuadas)
        : 'bg-slate-800 border-slate-700 hover:border-cyan-500' // Estilo para misiones activas
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-bold text-lg ${mission.isCompleted ? 'line-through text-slate-600' : 'text-slate-100'}`}>{mission.title}</h3>
          <p className="text-sm mt-1">{mission.description}</p>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          {/* Recompensa de XP con color neón */}
          <span className="font-bold text-cyan-400 font-mono">+{mission.experienceReward} XP</span>
        </div>
      </div>
      {!mission.isCompleted && (
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-cyan-500 hover:text-black transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Completando...' : 'Completar Misión'}
        </button>
      )}
    </div>
  );
}
