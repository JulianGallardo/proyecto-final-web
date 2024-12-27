import UserRepository from "@/repositories/UserRepository";
import { Role,User } from "@prisma/client";


const userRepository = new UserRepository();


const users = [
    {
        name: "Admin User",
        email: "admin@admin.com",
        password: "admin",
        role: Role.admin,
    },
    {
        name: "Test User",
        email: "test@test.com",
        password: "test",
        role: Role.user,
    },
];

async function createUsers() {
    for (const user of users) {
        await userRepository.create(user);
    }
}

async function main() {
    await userRepository.deleteAll();
    await createUsers();
}

main()

