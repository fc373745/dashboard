import { axisBottom, axisLeft } from "d3-axis";
import { easeLinear } from "d3-ease";
import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { curveMonotoneX, line } from "d3-shape";
import { active } from "d3-transition";
import React from "react";
import styled, { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
    .line0 {
        fill: none;
        stroke: black;
        stroke-width: 1.5px;
    }
`;

const PilotInfoGrid = styled.div`
    grid-column: 1 / span 3;
    grid-row: 2;
`;

type Props = {
    width: number;
    height: number;
    ins: number;
};
const n = 20;
const max = 10;
const min = -10;

const lineChartData: number[] = Array.from({ length: n }, () =>
    Math.floor(Math.random() * (max - min) + min)
);
class PilotInfo extends React.Component<Props> {
    svgRef = React.createRef<SVGSVGElement>();
    element: SVGSVGElement | null = null;
    selectionSVG: null | Selection<
        SVGSVGElement | null,
        {},
        null,
        undefined
    > = null;
    x = scaleLinear()
        .domain([0, n - 1])
        .range([0, this.props.width - 150]);

    y = scaleLinear()
        .domain([min, max])
        .range([this.props.height - 40, 0]);

    lineGenerator = line()
        .x((_, i) => this.x(i))
        .y(d => this.y(d as any))
        .curve(curveMonotoneX);

    state = {
        data: lineChartData
    };

    componentDidMount() {
        this.element = this.svgRef.current;
        this.initChart();
    }

    createAxes() {
        if (this.selectionSVG) {
            this.selectionSVG
                .append("g")
                .attr("class", "axis axis-x")
                .attr("transform", `translate(0, ${this.y(0)})`)
                .call(axisBottom(this.x));

            this.selectionSVG
                .append("g")
                .append("g")
                .attr("class", "axis axis-y")
                .call(axisLeft(this.y));
        }
    }

    initChart() {
        const self = this;

        this.selectionSVG = select(this.element);
        this.selectionSVG.attr("transform", `translate(200, 20)`);

        this.selectionSVG
            .append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.props.width)
            .attr("height", this.props.height - 40);

        this.createAxes();

        const g = this.selectionSVG.append("g").attr("clip-path", "url(#clip)");

        g.append("path")
            .datum(this.state.data)
            .attr("class", `line${this.props.ins}`)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .on("start", function() {
                self.tick(this);
            });
    }

    tick(selected: SVGPathElement) {
        const self = this;

        // Push a new data point onto the back.
        self.state.data.push(Math.floor(Math.random() * (max - min) + min));

        // Redraw the line.
        select(selected)
            .attr("d", self.lineGenerator as any)
            .attr("transform", null);

        // Slide it to the left.
        let activeSelection = active(selected);
        if (activeSelection) {
            activeSelection
                .attr("transform", "translate(" + self.x(-1) + ",0)")
                .transition()
                .on("start", function() {
                    self.tick(this);
                });
        }

        // Pop the old data point off the front.
        self.state.data.shift();
    }

    render() {
        return (
            <PilotInfoGrid>
                <svg width={this.props.width} height={this.props.height}>
                    <Global />
                    <g ref={this.svgRef} />
                </svg>
            </PilotInfoGrid>
        );
    }
}

export default PilotInfo;
