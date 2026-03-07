import React from 'react';
import { Book } from './types';

interface LikesViewProps {
  books: Book[];
}

const LikesView: React.FC<LikesViewProps> = ({ books }) => {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">♡</p>
        <h2>No likes yet</h2>
        <p>Swipe right on books you're interested in.</p>
      </div>
    );
  }

  return (
    <div className="likes-view">
      <h2 className="view-title">Liked Books</h2>
      <div className="likes-grid">
        {books.map((book, i) => (
          <div key={`${i}-${book.isbn}`} className="like-card">
            {book.image ? (
              <img src={book.image} alt={book.title} className="like-card-image" />
            ) : (
              <div className="like-card-image like-card-placeholder" />
            )}
            <div className="like-card-info">
              <p className="like-card-title">{book.title}</p>
              <p className="like-card-author">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikesView;
