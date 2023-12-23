import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addCart } from '../redux/cartSlice';

function Item(props) {
  const { item } = props;
  
  const dispatch = useDispatch();

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
    <div>
      <div style={{ position: 'relative' }} className="item-box">
        <img src={item?.foodImg} alt="" className="item-image" />
        <span className="d-flex flex-column item-details">
          {' '}
          <strong>{`N${item?.price}`}</strong>
          <span>{item?.dishName}</span>
        </span>
        <div style={{ position: 'absolute', right: 0, bottom: 40 }}>
          <RemoveIcon
            onClick={() => increaseQuantity(item, item?.quantity - 1)}
            className=" text-black   bg-body-secondary"
            style={{ borderRadius: '50%', width: '20px', height: '20px' }}
          />

          <span className="fw-bold  text-outline" variant="light">
            {item?.quantity}
          </span>

          <AddIcon
            onClick={() => increaseQuantity(item, item?.quantity + 1)}
            className=" text-black   bg-body-secondary"
            style={{ borderRadius: '50%', width: '20px', height: '20px' }}
          />
        </div>
        
      </div>
      
    </div>
  );
}

export default Item;
