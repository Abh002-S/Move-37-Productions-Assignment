const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.vote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'seed-hash'
    }
  });

  const poll = await prisma.poll.create({
    data: {
      question: 'What is your favorite language?',
      isPublished: true,
      creator: { connect: { id: alice.id } },
      pollOptions: { create: [{ text: 'JavaScript' }, { text: 'Python' }, { text: 'Go' }] }
    },
    include: { pollOptions: true }
  });

  console.log('Seeded:', { alice, poll });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });