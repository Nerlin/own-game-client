import * as React from "react";
import { Redirect } from "react-router";
import { compose } from "recompose";
import withGameState, { GameStateComponentProps } from "../context/Game";
import withGameSocket, { GameSocketProps } from "../context/GameSocket";


export interface GameStartedMessage {
    game_id: string;
    host_key: string;
}

export interface NewGamePageProps extends GameSocketProps, GameStateComponentProps {
}

class NewGamePage extends React.Component<NewGamePageProps> {
    protected initialized: boolean = false;

    public render() {
        if (this.props.gameState.gameId) {
            return <Redirect to={`/game/${this.props.gameState.gameId}/`}/>
        }

        return null;
    }

    public componentDidMount() {
        this.sendGameStartMessage();
    }

    protected sendGameStartMessage() {
        this.props.gameSocket.on("game_started", (message: GameStartedMessage) => {
            this.props.gameState.update({
                gameId: message.game_id,
                hostKey: message.host_key
            });

            window.localStorage.setItem(`${message.game_id}.hostKey`, message.host_key);
        });
        this.props.gameSocket.emit("start_game");
        this.initialized = true;
    }
}

export default compose(
    withGameState,
    withGameSocket,
)(NewGamePage);