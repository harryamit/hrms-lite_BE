import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-(--color-surface)">
      <Navbar />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
