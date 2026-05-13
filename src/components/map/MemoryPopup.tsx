import type { MapLocation } from '../../data/mapLocations';

interface MemoryPopupProps {
  location: MapLocation;
  onClose: () => void;
}

export function MemoryPopup({ location, onClose }: MemoryPopupProps) {
  return (
    <div
      className="fixed inset-0 z-[300] bg-warm-darkest/90 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-3xl block mb-3">{location.emoji}</span>

        <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-cream-dark/5 flex items-center justify-center">
          <img
            src={location.photo}
            alt={location.title}
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
        </div>

        <h3 className="font-serif text-cream text-xl mb-1">{location.title}</h3>
        <p className="text-violet-light/60 text-xs mb-3 font-body">{location.date}</p>
        <p className="font-body text-cream/70 text-sm leading-relaxed italic">{location.message}</p>
      </div>
    </div>
  );
}
