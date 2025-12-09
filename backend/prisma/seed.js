/*
 * If you need to initialize your database with some data, you may write a script
 * to do so here.
 */
'use strict';

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // 1. Create users
    const users = await seedUsers();

    // 2. Create promotions
    const promotions = await seedPromotions();

    // 3. Create events
    const events = await seedEvents();

    // 4. Create transactions
    //await seedTransactions(users, promotions, events);
    const transactions = await seedTransactions();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


async function seedUsers() {
    const users = [];

    users.push(await prisma.user.create({
        data: {
            name: "jasmine",
            points: 1000,
            utorid: "jasmin12",
            email: "jasmine.super@mail.utoronto.ca",
            role: "superuser",
            birthday: new Date("2004-04-11"),
            password: "Password123#",
            createdAt: new Date(),
            verified: true,
            activated: true,
        }
    }));

    users.push(await prisma.user.create({
        data: {
            name: "Bob",
            points: 400,
            utorid: "bobbob12",
            email: "bob.manager@mail.utoronto.ca",
            role: "manager",
            birthday: new Date("2004-05-11"),
            password: "Password123#",
            createdAt: new Date(),
            verified: true,
            activated: true,
        }
    }));

    users.push(await prisma.user.create({
        data: {
            name: "cathy",
            points: 500,
            utorid: "cathy12",
            email: "cathy.cashier@mail.utoronto.ca",
            role: "cashier",
            birthday: new Date("2004-05-11"),
            password: "Password123#",
            createdAt: new Date(),
            verified: true,
            activated: true,
        }
    }));

    users.push(await prisma.user.create({
        data: {
            name: "suspicous_cashier",
            points: 500,
            utorid: "sussus12",
            email: "suspicious.cashier@mail.utoronto.ca",
            role: "cashier",
            birthday: new Date("2004-05-11"),
            password: "Password123#",
            createdAt: new Date(),
            verified: true,
            activated: true,
            suspicious: true,
        }
    }));

    users.push(await prisma.user.create({
        data: {
            name: "Ree",
            points: 750,
            utorid: "reeree12",
            email: "ree.regular@mail.utoronto.ca",
            birthday: new Date("2004-05-11"),
            role: "regular",
            password: "Password123#",
            createdAt: new Date(),
            verified: true,
            activated: true,
        }
    }));

    users.push(await prisma.user.create({
        data: {
            name: "Rachel",
            points: 100,
            utorid: "rachel12",
            email: "rachel.regular@mail.utoronto.ca",
            role: "regular",
            password: "Password123#",
            birthday: new Date("2004-05-11"),
            createdAt: new Date(),
            suspicious: true,
        }
    }));

    for (let i = 1; i <= 7; i++) {
        users.push(await prisma.user.create({
            data: {
                name: `User${i}`,
                utorid: `regular${i}`,
                email: `regular${i}.regular@mail.utoronto.ca`,
                role: "regular",
                password: "Password123#",
                createdAt: new Date(),
            }
        }));
    }

    return users;
}

async function seedPromotions() {
    const promotions = [];

    promotions.push(await prisma.promotion.create({
        data: {
            name: `Double points on Winter Sale`,
            description: `Earn 2x points on all purchases in December`,
            type: "automatic",
            startTime: new Date("2025-12-01"),
            endTime: new Date("2025-12-31"),
            minSpending: 100,
            rate: 0.02,
            points: 0,
        }
    }));

    promotions.push(await prisma.promotion.create({
        data: {
            name: `Holiday Save Big`,
            description: `Earn 3x points during holidays`,
            type: "automatic",
            startTime: new Date("2025-12-01"),
            endTime: new Date("2025-12-31"),
            minSpending: 0,
            rate: 0.03,
        }
    }));

    promotions.push(await prisma.promotion.create({
        data: {
            name: `Black Friday Bonus`,
            description: `Earn 2x points on all purchases`,
            type: "automatic",
            startTime: new Date("2025-11-25"),
            endTime: new Date("2025-12-30"),
            minSpending: 0,
        }
    }));

    promotions.push(await prisma.promotion.create({
        data: {
            name: `Spend & Earn Bonus`,
            description: `Get extra 50 points when you spend $100+`,
            type: "onetime",
            startTime: new Date("2025-12-01"),
            endTime: new Date("2025-12-31"),
            minSpending: 100,
            points: 50,
        }
    }));

    promotions.push(await prisma.promotion.create({
        data: {
            name: `Christmas Sale`,
            description: `Get extra 10 points if you buy Christmas product`,
            type: "onetime",
            startTime: new Date("2025-12-01"),
            endTime: new Date("2025-12-31"),
            points: 10,
            minSpending: 0,
        }
    }));

    return promotions;
}

