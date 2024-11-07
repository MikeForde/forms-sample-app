import './Header.css';

import {
  Col, Container, Image, Navbar, NavDropdown, Row,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

function Header({ email, onLogout }) {
  return (
    <header>
      <Navbar>
        <Container fluid>
          <Row className="w-100">
            <Col>
              <Navbar.Brand>
                <Image src="../assets/images/OT.png" />
              </Navbar.Brand>
            </Col>
            <Col xs="auto">
              <NavDropdown title={email}>
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </header>
  );
}

Header.propTypes = {
  email: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
