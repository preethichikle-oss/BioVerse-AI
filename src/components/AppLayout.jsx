import { Outlet, NavLink } from 'react-router-dom';
import { Atom, Beaker, Bot, Home, Trophy, Volume2, VolumeX, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLearningStore } from '../store/useLearningStore.js';
import ProgressWidget from './ProgressWidget.jsx';

const navItems = [
  { to: '/', label: 'Launch', icon: Home },
  { to: '/explorer', label: '3D Cell', icon: Atom },
  { to: '/lab', label: 'Lab', icon: Beaker },
  { to: '/tutor', label: 'AI Tutor', icon: Bot },
  { to: '/quiz', label: 'Quiz', icon: Trophy },
];

export default function AppLayout() {
  const { soundEnabled, toggleSound, themePulse, toggleThemePulse } = useLearningStore();

  return (
    <div className="min-h-screen overflow-hidden bg-void text-slate-100">
      <div className="fixed inset-0 bg-grid bg-[length:42px_42px] opacity-30" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,248,255,0.18),transparent_28%),radial-gradient(circle_at_82%_32%,rgba(255,91,214,0.16),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(184,255,93,0.13),transparent_32%)]" />
      {themePulse && <div className="fixed inset-x-0 top-0 h-32 animate-scan bg-gradient-to-b from-cyanGlow/10 to-transparent" />}

      <aside className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-ink/88 px-2 py-2 backdrop-blur-xl md:bottom-auto md:right-auto md:top-0 md:h-screen md:w-24 md:border-r md:border-t-0 md:px-3 md:py-5">
        <div className="hidden h-14 w-14 place-items-center rounded-2xl border border-cyanGlow/35 bg-cyanGlow/10 shadow-neon md:grid">
          <Zap className="h-7 w-7 text-cyanGlow" />
        </div>
        <nav className="flex items-center justify-around gap-1 md:mt-8 md:flex-col md:gap-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative grid h-14 min-w-14 place-items-center rounded-2xl border text-xs transition md:w-16 ${
                  isActive
                    ? 'border-cyanGlow/50 bg-cyanGlow/15 text-cyanGlow shadow-neon'
                    : 'border-white/5 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
                }`
              }
              title={label}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1 text-[10px] md:hidden">{label}</span>
              <span className="pointer-events-none absolute left-20 hidden rounded-lg border border-white/10 bg-ink px-3 py-1 text-xs text-white opacity-0 shadow-neon transition group-hover:opacity-100 md:block">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden flex-col gap-3 md:flex md:absolute md:bottom-5 md:left-3">
          <button className="icon-btn" onClick={toggleSound} title="Toggle sound">
            {soundEnabled ? <Volume2 /> : <VolumeX />}
          </button>
          <button className="icon-btn" onClick={toggleThemePulse} title="Toggle scan animation">
            <Zap />
          </button>
        </div>
      </aside>

      <main className="relative z-10 min-h-screen pb-24 md:ml-24 md:pb-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto min-h-screen w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8"
        >
          <ProgressWidget />
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
