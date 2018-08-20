import * as React from "react";
import * as io from "socket.io-client";
import { GameURI } from "../config";


interface GameSocketState {
    gameSocket?: GameSocket;
}

export type GameSocketProps = Required<GameSocketState>;
export type GameSocket = SocketIOClient.Socket;


export default function withGameSocket<T>(Component: React.ComponentClass<GameSocketState>) {
    return class extends React.Component<T, GameSocketState> {
        public static displayName = `withGameSocket(${Component.displayName})`;

        public state: GameSocketState = {};

        public render() {
            const {gameSocket} = this.state;
            if (!gameSocket) {
                return null;
            }

            return <Component {...this.props} gameSocket={gameSocket} />;
        }

        public componentDidMount() {
            this.setState({ gameSocket: io(GameURI) });
        }

        public componentWillUnmount() {
            if (this.state.gameSocket) {
                this.state.gameSocket.close();
            }
        }
    }
}