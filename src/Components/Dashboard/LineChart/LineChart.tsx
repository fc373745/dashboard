import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleTime } from "d3-scale";
import { select, Selection } from "d3-selection";
import { curveMonotoneX, line } from "d3-shape";
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Price, PRICES } from "./Data";

const Global = createGlobalStyle`
    .line{
        fill: none;
        stroke: black;
        stroke-width: 3px;
    }
    .dot{
        fill: orange;
        &:hover{
            
            cursor: pointer;
        }
    }
`;
const LineChartGrid = styled.div`
    grid-row: 3;
    grid-column: 1 / span 3;
`;

const LineChartInfo = styled.div`
    margin: 10px;
    min-width: 140px;
    width: 140px;
    max-width: 140px;
    font-size: 16px;
`;

const LineChartContainer = styled.div`
    display: flex;
`;

type Props = {
    width: number;
    height: number;
};

type D3Selection = Selection<SVGSVGElement | null, {}, null, undefined>;

const LineChart: React.FC<Props> = (props: Props) => {
    const lineChartRef = useRef<SVGSVGElement | null>(null);
    const botAxisRef = useRef<SVGSVGElement | null>(null);
    const leftAxisRef = useRef<SVGSVGElement | null>(null);
    const margin = { bottom: 50, left: 50, top: 20 };
    const width = props.width - margin.left;
    const height = props.height - margin.bottom;

    const n = PRICES.length;
    const startDate = new Date("Dec 2017");
    const endDate = new Date("Jan 2019");

    const x = scaleTime()
        .domain([startDate, endDate])
        .range([0, width - 200]);

    const y = scaleLinear()
        .domain([0, 17000])
        .range([height, 0]);

    const lineGenerator = line<Price>()
        .x(d => x(d.month))
        .y(d => y(d.price))
        .curve(curveMonotoneX);

    const [lineSelection, setLineSelection] = useState<D3Selection | null>(
        null
    );
    const [lAxisSelection, setLAxisSelection] = useState<D3Selection | null>(
        null
    );
    const [bAxisSelection, setBAxisSelection] = useState<D3Selection | null>(
        null
    );

    const [info, setInfo] = useState<string>("some string");

    const [drawnLine, setDrawnLine] = useState(false);

    useEffect(() => {
        if (!lineSelection) {
            setLineSelection(select(lineChartRef.current as any));
            setLAxisSelection(select(leftAxisRef.current));
            setBAxisSelection(select(botAxisRef.current));
        }
        if (!drawnLine) {
            drawLine();
        }
    });

    const drawLine = () => {
        if (lineSelection && PRICES) {
            lineSelection
                .attr("width", props.width - margin.left)
                .attr("height", props.height - margin.top)
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .append("path")
                .datum(PRICES)
                .attr("class", "line")
                .attr("d", lineGenerator as any);

            lineSelection
                .selectAll(".dot")
                .data(PRICES)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => x(d.month))
                .attr("cy", d => y(d.price))
                .attr("r", 7)
                .on("mouseover", function(a, b, c) {
                    setInfo("" + a.month.toISOString());
                    select(this)
                        .transition()
                        .duration(250)
                        .attr("r", 13);
                })
                .on("mouseout", function(a, b, c) {
                    setInfo("blah blah blah");
                    select(this)
                        .transition()
                        .duration(250)
                        .attr("r", 7);
                });

            drawAxes();
            setDrawnLine(true);
        }
    };
    const drawAxes = () => {
        if (bAxisSelection && lAxisSelection) {
            const xAxis = axisBottom(x).ticks(5);
            const yAxis = axisLeft(y);

            const botAxis = bAxisSelection.attr(
                "transform",
                `translate(${margin.left}, ${height + margin.top})`
            );

            const leftAxis = lAxisSelection.attr(
                "transform",
                `translate(${margin.left}, ${margin.top})`
            );

            botAxis.call(xAxis as any);
            leftAxis.call(yAxis as any);
        }
    };

    return (
        <LineChartGrid>
            <Global />
            <LineChartContainer>
                <LineChartInfo>{info}</LineChartInfo>
                <svg width={props.width - 150} height={props.height}>
                    <g ref={lineChartRef} />
                    <g ref={botAxisRef} />
                    <g ref={leftAxisRef} />
                </svg>
            </LineChartContainer>
        </LineChartGrid>
    );
};

export default LineChart;
