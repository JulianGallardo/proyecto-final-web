import { Prisma } from "@prisma/client"


export interface AgenteTypeDTO {
    identifier: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateAgenteDTO  extends Prisma.AgenteCreateInput, Prisma.UserCreateInput {
    role: 'agente'
    
}
