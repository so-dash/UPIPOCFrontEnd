// import React,{ useState,useEffect} from 'react';
import React, {useState,useEffect} from "react";
import {BrowserRouter as Router , Route , Routes} from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { PhonePeApi } from "../api/PhonepeBackend";
import { Header } from "../components/Header";
import { AlertContainer, AlertEntity } from "../containers/AlertContainer";
import { ErrorContext } from "../contexts/ErrorContext";
import { v4 as v4uuid } from "uuid";
import { IInvoiceDetails, InvoiceDetails } from "./InvoiceDetails";
import { PaymentPanel } from "./PaymentPanel";
import {Table} from "../components/Table";
// import {Data} from "./invoices";
import { BrowserRouter } from "react-router-dom"; 
interface Order {
  amount: number;
  orderid: string;
}

export enum ViewStates {
  InvoiceShow,
  SelectPaymentMethod,
  VerifyVpa,
  PollingForStatus,
  TransactionSuccessful,
  TransactionFailed,
  TransactionTimedOut,
  QrInitiate,
}

export enum PaymentMethods {
  Credit,
  UPIQr,
  UPIVpa,
}

const Phonepe = new PhonePeApi(); 

export const UpiRoot = () => {
  const [errors, setErrors] = useState<AlertEntity[]>([]);
  const [view, setView] = useState<ViewStates>(ViewStates.InvoiceShow);
  const [order, setOrder] = useState<Order>({ amount: 0, orderid: "" });
  const [vpa, setVpa] = useState<string>("");
  const [vpaValid, setVpaValid] = useState<boolean>(true);
  const [panelHeading, setPanelHeading] = useState("Pay Now");
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethods.UPIVpa);
  const [qrcodestring, setQrcodestring] = useState("");
  const [shouldPanelOpen, setShouldPanelOpen] = useState(false);
  const [Data, setData] = useState([])
  useEffect(() => {
    //fetching the invoices data from database to show on the homepage 
    const fetchdata =async()=>{
      const res = await fetch(`https://upidemo-4a96e-default-rtdb.firebaseio.com/invoice.json`);
      const invoiceData = await res.json();
      console.log(invoiceData);
      setData(invoiceData);
      
    }
    fetchdata();
  }, [])
  
  const [invoice, setInvoice] = useState<IInvoiceDetails>({
    invoiceNumber: v4uuid(),
    invoiceDate: '03/08/22',
    billingPeriod:'12/07/21-03/07/22',
    amount: 4325.45,
    status: "Pending Due",
  });
  const [status,setStatus]=useState("Pending");
  const errorHandler = (err: string) => {
    setErrors(errors.concat([{error: err, header: "Something went wrong!"}]));
  };

  const alertHandler = (err: string, header: string) => {
    setErrors(errors.concat([{error: err, header: header}]))
  }

  const resetToBeginning = () => {
    setView(ViewStates.InvoiceShow);
    setOrder({ amount: 0, orderid: "" });
    setVpa("");
    setVpaValid(true);
    setPanelHeading("Pay Now");
    setPaymentMethod(PaymentMethods.UPIVpa);
    setQrcodestring("");
    setShouldPanelOpen(false);
    setInvoice({
        invoiceNumber: v4uuid(),
        invoiceDate: '03/08/22',
        billingPeriod:'12/07/21-03/07/22',
        amount: 4325.45,
        status: "Pending Due",
      })
  };



  const payNow = ():any=> {
    let order: Order = {
      amount: invoice.amount,
      orderid: invoice.invoiceNumber,
    };
    setOrder(order);
    setInvoice(invoice);
    setView(ViewStates.SelectPaymentMethod);
    setPanelHeading("Select Payment Method");
  };

  const InitiateCollectRequestQr = () => {
    setView(ViewStates.QrInitiate);
    
  };

  const payByUPI = async(amount: any) => {

    if (paymentMethod == PaymentMethods.UPIQr){

      InitiateCollectRequestQr();
      // fetching the qr string from the backend 
      let response = await fetch(`https://qrservice20221102173907.azurewebsites.net/api/Qr/${amount*100}`)
      // console.log(invoice.amount)
  
      let jresponse = await response.json();
      // console.log(jresponse)
      let qrstring = jresponse["data"]["qrString"];
  
      console.log(qrstring);
      setQrcodestring(qrstring);
      startVaildation(jresponse["data"]["transactionId"])
  

    }   else if (paymentMethod == PaymentMethods.UPIVpa){
      setView(ViewStates.VerifyVpa);
    }

  };
  // Example for some responses:-
  // {"success":true,"code":"PAYMENT_SUCCESS","message":"Your payment is successful.","data":{"merchantId":"MERCHANTUAT","transactionId":"TXe3641597-d96c-4aaf-905b-4a962f463635","providerReferenceId":"T2206221647491682701105","amount":546745,"merchantOrderId":"Me3641597-d96c-4aaf-905b-4a962f463635","paymentState":"COMPLETED","payResponseCode":"SUCCESS"}}
  // {"success":true,"code":"PAYMENT_PENDING","message":"Your request is in pending state.","data":{"merchantId":"MERCHANTUAT","transactionId":"TX71f2e1f2-d301-44c4-afe3-2d904f0f7277","amount":1223,"merchantOrderId":"M71f2e1f2-d301-44c4-afe3-2d904f0f7277","paymentState":"PENDING","payResponseCode":"CREATED"}}
  // {"success":false,"code":"PAYMENT_ERROR","message":"Payment Failed","data":{"merchantId":"MERCHANTUAT","transactionId":"TX71f2e1f2-d301-44c4-afe3-2d904f0f7277","amount":1223,"merchantOrderId":"M71f2e1f2-d301-44c4-afe3-2d904f0f7277","paymentState":"FAILED","payResponseCode":"TIMED_OUT"}}
  const startVaildation = async(transactionId:any)=>{
    // fetching the validation response either transaction is successfull of failed or timeout
      let response = await fetch(`https://qrservice20221102173907.azurewebsites.net/api/status/${transactionId}`)
      let jresponse = await response.json();
      console.log(jresponse)
      if ( jresponse["success"]===true && jresponse["code"]==="PAYMENT_SUCCESS"){
        setView(ViewStates.TransactionSuccessful)
        return ;

      }
      else if ( jresponse["success"]===false && jresponse["code"]==="PAYMENT_ERROR"){
        setView(ViewStates.TransactionTimedOut)
        return;
      }
      else{
        setTimeout(()=>{startVaildation(transactionId)}, 2000); 
      }
       

  }

  const InitiateCollectRequest = () => {
    Phonepe.InitiateCollectRequest(vpa, order.amount, order.orderid).then(
      (r) => {
        if (r.body.resultInfo.resultStatus == "F") {
          errorHandler(r.body.resultInfo.resultMsg);
          setView(ViewStates.TransactionFailed);
        } else {
          setTimeout(PollForStatus, 2000);
        }
      }
    ).catch(e=>{
        errorHandler(e.toString());
        resetToBeginning();
    });
  };

  const PollForStatus = () => {

    Phonepe.GetStatus(invoice.invoiceNumber).then((r) => {
      if (r.body.resultInfo.resultStatus == "TXN_SUCCESS") {
        setView(ViewStates.TransactionSuccessful);
      } else if (r.body.resultInfo.resultStatus == "PENDING") {
        setTimeout(PollForStatus, 2000);
      } else {
        setView(ViewStates.TransactionFailed);
      }
    }).catch(e=>{
        errorHandler(e.toString());
        resetToBeginning();
    });
  };

  const verifyVpa = () => {
    if(vpa==""){
      setVpaValid(false);
      return;
    }
    Phonepe.VerifyVpa(vpa).then((r) => {
      console.log(r.body.valid);
      setVpaValid(r.body.valid);
      if (r.body.valid) {
        InitiateCollectRequest();
        setView(ViewStates.PollingForStatus);
      }
    }).catch(e=>{
        errorHandler(e.toString());
        resetToBeginning();
    });
  };

  const updateVpa = (e: any) => {
    setVpa(e.target.value);
  };
  

  
  return (
    <>
      <AlertContainer alerts={errors} />
      
      <Header />
      {/* {console.log(Data)}; */}
      <></>
      <ErrorContext.Provider value={errorHandler}>
        
        <Router>
          <Routes>
            <Route path='/' element = {<Table data={Data}/>}></Route>
        <Route path ='/:id' element={<><InvoiceDetails  data = {Data} setInvoice={setInvoice} setShouldPanelOpen={setShouldPanelOpen} ViewStates={ViewStates} alertHandler={alertHandler} view={view} paynow={payNow}></InvoiceDetails>
          <PaymentPanel
            amount={invoice.amount}
            isOpen={shouldPanelOpen}
            closePanel={resetToBeginning}
            view={view}
            vpa={vpa}
            updateVpa={updateVpa}
            verifyVpa={verifyVpa}
            setView={setView}
            payByUPI={payByUPI}
            vpaValid={vpaValid}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            qrcodestring={qrcodestring}
          ></PaymentPanel></>}></Route>
        </Routes>
        </Router>
      </ErrorContext.Provider>
    </>
  );
};
