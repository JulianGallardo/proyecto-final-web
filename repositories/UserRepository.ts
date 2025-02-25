import prisma from "@/lib/db";
import BaseRepository from "./BaseRepository";
import { Role, User } from "@prisma/client";

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

    async getAllByRolePaginated(role: Role, page?:number): Promise<User[]> {
        return this.modelClient.findMany({
            where: { role },
            skip: page ? (page - 1) * 10 : 0,
            take: 10,
        });
    }

    async getTotalPagesByRole(role: Role): Promise<number> {
        const totalRecords = await this.modelClient.count({ where: { role } });
        return Math.ceil(totalRecords / 10);
    }
}