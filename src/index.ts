import axios from 'axios';

const _quantity = 300;

interface FakeBookResponse {
    "id": number,
    "title": string,
    "author": string,
    "genre": string,
    "description": string,
    "isbn": string,
    "image": string,
    "published": string,
    "publisher": string
}

interface FakeBookResponseWrapper {
    "data": FakeBookResponse[]
}

async function main() {
    try {
        const response = await axios.get<FakeBookResponseWrapper>(
            'http://localhost:4000/api/fake-book',
            { params: { _quantity } }
        );

        const fakeBooks = response.data.data;
        console.log('Raw fake book response:', fakeBooks)

        if (fakeBooks.length === 0) {
            return;
        }

        for (let i = 0; i < fakeBooks.length; i++) {
            const book = fakeBooks[i];
            const created = await axios.post('http://localhost:4000/api/books', {
                title: book.title,
                author: book.author,
                genre: book.genre,
                description: book.description,
                isbn: book.isbn,
                image: book.image,
                published: book.published,
                publisher: book.publisher
            });
            console.log(`Book ${i + 1} created:`, created.data);
        }
    } catch (error) {
        console.error('Error creating book:', error);
    }
}

main();