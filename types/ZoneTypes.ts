import { Zone } from "@prisma/client";

export interface ExtendedZone extends Zone {
    geometry: {
        type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        }[];
    };
    Agentes: {
        user: {
            name: string
        }
    }[];
    SubZonas: {
        id: string;
        zoneName: string;
        geometry: {
            type: string;
            coordinates: {
                latitude: number;
                longitude: number;
            }[];
        };
    }[];
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

export interface ZoneDtoWithSubZones extends ZoneDto {
    geometry: {
        type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        }[];
    };
    SubZonas: {
        id: string;
        zoneName: string;
        geometry: {
            type: string;
            coordinates: {
                latitude: number;
                longitude: number;
            }[];
        };
    }[];

}


export interface SubzoneDto {
    id: string;
    zoneName: string;
}