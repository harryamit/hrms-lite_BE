import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Employees } from './pages/Employees';
import { Attendance } from './pages/Attendance';
import { NotFound } from './pages/NotFound';

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense
                fallback={
                  <div className="space-y-6">
                    <div className="h-8 w-48 animate-pulse rounded bg-(--color-border)" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 animate-pulse rounded-lg bg-(--color-border)" />
                      ))}
                    </div>
                  </div>
                }
              >
                <Dashboard />
              </Suspense>
            }
          />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
        <Route path="*" element={<Layout />}>
          <Route index element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
