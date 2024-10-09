"use client";

import { useEffect, useState } from "react";

interface EventFormProps {
  selectedLocation: { lat: number | null; lng: number | null };
}

export default function EventForm({ selectedLocation }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedLocation.lat && selectedLocation.lng) {
      setLatitude(selectedLocation.lat.toString());
      setLongitude(selectedLocation.lng.toString());
    }
  }, [selectedLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setError("Invalid coordinates. Please select a location on the map.");
      return;
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      setTitle("");
      setDescription("");
      setDate("");
      setLatitude("");
      setLongitude("");
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block mb-2">
          Date
        </label>
        <input
          type="datetime-local"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Location (Selected on map)</label>
        <div>
          <span>Latitude: {latitude}</span>, <span>Longitude: {longitude}</span>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Event
      </button>
    </form>
  );
}
