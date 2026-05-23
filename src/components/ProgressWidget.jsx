import { Award, BrainCircuit, Gauge } from 'lucide-react';
import { useLearningStore } from '../store/useLearningStore.js';

export default function ProgressWidget() {
  const { xp, completedModules, quizScores } = useLearningStore();
  const completion = Math.min(100, Math.round((completedModules.length / 5) * 100));
  const bestScore = quizScores.length ? Math.max(...quizScores.map((score) => score.percent)) : 0;

  return (
    <section className="mb-5 grid gap-3 md:grid-cols-3">
      <Metric icon={BrainCircuit} label="Neural XP" value={`${xp} XP`} accent="text-cyanGlow" />
      <Metric icon={Gauge} label="Completion" value={`${completion}%`} accent="text-limeGlow" />
      <Metric icon={Award} label="Best Quiz" value={`${bestScore}%`} accent="text-amberGlow" />
    </section>
  );
}

function Metric({ icon: Icon, label, value, accent }) {
  return (
    <div className="glass flex items-center gap-3 p-3">
      <div className={`grid h-10 w-10 place-items-center rounded-xl bg-white/5 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
