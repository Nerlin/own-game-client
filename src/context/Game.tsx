import * as React from "react";

export interface ThemeQuestions { [theme: string]: Question[] }
export interface Question {
    text: string;
    score: number;
    disabled?: boolean;
    answeringPlayer?: Player;
}

export interface Player {
    name: string;
    score: number;
}

export interface GameState {
    gameId: string | null;
    playerKey: string | null;
    hostKey: string | null;
    currentQuestion: Question | null;
    themesQuestions?: ThemeQuestions;
    players: Player[];
    initialized: boolean;
    update(updates: Partial<GameState>): void;
}

export const GameStateContext = React.createContext<GameState>({
    currentQuestion: null,
    gameId: null,
    hostKey: null,
    initialized: false,
    playerKey: null,
    players: [],
    update: () => {},
});

export const GameStateProvider = GameStateContext.Provider;
export const GameStateConsumer = GameStateContext.Consumer;


export interface GameStateComponentProps {
    gameState: GameState;
}

export default function withGameState<T>(Component: React.ComponentClass<GameStateComponentProps>): React.SFC<T> {
    const component: React.SFC<T> = (props: T) => (
        <GameStateConsumer>
            {(state: GameState) =>
                <Component {...props} gameState={state} />
            }
        </GameStateConsumer>
    );
    component.displayName = `withGameState(${Component.displayName})`;
    return component;
}