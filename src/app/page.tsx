// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Gamifica Tu Vida
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Convierte tus tareas diarias en misiones épicas. Completa objetivos,
          gana experiencia y sube de nivel en el juego más importante: tu vida.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/missions" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Ver mis Misiones
          </Link>
          <Link href="/profile" className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
              Mi Perfil
          </Link>
        </div>
      </div>
    </main>
  );
}
