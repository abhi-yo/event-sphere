import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import React from "react";

const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'] });

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-80">
      <div className="flex items-center mb-4">
        {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8 text-black" })}
        <h2 className="text-xl font-semibold ml-3 text-black">{title}</h2>
      </div>
      <p className="text-black text-base">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className={`${poppins.className} min-h-screen bg-white text-black flex flex-col items-center justify-center p-6`}>
      <div className="max-w-3xl w-full space-y-10">
        <header className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-black">Hyper Local</h1>
          <p className="text-2xl text-black">
            Discover and manage events with ease
          </p>
        </header>
        <main className="flex flex-wrap justify-center gap-6">
          <FeatureCard
            icon={<Calendar />}
            title="Get Events Scheduled"
            description="Administrators can easily create and manage events with our intuitive interface."
          />
          <FeatureCard
            icon={<MapPin />}
            title="Discover Local Events"
            description="Find exciting events happening near you."
          />
        </main>
        <div className="text-center">
          <Link href="/events">
            <Button className="px-10 py-4 bg-black text-white text-2xl rounded-md hover:bg-gray-800 transition-colors duration-300 shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      <footer className="mt-16 text-center text-black text-base">
        <p>© 2024 Event App. All rights reserved.</p>
        <a
          href="mailto:akshatsing11@gmail.com"
          className="text-black hover:underline"
        >
          Drop a Mail
        </a>
      </footer>
    </div>
  );
}
