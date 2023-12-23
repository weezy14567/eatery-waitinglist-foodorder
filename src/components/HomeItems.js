import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../redux/cartSlice';

function HomeItems(props) {
  const { dish } = props;

  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = async (product) => {
    const existItem = cartItems.find((item) => item._id === product._id);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/dishes/single/${product._id}`
      );
      dispatch(addCart({ ...data, quantity }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-3">
      <Card>
        <Row className="p-1">
          <Col md={8} className="d-flex flex-column gap-2">
            <img
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              src={dish?.foodImg}
              alt=""
            />
          </Col>
          <Col md={4}>
            <div
              className="d-flex flex-column  justify-content-center gap-1"
              style={{ border: '1px solid gree', height: '100%' }}
            >
              <strong className="fs-5 text-capitalize">{dish?.dishName}</strong>
              <strong>{`N${dish?.price.toFixed(2)}`}</strong>
              {<span>
                <Button variant="light" className="btn">
                  <RemoveIcon />
                </Button>
                <span>
                  {cartItems?.map((item) =>
                    item._id === dish._id ? `${item?.quantity}` : ''
                  )}
                </span>
                <Button variant="light" className="btn">
                  <AddIcon />
                </Button>
              </span>}
              <div className="d-grid">
                <Button
                  onClick={() => handleAddToCart(dish)}
                  disabled={dish?.isAvailable === false}
                  variant="white"
                  className="bg-danger fw-bold text-white"
                >
                  Add To Cart
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default HomeItems;
