// app/api/user/[[...slug]]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const getUserIdFromSession = async (req: NextRequest): Promise<string> => {
    return 'user_12345';
};

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
    const action = params.slug?.[0]; // Debería ser 'Get'
    const requestedUserId = params.slug?.[1];

    if (action !== 'Get') {
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }

    // Si se especifica un ID de usuario, devolvemos info pública.
    // Si no, devolvemos la del usuario de la sesión.
    const userIdToFetch = requestedUserId || await getUserIdFromSession(req);

    const user = await db.user.findUnique({ userId: userIdToFetch });

    if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    // Aquí podrías filtrar datos si el usuario solicitado no es el de la sesión.
    return NextResponse.json(user);
}

// Aquí irían las funciones POST para /Create y /Modify
// export async function POST(...) {}
