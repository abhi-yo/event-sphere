"use client";
import LandingPage from '@/components/LandingPage';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main>
      {isAuthenticated ? (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <p className="mb-4">Welcome, Admin!</p>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      ) : (
        <LandingPage />
      )}
    </main>
  );
}
