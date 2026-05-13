import { motion } from 'framer-motion';

interface TypewriterTextProps {
  lines: string[];
}

export function TypewriterText({ lines }: TypewriterTextProps) {
  return (
    <div className="text-center px-6">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          className={`font-serif italic text-gold-light text-lg sm:text-xl md:text-2xl leading-relaxed ${
            line === '' ? 'h-4' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: line ? 0.7 : 0, y: 0 }}
          transition={{
            delay: 1.5 + i * 1.2,
            duration: 1.5,
            ease: 'easeOut',
          }}
        >
          {line || '\u00A0'}
        </motion.p>
      ))}
    </div>
  );
}
