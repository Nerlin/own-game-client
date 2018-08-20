import * as React from "react";
import styled from "styled-components";
import FormInput from "./FormInput";
import GameError from "./GameError";


const ConnectFormContainer = styled.div`
    padding: 1rem;
`;

export interface GameConnection {
    gameUUID: string;
    playerName: string;
}

export interface ConnectFormProps {
    initial?: GameConnection;
    error?: string;
    onConnect(result: GameConnection): void;
}

export default class ConnectForm extends React.Component<ConnectFormProps, GameConnection> {
    public constructor(props: ConnectFormProps) {
        super(props);
        this.state = props.initial || {
            gameUUID: "",
            playerName: ""
        };
    }


    public render() {
        return (
            <ConnectFormContainer>
                {this.props.error &&
                <GameError>{this.props.error}</GameError>
                }

                <FormInput
                    label={"Game UUID"}
                    value={this.state.gameUUID}
                    onChange={this.handleUUIDChange}
                />

                <FormInput
                    label={"Player name"}
                    value={this.state.playerName}
                    onChange={this.handlePlayerChange}
                />

                <button onClick={this.connect}>Connect</button>
            </ConnectFormContainer>
        );
    }

    private handleUUIDChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({ gameUUID: event.currentTarget.value });
    }

    private handlePlayerChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({ playerName: event.currentTarget.value });
    }

    private connect = () => {
        this.props.onConnect({...this.state});
    }
}