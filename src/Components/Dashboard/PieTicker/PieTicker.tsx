import { easeElastic } from "d3-ease";
import { interpolate } from "d3-interpolate";
import { select, Selection } from "d3-selection";
import { arc } from "d3-shape";
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
    .background {
        fill: none;
        stroke: #000;
        stroke-width: 2px;
    }
    /* .foreground {
        fill: orange;
        stroke: blue;
        stroke-width: 40px;
    } */

    .label{
        text-anchor: middle;
    }
`;

const PieTickerGrid = styled.div`
    grid-row: 5;
    grid-column: 1;
`;

type D3SVGSelection = Selection<
    SVGSVGElement | null,
    {},
    null,
    undefined
> | null;
type Props = {
    width: number;
    height: number;
};

let Data = {
    previous: 101,
    value: 100,
    size: 100,
    update: (value: number) => value--
};

const PieTicker: React.FC<Props> = (props: Props) => {
    const pieRef = useRef<SVGSVGElement | null>(null);
    const [selection, setSelection] = useState<D3SVGSelection>(null);

    const arcGenerator = arc()
        .innerRadius(70)
        .outerRadius(100)
        .startAngle(-0.75 * Math.PI)
        .endAngle(function(d: any) {
            console.log((d.value / d.size) * 2 * Math.PI);
            return (d.value / d.size) * 0.75 * Math.PI;
        });
    useEffect(() => {
        if (!selection) {
            setSelection(select(pieRef.current));
        }
        drawPie();
    });

    function arcTween(b: any) {
        var i = interpolate({ value: b.previous }, b);
        return function(t: number) {
            return arcGenerator(i(t));
        };
    }

    const drawPie = () => {
        if (selection) {
            selection.attr("transform", `translate(100, 100)`);
            selection
                .datum(Data)
                .append("path")
                .attr("class", "background")
                .attr("d", arcGenerator as any);

            const label = selection
                .append("text")
                .attr("class", "label")
                .attr("dy", ".35em");

            const path = selection.append("path").attr("class", "foreground");

            (function update() {
                if (Data.value > 0) {
                    Data.previous = Data.value;
                    Data.value--;
                    path.transition()
                        .ease(easeElastic)
                        .duration(750)
                        .attrTween("d", arcTween as any);

                    label.text(Data.value);
                    let timeout = Math.random() * (4500 - 1000) + 1000;
                    setTimeout(update, timeout);
                }
            })();
        }
    };

    return (
        <PieTickerGrid>
            <Global />
            <svg width={200} height={200}>
                <g ref={pieRef} />
            </svg>
        </PieTickerGrid>
    );
};

export default PieTicker;
