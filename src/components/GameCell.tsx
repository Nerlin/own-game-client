import * as React from "react";
import styled from "styled-components";
import { Question } from "../context/Game";

interface StyledGameCellProps {
    disabled?: boolean;
    question: Question;
    theme: string;
    selectable: boolean;
}

const StyledGameCell = styled.td<StyledGameCellProps>`
    padding: 1rem;
    background: ${props => props.disabled ? "#1e5799" : "#2989d8"};
    color: ${props => props.disabled ? "gray" : "white"};
    width: 30px;
    font-size: 2rem;
    text-align: center;
    
    &:hover {
        ${props => props.selectable && !props.disabled && `
            background: #1e5799;
            cursor: pointer;
        `}
    }
    
    @media(max-width: 450px) {
        font-size: 12pt;
        padding: 5px;
    }
`;


interface GameCellProps extends StyledGameCellProps {
    onSelect(theme: string, question: Question): void;
}

class GameCell extends React.Component<GameCellProps> {
    public render() {
        return <StyledGameCell
            disabled={this.props.disabled}
            question={this.props.question}
            theme={this.props.theme}
            selectable={this.props.selectable}
            onClick={this.select}
        >
            {this.props.children}
        </StyledGameCell>;
    }

    protected select = () => {
        if (this.props.selectable && !this.props.disabled) {
            this.props.onSelect(
                this.props.theme,
                this.props.question
            );
        }
    }
}


export default GameCell;