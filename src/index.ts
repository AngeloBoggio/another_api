import axios from 'axios';

const _quantity = 100;

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

axios.get('http://localhost:4000/api/fake-book', {params: {_quantity: _quantity}})
    .then(response => {
        const fakeBook: FakeBookResponseWrapper = response.data as FakeBookResponseWrapper
        console.log('Raw fake book response:', fakeBook.data);
    })
    .catch(error => {
        console.error('Error fetching fake book:', error);
    })


