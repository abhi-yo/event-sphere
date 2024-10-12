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
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectionMarker, setSelectionMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["marker"]
    });

    loader.load().then(() => {
      if (mapRef.current && !map) {
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
         mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
            mapTypeId: google.maps.MapTypeId.ROADMAP
         });
        setMap(newMap);

        newMap.setOptions({
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
          }
        });

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
      markers.forEach((marker) => marker.map = null);
      const newMarkers = events.map((event) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: {
            lat: event.location.coordinates[1],
            lng: event.location.coordinates[0],
          },
          title: event.title,
          content: createMarkerContent(event.title),
        });

        marker.addListener("click", () => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${event.location.coordinates[1]},${event.location.coordinates[0]}`;
          window.open(url, '_blank');
        });

        return marker;
      });
      setMarkers(newMarkers);
    }
  }, [map, events]);

  useEffect(() => {
    if (map && selectedEvent) {
      const selectedMarker = markers.find(
        marker => marker.title === selectedEvent.title
      );
      if (selectedMarker) {
        map.panTo(selectedMarker.position as google.maps.LatLng);
        map.setZoom(15);
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      }
    } else if (map && !selectedEvent) {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }
  }, [selectedEvent, map, markers]);

  const placeSelectionMarker = (latLng: google.maps.LatLng) => {
    if (selectionMarker) {
      selectionMarker.map = null;
    }
    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: latLng,
      content: createMarkerContent("Selected Location", "blue"),
    });
    setSelectionMarker(newMarker);
  };

  const createMarkerContent = (title: string, color: string = "red") => {
    const container = document.createElement("div");
    container.className = "marker-content";
    container.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0Z" fill="${color}"/>
        <circle cx="12" cy="8" r="4" fill="white"/>
      </svg>
    `;
    const tooltip = document.createElement("div");
    tooltip.className = "marker-tooltip";
    tooltip.textContent = title;
    container.appendChild(tooltip);
    return container;
  };

  return (
    <>
      <div ref={mapRef} className="w-full h-[400px]" />
      <style jsx global>{`
        .marker-content {
          position: relative;
          cursor: pointer;
        }
        .marker-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          display: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .marker-content:hover .marker-tooltip {
          display: block;
        }
      `}</style>
    </>
  );
}
