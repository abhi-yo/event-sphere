"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const markerColors = [
  '#FF3B5C', // Pink
  '#0095FF', // Blue
  '#00CC88', // Green
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#FF5722'  // Deep Orange
];

export default function EventMap({ events, onLocationSelect, selectedEvent }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [selectionMarker, setSelectionMarker] = useState<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Fix for default marker icons in Next.js
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      // Fix icon issues
      // @ts-expect-error - Known issue with Leaflet types
      delete L.Icon.Default.prototype._getIconUrl;
      
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }
  }, []);

  const createCustomIcon = useCallback((color: string = '#3388ff') => {
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `
        <div style="
          width: 16px;
          height: 16px;
          background: ${color};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            opacity: 0.8;
          "></div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 16],
    });
  }, []);

  const placeSelectionMarker = useCallback((latlng: L.LatLng) => {
    if (!mapInstanceRef.current) return;
    
    if (selectionMarker) {
      selectionMarker.remove();
    }
    
    const selectionIcon = L.divIcon({
      className: 'custom-selection-icon',
      html: `
        <div style="position: relative;">
          <div style="
            width: 12px;
            height: 12px;
            background: #ff3b3b;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            z-index: 10;
          "></div>
          <div style="
            width: 24px;
            height: 24px;
            border: 2px solid rgba(255, 59, 59, 0.7);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse 1.5s infinite;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    if (typeof document !== 'undefined' && !document.getElementById('pulsing-marker-style')) {
      const style = document.createElement('style');
      style.id = 'pulsing-marker-style';
      style.innerHTML = `
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    const newMarker = L.marker(latlng, { icon: selectionIcon }).addTo(mapInstanceRef.current);
    setSelectionMarker(newMarker);
    
    if (onLocationSelect) {
      onLocationSelect(latlng.lat, latlng.lng);
    }
  }, [selectionMarker, onLocationSelect]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    const initMap = () => {
      const mapInstance = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: true
      }).setView([20, 0], 2);

      // Add zoom control to top-right corner
      const zoomControl = new L.Control.Zoom({ position: 'topright' });
      zoomControl.addTo(mapInstance);
      
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
        minZoom: 2,
      }).addTo(mapInstance);
      
      L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 2,
        opacity: 0.7
      }).addTo(mapInstance);

      // Create fullscreen control
      class FullscreenControl extends L.Control {
        onAdd() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          const button = L.DomUtil.create('a', '', container);
          button.innerHTML = '⤢';
          button.href = '#';
          button.style.fontSize = '16px';
          button.style.width = '30px';
          button.style.height = '30px';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.fontWeight = 'bold';
          button.title = 'View Fullscreen';
          
          L.DomEvent
            .on(button, 'click', L.DomEvent.stopPropagation)
            .on(button, 'click', L.DomEvent.preventDefault)
            .on(button, 'click', () => {
              if (mapInstance.getContainer().requestFullscreen) {
                mapInstance.getContainer().requestFullscreen();
              }
            });
          
          return container;
        }
      }
      
      new FullscreenControl({ position: 'topright' }).addTo(mapInstance);

      // Handle click events for location selection
      if (onLocationSelect) {
        mapInstance.on('click', (e: L.LeafletMouseEvent) => {
          placeSelectionMarker(e.latlng);
        });
      }

      // Apply clean, modern styles to the map container
      const container = mapInstance.getContainer();
      container.style.borderRadius = '8px';
      container.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';

      mapInstanceRef.current = mapInstance;
      setIsMapReady(true);

      // Handle resize
      const handleResize = () => {
        mapInstance.invalidateSize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        mapInstance.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      };
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, [onLocationSelect, placeSelectionMarker]);

  // Handle events and markers
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance || !isMapReady) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    
    // Create new markers for each event
    const newMarkers = events.map((event, index) => {
      // Use different colors for each marker
      const colorIndex = index % markerColors.length;
      const eventIcon = createCustomIcon(markerColors[colorIndex]);
      
      // Create marker
      const marker = L.marker(
        [event.location.coordinates[1], event.location.coordinates[0]], 
        { icon: eventIcon }
      ).addTo(mapInstance);
      
      // Add click handler with simple Google Maps navigation
      marker.on('click', function() {
        const lat = event.location.coordinates[1];
        const lng = event.location.coordinates[0];
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
      });

      // Simple popup with just the title
      marker.bindPopup(`
        <div style="min-width: 180px; padding: 10px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${event.title}</h3>
        </div>
      `);

      return marker;
    });
    
    setMarkers(newMarkers);

    // Add CSS for simple popup
    if (typeof document !== 'undefined' && !document.getElementById('map-custom-styles')) {
      const style = document.createElement('style');
      style.id = 'map-custom-styles';
      style.innerHTML = `
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [events, isMapReady, createCustomIcon]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle selected event
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance || !selectedEvent || !isMapReady) return;
    
    const lat = selectedEvent.location.coordinates[1];
    const lng = selectedEvent.location.coordinates[0];
    
    // Simple pan and zoom to the location
    mapInstance.setView([lat, lng], 13, {
      animate: true,
      duration: 0.5
    });
    
    const selectedMarker = markers.find(
      (_, index) => events[index]._id === selectedEvent._id
    );
    if (selectedMarker) {
      selectedMarker.openPopup();
    }
  }, [selectedEvent, markers, events, isMapReady]);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden bg-white">
      <div ref={mapRef} className="w-full h-full" style={{ borderRadius: '8px' }} />
    </div>
  );
}