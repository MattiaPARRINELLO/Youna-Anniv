import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import BirthdayPage from "./components/birthday/BirthdayPage";
import { PushNotificationManager } from "./components/ui/PushSubscribeButton";

const ControlCenter = lazy(() =>
  import("./components/control-center/ControlCenter").then((m) => ({
    default: m.ControlCenter,
  }))
);

const MessagePage = lazy(() =>
  import("./components/message/MessagePage").then((m) => ({
    default: m.MessagePage,
  }))
);

function SectionFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-dark">
      <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<SectionFallback />}>
        <Routes>
          <Route path="/" element={<ControlCenter />} />
          <Route path="/anniversaire" element={<BirthdayPage />} />
          <Route path="/message" element={<MessagePage />} />
        </Routes>
        <PushNotificationManager />
      </Suspense>
    </HashRouter>
  );
}
