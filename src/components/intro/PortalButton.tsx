import { motion } from 'framer-motion';

interface PortalButtonProps {
  onClick: () => void;
}

export function PortalButton({ onClick }: PortalButtonProps) {
  return (
    <motion.button
      className="relative flex flex-col items-center gap-3 cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 100 }}
      whileTap={{ scale: 1.3 }}
    >
      <motion.div
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
        style={{
          border: '2px solid rgba(212,175,55,0.5)',
          boxShadow: '0 0 40px rgba(212,175,55,0.3), inset 0 0 20px rgba(212,175,55,0.1)',
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(212,175,55,0.2), inset 0 0 10px rgba(212,175,55,0.05)',
            '0 0 50px rgba(212,175,55,0.5), inset 0 0 30px rgba(212,175,55,0.2)',
            '0 0 20px rgba(212,175,55,0.2), inset 0 0 10px rgba(212,175,55,0.05)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold"
            style={{
              boxShadow: '0 0 8px rgba(212,175,55,0.8)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="absolute"
              style={{
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: '#d4af37',
                transform: `rotate(${angle}deg) translate(34px)`,
              }}
            />
          </motion.div>
        ))}
        <motion.span
          className="text-gold text-2xl relative z-10"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.span>
      </motion.div>
      <span className="text-cream-dark/40 text-[10px] font-body tracking-widest uppercase">
        touche l&apos;ecran
      </span>
    </motion.button>
  );
}
