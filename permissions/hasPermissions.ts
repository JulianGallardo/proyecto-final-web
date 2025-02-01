import { privileges } from "./permissions";
import { Permission, ProfileRole } from "./typePermissions";


export function hasPermission(role: ProfileRole, permission: Permission ) {
    const rolePermissions = privileges[role];
    const allowedOperations = rolePermissions.filter(p => p.resource === permission.resource).map(p => p.operations).flat();
    return allowedOperations.includes(permission.operation);
}