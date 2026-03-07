import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import BottomNav from './BottomNav';
import LikesView from './LikesView';
import ProfileView from './ProfileView';
import AuthPage from './AuthPage';
import { useAuth } from './AuthContext';
import { Book, View } from './types';
import './App.css';

function App() {
  const { user, token, logout } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const [currentView, setCurrentView] = useState<View>('swipe');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch today's book queue
  useEffect(() => {
    if (!user) return;
    fetch('/api/fake-book?_quantity=10')
      .then(r => r.json())
      .then(data => {
        setBooks(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load books');
        setLoading(false);
      });
  }, [user]);

  // Load persisted liked books from server
  useEffect(() => {
    if (!token) return;
    fetch('/api/liked-books', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setLikedBooks)
      .catch(console.error);
  }, [token]);

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (direction === 'like') {
      const book = books[currentIndex];
      setLikedBooks(prev => [...prev, book]);
      fetch('/api/liked-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book),
      }).catch(console.error);
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (!user) return <AuthPage />;

  const renderView = () => {
    if (currentView === 'likes') return <LikesView books={likedBooks} />;
    if (currentView === 'profile') {
      return (
        <ProfileView
          user={user}
          likedCount={likedBooks.length}
          seenCount={currentIndex}
          onLogout={logout}
        />
      );
    }

    // Swipe view
    if (loading) {
      return <div className="center-screen"><p>Loading today's picks...</p></div>;
    }
    if (error) {
      return <div className="center-screen"><p className="error-text">{error}</p></div>;
    }

    const isDone = currentIndex >= books.length;
    const visibleBooks = books.slice(currentIndex, currentIndex + 3);

    return (
      <div className="swipe-view">
        <header className="app-header">
          <h1>BookSwipe</h1>
          {!isDone && <p className="subtitle">{books.length - currentIndex} left today</p>}
        </header>

        {isDone ? (
          <div className="done-screen">
            <p className="done-icon">📚</p>
            <h2>All caught up!</h2>
            <p>Come back tomorrow for more recommendations.</p>
          </div>
        ) : (
          <>
            <div className="card-stack">
              {[...visibleBooks].reverse().map((book, i) => {
                const stackIndex = visibleBooks.length - 1 - i;
                return (
                  <BookCard
                    key={`${currentIndex + stackIndex}-${book.isbn}`}
                    book={book}
                    isTop={stackIndex === 0}
                    stackIndex={stackIndex}
                    onSwipe={stackIndex === 0 ? handleSwipe : undefined}
                  />
                );
              })}
            </div>
            <div className="action-buttons">
              <button className="action-btn btn-pass" onClick={() => handleSwipe('pass')} aria-label="Pass">✕</button>
              <button className="action-btn btn-like" onClick={() => handleSwipe('like')} aria-label="Like">♥</button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <div className="main-content">{renderView()}</div>
      <BottomNav current={currentView} onChange={setCurrentView} likeCount={likedBooks.length} />
    </div>
  );
}

export default App;
