import { privileges } from "./permissions";
import { Operation, Permission, ProfileRole } from "./typePermissions";


export function hasPermission(role: ProfileRole, permission: Permission ) {
    const rolePermissions = privileges[role];
    const allowedOperations = rolePermissions.filter(p => p.resource === permission.resource).map(p => p.operations).flat();
    return allowedOperations.includes(permission.operation);
}

export function canView(role: ProfileRole, resource: string) {
    return privileges[role].some(p => p.resource === resource && p.operations.includes(Operation.READ));
}

export function canEdit(role: ProfileRole, resource: string) {
    return privileges[role].some(p => p.resource === resource && p.operations.includes(Operation.UPDATE));
}

export function canCreate(role: ProfileRole, resource: string) {
    return privileges[role].some(p => p.resource === resource && p.operations.includes(Operation.CREATE));
}

export function canDelete(role: ProfileRole, resource: string) {
    return privileges[role].some(p => p.resource === resource && p.operations.includes(Operation.DELETE));
}

export function canList(role: ProfileRole, resource: string) {
    return privileges[role].some(p => p.resource === resource && p.operations.includes(Operation.LIST));
}