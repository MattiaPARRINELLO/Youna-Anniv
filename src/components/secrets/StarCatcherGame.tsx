import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface Star {
  id: number;
  x: number;
  size: number;
  duration: number;
  caught: boolean;
}

const GAME_DURATION = 12000;
const TARGET_SCORE = 10;
const MAX_STARS_ON_SCREEN = 3;

interface StarCatcherGameProps {
  onComplete: (won: boolean) => void;
  onClose: () => void;
}

export function StarCatcherGame({ onComplete, onClose }: StarCatcherGameProps) {
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const nextId = useRef(0);
  const scoreRef = useRef(0);
  const gameOver = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const spawnRef = useRef<ReturnType<typeof setInterval>>();
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const spawnStar = useCallback(() => {
    if (gameOver.current) return;
    const id = nextId.current++;
    setStars(prev => {
      if (prev.filter(s => !s.caught).length >= MAX_STARS_ON_SCREEN) return prev;
      return [...prev, {
        id,
        x: 10 + Math.random() * 80,
        size: 24 + Math.random() * 16,
        duration: 2.5 + Math.random() * 1.5,
        caught: false,
      }];
    });
  }, []);

  useEffect(() => {
    spawnRef.current = setInterval(spawnStar, 1500);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          gameOver.current = true;
          if (scoreRef.current >= TARGET_SCORE) {
            setGameState('won');
          } else {
            setGameState('lost');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [spawnStar]);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      const t = setTimeout(() => onComplete(scoreRef.current >= TARGET_SCORE), 2000);
      return () => clearTimeout(t);
    }
  }, [gameState, onComplete]);

  useEffect(() => {
    const caughtIds = stars.filter(s => s.caught).map(s => s.id);
    if (caughtIds.length === 0) return;

    const timer = setTimeout(() => {
      setStars(prev => prev.filter(s => !caughtIds.includes(s.id)));
    }, 600);

    return () => clearTimeout(timer);
  }, [stars.filter(s => s.caught).length]);

  const handleCatch = useCallback((starId: number) => {
    setStars(prev => prev.map(s =>
      s.id === starId && !s.caught ? { ...s, caught: true } : s
    ));
    setScore(prev => {
      const next = prev + 1;
      scoreRef.current = next;
      return next;
    });
  }, []);

  const progress = (timeLeft / (GAME_DURATION / 1000)) * 100;

  const gameHeight = gameAreaRef.current?.clientHeight || 700;

  return (
    <motion.div
      className="fixed inset-0 z-[250] flex flex-col bg-warm-darkest/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onClose} className="text-cream-dark/40 hover:text-cream">
          <FiX size={22} />
        </button>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1">
          <span className="text-sm">⭐</span>
          <span className="text-gold font-mono text-sm">{score}</span>
          <span className="text-cream-dark/30 text-xs">/ {TARGET_SCORE}</span>
        </div>
        <span className="text-cream-dark/30 font-mono text-xs">{timeLeft}s</span>
      </div>

      <div className="h-1 bg-cream-dark/10 mx-4 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold/40 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      <div
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {stars.map((star) => (
          <motion.button
            key={star.id}
            className="absolute text-gold active:scale-125 transition-transform p-3"
            style={{
              left: `${star.x}%`,
              top: -star.size,
              fontSize: star.size,
              filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))',
              pointerEvents: star.caught ? 'none' : 'auto',
            }}
            initial={{ y: 0 }}
            animate={star.caught
              ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
              : { y: gameHeight + star.size * 2 }
            }
            exit={{ opacity: 0 }}
            transition={
              star.caught
                ? { duration: 0.4 }
                : { duration: star.duration, ease: 'linear' }
            }
            onPointerDown={(e) => {
              e.preventDefault();
              if (!star.caught) handleCatch(star.id);
            }}
          >
            ✦
          </motion.button>
        ))}

        {gameState !== 'playing' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-serif text-gold text-3xl mb-2">
              {gameState === 'won' ? 'Bravo !' : 'Presque...'}
            </p>
            <p className="font-handwritten text-cream/60 text-lg">
              {gameState === 'won'
                ? "tu es une collectionneuse d'etoiles"
                : `${scoreRef.current} etoile${scoreRef.current > 1 ? 's' : ''}...`}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
