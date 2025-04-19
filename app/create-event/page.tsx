"use client";

import EventForm from "@/components/EventForm";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";

// Import EventMap dynamically with SSR disabled
const EventMap = dynamic(() => import("../../components/EventMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

export default function CreateEventPage() {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  if (!user) {
    return <p>Please log in to create an event.</p>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Event</h1>
      <div className="mb-4">
        <EventMap events={[]} onLocationSelect={handleLocationSelect} />
      </div>
      <EventForm selectedLocation={selectedLocation} />
    </main>
  );
}
