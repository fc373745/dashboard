import { geoOrthographic, geoPath } from "d3-geo";
import React, { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { feature } from "topojson";
import world from "./world.json";

const Global = createGlobalStyle`
    body{
        background-color: #141F1F;
    }
    path{
        fill:#D1E0E0;
        stroke: #0A1010;
        stroke-width: 0.5;

        &:hover {
        }
    }
`;

const RotatingGlobe: React.FunctionComponent = () => {
    const [mount, setMount] = useState(false);
    const [pathString, setPath] = useState<string | null>("");
    const [rotation, setRotation] = useState(0);
    const globeRef = React.createRef<SVGSVGElement>();
    //@ts-ignore
    const geoJson = feature(world, countries);
    //@ts-ignore
    const countries = feature(world, world.objects.ne_110m_admin_0_countries)
        .features;
    const projection = geoOrthographic()
        .fitSize([450, 450], geoJson)
        // .scale(((450 - 10) / 2) * 1.3)
        .rotate([rotation] as any);

    useEffect(() => {
        if (!mount) {
            const geoGenerator = geoPath().projection(projection);

            setPath(geoGenerator(geoJson));

            console.log(
                //@ts-ignore
                feature(world, world.objects.ne_110m_admin_0_countries).features
            );

            setMount(true);
        }
        setRotation(rotation + 0.2);
    });

    const setCountry = () => {};

    return (
        <div>
            <svg width={500} height={500}>
                <Global />
                {pathString && <path d={pathString} />}
            </svg>
            <button onClick={setCountry}>Click</button>
        </div>
    );
};

export default RotatingGlobe;
