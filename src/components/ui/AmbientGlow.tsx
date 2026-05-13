export function AmbientGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 animate-pulse-soft"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(212,168,83,0.04) 0%, transparent 70%)',
          animationDuration: '8s',
        }}
      />
    </div>
  );
}
