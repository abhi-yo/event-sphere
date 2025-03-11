import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MapPin, MessageCircle, Users } from "lucide-react";
import { Inter } from 'next/font/google';
import { ShimmerButton } from './magicui/shimmer-button';
import createGlobe from 'cobe';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

interface GlobeState {
  phi: number;
  width: number;
  height: number;
}

interface Marker {
  location: [number, number];
  size: number;
}

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
  const globeRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;

    let width = 0;
    let currentPhi = 0;
    const onResize = () => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
      }
    };
    
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(globeRef.current, {
      devicePixelRatio: window?.devicePixelRatio || 2,
      width: width * 2,
      height: width * 2 * (isMobile ? 0.6 : 0.4), // Taller aspect ratio on mobile
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 3,
      mapSamples: isMobile ? 4000 : 16000, // Reduce samples on mobile for better performance
      mapBrightness: 1.2,
      baseColor: [1, 1, 1] as [number, number, number],
      markerColor: [0.486, 0.227, 0.929] as [number, number, number],
      glowColor: [0.486, 0.227, 0.929] as [number, number, number],
      scale: isMobile ? 1.8 : 2.5, // Smaller scale on mobile
      offset: [0, width * 2 * (isMobile ? 0.6 : 0.4) * 0.6] as [number, number],
      markers: [
        { location: [37.7749, -122.4194], size: isMobile ? 0.08 : 0.1 },
        { location: [40.7128, -74.0060], size: isMobile ? 0.08 : 0.1 },
        { location: [51.5074, -0.1278], size: isMobile ? 0.08 : 0.1 },
        { location: [35.6762, 139.6503], size: isMobile ? 0.08 : 0.1 },
        { location: [1.3521, 103.8198], size: isMobile ? 0.08 : 0.1 }
      ] as Marker[],
      onRender: (state: GlobeState) => {
        state.phi = currentPhi;
        currentPhi += isMobile ? 0.003 : 0.002; // Slightly faster rotation on mobile
        state.width = width * 2;
        state.height = width * 2 * (isMobile ? 0.6 : 0.4);
      }
    });

    // Handle pointer/touch interactions for rotation
    const onPointerDown = (e: PointerEvent) => {
      pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
      globeRef.current!.style.cursor = 'grabbing';
    };

    const onPointerUp = () => {
      pointerInteracting.current = null;
      globeRef.current!.style.cursor = 'grab';
    };

    const onPointerOut = () => {
      pointerInteracting.current = null;
      globeRef.current!.style.cursor = 'grab';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta * (isMobile ? 1.5 : 1); // More sensitive on mobile
      }
    };

    // Add event listeners for interaction
    globeRef.current.addEventListener('pointerdown', onPointerDown);
    globeRef.current.addEventListener('pointerup', onPointerUp);
    globeRef.current.addEventListener('pointerout', onPointerOut);
    globeRef.current.addEventListener('pointermove', onPointerMove);

    // Set initial cursor style
    globeRef.current.style.cursor = 'grab';

    // Fade in the globe
    setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.style.opacity = '1';
      }
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
      globeRef.current?.removeEventListener('pointerdown', onPointerDown);
      globeRef.current?.removeEventListener('pointerup', onPointerUp);
      globeRef.current?.removeEventListener('pointerout', onPointerOut);
      globeRef.current?.removeEventListener('pointermove', onPointerMove);
    };
  }, [isMobile]); // Re-initialize globe when mobile state changes

  return (
    <div className={`${inter.className} min-h-screen bg-purple-50 flex flex-col`}>
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-8 md:pt-16 pb-24 md:pb-48">
          <div className="flex flex-col items-center text-center mb-24 md:mb-48">
            <div className="inline-block bg-[#E5D8FF] text-[#7C3AED] px-6 py-2 rounded-full text-sm mb-8 md:mb-16">
              No Sign Up Required
            </div>
            
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                  Discover Amazing Events
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold text-[#7C3AED] mb-8 tracking-tight">
                  Near You
                </h2>
              </div>
              
              {/* Globe Component */}
              <div 
                ref={containerRef}
                className="absolute inset-0 w-full"
                style={{
                  aspectRatio: isMobile ? '1/0.6' : '1/0.4',
                  margin: 'auto',
                  position: 'relative',
                }}
              >
                <canvas
                  ref={globeRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    opacity: 0,
                    transition: 'opacity 1s ease',
                    touchAction: 'none', // Prevent default touch behaviors
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#faf5ff_100%)]" />
              </div>
            </div>
            
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8 md:mb-16 leading-relaxed mt-8 relative z-10 px-4">
              Join live chat rooms, explore interactive maps, and discover extraordinary 
              events happening around you. Connect with like-minded people instantly.
            </p>

            <div className="flex gap-4 relative z-10">
              <Link href="/events">
                <ShimmerButton 
                  background="#7C3AED"
                  className="text-white text-base md:text-lg px-6 py-2 rounded-full h-auto hover:bg-[#6D28D9]"
                >
                  Get Started →
                </ShimmerButton>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 md:mb-24">
              Everything You Need
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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

      <footer className="bg-white py-6 md:py-8 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-0">
              © 2024 Event Sphere. All rights reserved.
            </p>
            <div className="flex space-x-6 md:space-x-8">
              <a href="#" className="text-sm md:text-base text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="text-sm md:text-base text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="mailto:contact@hyperlocal.com" className="text-sm md:text-base text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}