import React from "react";
import { createGlobalStyle } from "styled-components";
import Map from "./Map/Map2";
import PilotInfo from "./PilotInfo/PilotInfo";

const StyledContainer = createGlobalStyle`
    body {
        padding-top: 10px;
        background-color: #0a0f0f;
    }
`;

const Container: React.FunctionComponent = () => {
    return (
        <div>
            <StyledContainer />
            <Map width={960} height={600} />
            <PilotInfo width={1401} />
            <PilotInfo width={1401} />
        </div>
    );
};

export default Container;
