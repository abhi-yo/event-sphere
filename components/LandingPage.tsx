'use client'

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Calendar, MapPin, MessageCircle } from 'lucide-react';
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

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <div className="flex items-center mb-6">
        {React.cloneElement(icon as React.ReactElement, { className: "w-12 h-12 text-black" })}
        <h2 className="text-2xl font-bold ml-4 text-black">{title}</h2>
      </div>
      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className={`${poppins.className} min-h-screen bg-gradient-to-b from-white to-gray-100`}>
      {/* Hero Section with Background */}
      <div className="relative bg-black h-[600px] mb-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 text-white tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Event Sphere
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl mb-12 text-white max-w-4xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect with your community through local events and experiences
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/events">
              <Button className="bg-white text-black hover:bg-gray-100 px-12 py-6 text-2xl rounded-full font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                Explore Events
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Calendar />}
            title="Easy Scheduling"
            description="Create and manage events effortlessly with our intuitive dashboard and smart scheduling tools."
            delay={1}
          />
          <FeatureCard
            icon={<MessageCircle />}
            title="Live Chat"
            description="Foster community engagement with real-time chat channels for every event."
            delay={2}
          />
          <FeatureCard
            icon={<MapPin />}
            title="Local Discovery"
            description="Find and join exciting events happening in your neighborhood with precise location matching."
            delay={3}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <motion.p
            className="mb-6 sm:mb-0 text-lg font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            © 2024 Event Sphere. All rights reserved.
          </motion.p>
          <motion.div
            className="flex space-x-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="#" className="hover:text-gray-300 transition-colors duration-300  ">
              Terms
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors duration-300  ">
              Privacy
            </Link>
            <Link href="mailto:akshatsing11@gmail.com" className="hover:text-gray-300 transition-colors duration-300">
              Contact
            </Link>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
