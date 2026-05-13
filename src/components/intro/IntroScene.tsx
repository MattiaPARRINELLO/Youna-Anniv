import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';
import { TypewriterText } from './TypewriterText';
import { useMusic } from '../../context/MusicContext';

export function IntroScene() {
  const { markInteraction } = useMusic();

  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-warm-darkest via-warm-dark to-warm-dark-mid overflow-hidden"
      onClick={markInteraction}
    >
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <FloatingParticles />
      <motion.p
        className="text-gold/30 text-xs tracking-[0.3em] uppercase mb-8 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        pour toi
      </motion.p>
      <TypewriterText />
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.4, 0] }}
        transition={{ delay: 12, duration: 3, repeat: Infinity }}
      >
        <span className="text-cream-dark/30 text-xs font-body tracking-wider">defiler</span>
        <motion.div
          className="w-5 h-8 border border-cream-dark/20 rounded-full flex justify-center"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-cream-dark/30 rounded-full mt-1"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
