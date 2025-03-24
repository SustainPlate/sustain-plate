
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Define the location type
interface DonationLocation {
  id: string;
  locationType: 'pickup' | 'delivery';
  address: string;
  foodName?: string;
  status: string;
  timestamp: string;
}

interface MapViewProps {
  locations: DonationLocation[];
}

// This is a public token used for demonstration purposes only
// In a production application, this should be stored in environment variables
// or retrieved from a backend service
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VzdGFpbnBsYXRlIiwiYSI6ImNsajVvaXEwMjBsazIzcGs0ZXp4MDRyb24ifQ.vUMIOT4UgQB9nnNONdZA8Q';

const MapView: React.FC<MapViewProps> = ({ locations }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center on US
      zoom: 3,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Clean up on unmount
    return () => {
      map.current?.remove();
    };
  }, []);

  // Effect for handling markers when locations change
  useEffect(() => {
    if (!map.current || locations.length === 0) return;

    // Wait for map to load
    const addMarkers = () => {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Mock geocoded locations for demonstration
      // In a real application, you would use a geocoding service to convert addresses to coordinates
      const mockGeocodedLocations = locations.map((loc, index) => {
        // Generate random points around the US for demonstration
        const lat = 39.8283 + (Math.random() - 0.5) * 20;
        const lng = -98.5795 + (Math.random() - 0.5) * 40;
        return {
          ...loc,
          lat,
          lng
        };
      });

      // Add new markers
      mockGeocodedLocations.forEach(location => {
        const color = location.locationType === 'pickup' ? '#34D399' : '#60A5FA';
        
        const element = document.createElement('div');
        element.className = 'marker';
        element.style.backgroundColor = color;
        element.style.width = '20px';
        element.style.height = '20px';
        element.style.borderRadius = '50%';
        element.style.border = '2px solid white';
        element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        
        const marker = new mapboxgl.Marker(element)
          .setLngLat([location.lng, location.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3 class="font-bold">${location.locationType === 'pickup' ? 'Donation Pickup' : 'Delivery Location'}</h3>
              ${location.foodName ? `<p>Food: ${location.foodName}</p>` : ''}
              <p>Status: ${location.status}</p>
              <p>Date: ${new Date(location.timestamp).toLocaleDateString()}</p>`
            )
          )
          .addTo(map.current!);
          
        markersRef.current.push(marker);
      });
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }
  }, [locations]);

  return (
    <div className="h-full w-full">
      <div className="mapboxgl-popup-styles">
        <style>
          {`
          .mapboxgl-popup-content {
            padding: 12px;
            border-radius: 6px;
          }
          .mapboxgl-popup-content h3 {
            margin: 0 0 8px 0;
          }
          .mapboxgl-popup-content p {
            margin: 4px 0;
          }
          `}
        </style>
      </div>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default MapView;
