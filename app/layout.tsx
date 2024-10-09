"use client";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import "./globals.css";


const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ["latin"] });

function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-100 p-4 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="text-black hover:underline mr-6">Home</Link>
          <Link href="/events" className="text-black hover:underline mr-6">Events</Link>
          {user && <Link href="/create-event" className="text-black hover:underline">Create Event</Link>}
        </div>
        <div>
          {user ? (
            <>
              <span className="mr-4">{user.email}</span>
              <button onClick={logout} className="text-black hover:underline">Logout</button>
            </>
          ) : (
            <Link href="/login" className="text-black hover:underline">Login</Link>
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
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
