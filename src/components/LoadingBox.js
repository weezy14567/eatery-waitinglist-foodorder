import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function LoadingBox() {
  return (
    <div style={{width:"100%", height:"50vh"}} className='d-flex flex-column justify-content-center align-items-center'>
      <Spinner animation="border" variant="danger" />
    </div>
  );
}

export default LoadingBox;
