import * as React from "react";
import { Panel } from "@fluentui/react/lib/Panel";
import {
  Card,
  InputGroup,
  Button,
  FormControl,
  Form,
  Container,
  ListGroup
} from "react-bootstrap";
import Countdown from "react-countdown";
import { LoadingElement } from "../components/LoadingElement";
import Success from "../assets/check.png";
import Failure from "../assets/close.png";
import NetBankingIcon from "../assets/bank.png";
import UpiIcon from "../assets/upi.png";
import QrcodeIcon from "../assets/qrcode.png";
import WalletIcon from "../assets/wallet.png";
import CardIcon from "../assets/creditcard.png";
import { PaymentMethods, ViewStates } from "./UpiRoot";
import QrCode from "react-qr-code";

export interface IPaymentPanel {
  isOpen: boolean;
  closePanel: () => any;
  view: ViewStates;
  setView: (viewname: ViewStates) => any;
  payByUPI: (amount : any) => any;
  vpa: string;
  updateVpa: (e: any) => any;
  vpaValid: boolean;
  verifyVpa: () => any;
  panelHeading?: string;
  paymentMethod: PaymentMethods;
  setPaymentMethod: (pm: PaymentMethods) => any;
  qrcodestring: string;
  amount: any;
}

export const PaymentPanel = (props: IPaymentPanel) => {
  const renderSwich = (view: ViewStates) => {
    switch (view) {
      case ViewStates.InvoiceShow:
        return <></>;
      case ViewStates.PollingForStatus:
        return (
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Check your application</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Open your payment application and authorize transaction by
                entering your UPI PIN.
              </Card.Subtitle>
              <Card.Text>
                <LoadingElement></LoadingElement>
                <Countdown
                  date={Date.now() + 5000 * 60}
                  renderer={renderer}
                  zeroPadDays={2}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case ViewStates.SelectPaymentMethod:
        return (
          <>
            <Container fluid>
                <ListGroup>
                <ListGroup.Item action disabled>
                        <img src={NetBankingIcon} className="paymentmethodicon" ></img>
                        <span className="paymentmethodname">Internet Banking</span>
                    </ListGroup.Item>
                    <ListGroup.Item action disabled>
                        {/* // action 
                        // active={props.paymentMethod==PaymentMethods.UPIVpa} 
                        // onClick={() => props.setPaymentMethod(PaymentMethods.UPIVpa)}> */}
                        <img src={UpiIcon} className="paymentmethodicon" ></img>
                        <span className="paymentmethodname">UPI</span>
                    </ListGroup.Item>
                    <ListGroup.Item 
                        action 
                        active={props.paymentMethod==PaymentMethods.UPIQr}
                        onClick={() => props.setPaymentMethod(PaymentMethods.UPIQr)}
                        >
                        <img src={QrcodeIcon} className="paymentmethodicon" ></img>
                        <span className="paymentmethodname">UPI with QR</span>
                    </ListGroup.Item>
                    <ListGroup.Item action disabled>
                        <img src={WalletIcon} className="paymentmethodicon" ></img>
                        <span className="paymentmethodname">Wallets</span>
                    </ListGroup.Item>
                    <ListGroup.Item action disabled>
                        <img src={CardIcon} className="paymentmethodicon" ></img>
                        <span className="paymentmethodname">Credit/Debit cards</span>
                    </ListGroup.Item>
                </ListGroup>
            </Container>
            <hr />
            <div style={{ bottom: "5%", position: "fixed" }}>
              <Button onClick={()=>props.payByUPI(props.amount)}>Pay</Button>
            </div>
          </>
        );
      // case ViewStates.VerifyVpa:
      //   return (
      //     <>
      //       <Card style={{ width: "18rem" }}>
      //         <Card.Body>
      //           <Card.Title>VPA details</Card.Title>
      //           <Card.Subtitle className="mb-2 text-muted">
      //             Enter your vpa details!
      //           </Card.Subtitle>
      //           <Card.Text>
      //             <InputGroup className="mb-3">
      //               <FormControl
      //                 placeholder="Enter VPA"
      //                 aria-label="VPA"
      //                 aria-describedby="basic-addon1"
      //                 value={props.vpa}
      //                 onChange={props.updateVpa}
      //                 isInvalid={!!!props.vpaValid}
      //               />
      //               <Form.Control.Feedback type="invalid">
      //                 {"Please check the entered VPA again!"}
      //               </Form.Control.Feedback>
      //             </InputGroup>
      //           </Card.Text>
      //           <Button onClick={props.verifyVpa}>Verify and pay</Button>
      //         </Card.Body>
      //       </Card>
      //     </>
      //   );
      case ViewStates.QrInitiate:
        return (
          <>
            <Container>
              {props.qrcodestring == "" ? (
                <>
                  <LoadingElement></LoadingElement>
                  <div className="vcontainer">Loading QR code</div>
                </>
              ) : (
                <>
                  <QrCode value={props.qrcodestring}></QrCode>
                  <div className="vcontainer">
                    Please scan the QR code shown above with any UPI application
                    to pay.{" "}
                    
                  </div>
                <Card.Text>
                <div>
                <LoadingElement></LoadingElement>
                <Countdown date={Date.now() + 3000 * 60} renderer={renderer} zeroPadDays={2}/>
                </div>
                </Card.Text>
                
                </>
              )}
            </Container>
          </>
        );
      case ViewStates.TransactionSuccessful:
        return (
          <>
            <>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Transaction Successful</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Your payment was received.
                  </Card.Subtitle>
                  <Card.Text>
                    <img src={Success} width="100%"></img>
                  </Card.Text>
                </Card.Body>
              </Card>
            </>
          </>
        );
      case ViewStates.TransactionTimedOut:
        return (
          <>
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Transaction Timed out</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Looks like you did not interact with the payment request!
                </Card.Subtitle>
                <Card.Text>
                  <img src={Failure} width="100%"></img>
                </Card.Text>
              </Card.Body>
            </Card>
          </>
        );
      case ViewStates.TransactionFailed:
        return (
          <>
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Transaction Failed</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  We did not receive payment. If you did not decline the
                  transaction and your account was debited, rest assured, your
                  money will be refunded!
                </Card.Subtitle>
                <Card.Text>
                  <img src={Failure} width="100%"></img>
                </Card.Text>
              </Card.Body>
            </Card>
          </>
        );
      default:
        return <></>;
    }
  };

  const renderer = ({ minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a complete state
      props.setView(ViewStates.TransactionTimedOut);
      return <></>;
    } else {
      // Render a countdown
      return (
        <div className="vcontainer">
          <h1>
            {minutes}:{seconds}
          </h1>
        </div>
      );
    }
  };
  return (
    <div>
      <br />
      <br />
      <Panel
        isLightDismiss
        isOpen={props.isOpen}
        onDismiss={props.closePanel}
        closeButtonAriaLabel="Close"
        headerText={props.panelHeading ?? "Pay Now"}
      >
        <hr/>
        {renderSwich(props.view)}
      </Panel>
    </div>
  );
};
