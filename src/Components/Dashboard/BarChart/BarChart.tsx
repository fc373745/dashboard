import { scaleBand, scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Viewership } from "./Data";

type D3Selection = Selection<SVGSVGElement | null, {}, null, undefined>;
const infoWidth = 150;
const BarChartGrid = styled.div`
    grid-row: 4;
    grid-column: 2 / span 3;
`;
type Props = {
    width: number;
    height: number;
};

const BarChart: React.FC<Props> = (props: Props) => {
    const barChartRef = useRef<SVGSVGElement | null>(null);
    const margin = { top: 20, left: 50, bottom: 30 };
    const width = props.width - margin.left - infoWidth;
    const height = props.height - margin.top - margin.bottom;
    let defs: any | null = null;

    const x = scaleBand()
        .domain(Viewership.map(d => d.date))
        .range([0, width])
        .padding(0.1);

    const y = scaleLinear()
        .domain([0, 72000])
        .range([height, 0]);

    const [selection, setSelection] = useState<D3Selection | null>(null);
    const [chartDrawn, setDrawn] = useState(false);

    useEffect(() => {
        if (!selection) {
            setSelection(select(barChartRef.current));
        }
        drawChart();
    });

    const drawChart = () => {
        if (selection) {
            defs = selection.append("defs");

            defs.append("clipPath");

            selection
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .selectAll(".bar")
                .data(Viewership)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.date)!)
                .attr("y", d => y(d.viewers))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.viewers));

            setDrawn(true);
        }
    };

    return (
        <BarChartGrid>
            <svg width={props.width - infoWidth} height={200}>
                <g ref={barChartRef} />
            </svg>
        </BarChartGrid>
    );
};

export default BarChart;
