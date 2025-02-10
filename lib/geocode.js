export async function getGeocodeNominatim(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=AR&limit=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.length > 0) {
            return {
                address: data[0].display_name,
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
            };
        } else {
            console.warn("No se encontraron resultados para la dirección.");
            return null;
        }
    } catch (error) {
        console.error("Error obteniendo geocodificación:", error);
        return null;
    }
}

export async function getOptimizedRoute(addresses) {
    const api_key = "5b3ce3597851110001cf624882964b6d51a94e329e8f7d689d9f7767";
    const geocodeUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
    const routeUrl = "https://api.openrouteservice.org/v2/matrix/driving-car";

    try {
        // 1. Obtener coordenadas de todas las direcciones
        const locations = [];
        for (const address of addresses) {
            const response = await fetch(`${geocodeUrl}${encodeURIComponent(address)}&countrycodes=AR&limit=1`);
            const data = await response.json();
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                locations.push([lon, lat]);
            } else {
                console.warn(`No se encontró ubicación para: ${address}`);
            }
        }

        if (locations.length < 2) {
            throw new Error("Se necesitan al menos 2 ubicaciones para calcular la ruta.");
        }

        // 2. Enviar las coordenadas a la API de optimización de ruta
        const routeResponse = await fetch(routeUrl, {
            method: "POST",
            headers: {
                "Authorization": api_key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                locations: locations,
                metrics: ["distance", "duration"],
                resolve_locations: true
            })
        });

        if (!routeResponse.ok) {
            throw new Error(`Error en la solicitud de ruta: ${routeResponse.statusText}`);
        }

        const routeData = await routeResponse.json();

        // 3. Obtener el orden óptimo de las ubicaciones
        const distances = routeData.distances;
        const optimizedOrder = solveTSP(distances); // Resolver el problema del viajante (TSP)

        // 4. Formatear la respuesta
        const orderedAddresses = optimizedOrder.map(index => ({
            address: addresses[index],
            latitude: locations[index][1],
            longitude: locations[index][0]
        }));

        return {
            optimizedOrder: orderedAddresses,
            totalDistance: routeData.distances[optimizedOrder[0]][optimizedOrder[optimizedOrder.length - 1]],
            totalDuration: routeData.durations ? routeData.durations[optimizedOrder[0]][optimizedOrder[optimizedOrder.length - 1]] : null
        };
    } catch (error) {
        console.error("Error obteniendo la ruta optimizada:", error);
        return null;
    }
}

// Algoritmo simple para resolver el problema del viajante (TSP) con fuerza bruta
function solveTSP(distanceMatrix) {
    const n = distanceMatrix.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    // Generar todas las permutaciones posibles (solo recomendable para pocos puntos)
    const permutations = permute(indices);
    
    let bestOrder = indices;
    let minDistance = Infinity;
    
    for (const order of permutations) {
        let currentDistance = 0;
        for (let i = 0; i < order.length - 1; i++) {
            currentDistance += distanceMatrix[order[i]][order[i + 1]];
        }
        if (currentDistance < minDistance) {
            minDistance = currentDistance;
            bestOrder = order;
        }
    }
    
    return bestOrder;
}

// Generar permutaciones (backtracking)
function permute(arr) {
    if (arr.length === 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
        for (const perm of rest) {
            result.push([arr[i], ...perm]);
        }
    }
    return result;
}

// Prueba con varias direcciones
(async () => {
    const addresses = [
        "Castelli 2500, Bahia Blanca, Buenos Aires, Argentina",
        "Av. Colón 200, Bahia Blanca, Buenos Aires, Argentina",
        "San Martín 50, Bahia Blanca, Buenos Aires, Argentina",
        "Parque de Mayo, Bahia Blanca, Buenos Aires, Argentina"
    ];

    const result = await getOptimizedRoute(addresses);
    console.log(JSON.stringify(result, null, 2));
})();



