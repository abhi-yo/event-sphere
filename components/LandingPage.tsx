import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, MessageCircle, Users } from "lucide-react";
import { Inter } from "next/font/google";
import { ShimmerButton } from "./magicui/shimmer-button";
import createGlobe from "cobe";
import { TextRotateDemo } from "./ui/text-rotate-demo";
import { FlickeringGrid } from "./ui/flickering-grid";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`${
        inter.className
      } bg-white/70 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/90 cursor-pointer relative overflow-hidden ${
        isMobile ? "p-6" : "p-8"
      }`}
    >
      <div className={`relative ${isMobile ? "mb-4" : "mb-6"}`}>
        <div
          className={`bg-[#7C3AED]/10 rounded-xl flex items-center justify-center ${
            isMobile ? "w-12 h-12" : "w-14 h-14"
          }`}
        >
          {React.cloneElement(icon, {
            className: `text-[#7C3AED] ${isMobile ? "w-6 h-6" : "w-7 h-7"}`,
          })}
        </div>
      </div>
      <h3
        className={`font-semibold text-gray-900 font-heading ${
          isMobile ? "text-lg mb-3" : "text-xl mb-4"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-gray-600 leading-relaxed ${isMobile ? "text-sm" : ""}`}
      >
        {description}
      </p>
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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!globeRef.current || isMobile) return;

    let width = 0;
    let currentPhi = 0;
    const onResize = () => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(globeRef.current, {
      devicePixelRatio: window?.devicePixelRatio || 2,
      width: width * 2,
      height: width * 2 * 0.4,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 2.5,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1] as [number, number, number],
      markerColor: [0.486, 0.227, 0.929] as [number, number, number],
      glowColor: [0.59, 0.38, 0.96] as [number, number, number],
      scale: 2.5,
      offset: [0, width * 2 * 0.4 * 0.6] as [number, number],
      markers: [
        { location: [37.7749, -122.4194], size: 0.04 },
        { location: [40.7128, -74.006], size: 0.035 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [35.6762, 139.6503], size: 0.03 },
        { location: [1.3521, 103.8198], size: 0.045 },
        { location: [-33.8688, 151.2093], size: 0.04 },
        { location: [55.7558, 37.6176], size: 0.035 },
        { location: [28.6139, 77.209], size: 0.055 },
      ] as Marker[],
      onRender: (state: GlobeState) => {
        if (pointerInteracting.current !== null) {
          const deltaX = pointerInteractionMovement.current;
          currentPhi += deltaX / 100;
        } else {
          currentPhi += 0.002;
        }
        state.phi = currentPhi;
        state.width = width * 2;
        state.height = width * 2 * 0.4;
      },
    });

    const currentGlobeRef = globeRef.current;

    const onPointerDown = (e: PointerEvent) => {
      pointerInteracting.current =
        e.clientX - pointerInteractionMovement.current;
      if (globeRef.current) globeRef.current.style.cursor = "grabbing";
    };

    const onPointerUp = () => {
      pointerInteracting.current = null;
      if (globeRef.current) globeRef.current.style.cursor = "grab";
    };

    const onPointerOut = () => {
      pointerInteracting.current = null;
      if (globeRef.current) globeRef.current.style.cursor = "grab";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta;
      }
    };

    window.addEventListener("resize", onResize);
    currentGlobeRef?.addEventListener("pointerdown", onPointerDown);
    currentGlobeRef?.addEventListener("pointerup", onPointerUp);
    currentGlobeRef?.addEventListener("pointerout", onPointerOut);
    currentGlobeRef?.addEventListener("pointermove", onPointerMove);

    // Set initial cursor style
    if (globeRef.current) {
      globeRef.current.style.cursor = "grab";
      globeRef.current.style.opacity = "1";
    }

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
      currentGlobeRef?.removeEventListener("pointerdown", onPointerDown);
      currentGlobeRef?.removeEventListener("pointerup", onPointerUp);
      currentGlobeRef?.removeEventListener("pointerout", onPointerOut);
      currentGlobeRef?.removeEventListener("pointermove", onPointerMove);
    };
  }, []); // Initialize globe once on desktop

  return (
    <div
      className={`${inter.className} min-h-screen bg-purple-50 flex flex-col relative overflow-hidden pt-16 sm:pt-20`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#7C3AED"
          maxOpacity={0.03}
          flickerChance={0.1}
        />
      </div>

      <main className="flex-grow relative z-[1]">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-4 sm:pt-8 md:pt-16 pb-8 sm:pb-16 md:pb-48">
          <div className="flex flex-col items-center text-center mb-8 sm:mb-16 md:mb-48">
            <div className="inline-block bg-[#E5D8FF] text-[#7C3AED] px-4 md:px-6 py-2 rounded-full text-xs md:text-sm mb-4 md:mb-14 mt-4">
              No Sign Up Required
            </div>

            <div className="relative w-full max-w-4xl mx-auto">
              {/* Text Rotate Demo */}
              <div
                className={`relative z-[1] ${
                  isMobile ? "mb-8" : "mb-10 md:mb-16"
                }`}
              >
                <TextRotateDemo />
              </div>

              {/* Globe Component - Hidden on Mobile */}
              {!isMobile && (
                <div
                  ref={containerRef}
                  className="w-full"
                  style={{
                    aspectRatio: "1/0.4",
                    margin: "auto",
                    position: "relative",
                    transform: "translateX(2%) translateY(-80px)",
                  }}
                >
                  <canvas
                    ref={globeRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      contain: "layout paint size",
                      opacity: 1,
                      transition: "opacity 1s ease",
                      touchAction: "none",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#faf5ff_100%)]" />
                </div>
              )}
            </div>

            <p
              className={`text-sm md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed relative z-10 px-4 ${
                isMobile ? "mt-4 mb-6" : "mt-8 md:mt-16 mb-6 md:mb-16"
              }`}
              style={{
                transform: isMobile ? "translateY(0px)" : "translateY(-60px)",
              }}
            >
              Join live chat rooms, explore interactive maps, and discover
              extraordinary events happening around you. Connect with
              like-minded people instantly.
            </p>

            <div
              className={`flex gap-4 relative z-10 ${isMobile ? "mb-12" : ""}`}
              style={{
                transform: isMobile ? "translateY(0px)" : "translateY(-60px)",
              }}
            >
              <Link href="/events">
                <ShimmerButton
                  background="#7C3AED"
                  className="text-white text-sm md:text-lg px-5 md:px-6 py-2 rounded-full h-auto hover:bg-[#6D28D9]"
                >
                  Get Started →
                </ShimmerButton>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div
            className="max-w-7xl mx-auto px-4"
            style={{
              transform: isMobile ? "translateY(0px)" : "translateY(-60px)",
            }}
          >
            <div
              className={`text-center ${isMobile ? "mb-6" : "mb-8 md:mb-24"}`}
            >
              <h2
                className={`font-bold text-gray-900 tracking-tight font-heading ${
                  isMobile
                    ? "text-2xl mb-2"
                    : "text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4"
                }`}
              >
                Everything You Need
              </h2>
              <p
                className={`text-gray-600 max-w-3xl mx-auto ${
                  isMobile ? "text-sm px-4" : "text-base md:text-xl"
                }`}
              >
                All the tools to discover and connect with local events
              </p>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
                isMobile ? "gap-6" : "gap-4 md:gap-8"
              }`}
            >
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

      {/* Footer Section */}
      <footer className="py-8 border-t border-gray-100 bg-white relative z-[2]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-base">
              © 2024 Event Sphere. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link
                href="/terms"
                className="text-base text-gray-600 hover:text-gray-900"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-base text-gray-600 hover:text-gray-900"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="text-base text-gray-600 hover:text-gray-900"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