async function seedEvents() {
    // Event 1
    await prisma.event.create({
        data: {
            name: "Remembrance Day With U",
            description: "Honor and remember veterans.",
            location: "Bahen Center",
            startTime: new Date("2025-12-11T17:00:00"),
            endTime: new Date("2025-12-11T19:00:00"),
            pointsRemain: 300,
            capacity: 30,
            numGuests:2,
            guests: {
                connect: [
                    { utorid: "reeree12" },
                    { utorid: "bobbob12" },
                ]
            }
        }
    });

    // Event 2 (ended)
    await prisma.event.create({
        data: {
            name: "Game Night with Alumni",
            description: "Enjoy board games and free snacks.",
            location: "Rotman Commerce Lounge",
            startTime: new Date("2025-12-05T18:30:00"),
            endTime: new Date("2025-12-05T21:00:00"),
            pointsRemain: 500,
            capacity: 100,
            numGuests:1,
            guests: {
                connect: [
                    { utorid: "reeree12" }
                ]
            }
        }
    });

    // Event 3
    await prisma.event.create({
        data: {
            name: "Coding Workshop",
            description: "Hands-on coding with student mentors.",
            location: "BA 2135",
            startTime: new Date("2025-12-10T15:00:00"),
            endTime: new Date("2025-12-10T17:00:00"),
            pointsRemain: 200,
            capacity: 5,
            numGuests:2,
            guests: {
                connect: [
                    { utorid: "regular1" },
                    { utorid: "regular2" }
                ]
            },
            organizers: {
                connect: [
                    { utorid: "reeree12" }
                ]
            }
        }
    });

    // Event 4
    await prisma.event.create({
        data: {
            name: "Networking Social",
            description: "Meet Rotman alumni across industries.",
            location: "Hart House",
            startTime: new Date("2025-12-15T18:00:00"),
            endTime: new Date("2025-12-15T20:00:00"),
            pointsRemain: 1000,
            capacity: 150,
            numGuests:2,
            guests: {
                connect: [
                    { utorid: "regular3" },
                    { utorid: "regular4" }
                ]
            },
        }
    });

    // Event 5
    await prisma.event.create({
        data: {
            name: "Christmas Eve Celebration",
            description: "Holiday celebration with music and food.",
            location: "Convocation Hall",
            startTime: new Date("2025-12-24T16:00:00"),
            endTime: new Date("2025-12-24T19:00:00"),
            pointsRemain: 800,
            capacity: 300,

            guests: {
                connect: [
                    { utorid: "regular5" },
                    { utorid: "regular6" },
                    { utorid: "regular7" }
                ]
            },
            numGuests:3
        }
    });

    // Event 6
    await prisma.event.create({
        data: {
            name: "Winter Wellness Fair",
            description: "Start your winter season with relaxing workshop",
            location: "Sidney Smith",
            startTime: new Date("2025-12-29T16:00:00"),
            endTime: new Date("2025-12-29T19:00:00"),
            pointsRemain: 350,
            capacity: 10,

            guests: {
                connect: [
                    { utorid: "reeree12" },
                    { utorid: "rachel12" },
                    { utorid: "regular1" }
                ]
            },
            numGuests:3
        }
    });
}


