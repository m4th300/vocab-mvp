import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './providers/ThemeProvider';
import { StoreProvider } from './providers/StoreProvider';
import {
  DashboardPage, CardsListPage,
  QuizLauncherPage, QuizRunQCMPage, QuizRunReversePage, QuizRunTypingPage, QuizResultPage
} from './routes';
import { ToastProvider, useToast } from '@/ui/Toast';
import { Button } from '@/ui/Button';
import SidebarFolders from '@/features/folders/SidebarFolders';

function Topbar() {
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const loc = useLocation();
  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--border)]">
      <div className="font-medium">Vocab Cards — MVP</div>
      <div className="flex items-center gap-2">
        {loc.pathname.startsWith('/quiz') ? (
          <NavLink to="/quiz" className="text-sm underline">Menu Quiz</NavLink>
        ) : (
          <NavLink to="/quiz" className="text-sm underline">Quiz</NavLink>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.show({ title: 'Hello 👋', description: 'Toast de test' })}
        >
          Test toast
        </Button>
        <button
          onClick={toggle}
          className="px-3 py-1 rounded-full border border-[var(--border)] hover:opacity-90"
          aria-label="Basculer le thème"
          title="Basculer le thème"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
}

function Sidebar() {
  const loc = useLocation();
  if (loc.pathname.startsWith('/quiz')) return null; // écran quiz: focus
  return <SidebarFolders />;
}

function Shell() {
  return (
    <div className="h-full grid grid-rows-[auto,1fr]">
      <Topbar />
      <div className="grid grid-cols-[0,1fr] md:grid-cols-[14rem,1fr]">
        <Sidebar />
        <main className="min-h-0 overflow-auto">
          <Suspense fallback={<div className="p-6">Chargement…</div>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/cards" element={<CardsListPage />} />
              <Route path="/quiz" element={<QuizLauncherPage />} />
              <Route path="/quiz/run" element={<QuizRunQCMPage />} />
              <Route path="/quiz/run-reverse" element={<QuizRunReversePage />} />
              <Route path="/quiz/run-typing" element={<QuizRunTypingPage />} />
              <Route path="/quiz/result" element={<QuizResultPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <ToastProvider>
          <BrowserRouter>
            <Shell />
          </BrowserRouter>
        </ToastProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
