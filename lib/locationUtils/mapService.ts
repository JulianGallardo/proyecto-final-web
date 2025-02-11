// services/MapService.ts
import maplibregl from 'maplibre-gl';
import { RouteSegment, MapMarker } from '@/types/PlannerTypes';

export class MapService {
    private readonly colors = [
        "#FF1744", "#2979FF", "#00E676", "#FFD600",
        "#AA00FF", "#FF3D00", "#1DE9B6", "#F50057"
    ];

    private createMarkerElement(number: number): HTMLDivElement {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        Object.assign(el.style, {
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#FF4444',
            color: 'white',
            textAlign: 'center',
            lineHeight: '30px',
            fontWeight: 'bold',
            fontSize: '14px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        });
        el.innerHTML = `${number}`;
        return el;
    }

    public addMarker(map: maplibregl.Map, marker: MapMarker): maplibregl.Marker {
        const element = this.createMarkerElement(marker.number);
        return new maplibregl.Marker({ element })
            .setLngLat(marker.coordinates)
            .setPopup(new maplibregl.Popup().setHTML(`
                <div class="font-bold">Parada ${marker.number}</div>
                <div>📍 ${marker.description}</div>
            `))
            .addTo(map);
    }

    public addRouteSegment(
        map: maplibregl.Map,
        segment: RouteSegment,
        index: number
    ): { layerId: string; sourceId: string } {
        const sourceId = `route-source-${index}`;
        const layerId = `route-line-${index}`;

        // Add source for this segment
        map.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: { description: segment.description },
                geometry: {
                    type: 'LineString',
                    coordinates: segment.coordinates
                }
            }
        });

        // Add layer using the segment source
        map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': this.colors[index % this.colors.length],
                'line-width': 6,
                'line-opacity': 0.8
            }
        });


        return { layerId, sourceId };
    }

    

    public cleanup(
        map: maplibregl.Map,
        layers: string[],
        markers: maplibregl.Marker[]
    ): void {
        // Remove markers
        markers.forEach(marker => marker.remove());

        // Remove layers and sources
        layers.forEach(layer => {
            if (map.getLayer(layer)) {
                map.removeLayer(layer);
            }
            if (map.getSource(layer)) {
                map.removeSource(layer);
            }
        });

        // Remove main route source if it exists
        if (map.getSource('route')) {
            map.removeSource('route');
        }
    }
}