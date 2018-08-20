import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { compose } from "recompose";
import styled from "styled-components";
import CurrentQuestionDialog from "../components/CurrentQuestionDialog";
import GameCell from "../components/GameCell";
import GameError from "../components/GameError";
import GameRow from "../components/GameRow";
import PlayerScoreboard from "../components/PlayerScoreboard";
import ThemeCell from "../components/ThemeCell";
import { Player, Question, ThemeQuestions } from "../context/Game";
import withGameLocalStorage, { GameLocalStorageProps } from "../context/GameLocalStorage";
import withGameSocket, { GameSocketProps } from "../context/GameSocket";


interface GamePageProps extends GameSocketProps, GameLocalStorageProps, RouteComponentProps<{
    gameUUID: string
}> {}

interface GameServerCurrentQuestion {
    text: string;
    score: number;
    disabled: boolean;
    answering_player: Player;
}

interface GameSyncMessage {
    players: Player[];
    themes_questions: ThemeQuestions;
    current_question: GameServerCurrentQuestion;
    is_over: boolean;
}

interface GamePageState {
    error: string;
}

const GameBoard = styled.div``;

const QuestionBoardTable = styled.table`
    margin-right: 1rem;
`;

const QuestionBoard: React.SFC = ({ children }) => (
    <QuestionBoardTable>
        <tbody>{children}</tbody>
    </QuestionBoardTable>
);

const GameBoardPlayers = styled.div`
    margin: 1rem;
    border-top: 1px solid gray;
    
    @media(max-width: 450px) {
        margin: 1rem 0 0 5px;
    }
`;


class GamePage extends React.Component<GamePageProps, GamePageState> {
    public state: GamePageState = {
        error: ""
    };

    public render() {
        const {playerKey, hostKey, gameId} = this.props.gameState;

        if (!playerKey && !hostKey || !gameId) {
            return <Redirect to={"/"}/>;
        }

        const {error} = this.state;
        const {themesQuestions, currentQuestion, players} = this.props.gameState;
        return (
            <GameBoard>
                {error &&
                <GameError>{error}</GameError>
                }

                {currentQuestion ?
                <CurrentQuestionDialog
                    question={currentQuestion}
                    onAccept={this.acceptAnswer}
                    onDecline={this.declineAnswer}
                    onSkip={this.skipQuestion}
                    onAnswer={this.answer}
                />
                : themesQuestions &&
                <QuestionBoard>
                    {Object.keys(themesQuestions).map(theme =>
                    <GameRow key={theme}>
                        <ThemeCell>{theme}</ThemeCell>
                        {themesQuestions[theme].map((question, index) =>
                        <GameCell
                            key={index}
                            disabled={question.disabled}
                            question={question}
                            theme={theme}
                            selectable={!!hostKey}
                            onSelect={this.selectCell}
                        >
                            {question.score}
                        </GameCell>
                        )}
                    </GameRow>
                    )}
                </QuestionBoard>
                }

                <GameBoardPlayers>
                    <PlayerScoreboard players={players}/>
                </GameBoardPlayers>
            </GameBoard>
        );
    }

    public componentDidMount() {
        this.subscribeToSync();
        this.subscribeToErrors();
        this.subscribeToQuestionSelection();
        this.subscribeToAnsweringPlayerSelection();
        this.subscribeToPlayerJoining();
        this.subscribeToPlayerLeaving();

        this.connect();
    }

    protected selectCell = (theme: string, question: Question) => {
        this.props.gameSocket.emit("select_question", {
            game_id: this.props.gameState.gameId,
            host_key: this.props.gameState.hostKey,
            score: question.score,
            theme,
        });
    }

    protected acceptAnswer = () => {
        this.props.gameSocket.emit("accept_answer", {
            game_id: this.props.gameState.gameId,
            host_key: this.props.gameState.hostKey
        });
    }

    protected declineAnswer = () => {
        this.props.gameSocket.emit("decline_answer", {
            game_id: this.props.gameState.gameId,
            host_key: this.props.gameState.hostKey
        });
    }

    protected skipQuestion = () => {
        this.props.gameSocket.emit("skip_question", {
            game_id: this.props.gameState.gameId,
            host_key: this.props.gameState.hostKey
        });
    }

    protected answer = () => {
        this.props.gameSocket.emit("select_answering_player", {
            game_id: this.props.gameState.gameId,
            player_key: this.props.gameState.playerKey
        });
    }

    protected disconnect = () => {
        if (this.props.gameState.playerKey) {
            this.props.gameSocket.emit("leave_game", {
                game_id: this.props.gameState.gameId,
                player_key: this.props.gameState.playerKey,
            });
        }

        this.props.purge();
    }

    private connect() {
        const gameId = this.props.gameState.gameId!;
        const payload: Record<string, string> = { game_id: gameId };
        const hostKey = this.props.gameState.hostKey;
        if (hostKey) {
            payload.host_key = hostKey;
        } else {
            const playerKey = this.props.gameState.playerKey;
            if (playerKey) {
                payload.player_key = playerKey;
            }
        }

        this.props.gameSocket.emit("sync", payload);
    }

    private subscribeToPlayerLeaving() {
        this.props.gameSocket.on("player_left", (players: Player[]) => {
            this.props.gameState.update({
                players
            });
        });
    }

    private subscribeToPlayerJoining() {
        this.props.gameSocket.on("player_joined", (players: Player[]) => {
            this.props.gameState.update({
                players
            });
        });
    }

    private subscribeToAnsweringPlayerSelection() {
        this.props.gameSocket.on("selected_answering_player", (player: Player) => {
            this.props.gameState.update({
                currentQuestion: this.props.gameState.currentQuestion ? {
                    ...this.props.gameState.currentQuestion,
                    answeringPlayer: player
                } : null
            });
        });
    }

    private subscribeToQuestionSelection() {
        this.props.gameSocket.on("question_selected", (question: Question) => {
            this.props.gameState.update({
                currentQuestion: question
            });
        });
    }

    private subscribeToErrors() {
        this.props.gameSocket.on("fail", ({ error }: any) => {
            this.setState({ error });
        });
    }

    private subscribeToSync() {
        this.props.gameSocket.on("synced", (message: GameSyncMessage) => {
            this.props.gameState.update({
                currentQuestion: message.current_question ? {
                    answeringPlayer: message.current_question.answering_player,
                    disabled: message.current_question.disabled,
                    score: message.current_question.score,
                    text: message.current_question.text,
                } : null,
                players: message.players,
                themesQuestions: message.themes_questions,
            });
        });
    }
}

export default compose(
    withGameLocalStorage,
    withGameSocket
)(GamePage);