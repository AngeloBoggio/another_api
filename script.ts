import { prisma } from "./lib/prisma";

async function main() {
  // Create a new book
  const book = await prisma.book.create({
    data: {
        title: "Nobody moved. 'Who.",
            author: "Claudie Johnston",
            genre: "Quisquam",
            description: "I can't be civil, you'd better leave off,' said the Queen, in a very long silence, broken only by an occasional exclamation of 'Hjckrrh!' from the shock of being such a nice little dog near our.",
            isbn: "9789636154578",
            image: "http://placeimg.com/480/640/any",
            published: "2015-05-06",
            publisher: "Necessitatibus Qui"
        }
    });
  console.log("Created Book:", book);

  // Fetch all books
  const allBooks = await prisma.book.findMany();
  console.log("All books:", JSON.stringify(allBooks, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });