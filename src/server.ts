import express, {Request, Response} from 'express';
import { prisma } from '../lib/prisma';
import axios from 'axios';

const app = express();

app.use(express.json());

app.get('/api/fake-book', async (req: Request, res: Response) => {
    const quantity = req.query._quantity;
    console.log(quantity);
    try {
        const apiResponse = await axios.get('https://fakerapi.it/api/v2/books',{
            params: { _quantity: quantity}
        });
        res.json(apiResponse.data);
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

app.post('/api/books', async (req: Request, res: Response) => {
    try {
        const {
            title,
            author,
            genre,
            description,
            isbn,
            image,
            published,
            publisher,
        } = req.body;

        if(!title || !author){
            return res.status(400).json({ error: 'Title and author are required'});
        }

        const book = await prisma.book.create({
            data: {
                title,
                author,
                genre,
                description,
                isbn,
                image,
                published,
                publisher,
            },
        });

        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create book'});
    }
})

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
