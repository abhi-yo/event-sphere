import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle, Users } from "lucide-react";
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className={`${inter.className} bg-white/40 backdrop-blur-sm rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/60 cursor-pointer`}>
      <div className="mb-6">
        {React.cloneElement(icon, { 
          className: "w-8 h-8 text-[#7C3AED]/80" 
        })}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-purple-50 flex flex-col`}>
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-48">
          <div className="flex flex-col items-center text-center mb-48">
            <div className="inline-block bg-[#E5D8FF] text-[#7C3AED] px-6 py-2 rounded-full text-sm mb-16">
              No Sign Up Required
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Discover Amazing Events
            </h1>
            <h2 className="text-6xl font-bold text-[#7C3AED] mb-8 tracking-tight">
              Near You
            </h2>
            
            <p className="text-gray-600 max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
              Join live chat rooms, explore interactive maps, and discover extraordinary 
              events happening around you. Connect with like-minded people instantly.
            </p>

            <div className="flex gap-4">
              <Link href="/events">
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg px-6 py-2 rounded-full h-auto">
                  Get Started →
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-24">
              Everything You Need
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MapPin />}
                title="Interactive Map"
                description="Discover events happening around you with our intuitive map interface. Find the perfect events based on your location."
              />
              <FeatureCard
                icon={<MessageCircle />}
                title="Live Chat Rooms"
                description="Connect with other attendees in real-time chat rooms for each event. Make friends before the event starts."
              />
              <FeatureCard
                icon={<Users />}
                title="Community Events"
                description="Find and join events that match your interests and passions. Connect with like-minded people in your area."
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © 2024 Event Sphere. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="mailto:contact@hyperlocal.com" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}