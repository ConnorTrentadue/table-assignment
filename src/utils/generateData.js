import { faker } from '@faker-js/faker';

export function generateUsers(count = 500) {
    const users = [];
    for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        users.push({
            id: i + 1,
            firstName: firstName,
            lastName: lastName,
            email: faker.internet.email({firstName: firstName, lastName: lastName}),
            city: faker.location.city(),
            registeredDate: faker.date.past({years : 3})
        });
    }
    return users;
}