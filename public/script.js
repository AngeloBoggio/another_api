const loadBtn = document.getElementById('loadRandom');
const card = document.getElementById('bookCard');
const fields = {
    title: document.getElementById('bookTitle'),
    author: document.getElementById('bookAuthor'),
    genre: document.getElementById('bookGenre'),
    published: document.getElementById('bookPublished'),
    publisher: document.getElementById('bookPublisher'),
    isbn: document.getElementById('bookIsbn'),
    description: document.getElementById('bookDescription'),
    image: document.getElementById('bookImage'),
};

async function fetchRandomBook() {
    try {
        const res = await fetch('http://localhost:4000/api/books/random');
        if (!res.ok) throw new Error('Not found');
        const book = await res.json();
        renderBook(book);
    } catch (err) {
        console.error('Failed to fetch book:', err);
        alert('Could not load a random book. Make sure your server is running.');
    }
}

function renderBook(book) {
    fields.title.textContent = book.title || 'No title';
    fields.author.textContent = `Author: ${book.author || 'Unknown'}`;
    fields.genre.textContent = `Genre: ${book.genre || 'N/A'}`;
    fields.published.textContent = `Published: ${book.published || 'N/A'}`;
    fields.publisher.textContent = `Publisher: ${book.publisher || 'N/A'}`;
    fields.isbn.textContent = `ISBN: ${book.isbn || 'N/A'}`;
    fields.description.textContent = book.description || 'No description';
    fields.image.src = book.image || '';
    card.classList.remove('hidden');
}

loadBtn.addEventListener('click', fetchRandomBook);

// Optional: load one on page load
fetchRandomBook();