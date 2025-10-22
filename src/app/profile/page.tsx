// app/profile/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserProfile from '@/app/components/UserProfile';
import { data } from '@/lib/db';

// Este es el flujo de datos correcto para la página de perfil
export default async function ProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    // Esto es por seguridad, el middleware ya debería haber redirigido
    redirect('/sign-in');
  }

  // 1. Buscamos al usuario en nuestra base de datos
  let appUser = await data.user.findUnique({ userId: clerkUser.id });

  // 2. Si el usuario NO existe, es su primer inicio de sesión. ¡Lo creamos!
  if (!appUser) {
    const username = clerkUser.username || `user_${clerkUser.id.slice(5, 12)}`;
    // Llamamos a la función 'create' de nuestra DB
    await data.user.create({ clerkId: clerkUser.id, username: username });
    // Creamos un objeto 'appUser' temporal con los valores por defecto para mostrar en la página inmediatamente
    appUser = {
      clerkId: clerkUser.id,
      username: username,
      experience: 0,
      level: 1,
    };
  }
  
  // 3. Ahora tenemos garantizado que 'appUser' existe. Combinamos los datos para el componente.
  // Este objeto final es lo que realmente mostraremos en la UI.
  const userProfileData = {
    id: clerkUser.id,
    name: clerkUser.firstName || appUser.username,
    email: clerkUser.emailAddresses[0].emailAddress,
    profilePictureUrl: clerkUser.imageUrl,
    level: appUser.level,
    experience: appUser.experience,
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-100">Mi Perfil</h1>
      <UserProfile user={userProfileData} />
    </div>
  );
}
