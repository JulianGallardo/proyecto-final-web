import { Role } from "@prisma/client";

export enum Resource {
    AGENTE = "Agente",
    INSTRUMENTOS = "Instrumentos",
    JUZGADOS = "Juzgados",
    TIPOS_INSTRUMENTOS = "Tipos de Instrumentos",
    ZONAS = "Zonas",
    CONTROL = "CONTROL",
    PLANIFICADOR = "Planificador de Ruta",
}

export enum Operation {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LIST = "LIST",
}

export type PermissionList = { resource: Resource; operations: Operation[] };

export type Permission = {
    [K in Resource]: {
        resource: K;
        operation: Operation;
    }
}[Resource];

export type ProfileRole = Role; 