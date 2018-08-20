import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";


const DialogContainer = styled.dialog``;


export default class Dialog extends React.Component<{}> {
    private readonly domNode: HTMLElement;

    constructor(props: {}) {
        super(props);
        this.domNode = document.getElementById("#dialogs")!;
    }

    public render() {
        return ReactDOM.createPortal(
            <DialogContainer>
                {this.props.children}
            </DialogContainer>,
            this.domNode
        );
    }
}