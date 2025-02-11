import { Role } from "@prisma/client";
import { Operation, PermissionList, Resource, ProfileRole } from "./typePermissions";

const agentePrivileges: PermissionList[] = [
    { resource: Resource.AGENTE, operations: [Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.LIST] },
    { resource: Resource.PLANIFICADOR, operations: [Operation.READ] },
];

const jefaturaPrivileges: PermissionList[] = [
    { resource: Resource.JUZGADOS, operations: [Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.LIST] },
    { resource: Resource.AGENTE, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.INSTRUMENTOS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.TIPOS_INSTRUMENTOS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.ZONAS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
];

const mesaDeEntradaPrivileges: PermissionList[] = [
    { resource: Resource.INSTRUMENTOS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.ZONAS, operations: [Operation.LIST, Operation.READ] },
    
];

export const privileges: Record<ProfileRole, PermissionList[]> = {
    [Role.agente]: agentePrivileges,
    [Role.jefatura]: jefaturaPrivileges,
    [Role.mesa_de_entrada]: mesaDeEntradaPrivileges,
};