import { motion } from 'framer-motion';

const DISMISSED_KEY = 'youyou_mission_dismissed';

export function GemMissionPopup() {
  const dismissed = sessionStorage.getItem(DISMISSED_KEY);
  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    const el = document.getElementById('gem-mission-popup');
    if (el) el.style.display = 'none';
  };

  return (
    <motion.div
      id="gem-mission-popup"
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-warm-darkest/60 backdrop-blur-sm" onClick={handleDismiss} />
      <motion.div
        className="relative z-10 max-w-sm w-full rounded-2xl border border-gold/15 bg-gradient-to-b from-warm-dark/90 to-warm-darkest/95 backdrop-blur-xl p-8 text-center"
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
      >
        <div className="text-5xl mb-4">💎</div>
        <h2 className="font-serif text-2xl text-gold mb-3">Bienvenue, mon amour</h2>
        <p className="font-body text-cream/60 text-sm leading-relaxed mb-6">
          Notre histoire regorge de secrets cachés...
        </p>

        <div className="space-y-3 text-left mb-8">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">🔍</span>
            <span className="font-body text-cream/70 text-sm">Explore chaque section du site</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">💎</span>
            <span className="font-body text-cream/70 text-sm">Découvre les <strong className="text-gold">7 gemmes</strong> cachées</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">💌</span>
            <span className="font-body text-cream/70 text-sm">Débloque le message final…</span>
          </div>
        </div>

        <motion.button
          className="px-8 py-3 rounded-xl bg-gold/15 text-gold font-body text-sm tracking-wider border border-gold/20 hover:bg-gold/25 transition-colors duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDismiss}
        >
          C&apos;est parti 🩷
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
