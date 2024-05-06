import { authLinks, aggressors, users, occurrences, victims } from "./schema";

import { faker } from "@faker-js/faker";
import { db } from "./connection";
import chalk from "chalk";

await db.delete(authLinks);
await db.delete(aggressors);
await db.delete(users);
await db.delete(occurrences);
await db.delete(victims);

console.log(chalk.yellow("✔ Database reset"));

const [user1, user2] = await db
  .insert(users)
  .values([
    {
      institute: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      city: faker.location.city(),
      role: "user",
    },
    {
      institute: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      city: faker.location.city(),
      role: "user",
    },
  ])
  .returning();

console.log(chalk.yellow("✔ Created users"));

const [admin] = await db
  .insert(users)
  .values({
    institute: faker.person.fullName(),
    email: "kadubitzkig@gmail.com",
    phone: faker.phone.number(),
    city: faker.location.city(),
    role: "admin",
  })
  .returning();

console.log(chalk.yellow("✔ Created manager"));

function generateCPFNumbers() {
  let cpf = "";
  for (let i = 0; i < 9; i++) {
    cpf += Math.floor(Math.random() * 10);
  }
  return cpf;
}

for (let i = 0; i < 50; i++) {
  const victim = await db
    .insert(victims)
    .values({
      name: faker.person.fullName(),
      cpf: generateCPFNumbers(),
      phone: faker.phone.number(),
      district: faker.location.street(),
      address: faker.location.streetAddress(),
      age: faker.number.int(99),
      profession: faker.person.jobArea(),
      ethnicity: "Preta",
      maritalStatus: "União estável",
      auxGov: "BPC",
      childrens: faker.datatype.boolean(),
      income: faker.number.int({ min: 800, max: 10000 }),
      schooling: "Ensino médio completo",
      disabled: faker.datatype.boolean(),
    })
    .returning();
  const aggressor = await db
    .insert(aggressors)
    .values({
      name: faker.person.fullName(),
      cpf: generateCPFNumbers(),
      age: faker.number.int(99),
      ethnicity: "Amarela",
      schooling: "Ensino médio completo",
      substanceAddiction: faker.datatype.boolean(),
      criminalRecord: faker.datatype.boolean(),
    })
    .returning();
  await db.insert(occurrences).values({
    date: "10/10/10",
    time: "manhã",
    institute: faker.person.fullName(),
    bond: faker.lorem.word(),
    drugs: faker.datatype.boolean(),
    type: faker.lorem.word(),
    victimId: victim[0].id,
    aggressorId: aggressor[0].id,
    createdAt: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-05-30T00:00:00.000Z' })
  });
}

console.log(chalk.yellow("✔ Created victims and occurrences"));

console.log(chalk.greenBright("Database seeded successfully!"));

process.exit();
