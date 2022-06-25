// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import {Breadcrumb, Button, Container, Form, FormControl, Jumbotron, Nav, Navbar} from "react-bootstrap";

import * as Icons from "react-bootstrap-icons";



const style = {
  backgroundColor: "rgb(100,100,100)"
}

const heading={
  width: 100 ,
  height: 100 ,
}
export class Header extends React.Component {

    public render() {
        return (
            <>
            <Navbar style={style} variant="dark">
    <Navbar.Brand><Icons.List/></Navbar.Brand>
    <Navbar.Brand href="#">Microsoft Azure</Navbar.Brand>
    <Form.Control placeholder="Search resources and services"></Form.Control>
    <Nav>
      <Nav.Link>sosharma@microsoft.com</Nav.Link>
    </Nav>
  </Navbar>
  <Breadcrumb>
  <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/">Cost Management + Billing</Breadcrumb.Item>
</Breadcrumb>
<Navbar.Brand><h2>Cost Management + Billing | Invoices ... </h2></Navbar.Brand>


  </>
        )
    }
}