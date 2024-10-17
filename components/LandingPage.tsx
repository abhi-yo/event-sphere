import { Button } from "@/components/ui/button";
import { Calendar, MapPin, MessageCircle } from "lucide-react";
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import React from "react";

const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'] });

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
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
    <div className={`${poppins.className} min-h-screen bg-white text-black flex flex-col justify-between`}>
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full space-y-12">
          <header className="text-center ">
            <h1 className="text-6xl  font-bold mb-6 text-black animate-slide-up">Hyper Local</h1>
            <p className="text-2xl text-black ">
              Discover and manage events with ease
            </p>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
            <FeatureCard
              icon={<Calendar />}
              title="Get Events Scheduled"
              description="Administrators can easily create and manage events with our intuitive interface."
              delay={200}
            />
            <FeatureCard
              icon={<MessageCircle />}
              title="Connect Instantly"
              description="Chat with attendees in real-time event channels, no sign-up required."
              delay={400}
            />
            <FeatureCard
              icon={<MapPin />}
              title="Discover Local Events"
              description="Find exciting events happening near you."
              delay={600}
            />
          </main>
          <div className="text-center animate-fade-in">
            <Link href="/events">
              <Button className="px-10 py-4 bg-black text-white text-2xl rounded-md hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <footer className="bg-black text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="mb-4 sm:mb-0">© 2024 Hyper Local. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-gray-300 transition-colors duration-300">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors duration-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
