import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });

  return position === null ? null : (
    <Marker position={position}>
    </Marker>
  );
}

export const LocationPicker = ({ onLocationSelect, initialPosition = [48.8566, 2.3522] }: Props) => {
  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={initialPosition}
        zoom={13}
        className="h-[300px] w-full"
        style={{ height: '300px', width: '100%' }}
        
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
      <p className="text-sm text-gray-500 mt-2">Cliquez sur la carte pour sélectionner l'emplacement</p>
    </div>
  );
}; 