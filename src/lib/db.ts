// lib/db.ts
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { User, Mission, DefaultMission } from './types';

// 1. Convertimos la función a 'async'
async function getDB() {
  // 2. Usamos 'await' para esperar a que la promesa del contexto se resuelva
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

// --- LÓGICA DE BASE DE DATOS (REAL CON D1) ---

export const db = {
  missions: {
    findMany: async ({ userId }: { userId: string }): Promise<Mission[]> => {
      // 3. Usamos 'await' CADA VEZ que llamamos a getDB()
      const db = await getDB();
      const stmt = db.prepare('SELECT * FROM Tasks WHERE userId = ? AND isDefault = 0').bind(userId);
      const { results } = await stmt.all<Mission>();
      return results;
    },
    findUnique: async ({ missionId, userId }: { missionId: string; userId: string }): Promise<Mission | null> => {
      const db = await getDB();
      const stmt = db.prepare('SELECT * FROM Tasks WHERE id = ? AND userId = ?').bind(missionId, userId);
      return await stmt.first<Mission>();
    },
    create: async (data: { title: string; description: string; experienceReward: number; userId: string }) => {
        const db = await getDB();
        const stmt = db.prepare(
            'INSERT INTO Tasks (title, description, experienceReward, userId, type) VALUES (?, ?, ?, ?, ?)'
        ).bind(data.title, data.description, data.experienceReward, data.userId, 'ONCE');
        await stmt.run();
        return { success: true }; 
    },
    update: async ({ missionId, userId, data }: { missionId: string; userId: string, data: { isCompleted: boolean }}) => {
      const db = await getDB();
      const stmt = db.prepare('INSERT INTO TaskCompletions (taskId, userId) VALUES (?, ?)')
        .bind(missionId, userId);
      await stmt.run();
      return { success: true };
    }
  },
  defaultMissions: {
      findMany: async (): Promise<DefaultMission[]> => {
        const db = await getDB();
        const stmt = db.prepare('SELECT * FROM Tasks WHERE isDefault = 1');
        const { results } = await stmt.all<DefaultMission>();
        return results;
      },
  },
  user: {
    findUnique: async ({ userId }: { userId: string }): Promise<User | null> => {
        const db = await getDB();
        const stmt = db.prepare('SELECT * FROM Users WHERE clerkId = ?').bind(userId);
        const appUser = await stmt.first<{clerkId: string, username: string, experience: number, level: number}>();
        
        if (!appUser) return null;

        return {
          id: appUser.clerkId,
          name: appUser.username,
          level: appUser.level,
          experience: appUser.experience,
          email: '', 
          profilePictureUrl: '',
        };
    },
    // Aquí irían las futuras funciones `update` y `create` para el usuario,
    // y también necesitarían usar `await getDB()`.
  }
};
