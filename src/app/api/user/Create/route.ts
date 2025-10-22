// src/app/api/user/Create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { data } from '@/lib/db';

export async function POST(_req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  try {
    const existingUser = await data.user.findUnique({ userId });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe.' }, { status: 409 });
    }

    // LA CORRECCIÓN: Primero obtenemos el cliente con 'await'
    const client = await clerkClient();
    // Y luego usamos el cliente para obtener el usuario
    const clerkUser = await client.users.getUser(userId);
    const username = clerkUser.username || `user_${userId.slice(5, 12)}`;

    await data.user.create({ clerkId: userId, username: username });

    return NextResponse.json({ message: 'Usuario creado con éxito' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
