// lib/db.ts
// ATENCIÓN: Este fichero es un placeholder.
// Deberás reemplazar esta lógica con las llamadas reales a tu base de datos Cloudflare D1.

import { User, Mission, DefaultMission } from './types';

// --- DATOS SIMULADOS ---
const mockUser: User = {
  id: 'user_12345',
  name: 'Aventurero Novato',
  email: 'playerone@example.com',
  profilePictureUrl: 'https://i.pravatar.cc/150?u=user_12345',
  level: 1,
  experience: 75,
};

let mockMissions: Mission[] = [
  { id: 'mission_1', userId: 'user_12345', title: 'Hacer la cama', description: 'Tender la cama al levantarse.', experienceReward: 10, isCompleted: true, createdAt: new Date().toISOString() },
  { id: 'mission_2', userId: 'user_12345', title: 'Leer 10 páginas de un libro', description: 'Fomentar el hábito de la lectura.', experienceReward: 25, isCompleted: false, createdAt: new Date().toISOString() },
];

const mockDefaultMissions: DefaultMission[] = [
    { id: 'default_1', title: 'Beber 2 litros de agua', description: 'Mantente hidratado durante el día.', experienceReward: 15 },
    { id: 'default_2', title: 'Hacer 15 minutos de ejercicio', description: 'Una rutina corta para empezar el día con energía.', experienceReward: 30 },
];


// --- LÓGICA DE BASE DE DATOS (SIMULADA) ---

// Misiones
export const db = {
  missions: {
    findMany: async ({ userId }: { userId: string }) => mockMissions.filter(m => m.userId === userId),
    findUnique: async ({ missionId, userId }: { missionId: string; userId: string }) => mockMissions.find(m => m.id === missionId && m.userId === userId) || null,
    create: async (data: { title: string; description: string; experienceReward: number; userId: string }) => {
        const newMission: Mission = { ...data, id: `mission_${Date.now()}`, isCompleted: false, createdAt: new Date().toISOString() };
        mockMissions.push(newMission);
        return newMission;
    },
    update: async ({ missionId, userId, data }: { missionId: string; userId: string, data: { isCompleted: boolean }}) => {
        const missionIndex = mockMissions.findIndex(m => m.id === missionId && m.userId === userId);
        if (missionIndex > -1) {
            mockMissions[missionIndex] = { ...mockMissions[missionIndex], ...data };
            return mockMissions[missionIndex];
        }
        return null;
    }
  },
  defaultMissions: {
      findMany: async () => mockDefaultMissions,
  },
  user: {
    findUnique: async ({ userId }: { userId: string }) => (userId === mockUser.id ? mockUser : null),
    update: async({ userId, data }: { userId: string, data: { experience: number, level: number }}) => {
        if(userId === mockUser.id) {
            mockUser.experience = data.experience;
            mockUser.level = data.level;
            return mockUser;
        }
        return null;
    }
  }
};
