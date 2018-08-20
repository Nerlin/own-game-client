import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { compose } from "recompose";
import ConnectForm, { GameConnection } from "../components/ConnectForm";
import withGameLocalStorage, { GameLocalStorageProps } from "../context/GameLocalStorage";
import withGameSocket, { GameSocketProps } from "../context/GameSocket";

export interface ConnectPageProps extends GameSocketProps, GameLocalStorageProps, RouteComponentProps<{
    gameUUID?: string;
}> {
}

export interface ConnectPageState {
    connectedGame: string | null;
    initial: GameConnection;
    error: string;
}

class ConnectPage extends React.Component<ConnectPageProps, ConnectPageState> {
    public constructor(props: ConnectPageProps) {
        super(props);
        this.state = {
            connectedGame: null,
            error: "",
            initial: {
                gameUUID: props.match.params.gameUUID || "",
                playerName: ""
            },
        };
    }

    public render() {
        if (!this.props.gameSocket) {
            return null;
        }

        if (this.state.connectedGame) {
            return <Redirect to={`/game/${this.state.connectedGame}/`}/>;
        }

        return (
            <ConnectForm
                initial={this.state.initial}
                onConnect={this.connect}
                error={this.state.error}
            />
        );
    }

    public componentDidMount() {
        const gameUUID = this.props.gameState.gameId;
        const playerKey = this.props.gameState.playerKey;
        if (gameUUID && playerKey) {
            return this.connected(gameUUID, playerKey);
        }

        const hostKey = this.props.gameState.hostKey;
        if (gameUUID && hostKey) {
            this.setState({ connectedGame: gameUUID });
        }
    }

    protected connect = (connection: GameConnection) => {
        if (!this.props.gameSocket) {
            return;
        }

        this.props.gameSocket.off("joined_game");
        this.props.gameSocket.on("joined_game", (playerKey: string) => {
            this.connected(connection.gameUUID, playerKey);
        });

        this.props.gameSocket.on("fail", ({ error }: any) => {
            this.setState({ error });
        });

        this.props.gameSocket.emit("join_game", {
            "game_id": connection.gameUUID,
            "player_name": connection.playerName
        });
    }

    protected connected(gameId: string, playerKey: string) {
        this.props.gameState.update({
            gameId,
            playerKey
        });
        this.setState({ connectedGame: gameId });
        this.props.setPlayerKey(playerKey);
    }
}

export default compose(
    withGameLocalStorage,
    withGameSocket,
)(ConnectPage);