import { json } from "d3-fetch";
import { geoMercator, geoPath, GeoProjection } from "d3-geo";
import { select, Selection } from "d3-selection";
import React, { useEffect, useRef, useState } from "react";
import { feature, mesh } from "topojson";

interface Props {
    width: number;
    height: number;
}

const Map: React.FC<Props> = (props: Props) => {
    const mapRef = useRef<SVGSVGElement | null>(null);

    const projection: GeoProjection = geoMercator();
    projection.scale(1000).center([-98.5795, 39.8283]);
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
    });

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

            // mapSelection
            //     .selectAll('.flight-path')
        }
    };

    return (
        <svg width={props.width} height={props.height}>
            <g ref={mapRef} />
        </svg>
    );
};

export default Map;
