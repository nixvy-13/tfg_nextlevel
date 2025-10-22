// src/app/components/UserProfile.tsx
"use client";
import { User } from '@/lib/types'; // Asumimos que 'User' es el tipo correcto para las props
import Image from 'next/image';

export default function UserProfile({ user }: { user: User }) {
  const experienceToNextLevel = user.level * 100;
  const progressPercentage = (user.experience / experienceToNextLevel) * 100;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        <Image
          src={user.profilePictureUrl}
          alt={user.name}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full border-2 border-cyan-500"
        />
        <div>
          <h2 className="text-2xl font-bold text-slate-100">{user.name}</h2>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-1 font-mono">
          <span className="font-semibold text-slate-300">Nivel {user.level}</span>
          <span className="text-sm text-slate-400">{user.experience} / {experienceToNextLevel} XP</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
            className="bg-cyan-500 h-4 rounded-full transition-all duration-500"
            style={{ // La línea que faltaba
              width: `${progressPercentage}%`,
              boxShadow: `0 0 10px theme('colors.cyan.500')`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
