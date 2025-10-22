// src/app/api/missions/Create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Mission } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const missionsData: Omit<Mission, 'id' | 'userId' | 'isCompleted' | 'createdAt'>[] = await req.json();
    for (const data of missionsData) {
      await db.missions.create({ ...data, userId });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating mission:', error);
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
}
