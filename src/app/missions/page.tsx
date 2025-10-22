// app/missions/page.tsx
import MissionCard from '@/app/components/MissionCard';
import NewMissionForm from '@/app/components/NewMissionForm';
import { db } from '@/lib/db'; // 1. Importar la lógica de la DB directamente
import { auth } from '@clerk/nextjs/server'; // 2. Importar auth para obtener el usuario
import { redirect } from 'next/navigation';

// Ya no necesitamos las funciones getMissions/getDefaultMissions separadas,
// podemos hacerlo directamente en el componente de página.

export default async function MissionsPage() {
  // 3. Obtenemos el usuario autenticado. Esto es crucial.
  const { userId } = await auth();
  if (!userId) {
    // Si no hay usuario, redirigimos a la página de login.
    redirect('/sign-in');
  }

  // 4. Llamamos directamente a la base de datos para obtener los datos.
  // Envolvemos en un Promise.all para que se ejecuten en paralelo y sea más rápido.
  const [missions, defaultMissions] = await Promise.all([
    db.missions.findMany({ userId }),
    db.defaultMissions.findMany()
  ]);

  const activeMissions = missions.filter(m => !m.isCompleted);
  const completedMissions = missions.filter(m => m.isCompleted);

  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-100">Tablón de Misiones</h1>
      
      <NewMissionForm defaultMissions={defaultMissions} />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-200">Misiones Activas</h2>
        {activeMissions.length > 0 ? (
          <div className="space-y-4">
            {activeMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">¡No tienes misiones pendientes! Crea una nueva para empezar.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-200">Misiones Completadas</h2>
        {completedMissions.length > 0 ? (
          <div className="space-y-4">
            {completedMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">Aún no has completado ninguna misión.</p>
        )}
      </div>
    </main>
  );
}
