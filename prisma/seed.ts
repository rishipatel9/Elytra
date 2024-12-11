import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';  // Ensure you're using @faker-js/faker

const prisma = new PrismaClient();

async function main() {
  // Creating Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        emailVerified: new Date(),
        image: faker.image.avatar(),
        phone: faker.phone.number(),
        age: faker.number.int({ min: 18, max: 65 }),
        nationality: faker.address.country(),
        previousDegree: faker.lorem.words(3),
        grades: faker.lorem.words(5),
        currentEducationLevel: faker.helpers.arrayElement(['Undergraduate', 'Postgraduate']),
        preferredCountries: faker.lorem.words(3),
        preferredPrograms: faker.lorem.words(3),
        careerAspirations: faker.lorem.words(5),
        visaQuestions: faker.lorem.words(5),
        filledApplication: faker.datatype.boolean(),
        totalTimeUsed: faker.number.int({ min: 0, max: 120 }), 
        plan: faker.helpers.arrayElement(['FREE', 'PRO', 'ENTERPRISE']),
      },
    });
    users.push(user);
  }

  const sessions = [];
  for (let i = 0; i < 10; i++) {
    const session = await prisma.session.create({
      data: {
        userId: users[i].id,
        duration: faker.number.int({ min: 10, max: 60 }), 
        summary: faker.lorem.sentence(),
      },
    });
    sessions.push(session);
  }

  for (const session of sessions) {
    for (let i = 0; i < 5; i++) {
      await prisma.chat.create({
        data: {
          sessionId: session.id,
          sender: faker.helpers.arrayElement(['USER', 'AI']),
          message: faker.lorem.sentence(),
        },
      });
    }
  }

  const programs = [];
  for (let i = 0; i < 5; i++) {
    const program = await prisma.program.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        mode: faker.helpers.arrayElement(['Online', 'Offline']),
        duration: faker.number.int({ min: 6, max: 36 }).toString() + " months",
        category: faker.helpers.arrayElement(['Engineering', 'Science', 'Business']),
        fees: faker.commerce.price(),
        coOpInternship: faker.datatype.boolean().toString(),
        college: faker.company.name(),
        curriculum: faker.lorem.paragraph(),
        location: faker.address.city(),
        publicPrivate: faker.helpers.arrayElement(['Public', 'Private']),
        ranking: faker.number.int({ min: 1, max: 100 }).toString(),
        university: faker.company.name(),
        eligibility: JSON.stringify({
          minimumGpa: faker.helpers.arrayElement(['3.0', '3.5', '4.0']),
          workExperience: faker.helpers.arrayElement(['1 year', '2 years', 'None']),
        }),
      },
    });
    programs.push(program);
  }

  for (let i = 0; i < 5; i++) {
    await prisma.eligibility.create({
      data: {
        university: programs[i].university,
        program: programs[i].name,
        typeOfProgram: 'Master',
        percentage: '60%',
        backlogs: '0',
        workExperience: '1 year',
        allow3YearDegree: 'Yes',
        minimumGpaOrPercentage: '3.0',
        decisionFactor: 'High',
      },
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
