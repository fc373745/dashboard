import React from "react";

class PilotInfo extends React.Component {
    svgRef = React.createRef<SVGSVGElement>();

    render() {
        return (
            <svg>
                <g ref={this.svgRef} />
            </svg>
        );
    }
}

export default PilotInfo;
