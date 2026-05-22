import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "../ui/SectionWrapper";
import { useInView } from "../../hooks/useInView";
import { useSecrets } from "../../context/SecretContext";
import { GemAnimation } from "../secrets/GemAnimation";
import config from "../../config.json";

interface CardData {
  id: string;
  image: string;
  pairId: string;
}

const PAIRS: { id: string; image: string }[] = [
  { id: "a", image: "/photos/polaroids/memory-1.jpg" },
  { id: "b", image: "/photos/polaroids/memory-2.jpg" },
  { id: "c", image: "/photos/polaroids/memory-5.jpg" },
  { id: "d", image: "/photos/polaroids/memory-6.jpg" },
  { id: "e", image: "/photos/polaroids/memory-7.jpg" },
  { id: "f", image: "/photos/polaroids/memory-9.jpg" },
  { id: "g", image: "/photos/polaroids/memory-10.jpg" },
  { id: "h", image: "/photos/polaroids/memory-12.jpg" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MemoryGame({ id }: { id?: string }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [cards, setCards] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [gemGiven, setGemGiven] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const gemShownRef = useRef(false);
  const { unlockGem } = useSecrets();

  useEffect(() => {
    if (!inView || cards.length > 0) return;
    const deck = shuffle(
      PAIRS.flatMap((p) => [
        { id: `${p.id}-1`, image: p.image, pairId: p.id },
        { id: `${p.id}-2`, image: p.image, pairId: p.id },
      ]),
    );
    setCards(deck);
  }, [inView, cards.length]);

  useEffect(() => {
    if (matched.size === PAIRS.length * 2 && matched.size > 0) {
      if (!gemGiven) {
        unlockGem(5);
        setGemGiven(true);
      }
      const t = setTimeout(() => setCompleted(true), 800);
      return () => clearTimeout(t);
    }
  }, [matched.size, gemGiven, unlockGem]);

  useEffect(() => {
    if (gemGiven && !showGem && !gemShownRef.current) {
      gemShownRef.current = true;
      setShowGem(true);
    }
  }, [gemGiven, showGem]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(
    (cardId: string) => {
      if (lockedRef.current || completed) return;
      if (flipped.has(cardId) || matched.has(cardId)) return;

      setFlipped((prev) => new Set(prev).add(cardId));

      setSelected((prev) => {
        const next = [...prev, cardId];
        if (next.length === 2) {
          lockedRef.current = true;
          const [first, second] = next;

          const cardA = cards.find((c) => c.id === first);
          const cardB = cards.find((c) => c.id === second);

          if (cardA && cardB && cardA.pairId === cardB.pairId) {
            setMatched((prev) => new Set(prev).add(first).add(second));
            setSelected([]);
            lockedRef.current = false;
          } else {
            timerRef.current = setTimeout(() => {
              setFlipped((prev) => {
                const n = new Set(prev);
                n.delete(first);
                n.delete(second);
                return n;
              });
              setSelected([]);
              lockedRef.current = false;
            }, 900);
          }
          setMoves((prev) => prev + 1);
        }
        return next;
      });
    },
    [completed, flipped, matched, cards],
  );

  const resetGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlipped(new Set());
    setMatched(new Set());
    setSelected([]);
    setMoves(0);
    setCompleted(false);
    lockedRef.current = false;
    const deck = shuffle(
      PAIRS.flatMap((p) => [
        { id: `${p.id}-1`, image: p.image, pairId: p.id },
        { id: `${p.id}-2`, image: p.image, pairId: p.id },
      ]),
    );
    setCards(deck);
  }, []);

  const allFlipped = new Set(flipped);
  matched.forEach((id) => allFlipped.add(id));

  return (
    <SectionWrapper id={id} className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-warm-darkest via-[#1A1525] to-warm-darkest" />
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative z-10 px-1 py-16">
        <motion.h2
          className="font-serif text-2xl sm:text-3xl text-center text-cream/80 mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          🃏 Memory
        </motion.h2>
        <motion.p
          className="font-handwritten text-cream-dark/40 text-center text-sm mb-4 sm:mb-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {completed
            ? `Bravo ! ${moves} coup${moves > 1 ? "s" : ""} ✨`
            : "Retrouve les paires de souvenirs"}
        </motion.p>

        <AnimatePresence mode="wait">
          {!completed && cards.length > 0 && (
            <motion.div
              key="grid"
              className="grid grid-cols-4 gap-2 sm:gap-3"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              {cards.map((card, i) => {
                const isFlipped = allFlipped.has(card.id);
                const isMatched = matched.has(card.id);
                return (
                  <motion.button
                    key={card.id}
                    className="relative h-32 sm:h-40 md:h-52 aspect-[3/4] cursor-pointer perspective-[600px]"
                    onClick={() => handleClick(card.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    whileHover={
                      !isFlipped && !isMatched ? { scale: 1.05 } : undefined
                    }
                  >
                    <motion.div
                      className="absolute inset-0 preserve-3d"
                      animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl border ${isMatched ? "border-gold/30" : "border-cream-dark/10"} backface-hidden overflow-hidden`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-gold/20 via-warm-darkest to-gold/10 flex items-center justify-center">
                          <span className="text-xl sm:text-2xl opacity-20 select-none">
                            ♡
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-xl border border-cream-dark/5 backface-hidden overflow-hidden rotateY-180">
                        <div className="w-full h-full bg-warm-dark">
                          <img
                            src={card.image}
                            alt=""
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        </div>
                        {isMatched && (
                          <div className="absolute inset-0 bg-gold/10 flex items-center justify-center">
                            <span className="text-xl sm:text-2xl">✨</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {completed && (
            <motion.div
              key="done"
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                className="font-serif text-gold text-xl sm:text-2xl mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                ✨ Félicitations ✨
              </motion.p>
              <p className="font-handwritten text-cream/50 text-base">
                {moves <= 12
                  ? "Incroyable, t'as une mémoire de championne !"
                  : moves <= 20
                    ? "Tu as retrouvé tous nos souvenirs !"
                    : "Pas facile hein ? Mais tu as réussi !"}
              </p>
              <motion.button
                className="mt-6 font-body text-cream-dark/30 text-xs tracking-wider hover:text-cream-dark/60 transition-colors underline underline-offset-4"
                onClick={resetGame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                rejouer
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GemAnimation
        trigger={showGem}
        message={config.secrets.memoryGameMessage}
        onComplete={() => setShowGem(false)}
      />
    </SectionWrapper>
  );
}
