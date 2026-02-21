import { prisma } from "./lib/prisma";

async function main() {
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