"use client";

// import { Poppins } from "next/font/google";
import { Inter } from 'next/font/google';
import Link from "next/link";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { SocketProvider } from '../contexts/SocketContext';
import "./globals.css";

// const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ["latin"] });
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

function NavBar() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin-portal' }); 
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-10 shadow-md">
      <div className="container mx-auto h-full flex justify-between items-center px-6">

        {/* Center: Navigation (Adjusted Spacing) */}
        <div className="flex gap-12">
          <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium -mr-2">
            Home
          </Link>
          <Link href="/events" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium ml-4">
            Events
          </Link>
          {session?.user && (
            <Link href="/create-event" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
              Create Event
            </Link>
          )}
        </div>

        {/* Right: User Info & Logout */}
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{session.user.email}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div></div> // Keeps spacing balanced
        )}
      </div>
    </nav>


  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </SessionProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-16`}>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}