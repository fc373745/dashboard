import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import BarChart from "./BarChart/BarChart";
import LineChart from "./LineChart/LineChart";
import Map from "./Map/MapFinal";
import PieTicker from "./PieTicker/PieTicker";
import PilotInfo from "./PilotInfo/PilotInfo2";

const StyledContainer = createGlobalStyle`
    body {
        padding-top: 10px;
        background-color: #eee;
        padding: 0;
        margin: 0;
    }
`;

const ContainerGrid = styled.div`
    display: grid;
    grid-template: 50px repeat(4, 1fr) / repeat(8, 1fr);
`;
const Container: React.FunctionComponent = () => {
    const frw = window.innerWidth / 8;
    console.log(frw, frw * 3);
    const frl = window.innerHeight / 4;
    return (
        <ContainerGrid>
            <StyledContainer />
            <Map width={frw * 4} height={500} />
            <PilotInfo width={600} height={200} ins={0} />
            <LineChart width={frw * 3} height={200} />
            <BarChart width={frw * 3} height={250} />
            <PieTicker width={250} height={250} />
            {/* <PilotInfo width={600} height={200} ins={1} /> */}
        </ContainerGrid>
    );
};

export default Container;
