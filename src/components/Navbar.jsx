import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',        label: 'Home',    symbol: '🏠' },
  { path: '/history', label: 'History', symbol: '⏱️' },
  { path: '/profile', label: 'Profile', symbol: '👤' }
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const activeUser = user || { id: 1, name: "Mrunal" };

  if (!activeUser || pathname === '/login' || pathname === '/staff' || pathname === '/token-confirmed') {
    return null;
  }

  return (
    <nav className="fixed-minimal-text-navbar">
      <style>{`
        .fixed-minimal-text-navbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 4500;
          height: 66px;
          background: #ffffff;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: env(safe-area-inset-bottom);
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.02);
        }

        .minimal-nav-container {
          width: 100%;
          max-width: 480px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 100%;
        }

        .minimal-text-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #94a3b8; 
          font-size: 12px;
          font-weight: 700;
          height: 100%;
          width: 33.33%;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .link-symbol-icon {
          font-size: 18px;
          opacity: 0.7;
          transition: transform 0.2s, opacity 0.2s;
        }

        .minimal-text-link.active-text-node {
          color: #7c3aed; 
        }

        .minimal-text-link.active-text-node .link-symbol-icon {
          opacity: 1;
          transform: translateY(-1px) scale(1.05);
        }

        .minimal-text-link:active {
          transform: scale(0.96);
          opacity: 0.8;
        }
      `}</style>

      <div className="minimal-nav-container">
        {navItems.map(({ path, label, symbol }) => {
          const active = pathname === path;
          return (
            /* 🟢 FIXED LINE 80: Replaced invalid semicolon with proper syntax */
            <Link
              key={path}
              to={path}
              className={`minimal-text-link ${active ? 'active-text-node' : ''}`}
            >
              <span className="link-symbol-icon">{symbol}</span>
              <span className="link-label-text">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}