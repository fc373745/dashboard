import { geoOrthographic, geoPath } from "d3-geo";
import React, { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { feature } from "topojson";
import world from "./world.json";

const Global = createGlobalStyle`
    path{
        fill:#aaa;
        stroke: #ddd;
        stroke-width: 0.5;
    }
`;

const RotatingGlobe: React.FunctionComponent = () => {
    const [mount, setMount] = useState(false);
    const [pathString, setPath] = useState<string | null>("");
    const [rotation, setRotation] = useState(0);
    const globeRef = React.createRef<SVGSVGElement>();
    //@ts-ignore
    const geoJson = feature(world, world.objects.ne_110m_admin_0_countries);
    const projection = geoOrthographic()
        .fitSize([450, 450], geoJson)
        .rotate([rotation] as any);

    useEffect(() => {
        if (!mount) {
            const geoGenerator = geoPath().projection(projection);

            setPath(geoGenerator(geoJson));
        }
        setRotation(rotation + 0.2);
    });

    return (
        <svg width={500} height={500}>
            <Global />
            {pathString && <path d={pathString} />}
        </svg>
    );
};

export default RotatingGlobe;
