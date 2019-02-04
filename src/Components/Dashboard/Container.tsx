import React from "react";
import { createGlobalStyle } from "styled-components";
import Map from "./Map/MapFinal";
import PilotInfo from "./PilotInfo/PilotInfo2";

const StyledContainer = createGlobalStyle`
    body {
        padding-top: 10px;
        background-color: #eee;
    }
`;

const Container: React.FunctionComponent = () => {
    return (
        <div>
            <StyledContainer />
            <Map width={820} height={600} />
            <PilotInfo width={600} height={200} ins={0} />
            <PilotInfo width={600} height={200} ins={1} />
        </div>
    );
};

export default Container;
