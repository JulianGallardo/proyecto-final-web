import { Zone } from "@prisma/client"


export interface AgenteTypeDTO {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface UpdateAgenteDto {
    name: string
    lastName: string
    email: string

    telefono: number
}

export interface CreateAgenteDTO extends UpdateAgenteDto {
    password: string
    role: 'agente'
}


export interface AgenteExtendidoDto extends AgenteTypeDTO {
    zonas: Zone[]
    EntregaInstrumentos: string[]
    user: {
        telefono: string
        email: string
        name: string
        lastname: string
    }
}