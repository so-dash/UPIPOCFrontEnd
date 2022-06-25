import { Spinner } from "react-bootstrap";

export const LoadingElement = () => {
    return <div style={{textAlign:"center"}}>
        <Spinner animation="grow" variant="info" />
    </div>
}