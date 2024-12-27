import { type PrismaClient } from "@prisma/client/extension";

const DEFAULT_ORDER_BY = {
    createdAt: "desc",
};

const MAX_RECORDS_LIMIT = 100;

export default abstract class BaseRepository<T> {
    constructor(protected modelClient: PrismaClient) { }

    getAll(options: Record<string, any> = {}): Promise<T[]> {
        if(!options.orderBy) {
            options.orderBy = DEFAULT_ORDER_BY;
        }
        if(!options.take || options.take > MAX_RECORDS_LIMIT) {
            options.take = MAX_RECORDS_LIMIT;
        }
        return this.modelClient.findMany(options);
    }

    getById(id: number): Promise<T> {
        return this.modelClient.findUnique({ where: { id } });
    }

    delete(id: number): Promise<T> {
        return this.modelClient.delete({ where: { id } });
    }

    create(data: Record<string, any>): Promise<T> {
        return this.modelClient.create({ data });
    }

    update(id: number, data: Record<string, any>): Promise<T> {
        return this.modelClient.update({ where: { id }, data });
    }

    deleteAll(): Promise<void> {
        return this.modelClient.deleteMany();
    }



}