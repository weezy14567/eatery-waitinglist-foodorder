import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Groups2Icon from '@mui/icons-material/Groups2';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Badge from 'react-bootstrap/Badge';

import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cart from '../cartPage/Cart';

function Navbar(props) {
  const { userInfo } = useSelector((state) => state.user);
  const [waitingList, setWaitingList] = useState([]);
  const { cartItems } = useSelector((state) => state.cart);
  const [isOpen, setOpen] = useState(false);
  const { socket } = props;

  const handleJoinQuene = async () => {
    const formData = {
      customerId: userInfo?._id,
    };
    try {
      await axios.put(
        `http://localhost:8080/api/users/joinQueue/${userInfo?._id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      const { data } = await axios.post(
        `http://localhost:8080/api/waitinglist/createorder`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      const orders ={
        active:data?.active,
        customerId:data?.customerId,
        customerName:userInfo?.username,
        orderId:data?._id,
        requestType:data?.requestType,
        isAttendedTo:data?.isAttendedTo,
        isPaid:data?.isPaid
      }
      
      socket?.current?.emit('order', { order:orders });
    } catch (error) {
      console.log(error);
    }
  };

 

  useEffect(() => {
    const fetchWaitingList = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/users/waitinglist`
        );

        setWaitingList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWaitingList();
  }, []);

  useEffect(() => {

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    }
  });

  return (
    <div className={isOpen ? 'cartopen' : ''} style={{ height:"155px"}}>
      <div style={{ width: '100%', height: '200px', position: 'relative' }}>
        <img
          style={{ width: '100%', height: '140px', objectFit: 'cover',  }}
          src="/images/custommersinline2.jpg"
          alt=""
        />
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            width: '100%',
          }}
        >
          <Container className="d-flex align-items-center gap-3 justify-content-between">
            <Link
              to="/"
              className="d-flex align-items-center text-decoration-none gap-3"
            >
              {' '}
              <MenuIcon
                className="text-black"
                style={{
                  width: '50px',
                  height: '50px',
                  border: '1px solid black',
                  borderRadius: '5px',
                }}
              />
              <h2 className="text-danger d-none d-md-flex">Quilox Cafe</h2>
            </Link>
            <div className="d-flex bg-white  align-items-center gap-4">
              <strong className="d-none d-md-flex align-items-center">
                <FiberManualRecordIcon style={{ color: 'green' }} />
                {waitingList && `Waiting(${waitingList?.length})`}
              </strong>
              {!waitingList?.includes(userInfo?._id) && (
                <strong className="bg-warning d-flex align-items-center px-2">
                  <Dropdown as={NavItem}>
                    <Dropdown.Toggle as={NavLink}>
                      <Groups2Icon />
                     Quene
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <div className=" flex-column d-flex gap-2">
                          <div className="d-flex flex-column">
                            <span style={{ opacity: '0.6' }}>
                              Request someone to come and attend to you.
                            </span>
                            <Button
                              onClick={handleJoinQuene}
                              style={{
                                cursor: 'pointer',
                                width: 'fit-content',
                              }}
                              variant="light"
                              className="bg-danger text-white fw-bold"
                            >
                              Request a waiter
                            </Button>
                          </div>{' '}
                          <div className="d-flex flex-column">
                            <span style={{ opacity: '0.6' }}>
                              Order food from our kitchen.
                            </span>
                            <Button
                              style={{
                                cursor: 'pointer',
                                width: 'fit-content',
                              }}
                              variant="light"
                              className="bg-danger text-white fw-bold"
                            >
                              Order food
                            </Button>
                          </div>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </strong>
              )}
              {waitingList?.includes(userInfo?._id) && (
                <strong>
                  {waitingList?.map((id, index) =>
                    id === userInfo?._id ? (
                      <span key={index}>{`Position(${index + 1})`}</span>
                    ) : null
                  )}
                </strong>
              )}
              <strong>
                {' '}
                {!userInfo?._id && (
                  <Link
                    className="text-black align-items-center d-flex text-decoration-none"
                    to="/signin"
                  >
                    <AccountCircleIcon />
                    Sign In
                  </Link>
                )}
                {userInfo?._id && userInfo?.isAdmin ? (
                  <Link
                    className="text-black align-items-center d-flex text-decoration-none text-capitalize"
                    to={`/admin/dashboard/${userInfo?._id}`}
                  >
                    <AccountCircleIcon />
                    {userInfo?.username}
                  </Link>
                ):<Link
                className="text-black align-items-center d-flex text-decoration-none text-capitalize"
                to=""
              >
                
                {userInfo?.username}
              </Link>}
              </strong>
              <strong
                onClick={() => setOpen(!isOpen)}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <ShoppingCartCheckoutIcon />
                {cartItems?.length > 0 && (
                  <Badge
                    bg="danger"
                    style={{ position: 'absolute', top: -3, left: 13 }}
                  >
                    {cartItems?.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </strong>
            </div>
          </Container>
        </div>
      </div>
      {isOpen && (
        <div
          className="cartopen2"
          style={{
            width: '100%',
            height: '100vh',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          <Cart setOpen={setOpen} />
        </div>
      )}
    </div>
  );
}

export default Navbar;
