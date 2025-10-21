// app/components/MissionCard.tsx
"use client";

import { Mission } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MissionCard({ mission }: { mission: Mission }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (mission.isCompleted) return;

    setIsLoading(true);
    try {
      await fetch('/api/missions/Complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: mission.id }),
      });
      // Refresca los datos de la página actual para ver los cambios
      router.refresh();
    } catch (error) {
      console.error("Failed to complete mission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md transition-all ${mission.isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-bold text-lg ${mission.isCompleted ? 'line-through' : ''}`}>{mission.title}</h3>
          <p className="text-sm">{mission.description}</p>
        </div>
        <div className="text-right">
          <span className="font-semibold text-yellow-500">+{mission.experienceReward} XP</span>
        </div>
      </div>
      {!mission.isCompleted && (
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Completando...' : 'Completar Misión'}
        </button>
      )}
    </div>
  );
}
