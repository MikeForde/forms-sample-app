import './Toolbar.css';

import {
  Card, Col, Container, Navbar, Row,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ToolbarButtonGroup from './ToolbarButtonGroup';

function Toolbar({ title, buttons, children }) {
  const renderCard = (child, key) => (
    <Card key={key} className="w-auto ms-2">
      <Card.Body className="d-flex justify-content-between align-items-center p-2">
        {child}
      </Card.Body>
    </Card>
  );

  return (
    <Navbar className="toolbar mb-2">
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col lg={2}>
            <Navbar.Brand className="p-2">{title}</Navbar.Brand>
          </Col>
          <Col lg={10} className="p-0 d-flex justify-content-end">
            {
              children && (
                Array.isArray(children)
                  ? children.map((child, index) => child && renderCard(child, index))
                  : renderCard(children)
              )
            }
            {
              renderCard(<ToolbarButtonGroup buttons={buttons} />, 'actionButtons')
            }
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

Toolbar.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape({})),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Toolbar;
