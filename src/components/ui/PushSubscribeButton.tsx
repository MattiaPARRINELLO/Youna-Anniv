import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://tab.mprnl.fr/api/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

type State = "loading" | "subscribed" | "unsubscribed" | "error";

export function PushNotificationManager() {
  const [state, setState] = useState<State>("loading");
  const [modalOpen, setModalOpen] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("error");
      return;
    }
    navigator.serviceWorker.ready.then(async (reg) => {
      try {
        const sub = await reg.pushManager.getSubscription();
        setState(sub ? "subscribed" : "unsubscribed");
      } catch {
        setState("unsubscribed");
      }
    });
  }, []);

  async function subscribe() {
    if (!("serviceWorker" in navigator)) return;
    setSubscribing(true);

    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        alert("Installe d'abord l'app sur l'écran d'accueil");
        setSubscribing(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const res = await fetch(`${API_BASE}/public-key`);
      const { publicKey } = await res.json();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await fetch(`${API_BASE}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setState("subscribed");
    } catch (e) {
      console.warn("Push subscription:", e);
    } finally {
      setSubscribing(false);
    }
  }

  async function unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch(`${API_BASE}/unsubscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub.toJSON()),
        });
        await sub.unsubscribe();
      }
    } catch (e) {
      console.warn("Push unsubscribe:", e);
    }
    setState("unsubscribed");
  }

  function handleIconClick() {
    if (state === "subscribed") {
      unsubscribe();
    } else if (state === "unsubscribed") {
      setModalOpen(true);
    }
  }

  if (state === "error" || state === "loading") {
    return null;
  }

  return (
    <>
      <button
        onClick={handleIconClick}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-warm-dark/80 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-xl shadow-lg transition-all hover:border-gold/60 hover:scale-105 active:scale-95"
        aria-label={
          state === "subscribed"
            ? "Désactiver les notifications"
            : "Activer les notifications"
        }
      >
        {state === "subscribed" ? "🔔" : "🔕"}
      </button>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-6 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-sm rounded-2xl bg-warm-darkest border border-gold/20 p-6 shadow-2xl text-center">
                <span className="text-5xl mb-3 block">🔔</span>
                <h2 className="font-serif text-xl text-gold mb-2">
                  Notifications
                </h2>
                <p className="text-sm text-cream/60 font-light mb-6 leading-relaxed">
                  Reçois les messages directement sur ton téléphone, même quand
                  l'app n'est pas ouverte.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                    }}
                    className="flex-1 h-10 rounded-xl bg-warm-dark/60 border border-gold/20 text-cream/60 font-body text-sm hover:border-gold/30 transition-colors"
                  >
                    Plus tard
                  </button>
                  <button
                    onClick={async () => {
                      await subscribe();
                      setModalOpen(false);
                    }}
                    disabled={subscribing}
                    className="flex-1 h-10 rounded-xl bg-gold/20 border border-gold/40 text-gold font-body text-sm hover:bg-gold/30 transition-colors disabled:opacity-50"
                  >
                    {subscribing ? (
                      <div className="w-4 h-4 mx-auto border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    ) : (
                      "Activer"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
