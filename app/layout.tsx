"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { SocketProvider } from '../contexts/SocketContext';
import "./globals.css";

const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ["latin"] });

function NavBar() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin-portal' }); 
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-10 shadow-sm">
      <div className="container mx-auto h-full flex justify-between items-center px-4">
        {/* Left side - Navigation Links */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-gray-800 hover:text-black transition-colors duration-200 font-medium"
          >
            Home
          </Link>
          <Link 
            href="/events" 
            className="text-gray-800 hover:text-black transition-colors duration-200 font-medium"
          >
            Events
          </Link>
          {session?.user && (
            <Link 
              href="/create-event" 
              className="text-gray-800 hover:text-black transition-colors duration-200 font-medium"
            >
              Create Event
            </Link>
          )}
        </div>

        {/* Right side - User Info & Logout */}
        <div>
          {session?.user && (
            <div className="flex items-center gap-8">
              <span className="text-gray-600">{session.user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-gray-800 hover:text-black transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
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
      <body className={`${poppins.className} pt-16`}>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}