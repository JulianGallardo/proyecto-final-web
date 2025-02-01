import "server-only"
import RouteRecognizer, {Results} from "route-recognizer";
import { Operation, Permission, Resource } from "./typePermissions";


export const anonymousPages: string[] = [
    "/login",
    "/403",
    "/404",
    "icon.ico"
]

export const userPages: string[] = [
    "/inicio",
]


const recognizer = new RouteRecognizer();
const routeList:{path: string, handler: Permission}[] = [





    {path: "/instrumentos", handler: {resource: Resource.INSTRUMENTOS, operation: Operation.LIST }},
    {path: "/instrumentos", handler: {resource: Resource.INSTRUMENTOS, operation: Operation.READ }},
    {path: "/instrumentos", handler: {resource: Resource.INSTRUMENTOS, operation: Operation.CREATE }},
    {path: "/instrumentos", handler: {resource: Resource.INSTRUMENTOS, operation: Operation.UPDATE }},
    {path: "/instrumentos", handler: {resource: Resource.INSTRUMENTOS, operation: Operation.DELETE }},

    {path: "/instrumentos/upload", handler: {resource: Resource.INSTRUMENTOS, operation: Operation.CREATE }},

    {path: "/juzgados", handler: {resource: Resource.JUZGADOS, operation: Operation.LIST }},
    {path: "/juzgados", handler: {resource: Resource.JUZGADOS, operation: Operation.UPDATE }},
    {path: "/juzgados", handler: {resource: Resource.JUZGADOS, operation: Operation.DELETE }},
    {path: "/juzgados", handler: {resource: Resource.JUZGADOS, operation: Operation.READ }},
    {path: "/juzgados", handler: {resource: Resource.JUZGADOS, operation: Operation.CREATE }},


    {path: "/instrumentos-tipo", handler: {resource: Resource.JUZGADOS, operation: Operation.LIST }},
    {path: "/instrumentos-tipo", handler: {resource: Resource.JUZGADOS, operation: Operation.UPDATE }},
    {path: "/instrumentos-tipo", handler: {resource: Resource.JUZGADOS, operation: Operation.DELETE }},
    {path: "/instrumentos-tipo", handler: {resource: Resource.JUZGADOS, operation: Operation.READ }},
    {path: "/instrumentos-tipo", handler: {resource: Resource.JUZGADOS, operation: Operation.CREATE }},

    {path: "/zonas", handler: {resource: Resource.ZONAS, operation: Operation.LIST }},
    {path: "/zonas", handler: {resource: Resource.ZONAS, operation: Operation.UPDATE }},
    {path: "/zonas", handler: {resource: Resource.ZONAS, operation: Operation.DELETE }},
    {path: "/zonas", handler: {resource: Resource.ZONAS, operation: Operation.READ }},
    {path: "/zonas", handler: {resource: Resource.ZONAS, operation: Operation.CREATE }},
    
   
]
routeList.forEach(route => recognizer.add([route]));

export function getPermission(path: string): Permission | null {
    const results: Results | undefined = recognizer.recognize(path);
    if (results && results.length > 0) {
        return results[0]?.handler as Permission ?? null;
    }
    else
        return null;
}