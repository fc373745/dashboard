import { json } from "d3-fetch";
import {
    geoMercator,
    geoPath,
    GeoPermissibleObjects,
    GeoProjection
} from "d3-geo";
import { event, select, Selection } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity } from "d3-zoom";
import React, { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { feature, mesh } from "topojson";

const nyc: GeoPermissibleObjects = {
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [-73.9313850409, 40.694960689]
    },
    properties: {
        name: "Dinagat Islands"
    }
};

const Global = createGlobalStyle`
    .states{
        fill: #eee;
        fill-opacity: 0.4
    }
    .state-borders{
        fill: none;
        stroke: #fff;
        stroke-width: 0.5px;
        stroke-linejoin: round;
        stroke-linecap: round;
        pointer-events: none;
    }
    svg{
        background-color: #222
    }

    .flight-path{
        stroke: #000;
        stroke-width: 5px;
        fill: none
    }

`;

const flightPath = {
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

const CITIES = [
    {
        stateAbbr: "CA",
        placeName: "Los Angeles",
        lng: -118.408500088,
        lat: 34.1182277898,
        lnglat: [-118.408500088, 34.1182277898]
    },
    {
        stateAbbr: "IL",
        placeName: "Chicago",
        lng: -87.6862308732,
        lat: 41.8372950615,
        lnglat: [-87.6862308732, 41.8372950615]
    },
    {
        stateAbbr: "NY",
        placeName: "New York",
        lng: -73.9313850409,
        lat: 40.694960689,
        lnglat: [-73.9313850409, 40.694960689]
    },
    {
        stateAbbr: "TX",
        placeName: "Dallas",
        lng: -96.7656929463,
        lat: 32.7939804066,
        lnglat: [-96.7656929463, 32.7939804066]
    }
];

interface Props {
    width: number;
    height: number;
}

const Map: React.FC<Props> = (props: Props) => {
    const mapRef = React.createRef<SVGSVGElement>();
    const flightPathRef = React.createRef<SVGSVGElement>();
    const projection: GeoProjection = geoMercator();
    const path = geoPath().projection(projection);
    const flightGeoPath = geoPath();
    let index = 0;
    let city = CITIES[0];

    const [mapSelection, setMapSelection] = useState<Selection<
        SVGSVGElement | null,
        {},
        null,
        undefined
    > | null>(null);

    const [usMap, setMap] = useState<any>(null);

    async function fetchUs() {
        const mapRequest = json("/us.json");
        try {
            const result = await mapRequest;
            setMap(result);
        } catch (err) {
            throw err;
        }
    }

    useEffect(() => {
        if (!usMap && !mapSelection) {
            setMapSelection(select(mapRef.current));
            fetchUs();
        }
        drawChart();
    });

    const zoomed = (): void => {
        const translate = `translate(${event.transform.x}, ${
            event.transform.y
        })`;
        const scale = `scale(${event.transform.k}, ${event.transform.k})`;
        const transformStr = `${translate} ${scale}`;
        mapSelection!.attr("transform", transformStr);
    };
    const zBehavior = zoom().on("zoom", zoomed);

    const transform = () => {
        const cityPoint: GeoPermissibleObjects = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: city.lnglat
            },
            properties: {
                name: "Dinagat Islands"
            }
        };

        const centroid: number[] = path.centroid(cityPoint);
        const x = props.width / 2 - centroid[0];
        const y = props.height / 2 - centroid[1];

        return zoomIdentity.translate(x, y);
    };

    const transition = () => {
        index += 5;
        // index = index % CITIES.length;

        // city = CITIES[index];

        // if (mapSelection) {
        //     mapSelection
        //         .transition()
        //         .delay(500)
        //         .duration(4000)
        //         .call(zBehavior.transform as any, transform)
        //         .on("end", () => {
        //             mapSelection.call(transition);
        //         });
        // }

        if (mapSelection) {
            mapSelection
                .transition()
                .duration(1500)
                .attr("transform", `translate(${index},${index})`)
                .on("end", () => {
                    mapSelection.call(transition);
                });
        }
    };

    const drawChart = () => {
        if (usMap && mapSelection) {
            city = CITIES[index];

            const center = CITIES[3].lnglat;

            mapSelection.call(transition);

            projection.scale(4000).center([-98.5795, 39.8283]);

            const feat = feature(usMap, usMap.objects.states);
            //@ts-ignore
            const features = feat["features"];
            console.log(features);
            const meshed = mesh(usMap, usMap.objects.states, (a, b) => a !== b);
            const meshPath = path(meshed as any);

            mapSelection
                .attr("class", "states")
                .selectAll("path")
                .data(features)
                .enter()
                .append("path")
                .attr("d", path as any);

            if (meshPath !== null) {
                mapSelection
                    .append("path")
                    .attr("class", "state-borders")
                    .attr("d", meshPath);
            }

            // const point = mapSelection
            //     .selectAll(".city")
            //     .data(CITIES)
            //     .enter()
            //     .append("g")
            //     .classed('city', true)
            //     //@ts-ignore
            //     .attr('transform', (d: any)=> {
            //         const lnglat = projection(d.lnglat)
            //         if(lnglat !== null){
            //             const lng: any = lnglat[0]
            //             const lat: any = lnglat[1]
            //             return `translate(${lng}, ${lat})`
            //         } else{
            //             return ""
            //         }
            //     })

            mapSelection
                .selectAll(".flight-path")
                .data(flightPath.features)
                .enter()
                .append("path")
                .attr("class", "flight-path")
                .attr("d", path as any);
        }
    };

    return (
        <div>
            <svg width={props.width} height={props.height}>
                <Global />
                <g ref={mapRef} />
                <g ref={flightPathRef} />
            </svg>
            <button
                onClick={() => {
                    const centroid: number[] = path.centroid(nyc);
                    const x = props.width / 2 - centroid[0];
                    const y = props.height / 2 - centroid[1];
                    if (mapSelection) {
                        mapSelection
                            .transition()
                            .duration(750)
                            .attr("transform", `translate(${x}, ${y})`);
                    }
                }}
            >
                Click
            </button>
        </div>
    );
};

export default Map;
