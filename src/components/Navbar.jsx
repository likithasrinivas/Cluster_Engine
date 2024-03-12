import React from "react";
import CustomIcon from "./CustomIcon";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavBar = () => {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/" className="mr-2">
                        <CustomIcon /> <span>Cluster Engine</span>
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/coverage" className="mx-4">
                            Coverage
                        </Nav.Link>
                        <Nav.Link href="/efficiency" className="mx-4">
                            Efficiency
                        </Nav.Link>
                        <Nav.Link href="/dashboard" className="mx-4">
                            Dashboard
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;
