import * as React from "react";
import {Breadcrumb, Button, Container, Form, FormControl, Jumbotron, Nav, Navbar} from "react-bootstrap";
// import {Data} from "../upicomponents/invoices";
import { BrowserRouter as Router,Route,Routes} from "react-router-dom";
import { InvoiceDetails } from "../upicomponents/InvoiceDetails";
import { Link } from "react-router-dom";
import { useState } from "react";
export const Table = (props: any)=> {
    
        return (
            <>
                <div className='table'>
                    <table>
                        <tr>
                            <th>S.No.</th>
                            <th>Invoice Id</th>
                            <th>Subscription</th>
                            <th>Invoice Date</th>
                            <th>Billing Period</th>
                            <th>Amount Due</th>
                            <th>Total Amount</th>
                            <th>Type</th>
                            <th>Status</th>

                        </tr>
                        {props.data.map((val: any, key : any) => {
                        return (
                            <tr key={key}>
                            <td>{val.no}</td>
                            <td>{val.status!=="Paid" ? <Link to={`/${val.invoiceNumber}`}>{val.invoiceNumber}</Link> : val.invoiceNumber }</td>
                            <td>{val.subscription}</td>
                            <td>{val.invoiceDate}</td>
                            <td>{val.billingPeriod}</td>
                            <td>{val.amount}</td>
                            <td>{val.totalAmount}</td>
                            <td>{val.type}</td>
                            <td>{val.status}</td>
                            
                            </tr>
                        )
                        })}
                    </table>
                </div>
            </>
        )
    }