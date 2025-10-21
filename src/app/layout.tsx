// app/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css'; // Asegúrate de tener tu fichero de estilos global

export const metadata: Metadata = {
  title: 'Gamifica Tu Vida',
  description: 'Completa misiones, sube de nivel.',
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <header className="flex justify-between items-center p-4 border-b">
            <Link href="/" className="text-xl font-bold">
              GamifyLife
            </Link>
            <div className="flex items-center gap-4">
              <SignedIn>
                <Link href="/missions" className="text-sm font-medium hover:underline">Misiones</Link>
                <Link href="/profile" className="text-sm font-medium hover:underline">Perfil</Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                  Iniciar Sesión
                </Link>
              </SignedOut>
            </div>
          </header>
          <main className="p-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
