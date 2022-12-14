import React, { useState, useEffect }  from "react";
import { Button, Container } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import { propTypes } from "react-bootstrap/esm/Image";
import { useLocation } from "react-router-dom";
import axios from "axios";
// import{Data} from "./invoices"/;
// const fs = require('fs-extra');

export interface IInvoiceDetails {
  amount: number;
  billingPeriod: string;
  invoiceNumber: string;
  invoiceDate: string;
  status: string;
  paynow?: () => any;
}


export const InvoiceDetails = (props: any) => {
  //fetching the unique invoice numer to access its details 
  let UID = useLocation().pathname.split('/')[1]
  const [invoice,setinvoice] = useState(props.data.filter((invoice: any)=> invoice.invoiceNumber==UID)[0])
  props.setInvoice(invoice);
  console.log(invoice)
  useEffect(() => {
    if (props.view==props.ViewStates.TransactionSuccessful){
      props.setShouldPanelOpen(false);
      setinvoice((prev: any)=> ({...prev,status: "Paid"}));

      const newData = props.data.map((x:  any)=>{
        if (x.invoiceNumber===invoice.invoiceNumber){
          return {...x,status: "Paid"};
        }
        else{
          return x;
        }
      })
      const updateData = async()=>{
        await axios.put('https://upidemo-4a96e-default-rtdb.firebaseio.com/invoice.json',newData)
      }
      updateData();
      props.alertHandler("Payment was successfully received", "Success")
  } else if(props.view!==props.ViewStates.InvoiceShow){
      props.setShouldPanelOpen(true);
  }
}, [props.view])
  return (
    <>
      <Container fluid>
        <h3>{invoice.invoiceNumber}</h3>
        <h6>Invoice details</h6>
        <Button variant="link">
          Download Invoice <Icons.ArrowDown />
        </Button>
        <hr />
      </Container>

      <Container fluid className="p-4">
        <h6>Invoice Summary</h6>
        <table>
          <tbody>
            <tr>
              <td>
                <h3>&#8377; {invoice.amount}</h3>
              </td>
              <td>
                <Button
                
                  size="sm"
                  onClick={props.paynow}
                  disabled={invoice.status == "Paid"}>
                  Pay Now
                </Button>
              </td>
            </tr>
            <tr>
              <td>Total Amount:</td>
              <td>&#8377; {invoice.amount}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>{invoice.status}</td>
            </tr>
            <tr>
              <td>Billing Period:</td>
              <td>{invoice.billingPeriod}</td>
            </tr>
            <tr>
              <td>Document Date:</td>
              <td>{invoice.invoiceDate}</td>
            </tr>
            <tr>
              <td>Document No:</td>
              <td>{invoice.invoiceNumber}</td>
            </tr>
          </tbody>
        </table>
      </Container>
      <hr />
    </>
  );
};
