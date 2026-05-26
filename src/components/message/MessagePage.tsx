import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GrainOverlay } from "../ui/GrainOverlay";
import { CursorGlow } from "../ui/CursorGlow";
import { AmbientGlow } from "../ui/AmbientGlow";
import { EvolvingBackground } from "../ui/EvolvingBackground";

const API_URL = import.meta.env.PROD
  ? "https://tab.mprnl.fr/api/message"
  : "/api/message";

export function MessagePage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setStatus("sending");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue");
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen bg-warm-darkest text-cream font-body flex items-center justify-center overflow-hidden">
      <GrainOverlay />
      <CursorGlow />
      <AmbientGlow />
      <EvolvingBackground />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors bg-warm-dark/40 rounded-lg backdrop-blur-sm"
      >
        ← Retour
      </motion.button>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>
            <h2 className="font-serif text-2xl text-gold mb-2">Message envoyé !</h2>
            <p className="text-cream/60 mb-6">Il a bien été transmis ✉️</p>
            <button
              onClick={() => { setStatus("idle"); setText(""); }}
              className="px-6 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
            >
              Envoyer un autre message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-lg px-6"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <span className="text-4xl">💌</span>
              <h2 className="font-serif text-2xl mt-3 text-gold">
                Écris ton message
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50/10 backdrop-blur-sm rounded-2xl p-6 border border-gold/20 shadow-xl"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Écris quelque chose de doux..."
                rows={6}
                maxLength={2000}
                className="w-full bg-transparent text-cream font-handwritten text-lg placeholder-cream/30 resize-none outline-none border-b border-gold/20 pb-4 focus:border-gold/60 transition-colors"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-cream/40">{text.length}/2000</span>

                <button
                  onClick={handleSend}
                  disabled={!text.trim() || status === "sending"}
                  className="px-8 py-2.5 rounded-xl bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {status === "sending" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                      Envoi...
                    </span>
                  ) : (
                    "Envoyer ✉️"
                  )}
                </button>
              </div>

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-400 text-sm"
                >
                  {errorMsg}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
