import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import AdminOrderedItems from './AdminOrderedItems';
import { clearCart } from '../../redux/cartSlice';
import { Link} from 'react-router-dom';
import { singleOrder } from '../../redux/userSlice';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


function AttendantInfo(props) {
  const { userInfo, singleOrderId } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const { singleAttendantOrders, handleMobileSwitch } = props;
  const [dishes, setDishes] = useState([]);
  const [attendedOrders, setAttendedOrders] = useState([]);
  const dispatch = useDispatch();

  const orderTotal = cartItems?.reduce((a, c) => a + c.price * c.quantity, 0);

  const handleSumbmitOrder = async () => {
    const formData = {
      orderedItems: cartItems,
      customerId: userInfo?._id,
      orderTotal: orderTotal,
    };
    try {
      const { data } = await axios.post(
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

      dispatch(clearCart());
      dispatch(singleOrder(data.customerId));
    } catch (error) {
      console.log(error);
    }
  };

  const allDishes = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/dishes/all`);
      setDishes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const singleAttendantOrders = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/waitinglist/attendantorders/${userInfo?._id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setAttendedOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (!singleOrderId) {
      singleAttendantOrders();
    }
  }, [userInfo, singleOrderId]);

 

 console.log("attendant orders",attendedOrders);

  return (
    <div>
      <h6 className="text-center" style={{ borderBottom: '1px solid grey' }}>
        Attendant Info
      </h6>

      <div className="d-flex gap-3 align-items-center">
      <div className='d-md-none' onClick={handleMobileSwitch} style={{cursor:"pointer"}}>
                <ArrowBackIosIcon />
                </div>
        <div style={{ width: '70px', height: '70px' }}>
          <img
            src={userInfo?.avatar ? userInfo?.avatar : '/images/review.jpg'}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '1px solid grey',
            }}
          />
        </div>
        <div className="d-flex flex-column item-details">
          <strong>{userInfo?.username}</strong>
          <span>online</span>
        </div>
      </div>
      <div
        style={{
          borderBottom: '1px solid grey', 
        }}
        className="mt-5 d-flex  justify-content-center pb-3"
      >
        <Button
          style={{ borderRadius: '50%', width: '50px', height: '50px' }}
          variant="light"
          className="bg-secondary text-white"
          title="Notifications"
        >
          <NotificationsActiveIcon />
        </Button>
        <Button
          style={{ borderRadius: '50%', width: '50px', height: '50px' }}
          variant="light"
          className="bg-secondary text-white"
          title="Messages"
        >
          <EmailIcon />
        </Button>
        <Button
          style={{ borderRadius: '50%', width: '50px', height: '50px' }}
          variant="light"
          className="bg-secondary text-white"
          title="Search"
        >
          <SearchIcon />
        </Button>
        <Button
          style={{ borderRadius: '50%', width: '50px', height: '50px' }}
          variant="light"
          className={
            dishes[0]?._id ? 'bg-danger text-white' : 'bg-secondary text-white'
          }
          title="Take-Order"
          onClick={allDishes}
        >
          <DinnerDiningIcon />
        </Button>
        <Button
          style={{ borderRadius: '50%', width: '50px', height: '50px' }}
          variant="light"
          className={
            dishes[0]?._id ? 'bg-secondary text-white' : 'bg-danger text-white'
          }
          title="Logout"
          onClick={handleLogout}
        >
          <LockIcon />
        </Button>
      </div>

      <div className="mt-3 BG text-center">
        
          <Link className="fw-bold text-black-50" onClick={()=>{ singleAttendantOrders(userInfo._id)}}>
            {' '}
            see your orders{' '}
          </Link>
       
        { singleOrderId === null && attendedOrders?.ordersAndCustomers?.length > 0 &&(
          <div className="  text-center">
            {' '}
            Your order history in the last 12hrs
            <div
              style={{ position: 'relative', height: '55px' }}
              className="d-flex  p-2 "
            >
              {attendedOrders?.ordersAndCustomers
                ?.slice(0, 17)
                .map((item, index) => (
                  <img
                  key={index}
                    style={{
                      position: 'absolute',
                      left: `${index * 21}px`,
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid grey',
                    }}
                    src={item.avatar ? item.avatar : '/images/user.png'}
                    alt=""
                  />
                ))}
            </div>
           
          </div>
        ) }
      </div>

      {cartItems?.length > 0 && (
        <div style={{ borderBottom: '1px solid grey' }}>
          <div className="BG my-4 p-2">
            <ListGroup>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Selected Items:</strong>
                <strong style={{ borderBottom: '1px solid grey' }}>
                  Total:{' '}
                  {`N${cartItems
                    .reduce((a, c) => a + c.price * c.quantity, 0)
                    .toFixed(2)}`}
                </strong>
              </div>
              {cartItems?.length > 0 &&
                cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <span>
                      {item?.quantity} {item?.dishName}:{' '}
                      <Link className="fw-bold">{`N${item.price} each`}</Link>
                    </span>
                  </ListGroup.Item>
                ))}
            </ListGroup>
            <div className="text-end p-2">
              {' '}
              <Button
                onClick={handleSumbmitOrder}
                variant="lighter"
                className="bg-danger text-white fw-bold"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4">
        {dishes?.length > 0 && (
          <div className="d-flex gap-3 flex-wrap">
            {dishes.map((item) => (
              <AdminOrderedItems own={true} item={item} key={item?._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendantInfo;
