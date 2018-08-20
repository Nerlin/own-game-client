import * as React from 'react';
import { Route, Switch } from "react-router";
import { GameState, GameStateProvider } from "./context/Game";
import ConnectPage from "./pages/ConnectPage";
import GamePage from "./pages/GamePage";
import Index from "./pages/Index";
import NewGamePage from "./pages/NewGamePage";


interface AppState {
    gameState: GameState;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            gameState: {
                currentQuestion: null,
                gameId: null,
                hostKey: null,
                initialized: false,
                playerKey: null,
                players: [],
                update: this.updateGameState,
            }
        };
    }

    public render() {
        return (
            <GameStateProvider value={this.state.gameState}>
                <Switch>
                    <Route path={"/new-game/"} component={NewGamePage} />
                    <Route path={"/connect/:gameUUID/"} component={ConnectPage} />
                    <Route path={"/connect/"} component={ConnectPage} />
                    <Route path={"/game/:gameUUID/"} component={GamePage} />
                    <Route path={"/"} component={Index} exact={true} />
                </Switch>
            </GameStateProvider>
        );
    }

    protected updateGameState = (newGameState: Partial<GameState>) => {
        this.setState(({gameState}) => ({
            gameState: {...gameState, ...newGameState, update: this.updateGameState}
        }));
    }
}

export default App;
