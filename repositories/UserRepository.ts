import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { User } from "@prisma/client";

export default class UserRepository extends BaseRepository<User> {
    constructor() {
        super(prisma.user);
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.modelClient.findUnique({ where: { email } });
    }

    async getUser(email: string, password: string): Promise<User | null> {
        return this.modelClient.findFirst({ where: { email, password } });
    }
}