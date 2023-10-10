import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { userStateContext } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import axiosClient from "../axios";

export default function CustomerNavbar() {
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
                    <Navbar.Brand as={Link} to={"/"}>Bank managment</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to={"/transfer"}>Transfer money</Nav.Link>
                            <Nav.Link as={Link} to={"/history"}>Transaction history</Nav.Link>
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
