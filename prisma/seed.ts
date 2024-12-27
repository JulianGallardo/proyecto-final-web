import UserRepository from "@/repositories/UserRepository";
import { Role,User } from "@prisma/client";
import bcrypt from "bcryptjs";


const userRepository = new UserRepository();
const saltNumber = 10;


const users = [
    {
        name: "Admin User",
        email: "admin@admin.com",
        password: "admin12345",
        role: Role.admin,
    },
    {
        name: "Test User",
        email: "test@test.com",
        password: "test12345",
        role: Role.user,
    },
];

async function createUsers() {


    for (const user of users) {
        const hash = await bcrypt.hash(user.password, saltNumber);
        user.password = hash;
        await userRepository.create(user);
    }
}

async function main() {
    await userRepository.deleteAll();
    await createUsers();
    console.log("Seed completed");
}

main()

