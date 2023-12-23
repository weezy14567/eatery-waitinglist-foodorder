import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addCart } from '../../redux/cartSlice';

function AdminOrderedItems(props) {
  const { item, own } = props;
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = async (item) => {
    const existItem = cartItems.find((items) => items._id === item._id);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/dishes/single/${item._id}`
      );
      dispatch(addCart({ ...data, quantity }));
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantity = async (item, newQuantity) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/dishes/single/${item._id}`
      );
      const updatedQuantity = Math.max(newQuantity, 0);

      dispatch(addCart({ ...data, quantity: updatedQuantity }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ margin: '10px', width: '150px' }}>
      <div style={{}}>
        <img
          src={item?.foodImg}
          alt=""
          style={{
            width: '100%',
            minHeight: '120px',
            maxHeight: '120px',
            objectFit: 'cover',
          }}
        />
        <span className="d-flex flex-column" style={{ marginTop: '10px' }}>
          <strong>{`N${item?.price}`}</strong>
          <span>{item?.dishName}</span>
        </span>
        {own === true && (
          <span>
            <Button variant="light" className="btn">
              <RemoveIcon />
            </Button>
            <span>
              {cartItems.length > 0 && (
                <span>
                  {cartItems.find((cart) => (
                    <span>{cart._id === item._id && cart.quantity}</span>
                  ))}
                </span>
              )}
            </span>
            {/* <span>
            {cartItems.length > 0 && (
              <span>
              {cartItems.map((cart)=>(
                <span>
                  {cart._id === item._id && ( `${cart.quantity}`)}
                </span>
              ))}
              </span>
            )}
          </span> */}
            <Button
              onClick={() => handleAddToCart(item)}
              variant="light"
              className="btn"
            >
              <AddIcon />
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

export default AdminOrderedItems;
