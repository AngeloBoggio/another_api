import React, { useRef, useState } from 'react';
import { Book } from './types';

interface BookCardProps {
  book: Book;
  isTop: boolean;
  stackIndex: number; // 0 = top card
  onSwipe?: (direction: 'like' | 'pass') => void;
}

const SWIPE_THRESHOLD = 100;

const BookCard: React.FC<BookCardProps> = ({ book, isTop, stackIndex, onSwipe }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [flyingOff, setFlyingOff] = useState<'like' | 'pass' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const triggerSwipe = (direction: 'like' | 'pass') => {
    setFlyingOff(direction);
    setOffset({ x: direction === 'like' ? 1200 : -1200, y: offset.y });
    setTimeout(() => onSwipe?.(direction), 350);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop || flyingOff) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(offset.x) > SWIPE_THRESHOLD) {
      triggerSwipe(offset.x > 0 ? 'like' : 'pass');
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const rotation = isTop ? offset.x * 0.08 : 0;
  const likeOpacity = isTop ? Math.min(Math.max(offset.x / 80, 0), 1) : 0;
  const passOpacity = isTop ? Math.min(Math.max(-offset.x / 80, 0), 1) : 0;

  const scale = 1 - stackIndex * 0.05;
  const translateY = stackIndex * 14;

  const cardStyle: React.CSSProperties = {
    transform: `translateX(${offset.x}px) translateY(${offset.y + translateY}px) rotate(${rotation}deg) scale(${scale})`,
    transition: isDragging
      ? 'none'
      : flyingOff
      ? 'transform 0.35s ease-out'
      : 'transform 0.3s ease',
    zIndex: 10 - stackIndex,
    cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };

  return (
    <div
      className="swipe-card"
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="stamp stamp-like" style={{ opacity: likeOpacity }}>
        LIKE
      </div>
      <div className="stamp stamp-nope" style={{ opacity: passOpacity }}>
        NOPE
      </div>

      {book.image ? (
        <img src={book.image} alt={book.title} className="card-image" draggable={false} />
      ) : (
        <div className="card-image card-image-placeholder" />
      )}

      <div className="card-info">
        <h2 className="card-title">{book.title}</h2>
        <p className="card-author">{book.author}</p>
        {book.genre && <span className="genre-tag">{book.genre}</span>}
        {book.description && (
          <p className="card-description">{book.description}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
