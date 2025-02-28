import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Store } from '../types/Store';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { FaLayerGroup } from 'react-icons/fa';
import React from 'react';

// Styles de carte disponibles


// Icônes personnalisées
const createCustomIcon = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `
    <div class="marker-pin" style="background-color: ${color}">
      <div class="marker-pulse"></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -34]
});

const defaultIcon = createCustomIcon('#4F46E5');
const selectedIcon = createCustomIcon('#EF4444');

interface Props {
  stores: Store[];
  selectedStore?: Store | null;
  center?: [number, number];
  onStoreSelect?: (lat: number, lng: number) => void;
  isAddingNewStore?: boolean;
}

// Composant séparé pour le centrage et les contrôles de la carte
function MapController({ 
  selectedStore, 
  onStyleChange 
}: { 
  selectedStore: Store | null | undefined;
  onStyleChange: (style: string) => void;
}) {
  const map = useMap();

  // Effet de centrage
  React.useEffect(() => {
    if (selectedStore && map) {
      map.flyTo(
        [selectedStore.latitude, selectedStore.longitude],
        16,
        { duration: 1.5 }
      );
    }
  }, [selectedStore, map]);

  return (
    <>
      {/* Contrôle des styles */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg">
          <button
            onClick={() => onStyleChange('satellite')}
            className="p-2 flex items-center space-x-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <FaLayerGroup className="h-5 w-5" />
            <span className="text-sm font-medium">Vue Satellite</span>
          </button>
        </div>
      </div>

      {/* Contrôles de zoom */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        <button 
          onClick={() => map.zoomIn()}
          className="bg-white w-10 h-10 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          +
        </button>
        <button 
          onClick={() => map.zoomOut()}
          className="bg-white w-10 h-10 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          -
        </button>
      </div>
    </>
  );
}

export const StoreMap = ({ stores, selectedStore, center = [48.8566, 2.3522], onStoreSelect, isAddingNewStore = false }: Props) => {
  const [setMapStyle] = useState('satellite');
  const [markerPosition, setMarkerPosition] = React.useState<[number, number]>(center);

  useEffect(() => {
    setMarkerPosition(center);
  }, [center]);

  const handleMarkerDrag = (event: any) => {
    const { lat, lng } = event.target.getLatLng();
    setMarkerPosition([lat, lng]);
    if (onStoreSelect) {
      onStoreSelect(lat, lng);
    }
  };

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Fond de carte satellite */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />

        {/* Render existing store markers */}
        {stores.map(store => (
          <Marker
            key={store.id}
            position={[store.latitude, store.longitude]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onStoreSelect?.(store.latitude, store.longitude)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3">
                <h3 className="font-semibold text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{store.city} - {store.postalCode}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {store.services.map((service, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Draggable Marker for adding a new store */}
        {isAddingNewStore && (
          <Marker
            position={markerPosition}
            icon={selectedIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3">
                <h3 className="font-semibold text-gray-900">Selected Location</h3>
                <p className="text-sm text-gray-600 mt-1">Drag the marker to select a location.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Contrôleur de carte avec accès au contexte de la carte */}
        <MapController 
          selectedStore={selectedStore} 
          onStyleChange={setMapStyle}
        />
      </MapContainer>
    </div>
  );
}; 