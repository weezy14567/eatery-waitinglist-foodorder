import React from 'react';
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import HomeItems from '../../components/HomeItems';
import Item from '../../components/Item';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import { clearCart } from '../../redux/cartSlice';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Cart(props) {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const { setOpen } = props;
  const dispatch = useDispatch();
  const orderTotal = cartItems?.reduce((a, c) => a + c.price * c.quantity, 0);

  const handleSumbmitOrder = async () => {
    const formData = {
      orderedItems: cartItems,
      customerId: userInfo._id,
      orderTotal: orderTotal,
    };
    try {
     await axios.post(
        `http://localhost:8080/api/waitinglist/createorder`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      await axios.put(
        `http://localhost:8080/api/users/joinQueue/${userInfo?._id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      setOpen(false);
      window.location.reload()
      dispatch(clearCart());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ width: '', height: '', margin: 'auto' }}
    >
      {cartItems.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <Card>
            <div className="d-flex justify-content-between align-items-center mt-3 mx-3">
              <div>
                <h3>Cart Items({cartItems?.length})</h3>
              </div>
              <div>
                <h5 style={{ borderBottom: '2px solid grey' }}>
                  Total:{' '}
                  {` N${cartItems
                    ?.reduce((a, c) => a + c.price * c.quantity, 0)
                    .toFixed(2)}`}
                </h5>
              </div>
            </div>
            <Card.Body style={{ overflowY: 'scroll' }}>
              {' '}
              <div className="item-container">
                {cartItems.map((item) => (
                  <div key={item._id}>
                    <Item item={item} />
                  </div>
                ))}
              </div>
            </Card.Body>
            <div
              style={{ borderTop: '1px grey solid' }}
              className="d-flex flex-column mt-4 mx-3 my-3"
            >
              <strong>please comfirm your order</strong>
              <div className="">
                <span>Note: You cant edit after comfirming your order</span>
              </div>
              <div className="">
                <Button
                  variant="white"
                  className="bg-success fw-bold text-white"
                  onClick={handleSumbmitOrder}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div style={{ marginTop: '30px' , }}>
          <Card style={{  height:"400px", position:"relative"}}>
           <strong style={{  borderBottom:"1px solid grey"}} className='text-center fw-bold fs-5 mt-3'>Cart Page</strong>
            <Card.Body  className='d-flex flex-column justify-content-center'>
            <div className="d-flex justify-content-between align-items-center mt-3 mx-3">
              <div>
                <h3 style={{  opacity:"0.7"}}>Cart is empty, order food to see your items here</h3>
              </div>
            
            </div>
            </Card.Body>
            <div
              style={{ borderTop: '1px grey solid' }}
              className="d-flex flex-column mt-4 mx-3 my-3"
            >
              <strong>Order your food or join the quene to request for a waiter</strong>
              <div  className="">
                <span >Note: When you join the quene or make an order, you will see your order progress at the top of  the navigation bar.</span>
              </div>
              <div className="">
                <Button
                  variant="white"
                  className="bg-success fw-bold text-white"
                  onClick={handleSumbmitOrder}
                >
                  Confirm
                </Button>
              </div>
            </div>
          <div onClick={()=>setOpen(false)} style={{ position:"absolute", top:10, left:30, cursor:"pointer" }}>  <ArrowBackIosIcon/></div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Cart;
