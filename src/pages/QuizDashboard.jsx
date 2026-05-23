import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import { quizQuestions } from '../data/quizQuestions.js';
import { useLearningStore } from '../store/useLearningStore.js';

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function QuizDashboard() {
  const [difficulty, setDifficulty] = useState('All');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const { addQuizScore, addCompletion, quizScores, xp } = useLearningStore();

  const questions = useMemo(() => {
    const filtered = difficulty === 'All' ? quizQuestions : quizQuestions.filter((q) => q.difficulty === difficulty);
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, 6);
  }, [difficulty]);

  const current = questions[index];
  const correctCount = answers.filter((answer) => answer.correct).length;
  const percent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  useEffect(() => {
    addCompletion('Quiz');
  }, [addCompletion]);

  const choose = (option) => {
    if (selected || !current) return;
    const correct = option === current.answer;
    setSelected(option);
    const nextAnswers = [...answers, { question: current.question, selected: option, correct }];
    setAnswers(nextAnswers);
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        const finalCorrect = nextAnswers.filter((answer) => answer.correct).length;
        addQuizScore({ correct: finalCorrect, total: questions.length, percent: Math.round((finalCorrect / questions.length) * 100), date: new Date().toISOString() });
        setFinished(true);
      } else {
        setIndex(index + 1);
        setSelected(null);
      }
    }, 900);
  };

  const reset = () => {
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setFinished(false);
  };

  const badges = [
    { label: 'Cell Explorer', active: xp >= 150 },
    { label: 'ATP Analyst', active: correctCount >= 2 },
    { label: 'Quiz Champion', active: percent >= 80 },
  ];

  return (
    <div>
      <SectionHeader eyebrow="Interactive Quiz Dashboard" title="Prove your cell mastery">
        Answer randomized questions, receive instant feedback, earn XP, and track your strongest result.
      </SectionHeader>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass p-5">
          <div className="mb-5 flex flex-wrap gap-2">
            {difficulties.map((level) => (
              <button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  reset();
                }}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  difficulty === level ? 'border-cyanGlow/60 bg-cyanGlow/15 text-white shadow-neon' : 'border-white/10 bg-white/[0.03] text-slate-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {!finished && current ? (
            <>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full bg-cyanGlow" animate={{ width: `${((index + 1) / questions.length) * 100}%` }} />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Question {index + 1} of {questions.length} | {current.topic}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{current.question}</h2>
              <div className="mt-6 grid gap-3">
                {current.options.map((option) => {
                  const isCorrect = selected && option === current.answer;
                  const isWrong = selected === option && option !== current.answer;
                  return (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => choose(option)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition ${
                        isCorrect
                          ? 'border-limeGlow/70 bg-limeGlow/15 text-white'
                          : isWrong
                            ? 'border-roseGlow/70 bg-roseGlow/15 text-white'
                            : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyanGlow/40 hover:text-white'
                      }`}
                    >
                      {option}
                      {isCorrect && <CheckCircle2 className="h-5 w-5 text-limeGlow" />}
                      {isWrong && <XCircle className="h-5 w-5 text-roseGlow" />}
                    </motion.button>
                  );
                })}
              </div>
              {selected && <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-300">{current.explanation}</p>}
            </>
          ) : (
            <Result correct={correctCount} total={questions.length} percent={percent} reset={reset} />
          )}
        </section>

        <aside className="space-y-5">
          <div className="glass p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-cyanGlow">Leaderboard Style Stats</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat label="Score" value={`${percent}%`} />
              <Stat label="Correct" value={`${correctCount}/${questions.length}`} />
              <Stat label="XP" value={xp} />
            </div>
          </div>
          <div className="glass p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-amberGlow">Achievement Badges</p>
            <div className="mt-4 grid gap-3">
              {badges.map((badge) => (
                <div key={badge.label} className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  badge.active ? 'border-amberGlow/40 bg-amberGlow/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-500'
                }`}>
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-limeGlow">Recent Results</p>
            <div className="mt-4 space-y-2">
              {quizScores.length ? quizScores.slice(-5).reverse().map((score) => (
                <div key={score.date} className="flex justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                  <span>{score.correct}/{score.total} correct</span>
                  <span className="text-white">{score.percent}%</span>
                </div>
              )) : <p className="text-sm text-slate-500">Complete a quiz to appear here.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-center">
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Result({ correct, total, percent, reset }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
      <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-cyanGlow/40 bg-cyanGlow/10 text-3xl font-black text-white shadow-neon">
        {percent}%
      </div>
      <h2 className="mt-5 text-3xl font-black text-white">Mission Summary</h2>
      <p className="mt-2 text-slate-300">You answered {correct} of {total} questions correctly.</p>
      <button className="primary-btn mx-auto mt-6" onClick={reset}><RotateCcw className="h-5 w-5" /> Restart Quiz</button>
    </motion.div>
  );
}
