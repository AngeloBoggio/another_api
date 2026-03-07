import React from 'react';
import { View } from './types';

interface BottomNavProps {
  current: View;
  onChange: (view: View) => void;
  likeCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onChange, likeCount }) => {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${current === 'swipe' ? 'nav-active' : ''}`}
        onClick={() => onChange('swipe')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="16" height="13" rx="2" />
          <path d="M6 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2" />
        </svg>
        <span>Discover</span>
      </button>

      <button
        className={`nav-item ${current === 'likes' ? 'nav-active' : ''}`}
        onClick={() => onChange('likes')}
      >
        <div className="nav-icon-wrap">
          <svg viewBox="0 0 24 24" fill={current === 'likes' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likeCount > 0 && <span className="nav-badge">{likeCount}</span>}
        </div>
        <span>Likes</span>
      </button>

      <button
        className={`nav-item ${current === 'profile' ? 'nav-active' : ''}`}
        onClick={() => onChange('profile')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;
