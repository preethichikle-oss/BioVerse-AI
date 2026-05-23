export default function LoadingScreen({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[55vh] place-items-center">
      <div className="glass relative w-full max-w-sm overflow-hidden p-8 text-center">
        <div className="mx-auto mb-5 h-20 w-20 rounded-full border border-cyanGlow/40 bg-cyanGlow/10 shadow-neon">
          <div className="h-full w-full animate-spin rounded-full border-4 border-transparent border-t-cyanGlow" />
        </div>
        <p className="font-semibold text-white">{label}</p>
        <p className="mt-2 text-sm text-slate-400">Synchronizing neural learning modules...</p>
      </div>
    </div>
  );
}
