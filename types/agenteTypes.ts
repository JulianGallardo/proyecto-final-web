import {  Zone } from "@prisma/client"


export interface AgenteTypeDTO {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateAgenteDTO  {
    name: string
    email: string
    password: string
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