"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { motion } from "framer-motion";
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
  const [is3DMode, setIs3DMode] = useState(true);

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

          // Enhanced custom map styles for a more futuristic look
          const mapStyles = [
            {
              elementType: "geometry",
              stylers: [{ color: "#0c0e13" }]
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#8ec3b9" }]
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#1a3646" }]
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#4b6878" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#283d6a" }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#304a7d" }]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }]
            }
          ];

          const newMap = new google.maps.Map(mapRef.current, {
            center: centerCoordinates,
            zoom: 3,
            minZoom: 2,
            maxZoom: 18,
            mapTypeId: google.maps.MapTypeId.HYBRID,  // Explicitly set HYBRID mode
            tilt: 45,
            heading: 0,
            styles: mapStyles,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            rotateControl: true,
            backgroundColor: '#0c0e13',
            mapTypeControlOptions: {
              mapTypeIds: ['hybrid']
            }
          });

          setMap(newMap);

          // Force 3D mode after map creation
          google.maps.event.addListenerOnce(newMap, 'tilesloaded', () => {
            newMap.setMapTypeId(google.maps.MapTypeId.HYBRID);
            newMap.setTilt(45);
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
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#00E676",
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: "#FFF"
          }
        });

        // Create custom info window with enhanced styling
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 15px; background: rgba(0,0,0,0.8); border-radius: 8px; box-shadow: 0 4px 6px rgba(0,230,118,0.1);">
              <h3 style="margin: 0 0 10px; color: #00E676; font-size: 18px;">${event.title}</h3>
              <button
                style="background: #00E676; color: #000; border: none;
                padding: 8px 15px; border-radius: 20px; cursor: pointer;
                font-weight: bold; transition: all 0.3s ease;"
                onmouseover="this.style.background='#00C853'"
                onmouseout="this.style.background='#00E676'"
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
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#FF4081",
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: "#FFF"
      }
    });
    setSelectionMarker(newMarker);
  };

  const toggle3DMode = () => {
    if (map) {
      const newIs3DMode = !is3DMode;
      setIs3DMode(newIs3DMode);

      if (newIs3DMode) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        map.setTilt(45);
      } else {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        map.setTilt(0);
      }
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
      <motion.div
        className="absolute bottom-4 right-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={toggle3DMode}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
            is3DMode
              ? "bg-green-500 text-black hover:bg-green-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {is3DMode ? "Switch to 2D" : "Switch to 3D"}
        </button>
      </motion.div>
    </div>
  );
}
