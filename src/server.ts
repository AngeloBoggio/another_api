import express, {Request, Response} from 'express';
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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
