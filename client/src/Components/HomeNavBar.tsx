import { Nav, Container, Navbar } from 'react-bootstrap'
import { Switch, Route } from 'react-router';
import PlayScreen from './PlayScreen'

const HomeNavbar = () => {
  return (
    <div className='home-navbar'>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/home">BadukBin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/play">Play</Nav.Link>
              <Nav.Link href="/study">Study</Nav.Link>
              <Nav.Link href="/discover">Discover</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Switch>
        <Route
          path="/play"
          component={PlayScreen}
        />
      </Switch>
    </div>
  )
}

export default HomeNavbar;
