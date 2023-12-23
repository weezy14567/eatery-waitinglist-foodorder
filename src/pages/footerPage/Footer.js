import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

function Footer() {
  return (
    <div>
      <Row>
        <Col md={4}>
          <div>
            <strong>Contact Us:</strong>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Col>
        <Col md={4}></Col>
        <Col md={4}></Col>
      </Row>
    </div>
  );
}

export default Footer;
