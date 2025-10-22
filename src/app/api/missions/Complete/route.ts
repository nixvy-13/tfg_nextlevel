// src/app/api/missions/Complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

interface CompleteMissionBody {
  missionId: string;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { missionId } = (await req.json()) as CompleteMissionBody;
    const mission = await db.missions.findUnique({ missionId, userId });

    if (!mission || mission.isCompleted) {
      return NextResponse.json({ error: 'Misión no válida para completar' }, { status: 400 });
    }

    // Marcar misión como completada y actualizar XP del usuario
    await db.missions.update({ missionId, userId });
    const user = await db.user.findUnique({ userId });
    if (user) {
      const newExperience = user.experience + mission.experienceReward;
      let newLevel = user.level;
      if (newExperience >= user.level * 100) {
        newLevel += 1;
      }
      await db.user.update({ userId, data: { experience: newExperience, level: newLevel } });
    }

    return NextResponse.json({ message: 'Misión completada con éxito' });
  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
}
