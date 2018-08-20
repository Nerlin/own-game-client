import * as React from "react";
import { RouteComponentProps } from "react-router";
import withGameState, { GameState, GameStateComponentProps } from "./Game";



export interface GameLocalStorageProps extends GameStateComponentProps {
    setPlayerKey(playerKey: string): void;
    setHostKey(hostKey: string): void;
    purge(): void;
}

export default function withGameLocalStorage<T extends GameLocalStorageProps>(Component: React.ComponentClass<T>) {
    class GameLocalStorage extends React.Component<T & GameStateComponentProps & RouteComponentProps<{
        gameUUID?: string;
    }>> {
        public static displayName = `withGameLocalStorage(${Component.displayName})`;

        public render() {
            if (!this.props.gameState.initialized) {
                return null;
            }

            return <Component
                {...this.props}
                setHostKey={this.setHostKey}
                setPlayerKey={this.setPlayerKey}
                purge={this.purge}
            />;
        }

        public componentDidMount() {
            const state: Partial<GameState> = {};
            state.initialized = true;

            const gameId = this.props.match.params.gameUUID;
            if (gameId) {
                const hostKey = window.localStorage.getItem(this.hostKeyStorage(gameId));
                if (hostKey) {
                    state.hostKey = hostKey;
                }

                const playerKey = window.localStorage.getItem(this.playerKeyStorage(gameId));
                if (playerKey) {
                    state.playerKey = playerKey;
                }
            }

            state.gameId = gameId;

            this.props.gameState.update(state);
        }

        protected setPlayerKey = (playerKey: string) => {
            const playerKeyStorage = this.playerKeyStorage();
            if (playerKeyStorage) {
                window.localStorage.setItem(playerKeyStorage, playerKey);
            }

            this.props.gameState.update({ playerKey });
        }

        protected setHostKey = (hostKey: string) => {
            const hostKeyStorage = this.hostKeyStorage();
            if (hostKeyStorage) {
                window.localStorage.setItem(hostKeyStorage, hostKey);
            }

            this.props.gameState.update({ hostKey });
        }

        protected purge = () => {
            if (this.gameUUID) {
                window.localStorage.removeItem(this.hostKeyStorage(this.gameUUID));
                window.localStorage.removeItem(this.playerKeyStorage(this.gameUUID));
            }
        }

        private playerKeyStorage(gameUUID: string): string;
        private playerKeyStorage(gameUUID: undefined): null;
        private playerKeyStorage(): string | null;
        private playerKeyStorage(gameUUID = this.gameUUID) {
            if (gameUUID) {
                return `${gameUUID}.playerKey`;
            }
            return null;
        }

        private hostKeyStorage(gameUUID: string): string;
        private hostKeyStorage(gameUUID: undefined): null;
        private hostKeyStorage(): string | null;
        private hostKeyStorage(gameUUID = this.gameUUID): string | null {
            if (gameUUID) {
                return `${gameUUID}.hostKey`;
            }
            return null;
        }

        private get gameUUID(): string | undefined {
            return this.props.match.params.gameUUID;
        }
    }

    return withGameState(GameLocalStorage);
}