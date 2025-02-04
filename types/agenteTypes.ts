import { Prisma, Zone } from "@prisma/client"


export interface AgenteTypeDTO {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateAgenteDTO  extends Prisma.AgenteCreateInput, Prisma.UserCreateInput {
    role: 'agente'
    
}


export interface AgenteExtendidoDto extends AgenteTypeDTO {
    zonas: Zone[]
    EntregaInstrumentos: string[]
    user: {
        email: string
        name: string
    }
}