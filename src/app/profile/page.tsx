// app/profile/page.tsx
import UserProfile from '@/app/components/UserProfile';
import { User } from '@/lib/types';

// Esta función se ejecuta en el servidor para obtener los datos
async function getUserData(): Promise<User | null> {
  // En una aplicación real, obtendrías el ID del usuario de la sesión (ej. NextAuth.js, Clerk)
  // Por ahora, usamos una API que asume que la cookie de sesión identifica al usuario.
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/Get`, {
      cache: 'no-store', // No cachear datos de usuario
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    return <p>No se pudo cargar el perfil del usuario. Por favor, inicia sesión.</p>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <UserProfile user={user} />
    </main>
  );
}
