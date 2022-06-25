import React from "react";
import { Toast } from "react-bootstrap";

export interface AlertComponentProps {
    error: string,
    header: string
}

interface IAlertComponentState {
    error: string,
    show: boolean,
    header: string
}

export class AlertComponent extends React.Component<AlertComponentProps, IAlertComponentState> {

    constructor(props: AlertComponentProps) {
        super(props);
        this.state = {
            error: props.error,
            show: true,
            header: props.header
        }
    }
    
    private dissmissErrorToggle = () => {
        this.setState({...this.state, show: false});
    }
    

    render() {
        return (
                <Toast
                    onClose={this.dissmissErrorToggle}
                    show={this.state.show} delay={3000}  
                    autohide
                >
                  <Toast.Header>
                    <img
                      src="holder.js/20x20?text=%20"
                      className="rounded mr-2"
                      alt=""
                    />
                    <strong className="mr-auto">{this.state.header}</strong>
                  </Toast.Header>
                  <Toast.Body>{this.state.error}</Toast.Body>
                </Toast>
          );
    }
}
