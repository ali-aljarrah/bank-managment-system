import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { userStateContext } from "../context/ContextProvider";
import { Link, useLocation } from "react-router-dom";
import axiosClient from "../axios";

export default function AdminNavbar() {
    const location = useLocation();
    const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext();

    const logout = (e) => {
        e.preventDefault();
        axiosClient.post("/logout").then((res) => {
            setCurrentUser({});
            setUserToken(null);
        });
      };
    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to={"/adminDashboard"}>Bank managment</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav activeKey={location.pathname} className="me-auto">
                            <Nav.Link as={Link} to={"/adminDashboard/customers"} href="/adminDashboard/customers">Customers</Nav.Link>
                            <Nav.Link as={Link} to={"/adminDashboard/customersAccounts"} href="/adminDashboard/customersAccounts">Customers accounts</Nav.Link>
                            <Nav.Link as={Link} to={"/adminDashboard/adminDeposit"} href="/adminDashboard/adminDeposit">Deposit money</Nav.Link>
                            <Nav.Link as={Link} to={"/adminDashboard/adminHistory"} href="/adminDashboard/adminHistory">Transaction history</Nav.Link>
                        </Nav>
                        <Nav>
                            <div className="text-start text-lg-end mt-3 mt-lg-0">
                                <a className="btn btn-danger fw-bold" href="#" onClick={(e) => logout(e)}>
                                    Logout
                                </a>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
