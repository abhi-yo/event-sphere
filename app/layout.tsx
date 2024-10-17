"use client";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import "./globals.css";

const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ["latin"] });

function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b border-gray-200 py-4 fixed top-0 left-0 right-0 z-10 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-5">
          <Link href="/" className="text-gray-800 hover:text-black transition-colors duration-200 font-medium">Home</Link>
          <Link href="/events" className="text-gray-800 hover:text-black transition-colors duration-200 font-medium">Events</Link>
          {user && (
            <Link href="/create-event" className="text-gray-800 hover:text-black transition-colors duration-200 font-medium">
              Create Event
            </Link>
          )}
        </div>
        <div>
          {user ? (
            <div className="flex items-center space-x-6">
              <span className="text-gray-600">{user.email}</span>
              <button onClick={logout} className="text-gray-800 hover:text-black transition-colors duration-200 font-medium">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-gray-800 hover:text-black transition-colors duration-200 font-medium">Login</Link>
          )}
        </div>
      </div>
    </nav>
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
        <AuthProvider>
          <SocketProvider>
            <NavBar />
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
