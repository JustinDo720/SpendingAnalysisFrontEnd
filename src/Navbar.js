import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";

export default function SANav(){
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary mb-3">
            <Container>
                <Navbar.Brand as={Link} to='/'>
                    <img
                        src="sa_logo.png"
                        width="60"
                        height="60"
                        className="d-inline-block align-top"
                        alt="SA logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to='/'>Home</Nav.Link>
                    <Nav.Link as={Link} to='/reports'>Reports</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

