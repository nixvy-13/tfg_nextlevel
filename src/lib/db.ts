// lib/db.ts
import { getCloudflareContext } from '@opennextjs/cloudflare';
// El linter nos avisó que 'User' no se usa aquí. Lo eliminamos.
import { Mission, DefaultMission } from './types';

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

// Creamos un tipo que representa EXACTAMENTE lo que hay en la tabla 'Users' de la DB
type AppUserFromDB = {
  clerkId: string;
  username: string;
  experience: number;
  level: number;
};

export const db = {
  // ... (missions y defaultMissions no cambian) ...
  missions: {
    findMany: async ({ userId }: { userId: string }): Promise<Mission[]> => {
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
    update: async ({ missionId, userId }: { missionId: string; userId: string}) => {
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
    // LA CORRECCIÓN: Usamos nuestro nuevo tipo específico en lugar de 'any'
    findUnique: async ({ userId }: { userId: string }): Promise<AppUserFromDB | null> => {
        const db = await getDB();
        const stmt = db.prepare('SELECT * FROM Users WHERE clerkId = ?').bind(userId);
        return await stmt.first<AppUserFromDB>();
    },
    update: async({ userId, data }: { userId: string, data: { experience: number, level: number }}) => {
      const db = await getDB();
      const stmt = db.prepare(
        'UPDATE Users SET experience = ?, level = ? WHERE clerkId = ?'
      ).bind(data.experience, data.level, userId);
      await stmt.run();
      return { success: true };
    },
    create: async ({ clerkId, username }: { clerkId: string, username: string }) => {
      const db = await getDB();
      const stmt = db.prepare('INSERT INTO Users (clerkId, username) VALUES (?, ?)')
        .bind(clerkId, username);
      await stmt.run();
      return { success: true };
    },
    modify: async ({ userId, data }: { userId: string, data: { username: string } }) => {
      const db = await getDB();
      const stmt = db.prepare('UPDATE Users SET username = ? WHERE clerkId = ?')
        .bind(data.username, userId);
      await stmt.run();
      return { success: true };
    }
  }
};
