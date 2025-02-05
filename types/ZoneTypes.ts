import { Zone } from "@prisma/client";

export interface ExtendedZone extends Zone {
    geometry: {
        type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        }[];
    };
}

export interface ZoneDto {
    id: string;
    zoneName: string;
    zoneColor: string;
    Agentes: {
        user: {
            name: string
        }
    }[];
}