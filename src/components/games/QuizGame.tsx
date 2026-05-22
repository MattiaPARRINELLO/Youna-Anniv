import { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { useInView } from '../../hooks/useInView';
import { trackEvent } from '../../utils/tracker';
import { useSecrets } from '../../context/SecretContext';
import { GemAnimation } from '../secrets/GemAnimation';
import config from '../../config.json';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
    {
      q: "Quelle est ma couleur préférée ?",
      options: ["Rouge", "Bleu", "Noir", "Vert"],
      correct: 0,
    },
    {
      q: "Quel est mon plat préféré ?",
      options: ["Pâtes carbonara", "Pizza", "Sushi", "Burger"],
      correct: 0,
    },
    {
      q: "Quel est mon film préféré ?",
      options: ["Interstellar", "Inception", "The Dark Knight", "Matrix"],
      correct: 0,
    },
    {
      q: "Quelle est ma plus grande passion ?",
      options: ["La photo", "Les jeux vidéo", "La musique", "Le sport"],
      correct: 0,
    },
    {
      q: "Quel animal est-ce que je préfère ?",
      options: ["Les chats", "Les chiens", "Les lapins", "Les hamsters"],
      correct: 0,
    },
    {
      q: "Quelle est ma boisson préférée ?",
      options: ["Oasis", "Coca", "Jus d'orange", "Eau"],
      correct: 0,
    },
    {
      q: "Quel est mon plus grand rêve ?",
      options: ["Réussir dans la photo", "Voyager autour du monde", "Devenir riche", "Ouvrir un restaurant"],
      correct: 0,
    },
    {
      q: "Qu'est-ce qui me fait le plus rire ?",
      options: ["Toi", "Les blagues nulles", "Les films comiques", "Mes amis"],
      correct: 0,
    },
];

const TOTAL = QUESTIONS.length;

function getScoreMessage(score: number): { title: string; desc: string } {
  if (score === TOTAL) return { title: '💕 Parfaite !', desc: 'Tu me connais par cœur. C\'est tout ce que je pouvais espérer. 🥹' };
  if (score >= 6) return { title: '🥰 Presque parfait !', desc: 'Tu me connais très bien. Il te manque juste quelques petits détails…' };
  if (score >= 4) return { title: '💛 Pas mal du tout !', desc: 'Tu apprends à me connaître. On a encore plein de temps pour ça.' };
  return { title: '😄 On recommence ?', desc: 'Bon, on va devoir passer un peu plus de temps ensemble… Mais je suis tout à fait d\'accord !' };
}

function getAnswerEmoji(index: number): string {
  return ['🇦', '🇧', '🇨', '🇩'][index] || '';
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizGame({ id }: { id?: string }) {
  const { unlockGem } = useSecrets();
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const gemGivenRef = useRef(false);
  const [retryKey, setRetryKey] = useState(0);

  const shuffled = useMemo(() =>
    QUESTIONS.map(q => {
      const opts = shuffleArray(q.options);
      return { ...q, options: opts, correct: opts.indexOf(q.options[q.correct]) };
    }),
    [retryKey],
  );

  const current = shuffled[questionIndex];

  const handleAnswer = useCallback((index: number) => {
    if (locked || finished) return;
    setLocked(true);
    setSelected(index);

    const isCorrect = index === current.correct;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex >= TOTAL) {
        const finalScore = score + (isCorrect ? 1 : 0);
        trackEvent('quiz_completed', `${finalScore}/${TOTAL}`);
        if (!gemGivenRef.current) {
          gemGivenRef.current = true;
          unlockGem(6);
          setShowGem(true);
        }
        setFinished(true);
        setShowResult(true);
      } else {
        setQuestionIndex(nextIndex);
        setSelected(null);
        setLocked(false);
      }
    }, 1200);
  }, [questionIndex, current.correct, locked, finished, score]);

  const handleRetry = useCallback(() => {
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    setLocked(false);
    gemGivenRef.current = false;
    setRetryKey(k => k + 1);
    trackEvent('quiz_retry');
  }, []);

  const progress = finished ? 1 : (questionIndex) / TOTAL;

  return (
    <SectionWrapper id={id} className="px-4 py-24">
      <div ref={ref} className="w-full max-w-lg mx-auto flex flex-col items-center gap-8">
        <motion.h2
          className="font-serif text-3xl md:text-4xl text-gold text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🌸 Tu me connais ?
        </motion.h2>
        <p className="font-body text-cream/40 text-sm -mt-6">
          {TOTAL} questions pour voir si tu me connais vraiment
        </p>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={questionIndex}
              className="w-full flex flex-col gap-6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-cream-dark/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold/60 rounded-full"
                  initial={{ width: `${(questionIndex / TOTAL) * 100}%` }}
                  animate={{ width: `${((questionIndex + 1) / TOTAL) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="font-body text-xs text-cream/30 text-center">
                {questionIndex + 1} / {TOTAL}
              </span>

              {/* Question */}
              <p className="font-serif text-xl md:text-2xl text-cream/90 text-center leading-relaxed">
                {current.q}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {current.options.map((opt, i) => {
                  let btnClass = "w-full text-left px-5 py-4 rounded-xl border font-body text-sm md:text-base transition-all duration-300 ";
                  if (selected === null) {
                    btnClass += "border-cream-dark/10 bg-cream/5 text-cream/70 hover:border-gold/30 hover:bg-gold/5 hover:text-cream";
                  } else if (i === current.correct) {
                    btnClass += "border-emerald-400/50 bg-emerald-400/10 text-emerald-300";
                  } else if (i === selected) {
                    btnClass += "border-red-400/50 bg-red-400/10 text-red-300";
                  } else {
                    btnClass += "border-cream-dark/5 bg-cream/3 text-cream/30";
                  }

                  return (
                    <motion.button
                      key={`${questionIndex}-${i}`}
                      className={btnClass}
                      onClick={() => handleAnswer(i)}
                      disabled={selected !== null}
                      whileTap={selected === null ? { scale: 0.98 } : undefined}
                    >
                      <span className="mr-3 opacity-50">{getAnswerEmoji(i)}</span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="w-full flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Score circle */}
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <motion.circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / TOTAL) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="text-gold"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-4xl text-cream">{score}<span className="text-lg text-cream/40">/{TOTAL}</span></span>
                </div>
              </div>

              {/* Score message */}
              <div className="text-center">
                <p className="font-serif text-2xl text-gold mb-2">{getScoreMessage(score).title}</p>
                <p className="font-body text-sm text-cream/60 max-w-sm">{getScoreMessage(score).desc}</p>
              </div>

              {/* Retry */}
              <motion.button
                className="mt-4 px-6 py-3 rounded-xl border border-cream-dark/20 text-cream/50 font-body text-sm
                  hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-all duration-300"
                onClick={handleRetry}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                🔄 Recommencer
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GemAnimation
        trigger={showGem}
        message={config.secrets.quizMessage}
        onComplete={() => setShowGem(false)}
      />
    </SectionWrapper>
  );
}
