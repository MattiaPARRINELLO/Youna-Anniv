import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { PortalCard } from './PortalCard';
import { OpenWhenPortal } from './OpenWhenPortal';
import { openWhenEntries, type OpenWhenEntry } from '../../data/openWhen';
import { FloatingElements } from '../ui/FloatingElements';
import { useSecrets } from '../../context/SecretContext';
import { trackEvent } from '../../utils/tracker';
import { GemAnimation } from '../secrets/GemAnimation';
import { SecretPassword } from '../secrets/SecretPassword';
import config from '../../config.json';

export function OpenWhenHub({ id }: { id?: string }) {
  const { openWhenPortalsVisited, portalSecretsRevealed, gem3, unlockGem } = useSecrets();
  const [activeEntry, setActiveEntry] = useState<OpenWhenEntry | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const passwordDismissed = useRef(false);
  const [showHint, setShowHint] = useState(false);
  const [showSecretCounter, setShowSecretCounter] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (portalSecretsRevealed.length > 0) setShowSecretCounter(true);
  }, [portalSecretsRevealed]);

  useEffect(() => {
    if (openWhenPortalsVisited.length >= 8 && !gem3 && !passwordDismissed.current) {
      const timer = setTimeout(() => setShowPassword(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [openWhenPortalsVisited, gem3]);

  return (
    <SectionWrapper id={id} className="bg-gradient-to-b from-warm-dark-mid to-warm-dark py-20">
      <FadeInOnScroll className="text-center mb-10">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">pour plus tard</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">Ouvre quand...</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">des petits mots pour chaque moment</p>

        {showSecretCounter && portalSecretsRevealed.length > 0 && (
          <motion.p
            className="text-gold-light/40 text-xs mt-2 font-body"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✨ {portalSecretsRevealed.length}/6 secrets trouvés
          </motion.p>
        )}

        {showHint && portalSecretsRevealed.length === 0 && (
          <motion.p
            className="text-cream-dark/20 text-xs mt-3 font-body italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            certaines cartes cachent peut-être quelque chose...
          </motion.p>
        )}
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.2} className="w-full max-w-lg mx-auto px-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {openWhenEntries.map((entry, i) => (
            <PortalCard
              key={entry.slug}
              emoji={entry.emoji}
              title={entry.title}
              hasSecret={!!entry.surprise}
              onClick={() => {
                setActiveEntry(entry);
                trackEvent('open_when_opened', entry.title);
              }}
              delay={0.1 * i}
            />
          ))}
        </div>
      </FadeInOnScroll>

      <AnimatePresence>
        {activeEntry && (
          <OpenWhenPortal
            entry={activeEntry}
            onClose={() => setActiveEntry(null)}
          />
        )}
      </AnimatePresence>
      <FloatingElements type="mixed" countDesktop={4} countMobile={2} />

      <AnimatePresence>
        {showPassword && (
          <SecretPassword
            passwordWord={config.secrets.passwordWord}
            onCorrect={() => {
              setShowPassword(false);
              unlockGem(3);
              setShowGem(true);
              trackEvent('password_correct');
            }}
            onClose={() => { setShowPassword(false); passwordDismissed.current = true; }}
          />
        )}
      </AnimatePresence>

      <GemAnimation
        trigger={showGem}
        message="chaque lettre etait cachee pour toi..."
        onComplete={() => setShowGem(false)}
      />
    </SectionWrapper>
  );
}
