export interface Book {
  id?: number;
  title: string;
  author: string;
  genre?: string;
  published?: string;
  publisher?: string;
  isbn?: string;
  description?: string;
  image?: string;
}

export type View = 'swipe' | 'likes' | 'profile';
