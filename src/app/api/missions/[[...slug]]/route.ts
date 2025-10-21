// app/api/missions/[[...slug]]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Mission } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
    // LA CORRECCIÓN: Añadimos 'await' para resolver la promesa que devuelve auth()
    const { userId } = await auth(); 
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado. Por favor, inicia sesión.' }, { status: 401 });
    }

    const action = params.slug?.[0];
    
    if (action === 'GetDefault') {
        const defaultMissions = await db.defaultMissions.findMany();
        return NextResponse.json(defaultMissions);
    }
    
    const taskId = params.slug?.[1];

    if (taskId) {
        const mission = await db.missions.findUnique({ missionId: taskId, userId: userId });
        if (!mission) {
            return NextResponse.json({ error: 'Misión no encontrada o no te pertenece' }, { status: 404 });
        }
        return NextResponse.json(mission);
    } else {
        const missions = await db.missions.findMany({ userId: userId });
        return NextResponse.json(missions);
    }
}

interface CompleteMissionBody {
  missionId: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
    // LA CORRECCIÓN: También aquí, añadimos 'await'
    const { userId } = await auth(); 
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado. Por favor, inicia sesión.' }, { status: 401 });
    }
    
    const action = params.slug?.[0];
    
    if (action === 'Create') {
        const missionsData: Omit<Mission, 'id' | 'userId' | 'isCompleted' | 'createdAt'>[] = await req.json();
        const createdMissions = [];

        for (const data of missionsData) {
            const newMission = await db.missions.create({
                ...data,
                userId: userId
            });
            createdMissions.push(newMission);
        }
        return NextResponse.json(createdMissions, { status: 201 });
    }

    if(action === 'Complete') {
        const { missionId } = await req.json() as CompleteMissionBody;
        
        const mission = await db.missions.findUnique({ missionId, userId: userId });
        
        if (!mission || mission.isCompleted) {
            return NextResponse.json({ error: 'Misión no válida para completar' }, { status: 400 });
        }

        await db.missions.update({ missionId, userId: userId, data: { isCompleted: true } });

        const user = await db.user.findUnique({ userId: userId });
        if(user) {
            const newExperience = user.experience + mission.experienceReward;
            const experienceForNextLevel = user.level * 100;
            let newLevel = user.level;

            if (newExperience >= experienceForNextLevel) {
                newLevel += 1;
            }
            
            await db.user.update({ userId: userId, data: { experience: newExperience, level: newLevel } });
        }

        return NextResponse.json({ message: 'Misión completada con éxito' });
    }
    
    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
