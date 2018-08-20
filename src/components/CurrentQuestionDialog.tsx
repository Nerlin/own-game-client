import * as React from "react";
import styled from "styled-components";
import withGameState, { GameStateComponentProps, Question } from "../context/Game";

const CurrentQuestionDialogContainer = styled.div<{
    busy: boolean;
}>`
    padding: 1rem;
    background: ${props => props.busy ? "lightgray" : "white"};
`;

const CurrentQuestion = styled.div`
    text-align: center;
    font-size: 16pt;
    white-space: pre-line;
`;

const CurrentAnsweringPlayer = styled.div`
    padding: 1rem 0;
`;

const CurrentAnsweringPlayerName = styled.span`
    font-weight: bold;
`;

const QuestionHostButtons = styled.div`
    display: flex;
    padding: 1rem 0;
`;

const QuestionAcceptButton = styled.button`
    color: darkgreen;
`;

const QuestionDeclineButton = styled.button`
    color: darkred;
`;

const QuestionSkipButton = styled.button`
    color: darkgray;
`;


interface CurrentQuestionDialogProps {
    question: Question;
    onAccept(question: Question): void;
    onDecline(question: Question): void;
    onSkip(question: Question): void;
    onAnswer(question: Question): void;
}

class CurrentQuestionDialog extends React.Component<CurrentQuestionDialogProps & GameStateComponentProps> {
    public render() {
        const {question} = this.props;
        const {hostKey} = this.props.gameState;
        return (
            <CurrentQuestionDialogContainer
                busy={!!question.answeringPlayer}
                onClick={this.answer}
            >
                <CurrentQuestion>{question.text}</CurrentQuestion>

                {question.answeringPlayer &&
                <CurrentAnsweringPlayer>
                    Answering: {" "}
                    <CurrentAnsweringPlayerName>{question.answeringPlayer.name}</CurrentAnsweringPlayerName>
                </CurrentAnsweringPlayer>
                }

                {hostKey &&
                    <QuestionHostButtons>
                        {question.answeringPlayer &&
                        <QuestionAcceptButton onClick={this.accept}>Accept</QuestionAcceptButton>
                        }

                        {question.answeringPlayer &&
                        <QuestionDeclineButton onClick={this.decline}>Decline</QuestionDeclineButton>
                        }

                        <QuestionSkipButton onClick={this.skip}>Skip</QuestionSkipButton>
                    </QuestionHostButtons>
                }
            </CurrentQuestionDialogContainer>
        );
    }

    protected accept = () => {
        this.props.onAccept(this.props.question);
    }

    protected decline = () => {
        this.props.onDecline(this.props.question);
    }

    protected skip = () => {
        this.props.onSkip(this.props.question);
    }

    protected answer = () => {
        if (this.props.gameState.playerKey && !this.props.question.answeringPlayer) {
            this.props.onAnswer(this.props.question);
        }
    }
}

export default withGameState<CurrentQuestionDialogProps>(CurrentQuestionDialog);