import { easeLinear } from "d3-ease";
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
        //@ts-ignore
        const self = this;
        if (lineSelection) {
            lineSelection
                .append("defs")
                .append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", 500)
                .attr("width", 300);

            lineSelection.append("g").attr("clip-path", "url(#clip)");

            lineSelection
                .append("path")
                .datum(lineChartData)
                .attr("class", "line")
                .transition()
                .duration(500)
                .ease(easeLinear)
                .on("start", function() {
                    // tick();
                });
        }
    };

    function tick() {
        console.log("wtf");

        if (lineSelection) {
            console.log(lineChartData);
            lineChartData.push(Math.floor(Math.random() * 40));

            lineSelection
                .append("path")
                .datum(lineChartData)
                .attr("d", lineGenerator as any)
                .attr("transform", null);

            // active(lineChartRef.current)!
            //     .attr("transform", `translate(${(x(-1), 0)})`)
            //     .transition()
            //     .duration(500);
            // .on("start", () => {
            //     lineSelection.call(tick);
            // });

            lineChartData.shift();
        }
    }

    return (
        <div>
            <svg width={width} height={300}>
                <g ref={lineChartRef} />
            </svg>
        </div>
    );
};

export default PilotInfo;
