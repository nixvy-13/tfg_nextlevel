// app/profile/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserProfile from '@/app/components/UserProfile';
import { User } from '@/lib/types'; // Asumimos que la base de datos devuelve este tipo
import { db } from '@/lib/db'; // Importamos la DB simulada

// Esta función ahora combina datos de Clerk y de nuestra DB
async function getCombinedUserData(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null; // No hay usuario logueado
  }

  // Buscamos al usuario en nuestra base de datos con el ID de Clerk
  let appUser = await db.user.findUnique({ userId: clerkUser.id });

  // Si el usuario no existe en nuestra DB, este es su primer inicio de sesión.
  // ¡Aquí es donde lo crearíamos! (En un caso real, llamaríamos a la API /user/Create)
  if (!appUser) {
    // Simulamos la creación de un nuevo usuario en nuestra DB
    appUser = {
      id: clerkUser.id,
      name: clerkUser.firstName || 'Nuevo Aventurero',
      email: clerkUser.emailAddresses[0].emailAddress,
      profilePictureUrl: clerkUser.imageUrl,
      level: 1,
      experience: 0,
    };
    // Aquí guardarías 'appUser' en tu base de datos D1.
  }
  
  // Devolvemos el usuario de nuestra aplicación, que ya contiene todos los datos.
  return appUser;
}

export default async function ProfilePage() {
  const user = await getCombinedUserData();

  if (!user) {
    // Esto no debería pasar gracias al middleware, pero es una buena práctica de seguridad
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <UserProfile user={user} />
    </div>
  );
}
