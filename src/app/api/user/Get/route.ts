// src/app/api/user/Get/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { data } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { userId: currentUserId } = await auth();
  const requestedUserId = req.nextUrl.searchParams.get('userId');

  const targetUserId = requestedUserId || currentUserId;

  if (!targetUserId) {
    return NextResponse.json({ error: 'No se ha especificado un ID de usuario o no estás autenticado.' }, { status: 400 });
  }

  try {
    // 1. Obtenemos el usuario de nuestra base de datos
    const appUser = await data.user.findUnique({ userId: targetUserId });
    if (!appUser) {
      return NextResponse.json({ error: 'Usuario no encontrado en la aplicación.' }, { status: 404 });
    }

    // 2. Obtenemos los datos de Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(targetUserId);

    // 3. Combinamos los datos usando los nombres de propiedad correctos
    const combinedUser = {
      // CORRECCIÓN 1: Usamos 'appUser.clerkId' en lugar de 'appUser.id'
      id: appUser.clerkId, 

      // CORRECCIÓN 2: Priorizamos el nombre de Clerk y usamos nuestro 'username' de la DB como fallback.
      name: clerkUser.firstName || appUser.username, 

      username: clerkUser.username || appUser.username,
      profilePictureUrl: clerkUser.imageUrl,
      level: appUser.level,
      experience: appUser.experience,
      email: currentUserId === targetUserId ? clerkUser.emailAddresses[0]?.emailAddress : undefined,
    };

    return NextResponse.json(combinedUser);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
