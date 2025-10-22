// app/layout.tsx

import { dark } from '@clerk/themes';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'NextLevel',
  description: 'Completa misiones, sube de nivel.',
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{
      theme: dark,
    }}>
      <html lang="es">
        <body className="bg-slate-900 text-slate-200"> 
          <header className="flex justify-between items-center p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
            <Link href="/" className="text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              GamifyLife
            </Link>
            <div className="flex items-center gap-4">
              <SignedIn>
                <Link href="/missions" className="text-sm font-medium hover:underline">Misiones</Link>
                <Link href="/profile" className="text-sm font-medium hover:underline">Perfil</Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in" className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg shadow-md hover:bg-cyan-400 transition-colors">
                  Iniciar Sesión
                </Link>
              </SignedOut>
            </div>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
