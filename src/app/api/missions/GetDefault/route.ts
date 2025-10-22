// src/app/api/missions/GetDefault/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const defaultMissions = await db.defaultMissions.findMany();
    return NextResponse.json(defaultMissions);
  } catch (error) {
    console.error('Error fetching default missions:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
