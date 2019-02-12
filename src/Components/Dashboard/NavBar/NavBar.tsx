import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";

const NavBarContainer = styled.div`
    width: 75px;
    height: 100vh;
    background-color: #000;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
`;

const NavBarInnerContainer = styled.div`
    width: 400px;
    height: 100vh;
    background-color: blue;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
`;

const NavBar: React.FC = () => {
    const [toggle, setToggle] = useState(false);
    const props = useSpring({
        transform: toggle ? "translateX(-400px)" : "translateX(0px)",
        zIndex: 1
    });

    const onClick = () => {
        setToggle(!toggle);
    };
    return (
        <div>
            <NavBarContainer>
                <button onClick={onClick}> click</button>
            </NavBarContainer>
            <animated.div style={props}>
                <NavBarInnerContainer />
            </animated.div>
        </div>
    );
};

export default NavBar;
