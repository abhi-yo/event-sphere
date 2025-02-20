"use client"

import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { ArrowRight, Calendar, MapPin, MessageCircle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SparklesText } from './magicui/sparkles-text';
import EventChat from './EventChat';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

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

interface EventListProps {
  onEventSelect?: (event: Event) => void;
}

export default function EventList({ onEventSelect }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then(setEvents)
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      });
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEventId(selectedEventId === event._id ? null : event._id);
    if (onEventSelect) onEventSelect(event);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className={`${inter.className} max-w-6xl mx-auto px-4 py-8`}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <SparklesText text="Discover Amazing Events" className="text-4xl" />
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Join live chat rooms, explore interactive maps, and discover extraordinary events
          happening around you. Connect with like-minded people instantly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const { date, time } = formatDateTime(event.date);
            return (
              <Card 
                key={event._id}
                className={`group relative overflow-hidden bg-white transition-all duration-300 hover:shadow-lg
                  ${selectedEventId === event._id ? 'ring-2 ring-[#7C3AED]' : ''}
                `}
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-6">
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-[#7C3AED]/5 rounded-full transition-transform group-hover:scale-150" />
                  
                  <h3 className="text-xl font-semibold mb-3 relative">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 relative">{event.description}</p>
                  
                  <div className="space-y-3 text-sm text-gray-500 relative">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#7C3AED]" />
                      <span>{date} at {time}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#7C3AED]" />
                      <span>View on Map</span>
                    </div>

                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-[#7C3AED]" />
                      <span>Join Chat Room</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center relative">
                    <button className="flex items-center text-sm font-medium text-[#7C3AED] group-hover:translate-x-2 transition-transform">
                      Join Event
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div className="px-2 py-1 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-medium">
                      Free
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found. Check back soon!</p>
        </div>
      )}
      {selectedEventId && (
          <div className="mt-4 lg:mt-0 lg:w-1/2">
            <EventChat eventId={selectedEventId} />
          </div>
        )}
    </div>
  );
}