import React from 'react';

interface ProfileViewProps {
  user: { name: string; email: string };
  likedCount: number;
  seenCount: number;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, likedCount, seenCount, onLogout }) => {
  const passedCount = seenCount - likedCount;

  return (
    <div className="profile-view">
      <div className="profile-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="profile-name">{user.name}</h2>
      <p className="profile-subtitle">{user.email}</p>

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-value">{seenCount}</span>
          <span className="stat-label">Seen</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">{likedCount}</span>
          <span className="stat-label">Liked</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">{passedCount}</span>
          <span className="stat-label">Passed</span>
        </div>
      </div>

      <button className="logout-btn" onClick={onLogout}>Log out</button>
    </div>
  );
};

export default ProfileView;
