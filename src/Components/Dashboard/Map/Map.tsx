import { geoMercator, geoPath } from "d3-geo";
import { event, select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity } from "d3-zoom";
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { feature, mesh } from "topojson";
import us from "./us.json";

type City = {
    name: string;
    lnglat: number[];
};

const MapStyles = styled.svg`
    background-color: #373745;
`;

const Global = createGlobalStyle`
    .counties{
        stroke: #000;
        fill: #373745;
        &:hover{
            fill: black
        }
    }
    
    .county-borders{
        fill: none;
        stroke: white;
        stroke-width: 1px;
        stroke-linejoin: round;
        stroke-linecap: round;
        pointer-events: none;
    }
    `;

const Map: React.FunctionComponent = () => {
    const cities = [
        { name: "Seattle", lnglat: [47.6062, -122.3321] },
        { name: "Los Angeles", lnglat: [34.0522, -118.2437] },
        { name: "Dallas", lnglat: [32.7767, -96.797] },
        { name: "Chicago", lnglat: [41.8781, -87.6298] },
        { name: "New York City", lnglat: [40.7128, -74.006] }
    ];
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const projection = geoMercator();
    const path = geoPath().projection(projection);
    const [city, setCity] = useState<City | null>(cities[3]);
    const [index, setIndex] = useState(3);

    const zoomed = () => {
        select(mapRef.current).attr(
            "transform",
            //prettier-ignore
            `translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k},${event.transform.k})`
        );
    };

    const transform = () => {
        const cityPoint = {
            type: "Feature",
            geometry: {
                type: "Point",
                //@ts-ignore
                coordinates: city.lnglat
            },
            properties: {
                name: "x"
            }
        };

        const centroid = path.centroid(cityPoint as any);
        const x = 960 / 2 - centroid[0];
        const y = 600 / 2 - centroid[1];

        return zoomIdentity.translate(x, y);
    };

    const zoom2 = zoom().on("zoom", zoomed);

    const transition = () => {
        if (index + 1 > cities.length) {
            setIndex((index + 1) % cities.length);
        } else {
            setIndex(index + 1);
        }
        setCity(cities[index]);
        select(mapRef.current)
            .transition()
            .delay(500)
            .duration(3000)
            .call(zoom2.transform as any, transform)
            .on("end", () => {
                select(mapRef.current).call(transition);
            });
    };

    useEffect(() => {
        drawMap();
    }, []);

    const drawMap = () => {
        const mapSelection = select(mapRef.current);
        const containerSelection = select(containerRef.current);
        const newCities = cities.map(d => {
            lnglat: d.lnglat.reverse();
        });

        const center = cities[3].lnglat.reverse();
        console.log(center);

        mapSelection.call(transition);

        console.log(projection);
        projection.scale(7000).center(center as any);

        mapSelection
            .selectAll("path")
            //@ts-ignore
            .data(feature(us, us.objects.counties).features)
            .enter()
            .append("path")
            .attr("class", "counties")
            .attr("d", path as any);

        mapSelection
            .append("path")

            .attr("d", path(
                //@ts-ignore
                mesh(us, us.objects.counties, function(a, b) {
                    return a !== b;
                })
            ) as any)
            .attr("class", "county-borders");
    };

    return (
        <div>
            <Global />
            <MapStyles ref={containerRef} width={960} height={600}>
                <g ref={mapRef} />
            </MapStyles>
        </div>
    );
};
export default Map;
