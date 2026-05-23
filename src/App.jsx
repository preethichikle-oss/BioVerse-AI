import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from './components/AppLayout.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Explorer = lazy(() => import('./pages/Explorer.jsx'));
const SimulationLab = lazy(() => import('./pages/SimulationLab.jsx'));
const TutorChat = lazy(() => import('./pages/TutorChat.jsx'));
const QuizDashboard = lazy(() => import('./pages/QuizDashboard.jsx'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          element={
            <Suspense fallback={<LoadingScreen label="Preparing BioVerse AI" />}>
              <AppLayout />
            </Suspense>
          }
        >
          <Route index element={<Page><Landing /></Page>} />
          <Route path="explorer" element={<Page><Explorer /></Page>} />
          <Route path="lab" element={<Page><SimulationLab /></Page>} />
          <Route path="tutor" element={<Page><TutorChat /></Page>} />
          <Route path="quiz" element={<Page><QuizDashboard /></Page>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
