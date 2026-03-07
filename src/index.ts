import axios from 'axios';

const _quantity = 100;

interface MockBookResponse {
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

interface MockBookResponseWrapper {
    "data": MockBookResponse[]
}

async function main() {
    try {
        const response = await axios.get<MockBookResponseWrapper>(
            'http://localhost:4000/api/fake-book',
            { params: { _quantity } }
        );

        const mockBooks = response.data.data;

        if (mockBooks.length === 0) {
            return;
        }

        const createdBooks = await Promise.all(mockBooks.map(async book => {
            const bookData = {
                title: book.title,
                author: book.author,
                genre: book.genre,
                description: book.description,
                isbn: book.isbn,
                image: book.image,
                published: book.published,
                publisher: book.publisher
            };
            const createBook = await axios.post('http://localhost:4000/api/books', bookData);
            return createBook.data;
        }));
        console.log('Created books:', createdBooks);
    } catch (error) {
        console.error('Error creating book:', error);
    }
}

main();