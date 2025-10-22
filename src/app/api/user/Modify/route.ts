// src/app/api/user/Modify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { data } from '@/lib/db';

interface ModifyUserBody {
  username?: string;
  // aquí podrían ir otros campos modificables en el futuro
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { username } = (await req.json()) as ModifyUserBody;

    if (!username) {
        return NextResponse.json({ error: 'No se proporcionaron datos para modificar.' }, { status: 400 });
    }
    
    // Aquí podrías añadir validación para el username (longitud, caracteres, si ya existe, etc.)

    // Creamos una función 'modify' en nuestro db.user
    await data.user.modify({ userId, data: { username } });

    return NextResponse.json({ message: 'Usuario modificado con éxito.' });
  } catch (error) {
    console.error('Error modifying user:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
