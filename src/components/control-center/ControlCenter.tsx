import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GrainOverlay } from "../ui/GrainOverlay";
import { CursorGlow } from "../ui/CursorGlow";
import { AmbientGlow } from "../ui/AmbientGlow";
import { EvolvingBackground } from "../ui/EvolvingBackground";

const cards = [
  {
    title: "Anniversaire",
    emoji: "🎂",
    description: "Retourner voir le site d'anniversaire",
    route: "/anniversaire",
  },
  {
    title: "Envoyer un message",
    emoji: "💌",
    description: "Écrire et envoyer un petit mot",
    route: "/message",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export function ControlCenter() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-warm-darkest text-cream font-body flex items-center justify-center overflow-hidden">
      <GrainOverlay />
      <CursorGlow />
      <AmbientGlow />
      <EvolvingBackground />

      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl md:text-4xl text-gold"
        >
          Centre de Contrôle
        </motion.h1>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 px-6"
      >
        {cards.map((card) => (
          <motion.button
            key={card.route}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.route)}
            className="w-64 h-72 md:w-72 md:h-80 rounded-2xl bg-warm-dark/60 backdrop-blur-sm border border-gold/20 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors hover:border-gold/50 hover:bg-warm-dark/80"
          >
            <span className="text-5xl md:text-6xl">{card.emoji}</span>
            <h2 className="font-serif text-xl md:text-2xl text-cream">{card.title}</h2>
            <p className="text-sm text-cream/60 font-light max-w-[200px] text-center">
              {card.description}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
