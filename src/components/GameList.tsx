import * as React from "react";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import styled from "styled-components";
import withGameSocket, { GameSocketProps } from "../context/GameSocket";


const GameListContainer = styled.div`
    margin: 1rem;
    flex: 0 0 100%;
`;

const GameConnectionLink = styled(Link)`
    display: block;
    margin-top: 1rem;
`;


interface GameListState {
    games: string[] | null;
}

class GameList extends React.Component<GameSocketProps, GameListState> {
    public state: GameListState = {
        games: null
    };

    public render() {
        if (!this.state.games) {
            return null;
        }

        return (
            <GameListContainer>
                {this.state.games.map(gameUUID =>
                    <GameConnectionLink key={gameUUID} to={`/connect/${gameUUID}/`}>{gameUUID}</GameConnectionLink>
                )}
            </GameListContainer>
        )
    }

    public componentDidMount() {
        this.props.gameSocket.on("games_list_received", (games: string[]) => {
            this.setState({ games });
        });

        this.props.gameSocket.emit("get_games_list");
    }
}

export default compose(
    withGameSocket
)(GameList);