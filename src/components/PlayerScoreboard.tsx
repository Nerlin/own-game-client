import * as React from "react";
import styled from "styled-components";
import { Player } from "../context/Game";


interface PlayerScoreboardProps {
    players: Player[];
}

const PlayerScoreboardContainer = styled.div`
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    
    @media(max-width: 450px) {
        padding: 5px;
    }
`;

const PlayerScoreboardTitle = styled.div`
    font-size: 1.5rem;
    
    @media(max-width: 450px) {
        font-size: 12pt;
    }
`;

const PlayerName = styled.span`
    font-weight: bold;
`;

const PlayerScore = styled.span`
    font-style: italic;
`;

const PlayerViewContainer = styled.div`
    font-size: 1.1rem;
    margin: 1rem 0 0 0;
    
    @media(max-width: 450px) {
        font-size: 10pt;
    }
`;

const PlayerView = ({ player }: { player: Player }) => (
    <PlayerViewContainer>
        <PlayerName>{player.name}</PlayerName>{": "}
        <PlayerScore>{player.score}</PlayerScore>
    </PlayerViewContainer>
)

const PlayerScoreboard = ({players}: PlayerScoreboardProps) => (
    <PlayerScoreboardContainer>
        <PlayerScoreboardTitle>Players</PlayerScoreboardTitle>

        {players.map((player, index) =>
        <PlayerView key={index} player={player} />
        )}
    </PlayerScoreboardContainer>
);

export default PlayerScoreboard;