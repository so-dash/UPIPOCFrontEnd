import React from "react";
import { AlertComponent } from "../components/Alerts";

export interface AlertEntity {
    header: string,
    error: string
}

interface IAlertContainerProps {
    alerts: AlertEntity[]
}

export class AlertContainer extends React.Component<IAlertContainerProps> {
    render() {
        return (<div
            style={{
            position: 'absolute',
            bottom:"1vh",
            left: "1vh",
            }}>
                {this.props.alerts.map((err, index)=>{
                    return <AlertComponent error={err.error} header={err.header} key={index}></AlertComponent>;
                })}
            </div>)
    }
}