import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE = "https://tab.mprnl.fr/api/push";

type State = "loading" | "subscribed" | "unsubscribed" | "error";

export function PushSubscribeButton() {
  const [state, setState] = useState<State>("loading");

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

  async function handleSubscribe() {
    if (!("serviceWorker" in navigator)) return;

    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        alert("Installe d'abord l'app sur l'écran d'accueil");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const res = await fetch(`${API_BASE}/public-key`);
      const { publicKey } = await res.json();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: Uint8Array.from(atob(publicKey), (c) => c.charCodeAt(0)),
      });
      await fetch(`${API_BASE}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setState("subscribed");
    } catch (e) {
      console.warn("Push subscription:", e);
      setState("error");
    }
  }

  if (state === "error") return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      whileHover={state === "unsubscribed" ? { scale: 1.05 } : undefined}
      whileTap={state === "unsubscribed" ? { scale: 0.98 } : undefined}
      onClick={state === "unsubscribed" ? handleSubscribe : undefined}
      disabled={state !== "unsubscribed"}
      className="w-64 h-10 rounded-2xl bg-warm-dark/60 backdrop-blur-sm border border-gold/20 flex items-center justify-center gap-2 font-body text-sm text-cream/80 transition-colors hover:border-gold/50 hover:bg-warm-dark/80 disabled:opacity-60 disabled:cursor-default"
    >
      {state === "loading" && (
        <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      )}
      {state === "subscribed" && (
        <>
          <span>🔔</span>
          <span>Notifications activées ✓</span>
        </>
      )}
      {state === "unsubscribed" && (
        <>
          <span>🔔</span>
          <span>Activer les notifications</span>
        </>
      )}
    </motion.button>
  );
}
