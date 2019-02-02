import { easeLinear } from "d3-ease";
import { json } from "d3-fetch";
import {
    geoMercator,
    geoPath,
    GeoPermissibleObjects,
    GeoProjection
} from "d3-geo";
import { event, select, Selection } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import React, { useEffect, useRef, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { feature, mesh } from "topojson";
import {
    cities,
    flightPath1,
    flightPath2,
    initialFlightPoints,
    US_MAP_CENTER,
    US_MAP_DEFAULT_SCALE
} from "./Data";

const Global = createGlobalStyle`
    .flight-path1{
        stroke: #fff;
        stroke-width: 3px;
        fill: none;
        stroke-linecap: round;
    }
    .flight-path2{
        stroke: #fff;
        stroke-width: 3px;
        fill: none;
        stroke-linecap: round;
    }
`;

interface Props {
    width: number;
    height: number;
}

type City = {
    placeName: string;
    lnglat: number[];
};

const Map: React.FC<Props> = (props: Props) => {
    let city: number[] | null = null;
    let flightOneLocation: number[] | null = null;
    let flightTwoLocation: number[] | null = null;
    let following: boolean = false;
    const mapRef = useRef<SVGSVGElement | null>(null);

    const projection: GeoProjection = geoMercator();
    projection.scale(US_MAP_DEFAULT_SCALE).center(US_MAP_CENTER);
    const path = geoPath().projection(projection);

    const [usMap, setMap] = useState<any>(null);
    const [mapSelection, setMapSelection] = useState<Selection<
        SVGSVGElement | null,
        {},
        null,
        undefined
    > | null>(null);

    async function fetchMap() {
        const mapRequest = json("us.json");
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
            fetchMap();
        }
        drawChart();
        console.log("hi");
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
        if (city && !following) {
            const cityPoint: GeoPermissibleObjects = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: city
                },
                properties: {
                    name: "Dinagat Islands"
                }
            };

            const centroid: number[] = path.centroid(cityPoint);
            return zoomIdentity
                .translate(props.width / 2, props.height / 2)
                .scale(4)
                .translate(-centroid[0], -centroid[1]);
        } else if (following && flightOneLocation) {
            return zoomIdentity
                .translate(props.width / 2, props.height / 2)
                .scale(4)
                .translate(-flightOneLocation[0], -flightOneLocation[1]);
        }
        return zoomIdentity.scale(1);
    };

    function translateAlong(path: any, flight: string) {
        var l = path.getTotalLength();
        return function(d: any, i: any, a: any) {
            return function(t: any) {
                var p = path.getPointAtLength(t * l);

                if (flight === "one") {
                    flightOneLocation = [p.x, p.y];
                }
                return "translate(" + p.x + "," + p.y + ")";
            };
        };
    }

    const drawChart = () => {
        if (mapSelection && usMap) {
            const feat: any = feature(usMap, usMap.objects.states);
            const features = feat["features"];

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

            const mappath1 = mapSelection
                .selectAll(".flight-path1")
                .data(flightPath1.features)
                .enter()
                .append("path")
                .attr("class", "flight-path1")
                .attr("d", path as any);

            const mappath2 = mapSelection
                .selectAll(".flight-path2")
                .data(flightPath2.features)
                .enter()
                .append("path")
                .attr("class", "flight-path2")
                .attr("d", path as any);

            const lnglat1 = projection(initialFlightPoints[0].lnglat as any);
            const lnglat2 = projection(initialFlightPoints[1].lnglat as any);
            if (lnglat1 && lnglat2) {
                const point1 = mapSelection.append("g").attr("city", "city");

                const circle1 = point1
                    .append("circle")
                    .classed("city-cirlce", true)
                    .attr("r", "8px")
                    .attr("fill", "orange");

                const point2 = mapSelection.append("g").attr("city", "city");

                const circle2 = point2
                    .append("circle")
                    .classed("city-cirlce", true)
                    .attr("r", "8px")
                    .attr("fill", "orange");

                circle1
                    .transition()
                    .duration(40000)
                    .ease(easeLinear)
                    .attrTween(
                        "transform",
                        translateAlong(mappath1.node(), "one")
                    );
                circle2
                    .transition()
                    .duration(25000)
                    .ease(easeLinear)
                    .attrTween(
                        "transform",
                        translateAlong(mappath2.node(), "two")
                    );
            }
        }
    };

    const setCity = (lnglat: number[]) => {
        city = lnglat;
        if (mapSelection) {
            mapSelection
                .transition()
                .duration(2000)
                .call(zBehavior.transform as any, transform);
        }
    };

    const setCityNull = () => {
        city = null;
        if (mapSelection) {
            mapSelection
                .transition()
                .duration(2000)
                .call(zBehavior.transform as any, transform);
        }
    };

    const followFlightOne = () => {
        if (flightOneLocation && mapSelection) {
            mapSelection
                .transition()
                .duration(15)
                .call(zBehavior.transform as any, transform)
                .on("end", () => {
                    if (following) {
                        mapSelection.call(followFlightOne);
                    }
                });
        }
    };

    const setFlightOne = () => {
        if (mapSelection) {
            mapSelection
                .transition()
                .duration(450)
                .call(zBehavior.transform as any, transform)
                .on("end", () => {
                    mapSelection.call(followFlightOne);
                });
        }
    };

    const setFollowing = (follow: boolean) => {
        following = follow;
    };

    return (
        <div>
            <Global />
            <svg width={props.width} height={props.height}>
                <g ref={mapRef} />
            </svg>
            <div>
                {cities.map(city => (
                    <button
                        key={city.placeName}
                        onClick={() => setCity(city.lnglat)}
                    >
                        {city.placeName}
                    </button>
                ))}
                <button
                    onClick={() => {
                        setCityNull();
                        setFollowing(false);
                    }}
                >
                    See Map
                </button>
                <button
                    onClick={() => {
                        setFollowing(true);
                        setFlightOne();
                    }}
                >
                    Flight ONe
                </button>
            </div>
        </div>
    );
};

export default Map;
