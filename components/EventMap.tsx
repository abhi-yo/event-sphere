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
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
    });
    loader.load().then(() => {
      if (mapRef.current && !map) {
        const kolkataCoordinates = { lat: 22.5726, lng: 88.3639 };
        const newMap = new google.maps.Map(mapRef.current, {
          center: kolkataCoordinates,
          zoom: 9,
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
    });
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

        marker.addListener("click", () => {
          map.setCenter(marker.getPosition()!);
          map.setZoom(12);
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
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });
    setSelectionMarker(newMarker);
  };

  return <div ref={mapRef} className="w-full h-[400px]" />;
}
