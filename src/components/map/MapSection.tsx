import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin } from 'react-icons/fi';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { MemoryPopup } from './MemoryPopup';
import { mapLocations, type MapLocation } from '../../data/mapLocations';
import 'leaflet/dist/leaflet.css';

const heartIcon = L.divIcon({
  html: '<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">\uD83D\uDCAB</div>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export function MapSection() {
  const [showFullMap, setShowFullMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark to-warm-dark-mid py-20">
      <FadeInOnScroll className="text-center mb-8">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">les lieux</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">Notre carte</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">les endroits qui comptent</p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.2}>
        <button
          className="glass rounded-2xl p-4 w-[85vw] max-w-md mx-auto cursor-pointer"
          onClick={() => setShowFullMap(true)}
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-warm-darkest flex items-center justify-center relative">
            <div className="absolute inset-0" style={{ filter: 'brightness(0.6) saturate(0.5)' }}>
              <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                className="w-full h-full"
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              </MapContainer>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <FiMapPin className="text-gold" size={28} />
              <span className="font-body text-cream/80 text-sm">ouvrir la carte</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            {mapLocations.map((loc) => (
              <div key={loc.id} className="text-center">
                <span className="text-lg">{loc.emoji}</span>
                <p className="text-cream/50 text-[10px] font-body mt-1">{loc.title}</p>
              </div>
            ))}
          </div>
        </button>
      </FadeInOnScroll>

      <AnimatePresence>
        {showFullMap && (
          <motion.div
            className="fixed inset-0 z-[250] bg-warm-darkest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-6 right-6 z-[400] w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
              onClick={() => setShowFullMap(false)}
            >
              &times;
            </button>

            <MapContainer
              center={[48.8566, 2.3522]}
              zoom={13}
              className="w-full h-full"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {mapLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={[loc.lat, loc.lng]}
                  icon={heartIcon}
                  eventHandlers={{ click: () => setSelectedLocation(loc) }}
                >
                  <Popup>
                    <div className="text-center p-1">
                      <p className="font-serif text-cream text-sm mb-1">{loc.title}</p>
                      <p className="text-cream-dark/60 text-[10px]">{loc.date}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedLocation && (
        <MemoryPopup location={selectedLocation} onClose={() => setSelectedLocation(null)} />
      )}
    </SectionWrapper>
  );
}
