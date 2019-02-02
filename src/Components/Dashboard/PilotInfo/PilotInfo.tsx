import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { curveMonotoneX, line } from "d3-shape";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    width: number;
};

const PilotInfo: React.FC<Props> = (props: Props) => {
    let lineChartData: number[] = Array.from({ length: 20 }, () =>
        Math.floor(Math.random() * 40)
    );
    const { width } = props;
    const lineChartRef = useRef<SVGSVGElement | null>(null);
    const x = scaleLinear()
        .domain([0, 19])
        .range([0, 400]);
    const y = scaleLinear()
        .domain([0, 40])
        .range([150, 0]);
    const lineGenerator = line()
        .x((d, i) => x(i))
        .y(d => y(d as any))
        .curve(curveMonotoneX);

    const [lineSelection, setLine] = useState<Selection<
        SVGSVGElement | null,
        {},
        null,
        undefined
    > | null>(null);

    useEffect(() => {
        if (!lineSelection) {
            setLine(select(lineChartRef.current));
        }
        drawLineChart();
    });

    const drawLineChart = () => {
        if (lineSelection && lineChartData.length > 0) {
            console.log(lineChartData);
            lineSelection
                .append("path")
                .datum(lineChartData)
                .attr("class", "line")
                .attr("stroke", "blue")
                .attr("fill", "none")
                .attr("d", lineGenerator as any);
        }
    };

    const tick = () => {};

    return (
        <div>
            <svg width={width} height={300}>
                <g ref={lineChartRef} />
            </svg>
        </div>
    );
};

export default PilotInfo;