async function seedTransactions() {
    // Purchases
    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "purchase",
            amount: 120,
            createdBy: "cathy12",
            spent: 30,
            remark: "Store #12 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "purchase",
            amount: 80,
            spent: 20,
            createdBy: "cathy12",
            remark: "Store #8 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "rachel12",
            type: "purchase",
            amount: 150,
            spent: 37.5,
            createdBy: "cathy12",
            remark: "Store #5 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "rachel12",
            type: "purchase",
            amount: 40,
            spent: 10,
            createdBy: "cathy12",
            remark: "Store #3 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "purchase",
            amount: 100,
            spent: 25,
            createdBy: "jasmin12",
            remark: "Store #1 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "purchase",
            amount: 100,
            spent: 25,
            createdBy: "jasmin12",
            remark: "Store #1 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "purchase",
            amount: 375,
            spent: 75,
            rate: 0.05,
            createdBy: "jasmin12",
            remark: "Store #5 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "cathy12",
            type: "purchase",
            amount: 375,
            spent: 75,
            rate: 0.05,
            createdBy: "jasmin12",
            remark: "Store #5 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "bobbob12",
            type: "purchase",
            amount: 375,
            spent: 75,
            rate: 0.05,
            createdBy: "jasmin12",
            remark: "Store #5 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "purchase",
            amount: 200,
            spent: 50,
            createdBy: "jasmin12",
            remark: "Store #1 purchase"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "purchase",
            amount: 100,
            spent: 50,
            createdBy: "sussus12",
            remark: "Store #2 purchase",
            suspicious: true,
        }
    });

    // Adjustments
    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "adjustment",
            amount: -20,
            createdBy: "cathy12",
            relatedId: 1,   // referencing transaction #1
            remark: "Manual correction"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "rachel12",
            type: "adjustment",
            amount: 10,
            createdBy: "cathy12",
            relatedId: 2,   // referencing transaction #2
            remark: "Reward correction"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "adjustment",
            amount: -20,
            createdBy: "cathy12",
            relatedId: 5,
            remark: "Manual correction"
        }
    });


    //Redemption
    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "redemption",
            amount: -150,
            createdBy: "cathy12",
            remark: "$15 Redemption"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "redemption",
            amount: -20,
            createdBy: "jasmin12",
            remark: "$2 Redemption"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "redemption",
            amount: -300,
            createdBy: "cathy12",
            remark: "$30 Redemption"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "rachel12",
            type: "redemption",
            amount: -200,
            createdBy: "cathy12",
            remark: "$20 Redemption"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "redemption",
            amount: 100,
            createdBy: "cathy12",
            remark: "$10 Redemption"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "redemption",
            amount: 50,
            createdBy: "jasmin12",
            remark: "$50 Redemption"
        }
    });

    // Transfer
    // Ree sends 50 to Rachel
    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "transfer",
            amount: -50,
            createdBy: "reeree12",
            relatedId: 5,         // Rachel's user ID
            remark: "Transfer to Rachel"
        }
    });

    // Rachel receives 50 from Ree
    await prisma.transaction.create({
        data: {
            utorid: "rachel12",
            type: "transfer",
            amount: 50,
            createdBy: "reeree12",
            relatedId: 4,         // Ree's user ID
            remark: "Transfer from Ree"
        }
    });

    // Ree sends 100 to Jasmine
    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "transfer",
            amount: -100,
            createdBy: "reeree12",
            relatedId: 1,         // Jasmine's user ID
            remark: "Transfer to Jasmine"
        }
    });

    // Jasmine receive 100 from ree
    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "transfer",
            amount: 100,
            createdBy: "reeree12",
            relatedId: 4,         // Ree's user ID
            remark: "Transfer from Ree"
        }
    });

    // Bob sends 50 to Jasmine
    await prisma.transaction.create({
        data: {
            utorid: "bobbob12",
            type: "transfer",
            amount: -50,
            createdBy: "bobbob12",
            relatedId: 1,         // Jasmine's user ID
            remark: "Transfer to Jasmine"
        }
    });

    // Jasmine receive 100 from Bob
    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "transfer",
            amount: 50,
            createdBy: "bobbob12",
            relatedId: 2,         // Bob's user ID
            remark: "Transfer from Bob"
        }
    });

    // Event
    await prisma.transaction.create({
        data: {
            utorid: "reeree12",
            type: "event",
            amount: 200,
            createdBy: "jasmin12",
            relatedId: 2,  // event #2
            remark: "Game Night"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "rachel12",
            type: "event",
            amount: 200,
            createdBy: "jasmin12",
            relatedId: 2, // event #2
            remark: "Game Night"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "jasmin12",
            type: "event",
            amount: 200,
            createdBy: "jasmin12",
            relatedId: 2,   // event #2
            remark: "Game Night"
        }
    });

    await prisma.transaction.create({
        data: {
            utorid: "rachel12",
            type: "event",
            amount: 200,
            createdBy: "jasmin12",
            relatedId: 2,   // event #2
            remark: "Game Night"
        }
    });
}


