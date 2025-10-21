// app/api/missions/[[...slug]]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Placeholder de tu base de datos
import { Mission } from '@/lib/types';

// En un caso real, esta función obtendría el ID del usuario de su sesión.
// Por ahora, usamos un ID fijo.
const getUserIdFromSession = async (req: NextRequest): Promise<string> => {
    return 'user_12345';
};

// ... (la función GET no cambia y queda como estaba) ...
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
    const action = params.slug?.[0];
    const userId = await getUserIdFromSession(req);
    
    if (action === 'GetDefault') {
        const defaultMissions = await db.defaultMissions.findMany();
        return NextResponse.json(defaultMissions);
    }
    
    const taskId = params.slug?.[1];

    if (taskId) {
        const mission = await db.missions.findUnique({ missionId: taskId, userId });
        if (!mission) {
            return NextResponse.json({ error: 'Misión no encontrada o no te pertenece' }, { status: 404 });
        }
        return NextResponse.json(mission);
    } else {
        const missions = await db.missions.findMany({ userId });
        return NextResponse.json(missions);
    }
}

// --- CÓDIGO CORREGIDO EN LA FUNCIÓN POST ---

// Define el tipo esperado para el cuerpo de la petición de 'Complete'
interface CompleteMissionBody {
  missionId: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
    const action = params.slug?.[0];
    const userId = await getUserIdFromSession(req);
    
    if (action === 'Create') {
        const missionsData: Omit<Mission, 'id' | 'userId' | 'isCompleted' | 'createdAt'>[] = await req.json();
        const createdMissions = [];

        for (const data of missionsData) {
            const newMission = await db.missions.create({
                ...data,
                userId
            });
            createdMissions.push(newMission);
        }
        return NextResponse.json(createdMissions, { status: 201 });
    }

    if(action === 'Complete') {
        // AQUÍ ESTÁ LA CORRECCIÓN:
        // Hacemos una aserción de tipo para decirle a TypeScript que esperamos un objeto
        // con la propiedad missionId de tipo string.
        const { missionId } = await req.json() as CompleteMissionBody;
        
        // Ahora TypeScript ya no se queja y sabe que missionId es un string.
        const mission = await db.missions.findUnique({ missionId, userId });
        
        if (!mission || mission.isCompleted) {
            return NextResponse.json({ error: 'Misión no válida para completar' }, { status: 400 });
        }

        // Marcar misión como completada
        await db.missions.update({ missionId, userId, data: { isCompleted: true } });

        // Actualizar experiencia y nivel del usuario
        const user = await db.user.findUnique({ userId });
        if(user) {
            const newExperience = user.experience + mission.experienceReward;
            const experienceForNextLevel = user.level * 100;
            let newLevel = user.level;

            if (newExperience >= experienceForNextLevel) {
                newLevel += 1;
            }
            
            await db.user.update({ userId, data: { experience: newExperience, level: newLevel } });
        }

        return NextResponse.json({ message: 'Misión completada con éxito' });
    }
    
    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
