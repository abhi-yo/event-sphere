"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import EventList from "@/components/EventList";
import { Event } from "@/lib/types";

// Import EventMap dynamically with SSR disabled
const EventMap = dynamic(() => import("../../components/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <main className="container mx-auto p-4 pt-24">
      <div className="mb-8 rounded-xl overflow-hidden shadow-md bg-white">
        {loading ? (
          <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <EventMap events={events} selectedEvent={selectedEvent} />
        )}
      </div>
      <EventList onEventSelect={handleEventSelect} />
    </main>
  );
}
