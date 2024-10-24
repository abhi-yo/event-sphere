"use client";
import EventList from "@/components/EventList";
import EventMap from "@/components/EventMap";
import { useEffect, useState } from "react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="mb-8 rounded-xl overflow-hidden shadow-md bg-white">
        <EventMap events={events} selectedEvent={selectedEvent} />
      </div>
      <EventList onEventSelect={handleEventSelect} />
    </main>
  );
}
