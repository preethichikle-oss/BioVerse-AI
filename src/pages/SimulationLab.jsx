import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import { getDidYouKnow } from '../services/aiTutor.js';
import { useLearningStore } from '../store/useLearningStore.js';

const simulations = [
  {
    id: 'atp',
    name: 'ATP Energy Production',
    color: '#ff5bd6',
    glowColor: 'rgba(255, 91, 214, 0.35)',
    steps: ['Glucose enters mitochondrion', 'Oxygen assists reactions', 'ATP molecules charge up', 'Energy powers cell work'],
  },
  {
    id: 'protein',
    name: 'Protein Synthesis',
    color: '#b8ff5d',
    glowColor: 'rgba(184, 255, 93, 0.35)',
    steps: ['DNA instruction is copied', 'mRNA travels outward', 'Ribosome reads codons', 'Amino acids form protein'],
  },
  {
    id: 'transport',
    name: 'Cell Transport',
    color: '#38f8ff',
    glowColor: 'rgba(56, 248, 255, 0.35)',
    steps: ['Molecules approach membrane', 'Channels recognize cargo', 'Particles cross selectively', 'Cell balance is restored'],
  },
];

// Fixed: use percentage-based positions relative to the container (0–100),
// not viewport units. Each particle gets a deterministic lane so they spread
// evenly across the full height of the canvas instead of bunching at the top.
function buildParticleDefs(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // Spread vertically across 10%–88% so particles are always visible above the step cards
    topPct: 10 + (i % 9) * 8.5,
    // Stagger start positions so the canvas looks alive immediately
    initialXPct: (i * 4.7) % 80,
    // Vary speed slightly per particle for organic feel
    duration: 2.2 + (i % 5) * 0.22,
    delay: i * 0.08,
    // Amplitude of vertical wobble in px — small enough to stay in lane
    wobble: i % 2 === 0 ? 10 : -10,
    size: i % 3 === 0 ? 14 : i % 3 === 1 ? 10 : 8,
  }));
}

const PARTICLE_DEFS = buildParticleDefs(22);

export default function SimulationLab() {
  const [active, setActive] = useState(simulations[0]);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [fact, setFact] = useState('');
  const addCompletion = useLearningStore((state) => state.addCompletion);

  useEffect(() => {
    addCompletion('Lab');
  }, [addCompletion]);

  useEffect(() => {
    setStep(0);
    setRunning(false);
    getDidYouKnow(active.name)
      .then(setFact)
      .catch(() => setFact('Cells coordinate thousands of reactions every second while maintaining internal balance.'));
  }, [active]);

  useEffect(() => {
    if (!running) return undefined;
    const interval = setInterval(() => {
      setStep((current) => (current + 1) % active.steps.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [running, active.steps.length]);

  const progressPct = ((step + 1) / active.steps.length) * 100;

  return (
    <div>
      <SectionHeader eyebrow="Simulation Lab" title="Run cell function experiments">
        Start, pause, and reset animated simulations to see how energy, proteins, and transport happen inside human cells.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="glass p-5">
          <div className="space-y-3">
            {simulations.map((sim) => (
              <button
                key={sim.id}
                onClick={() => setActive(sim)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active.id === sim.id
                    ? 'border-cyanGlow/60 bg-cyanGlow/15 shadow-neon'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <p className="text-sm font-bold text-white">{sim.name}</p>
                <p className="mt-1 text-xs text-slate-400">{sim.steps.length} animated learning steps</p>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-limeGlow">AI Did You Know?</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{fact || 'Generating a useful cell fact...'}</p>
          </div>
        </aside>

        <section className="glass overflow-hidden p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active simulation</p>
              <h2 className="text-2xl font-black text-white">{active.name}</h2>
            </div>
            <div className="flex gap-2">
              <button className="icon-btn" onClick={() => setRunning(true)} title="Start simulation">
                <Play />
              </button>
              <button className="icon-btn" onClick={() => setRunning(false)} title="Pause simulation">
                <Pause />
              </button>
              <button
                className="icon-btn"
                onClick={() => {
                  setRunning(false);
                  setStep(0);
                }}
                title="Reset simulation"
              >
                <RotateCcw />
              </button>
            </div>
          </div>

          {/* ── Visualization canvas ─────────────────────────────── */}
          <div
            className="relative mt-5 overflow-hidden rounded-3xl border border-white/10"
            style={{ height: 360, background: 'rgba(0,0,0,0.45)' }}
          >
            {/* Ambient glow that pulses when running */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: running ? [0.18, 0.38, 0.18] : 0.08 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${active.glowColor}, transparent)` }}
            />

            {/* Particles — fixed: pure pixel-based positioning inside the container */}
            {PARTICLE_DEFS.map((p) => (
              <motion.div
                key={`${active.id}-${p.id}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                  // topPct is stable — position relative to container height
                  top: `${p.topPct}%`,
                  // Box-shadow creates the glow effect with no extra DOM nodes
                  boxShadow: `0 0 ${p.size + 4}px 2px ${active.color}`,
                  backgroundColor: active.color,
                }}
                animate={
                  running
                    ? {
                        // Fixed: animate left% 0→90% so particles always cross the canvas
                        left: ['0%', '92%'],
                        // Fixed: wobble in px relative to the natural top% position
                        y: [0, p.wobble, 0, -p.wobble, 0],
                        opacity: [0, 0.9, 1, 0.85, 0],
                        scale: [0.6, 1, 1.1, 1, 0.6],
                      }
                    : {
                        // Idle: park each particle at its staggered start position
                        left: `${p.initialXPct}%`,
                        y: 0,
                        opacity: 0.55,
                        scale: 1,
                      }
                }
                transition={
                  running
                    ? {
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'linear',
                        // Independent timing for the wobble axes
                        y: { duration: p.duration, repeat: Infinity, ease: 'easeInOut' },
                        opacity: { duration: p.duration, repeat: Infinity, ease: 'easeInOut' },
                        scale: { duration: p.duration, repeat: Infinity, ease: 'easeInOut' },
                      }
                    : { duration: 0.4 }
                }
              />
            ))}

            {/* Progress track — vertically centred in the upper 55% of canvas */}
            <div
              className="absolute left-8 right-8 rounded-full bg-white/10"
              style={{ top: '55%', height: 3 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: active.color }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {/* Step dot marker */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 rounded-full border-2"
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: active.color,
                  borderColor: 'rgba(0,0,0,0.6)',
                  boxShadow: `0 0 10px 3px ${active.color}`,
                }}
                animate={{ left: `calc(${progressPct}% - 6px)` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {/* Step cards — pinned to bottom, clear of particle zone */}
            <div className="absolute inset-x-4 bottom-4 grid gap-2 sm:grid-cols-4">
              {active.steps.map((label, index) => (
                <motion.div
                  key={label}
                  animate={{
                    borderColor: index === step ? `${active.color}80` : 'rgba(255,255,255,0.08)',
                    backgroundColor: index === step ? `${active.color}20` : 'rgba(0,0,0,0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border p-2.5 text-xs"
                  style={{
                    // Subtle glow on active card
                    boxShadow: index === step ? `0 0 12px 2px ${active.color}40` : 'none',
                    color: index === step ? '#ffffff' : 'rgb(148,163,184)',
                  }}
                >
                  <span className="font-semibold opacity-60">Step {index + 1}</span>
                  <br />
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
          {/* ── End canvas ───────────────────────────────────────── */}
        </section>
      </div>
    </div>
  );
}
