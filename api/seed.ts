//seeding, for populating the db with sample data, ensure connectivity


import { PrismaClient, ChallengeType } from './app/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
//   // Optional: Clear existing data (use with caution, especially in production)
//   await prisma.option.deleteMany();
//   await prisma.challenge.deleteMany();

  // Seed Challenges
  await prisma.challenge.upsert({
    where: { id: 'challenge-text-1' },
    update: {},
    create: {
      id: 'challenge-text-1',
      type: ChallengeType.TEXT,
      stageNumber: 1,
      prompt: 'Write a short essay about the impact of artificial intelligence on society.',
      expectedAnswer: 'Artificial intelligence impacts society by automating tasks, enhancing decision-making, and raising ethical concerns...',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.challenge.upsert({
    where: { id: 'challenge-code-1' },
    update: {},
    create: {
      id: 'challenge-code-1',
      type: ChallengeType.CODE,
      stageNumber: 2,
      prompt: 'Write a Python function to reverse a string.',
      expectedAnswer: 'def reverse_string(s): return s[::-1]',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.challenge.upsert({
    where: { id: 'challenge-mcq-1' },
    update: {},
    create: {
      id: 'challenge-mcq-1',
      type: ChallengeType.MCQ,
      stageNumber: 3,
      prompt: 'What is the capital city of France?',
      createdAt: new Date(),
      updatedAt: new Date(),
      options: {
        create: [
          {
            id: 'option-mcq-1-1',
            text: 'Paris',
            isCorrect: true,
            order: 1,
          },
          {
            id: 'option-mcq-1-2',
            text: 'London',
            isCorrect: false,
            order: 2,
          },
          {
            id: 'option-mcq-1-3',
            text: 'Berlin',
            isCorrect: false,
            order: 3,
          },
          {
            id: 'option-mcq-1-4',
            text: 'Madrid',
            isCorrect: false,
            order: 4,
          },
        ],
      },
    },
  });

  await prisma.challenge.upsert({
    where: { id: 'challenge-mcq-2' },
    update: {},
    create: {
      id: 'challenge-mcq-2',
      type: ChallengeType.MCQ,
      stageNumber: 4,
      prompt: 'Which programming language is primarily used for web development?',
      createdAt: new Date(),
      updatedAt: new Date(),
      options: {
        create: [
          {
            id: 'option-mcq-2-1',
            text: 'Python',
            isCorrect: false,
            order: 1,
          },
          {
            id: 'option-mcq-2-2',
            text: 'JavaScript',
            isCorrect: true,
            order: 2,
          },
          {
            id: 'option-mcq-2-3',
            text: 'C++',
            isCorrect: false,
            order: 3,
          },
          {
            id: 'option-mcq-2-4',
            text: 'Java',
            isCorrect: false,
            order: 4,
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });