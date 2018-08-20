import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import GameList from "../components/GameList";


const IndexWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 1rem;
`;

const IndexLink = styled(Link)`
    margin: 0 1rem;
`;


const Index = () => (
    <IndexWrapper>
        <IndexLink to={"/new-game/"}>Create new game</IndexLink>
        <IndexLink to={"/connect/"}>Connect</IndexLink>

        <GameList />
    </IndexWrapper>
);

export default Index;