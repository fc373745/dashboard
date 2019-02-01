export const cities = [
    {
        placeName: "Los Angeles",
        lnglat: [-118.408500088, 34.1182277898]
    },
    {
        placeName: "Chicago",
        lnglat: [-87.6862308732, 41.8372950615]
    },
    {
        placeName: "New York",
        lnglat: [-73.9313850409, 40.694960689]
    },
    {
        placeName: "Dallas",
        lnglat: [-96.7656929463, 32.7939804066]
    }
];

export const initialFlightPoints = [
    {
        placeName: "Los Angeles",
        lnglat: [-118.408500088, 34.1182277898]
    },
    {
        placeName: "Dallas",
        lnglat: [-96.7656929463, 32.7939804066]
    }
];

export const flightPath1 = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [
                    [-118.408500088, 34.1182277898],
                    [-87.6862308732, 41.8372950615]
                ]
            },
            properties: {}
        }
    ]
};

export const flightPath2 = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [
                    [-96.7656929463, 32.7939804066],
                    [-87.6862308732, 41.8372950615]
                ]
            },
            properties: {}
        }
    ]
};

export const US_MAP_CENTER = [-91, 37] as [number, number];

export const US_MAP_DEFAULT_SCALE = 800;
