import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Microscope, Sparkles, Trophy } from 'lucide-react';
import HeroCell from '../components/three/HeroCell.jsx';
import { useLearningStore } from '../store/useLearningStore.js';

const features = [
  { icon: Microscope, title: 'Interactive 3D Explorer', text: 'Rotate, zoom, select, and inspect organelles inside a living-style human cell.' },
  { icon: Brain, title: 'AI Tutor', text: 'Ask beginner-friendly questions and receive short explanations with learning checks.' },
  { icon: Sparkles, title: 'Simulation Lab', text: 'Run ATP, protein synthesis, and membrane transport animations with step notes.' },
  { icon: Trophy, title: 'Quiz Feedback', text: 'Earn XP, badges, instant correction, and a competition-ready progress dashboard.' },
];

export default function Landing() {
  const addCompletion = useLearningStore((state) => state.addCompletion);

  return (
    <div>
      <section className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
        <HeroCell />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/78 to-transparent" />
        <div className="relative z-10 flex min-h-[calc(100vh-120px)] max-w-3xl flex-col justify-center px-5 py-20 sm:px-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-[0.32em] text-cyanGlow"
          >
            AI Model Development Competition 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl"
          >
            BioVerse AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-2xl text-lg leading-8 text-slate-300"
          >
            Interactive 3D Human Cell Learning Platform with AI explanations, simulations, learner feedback, and immersive exploration.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/explorer" onClick={() => addCompletion('Landing')} className="primary-btn">
              Start Learning <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/tutor" className="secondary-btn">Ask AI Tutor</Link>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="glass group p-5 hover:border-cyanGlow/40 hover:shadow-neon"
            >
              <feature.icon className="mb-5 h-8 w-8 text-cyanGlow transition group-hover:scale-110" />
              <h2 className="text-lg font-bold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
