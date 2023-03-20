import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
export default function Header() {

    return (
        <Navbar style={{height:"10vh"}}>
            <Container>
                <Navbar.Brand href="/">
                    <img
                        // Hmm, we shouldn't rely on duckduckgo to provide the logo, especially since we have it as a jpg file...
                        src={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fjobo.sc%2Fwp-content%2Fuploads%2F2019%2F03%2FNature_Seychelles_Logo_270px.png&f=1&nofb=1&ipt=416c280ffa82404a0523d9fe9bce58fcbd425f5f981786d606a672aea7188a22&ipo=images"}
                        width="65"
                        height="50"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link style={{textAlign:'center'}} href="/live">NEST Live Data</Nav.Link>
                        <Nav.Link style={{ textAlign: 'center' }} href="/history">NEST Historical Data</Nav.Link>
                        <Nav.Link style={{textAlign:'center'}} href="/live">NEST Live Data</Nav.Link>
                        <Nav.Link style={{textAlign:'center'}} href="/history">NEST Historical Data</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}