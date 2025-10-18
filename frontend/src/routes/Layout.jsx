import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
        <Header />
      </div>
      <nav className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex gap-4 text-sm">
          <Nav to="/" label="Home" />
          <Nav to="/upload" label="Upload" />
          <Nav to="/review" label="Review" />
          <Nav to="/help" label="Help" />
          <Nav to="/about" label="About" />
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} TallyBridge AI</div>
          <div className="flex items-center gap-3">
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Contact</a>
            <span className="inline-flex items-center gap-1">Powered by <span className="font-medium">Claude AI</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Nav({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-2 py-1 rounded ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`
      }
      end={to === '/'}
    >
      {label}
    </NavLink>
  );
}


