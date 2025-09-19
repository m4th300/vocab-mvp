import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { ThemeProvider, useTheme } from './providers/ThemeProvider';
import { StoreProvider } from './providers/StoreProvider';
import { DashboardPage } from './routes';

function Topbar() {
  const { theme, toggle } = useTheme();
  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--border)]">
      <div className="font-medium">Vocab Cards — MVP</div>
      <div className="flex items-center gap-2">
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
  return (
    <aside className="w-56 border-r border-[var(--border)] hidden md:flex md:flex-col">
      <nav className="p-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg ${
              isActive ? 'bg-[var(--border)]/40' : 'hover:bg-[var(--border)]/30'
            }`
          }
          end
        >
          Dashboard
        </NavLink>
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <BrowserRouter>
          <div className="h-full grid grid-rows-[auto,1fr]">
            <Topbar />
            <div className="grid grid-cols-[0,1fr] md:grid-cols-[14rem,1fr]">
              <Sidebar />
              <main className="min-h-0 overflow-auto">
                <Suspense fallback={<div className="p-6">Chargement…</div>}>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}
