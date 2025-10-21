// app/components/UserProfile.tsx
"use client";

import { User } from '@/lib/types';

export default function UserProfile({ user }: { user: User }) {
  const experienceToNextLevel = user.level * 100;
  const progressPercentage = (user.experience / experienceToNextLevel) * 100;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePictureUrl}
          alt={user.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold">Nivel {user.level}</span>
          <span className="text-sm text-gray-600">{user.experience} / {experienceToNextLevel} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
