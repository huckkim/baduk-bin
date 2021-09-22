import { Nav,NavDropdown, Container, Navbar } from 'react-bootstrap'

const HomeNavbar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">BadukBin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#href">Home</Nav.Link>
            <NavDropdown title="Play" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Create</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Join</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default HomeNavbar;
