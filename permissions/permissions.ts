import { Role } from "@prisma/client";
import { Operation, PermissionList, Resource, ProfileRole } from "./typePermissions";

const agentePrivileges: PermissionList[] = [
    { resource: Resource.PLANIFICADOR, operations: [Operation.READ] },
    { resource: Resource.ENTREGAS, operations: [Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.LIST] },
    { resource: Resource.INSTRUMENTOS_AGENTE, operations: [Operation.LIST, Operation.READ, Operation.UPDATE] },
    { resource: Resource.CONTROL_AGENTE, operations: [Operation.READ] },
    {
        resource: Resource.SUB_ZONAS, operations: [Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.LIST]
    }

];

const jefaturaPrivileges: PermissionList[] = [
    { resource: Resource.JUZGADOS, operations: [Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.LIST] },
    { resource: Resource.AGENTE, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.INSTRUMENTOS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.TIPOS_INSTRUMENTOS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.ZONAS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.CONTROL, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource:Resource.MESA_ENTRADA, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE]}
];

const mesaDeEntradaPrivileges: PermissionList[] = [
    { resource: Resource.INSTRUMENTOS, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },
    { resource: Resource.ZONAS, operations: [Operation.LIST, Operation.READ] },
    { resource: Resource.GENERAR_INGRESO, operations: [Operation.LIST, Operation.READ, Operation.UPDATE, Operation.DELETE, Operation.CREATE] },


];

export const privileges: Record<ProfileRole, PermissionList[]> = {
    [Role.agente]: agentePrivileges,
    [Role.jefatura]: jefaturaPrivileges,
    [Role.mesa_de_entrada]: mesaDeEntradaPrivileges,
};