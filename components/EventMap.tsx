"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

interface Event {
  _id: string;
  title: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface EventMapProps {
  events: Event[];
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedEvent?: Event | null;
}

export default function EventMap({ events, onLocationSelect, selectedEvent }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectionMarker, setSelectionMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: "weekly",
      });

      try {
        await loader.load();
        if (mapRef.current && !map) {
          const centerCoordinates = { lat: 20, lng: 0 };

          const newMap = new google.maps.Map(mapRef.current, {
            center: centerCoordinates,
            zoom: 3,
            minZoom: 2,
            maxZoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          });

          setMap(newMap);

          if (onLocationSelect) {
            newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
              const clickedLat = e.latLng?.lat();
              const clickedLng = e.latLng?.lng();
              if (clickedLat && clickedLng) {
                onLocationSelect(clickedLat, clickedLng);
                placeSelectionMarker(e.latLng!);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, [onLocationSelect]);

  useEffect(() => {
    if (map) {
      markers.forEach((marker) => marker.setMap(null));
      const newMarkers = events.map((event) => {
        const marker = new google.maps.Marker({
          position: {
            lat: event.location.coordinates[1],
            lng: event.location.coordinates[0],
          },
          map: map,
          title: event.title,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3 style="margin: 0 0 10px;">${event.title}</h3>
              <button
                style="background: #007bff; color: white; border: none;
                padding: 8px 15px; border-radius: 4px; cursor: pointer;"
                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
                  event.location.coordinates[1]
                },${event.location.coordinates[0]}', '_blank')"
              >
                Get Directions
              </button>
            </div>
          `
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });
      setMarkers(newMarkers);
    }
  }, [map, events]);

  useEffect(() => {
    if (map && selectedEvent) {
      const selectedMarker = markers.find(
        marker => marker.getTitle() === selectedEvent.title
      );
      if (selectedMarker) {
        map.setCenter(selectedMarker.getPosition()!);
        map.setZoom(12);
      }
    }
  }, [selectedEvent, map, markers]);

  const placeSelectionMarker = (latLng: google.maps.LatLng) => {
    if (selectionMarker) {
      selectionMarker.setMap(null);
    }
    const newMarker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    setSelectionMarker(newMarker);
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}