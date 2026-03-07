import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/auth';
import { requireAuth, AuthRequest } from './middleware/auth';
import axios from 'axios';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── Liked books ───────────────────────────────────────────────────────────────

app.get('/api/liked-books', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const liked = await prisma.likedBook.findMany({
      where: { userId: req.user!.userId },
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(liked.map(l => l.book));
  } catch {
    res.status(500).json({ error: 'Failed to fetch liked books' });
  }
});

app.post('/api/liked-books', requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, author, genre, description, isbn, image, published, publisher } = req.body;
  const userId = req.user!.userId;
  try {
    let book = await prisma.book.findFirst({ where: { isbn } });
    if (!book) {
      book = await prisma.book.create({
        data: { title, author, genre, description, isbn, image, published, publisher },
      });
    }
    await prisma.likedBook.upsert({
      where: { userId_bookId: { userId, bookId: book.id } },
      create: { userId, bookId: book.id },
      update: {},
    });
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to save like' });
  }
});

// ── Books ─────────────────────────────────────────────────────────────────────

app.get('/api/fake-book', async (req: Request, res: Response) => {
  const quantity = req.query._quantity;
  try {
    const apiResponse = await axios.get('https://fakerapi.it/api/v2/books', {
      params: { _quantity: quantity },
    });
    res.json(apiResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/books', async (req: Request, res: Response) => {
  const { title, author, genre, description, isbn, image, published, publisher } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  try {
    const book = await prisma.book.create({
      data: { title, author, genre, description, isbn, image, published, publisher },
    });
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

app.get('/api/books/random', async (req: Request, res: Response) => {
  try {
    const total = await prisma.book.count();
    if (total === 0) {
      return res.status(404).json({ error: 'No books in DB' });
    }
    const randomIndex = Math.floor(Math.random() * total);
    const randomBook = await prisma.book.findMany({ skip: randomIndex, take: 1 });
    res.json(randomBook[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
