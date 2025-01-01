import { Poppins } from 'next/font/google';
import { useEffect, useState } from "react";
import EventChat from './EventChat';

const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'] });

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
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
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
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (error) {
    return <p className={`text-red-500 ${poppins.className}`}>{error}</p>;
  }

  return (
    <div className={poppins.className}>
    <h2 className="text-3xl font-extrabold mb-4 pb-1 relative inline-block overflow-hidden group">
          <span className="text-black">
            Upcoming Events
          </span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black scale-x-100"></span>
        </h2>
      <div className={`flex flex-col lg:flex-row ${selectedEventId ? 'gap-4' : ''}`}>
        <div className={`${selectedEventId ? 'lg:w-1/2' : 'w-full'}`}>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <ul className="space-y-4">
              {events.map((event) => (
                <li
                  key={event._id}
                  className={`mb-4 p-4 border rounded cursor-pointer ${
                    selectedEventId === event._id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="text-sm text-gray-500">
                    {formatDate(event.date)} at {formatTime(event.date)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedEventId && (
          <div className="mt-4 lg:mt-0 lg:w-1/2">
            <EventChat eventId={selectedEventId} />
          </div>
        )}
      </div>
    </div>
  );
}
