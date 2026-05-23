import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AudioLines, Loader2, Sparkles } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import CellScene from '../components/three/CellScene.jsx';
import { organelles } from '../data/organelles.js';
import { getOrganelleExplanation } from '../services/aiTutor.js';
import { useLearningStore } from '../store/useLearningStore.js';

export default function Explorer() {
  const { selectedOrganelle, setSelectedOrganelle, addCompletion, soundEnabled } = useLearningStore();
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const selected = organelles.find((item) => item.name === selectedOrganelle) || organelles[0];

  useEffect(() => {
    let active = true;
    setLoading(true);
    getOrganelleExplanation(selectedOrganelle)
      .then((text) => active && setExplanation(text))
      .catch(() => active && setExplanation(selected.detail))
      .finally(() => active && setLoading(false));
    addCompletion('Explorer');
    return () => {
      active = false;
    };
  }, [selectedOrganelle, selected.detail, addCompletion]);

  const speak = () => {
    if (!soundEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(explanation || selected.detail));
  };

  return (
    <div>
      <SectionHeader eyebrow="3D Cell Explorer" title="Inspect a living-style human cell">
        Click organelles in the model or use the selector panel. The AI explanation updates with short, learner-friendly guidance.
      </SectionHeader>
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <CellScene />
        <aside className="glass p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Selected organelle</p>
              <h2 className="mt-2 text-2xl font-black text-white">{selected.name}</h2>
            </div>
            <button className="icon-btn" onClick={speak} title="Narrate explanation">
              <AudioLines />
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold text-cyanGlow">{selected.role}</p>
          <div className="mt-4 min-h-32 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
            {loading ? (
              <span className="flex items-center gap-2 text-cyanGlow"><Loader2 className="h-4 w-4 animate-spin" /> AI generating explanation...</span>
            ) : (
              explanation
            )}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {organelles.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedOrganelle(item.name)}
                className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${
                  selectedOrganelle === item.name
                    ? 'border-cyanGlow/60 bg-cyanGlow/15 text-white shadow-neon'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <motion.div className="mt-5 rounded-2xl border border-limeGlow/20 bg-limeGlow/10 p-4" whileHover={{ scale: 1.02 }}>
            <Sparkles className="mb-2 h-5 w-5 text-limeGlow" />
            <p className="text-sm text-slate-200">Try zooming into the membrane, then click mitochondria to compare boundary control with energy production.</p>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
