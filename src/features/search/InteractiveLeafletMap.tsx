import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Property } from '../../types';
import { useMapStore } from '../../stores/useMapStore';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { formatBDTShort, formatBDT } from '../../lib/utils';
import { Star, ShieldCheck, ArrowRight, Compass } from 'lucide-react';

interface InteractiveLeafletMapProps {
  properties: Property[];
  className?: string;
}

// Custom Leaflet Price Tag Marker generator
const createPriceIcon = (property: Property, isHovered: boolean, isSelected: boolean) => {
  const formattedPrice = formatBDTShort(property.price);
  const fullPrice = formatBDT(property.price);
  
  let bgClass = 'bg-[#3f3531] text-white border-white';
  let scaleClass = 'scale-100';
  let zIndex = 100;

  if (isSelected) {
    bgClass = 'bg-[#c9996b] text-white border-white ring-2 ring-[#c9996b] shadow-xl';
    scaleClass = 'scale-115 font-black z-50';
    zIndex = 500;
  } else if (isHovered) {
    bgClass = 'bg-[#5c766d] text-white border-white scale-110 shadow-lg';
    scaleClass = 'scale-110 font-black z-40';
    zIndex = 400;
  }

  const ariaLabel = `Rental pin: ${property.title}, ${property.propertyType} in ${property.area}, ${fullPrice} per month, ${property.bedrooms} beds, rating ${property.rating}`;

  const html = `
    <div
      role="button"
      tabindex="0"
      aria-label="${ariaLabel}"
      title="${property.title} - ${fullPrice}/mo in ${property.area}"
      class="relative group cursor-pointer transition-transform duration-200 ${scaleClass}"
      style="z-index: ${zIndex}"
    >
      <div class="px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border flex items-center gap-1 ${bgClass} whitespace-nowrap transition-colors">
        <span>${formattedPrice}</span>
      </div>
      <div class="w-2 h-2 rotate-45 mx-auto -mt-1 ${isSelected ? 'bg-[#c9996b]' : isHovered ? 'bg-[#5c766d]' : 'bg-[#3f3531]'}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-price-pin',
    iconSize: [60, 30],
    iconAnchor: [30, 28],
    popupAnchor: [0, -28],
  });
};

// Map controller to react to mapCenter or property selection
const MapController: React.FC<{ center: [number, number]; zoom: number; selectedProp?: Property }> = ({
  center,
  zoom,
  selectedProp,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProp) {
      map.flyTo([selectedProp.lat, selectedProp.lng], 14, { duration: 1 });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, selectedProp, map]);

  return null;
};

export const InteractiveLeafletMap: React.FC<InteractiveLeafletMapProps> = ({
  properties,
  className = '',
}) => {
  const { hoveredPropertyId, selectedPropertyId, mapCenter, mapZoom, setHoveredPropertyId, setSelectedPropertyId } =
    useMapStore();
  const { navigate } = useNavigationStore();

  const selectedProp = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div
      role="region"
      aria-label="Interactive map of Dhaka rental properties"
      className={`relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-[#5c4f4a]/20 ${className}`}
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController center={mapCenter} zoom={mapZoom} selectedProp={selectedProp} />

        {properties.map((prop) => {
          const isHovered = hoveredPropertyId === prop.id;
          const isSelected = selectedPropertyId === prop.id;
          const customIcon = createPriceIcon(prop, isHovered, isSelected);

          return (
            <Marker
              key={prop.id}
              position={[prop.lat, prop.lng]}
              icon={customIcon}
              title={`${prop.title} - ${formatBDT(prop.price)}/mo`}
              alt={`Map pin for ${prop.title} in ${prop.area}, ${formatBDT(prop.price)} per month`}
              eventHandlers={{
                mouseover: () => setHoveredPropertyId(prop.id),
                mouseout: () => setHoveredPropertyId(null),
                click: () => {
                  setSelectedPropertyId(prop.id);
                  // Scroll matching card into view if available
                  const el = document.getElementById(`property-card-${prop.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                },
              }}
            >
              <Popup className="custom-nestora-popup" closeButton={false}>
                <div
                  role="dialog"
                  aria-label={`Property snapshot for ${prop.title}`}
                  className="w-56 p-1 bg-white rounded-xl text-[#3f3531]"
                >
                  <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-2 bg-stone-100">
                    <img
                      src={prop.images[0]}
                      alt={`Photo of ${prop.title} in ${prop.area}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded text-[9px] font-bold text-[#3f3531]">
                        {prop.area}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#3f3531]/90 text-[#c9996b] rounded text-[8px] font-bold flex items-center gap-0.5">
                        <Compass className="w-2.5 h-2.5 animate-spin-slow" aria-hidden="true" />
                        360°
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold font-['Outfit'] line-clamp-1">
                    {prop.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-[#5c4f4a]/80 mt-1">
                    <span>{prop.bedrooms} Beds • {prop.bathrooms} Baths</span>
                    <span className="flex items-center gap-0.5 font-bold text-[#3f3531]">
                      <Star className="w-3 h-3 fill-[#c9996b] text-[#c9996b]" aria-hidden="true" />
                      <span>{prop.rating}</span>
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-[#3f3531]">
                        {formatBDT(prop.price)}
                      </span>
                      <span className="text-[9px] text-[#5c4f4a]/70">/mo</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate({ name: 'property', id: prop.id })}
                      aria-label={`View full details for ${prop.title}`}
                      className="px-2.5 py-1 rounded-lg bg-[#c9996b] hover:bg-[#b07e4f] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs"
                    >
                      View <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Controls & Badges */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-[#5c4f4a]/15 text-xs font-bold text-[#3f3531]">
        <ShieldCheck className="w-4 h-4 text-[#5c766d]" aria-hidden="true" />
        <span>Dhaka Live Geo-Rentals</span>
      </div>

      <div
        aria-live="polite"
        className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-[#5c4f4a]/15 text-[11px] font-semibold text-[#5c4f4a]"
      >
        Showing {properties.length} map pins
      </div>
    </div>
  );
};
