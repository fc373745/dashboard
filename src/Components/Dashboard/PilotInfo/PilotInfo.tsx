import React from "react";
import styled from "styled-components";

type Props = {
    width: number;
};

const PilotInfo: React.FC<Props> = (props: Props) => {
    const { width } = props;

    const PilotInfoContainer = styled.div`
        width: ${width > 1400
            ? "500px"
            : width > 900 && width <= 1400
            ? "300px"
            : "600px"};
        background-color: #0a0f0f;
        border: 1px solid #ffcc80;
        height: 150px;
        margin-bottom: 20px;
        border-radius: 5px;
    `;

    return <PilotInfoContainer />;
};

export default PilotInfo;
