import React from "react";
import { createGlobalStyle } from "styled-components";
import Map from "./Map/MapFinal";
import PilotInfo from "./PilotInfo/PilotInfo";

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
            <Map width={820} height={450} />
            <PilotInfo width={1401} />
            <PilotInfo width={1401} />
        </div>
    );
};

export default Container;
