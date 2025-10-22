// src/app/api/missions/Get/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Obtenemos el taskId de los parámetros de búsqueda de la URL
  const taskId = req.nextUrl.searchParams.get('taskId');

  try {
    if (taskId) {
      // Si hay taskId, buscamos una misión específica
      const mission = await db.missions.findUnique({ missionId: taskId, userId });
      return mission
        ? NextResponse.json(mission)
        : NextResponse.json({ error: 'Misión no encontrada' }, { status: 404 });
    } else {
      // Si no, devolvemos todas las misiones del usuario
      const missions = await db.missions.findMany({ userId });
      return NextResponse.json(missions);
    }
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
