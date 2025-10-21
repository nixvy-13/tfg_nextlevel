// app/missions/page.tsx
import { Mission, DefaultMission } from '@/lib/types';
import MissionCard from '@/app/components/MissionCard';
import NewMissionForm from '@/app/components/NewMissionForm';

async function getMissions(): Promise<Mission[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/missions/Get`, {
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error('Failed to fetch missions:', error);
    return [];
  }
}

async function getDefaultMissions(): Promise<DefaultMission[]> {
   try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/missions/GetDefault`, {
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error('Failed to fetch default missions:', error);
    return [];
  }
}


export default async function MissionsPage() {
  const missions = await getMissions();
  const defaultMissions = await getDefaultMissions();

  const activeMissions = missions.filter(m => !m.isCompleted);
  const completedMissions = missions.filter(m => m.isCompleted);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tablón de Misiones</h1>
      
      <NewMissionForm defaultMissions={defaultMissions} />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Misiones Activas</h2>
        {activeMissions.length > 0 ? (
          <div className="space-y-4">
            {activeMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">¡No tienes misiones pendientes! Crea una nueva para empezar.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Misiones Completadas</h2>
        {completedMissions.length > 0 ? (
          <div className="space-y-4">
            {completedMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aún no has completado ninguna misión.</p>
        )}
      </div>
    </main>
  );
}

