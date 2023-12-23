import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { useSelector } from 'react-redux';
import Groups2Icon from '@mui/icons-material/Groups2';
import PaymentsIcon from '@mui/icons-material/Payments';
import SettingsIcon from '@mui/icons-material/Settings';
import Badge from 'react-bootstrap/esm/Badge';
import axios from 'axios';
import WaitingList from './WaitingList';
import Spinner from 'react-bootstrap/Spinner';

import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/esm/ListGroup';

function AdminDashBoard(props) {
  const { userInfo } = useSelector((state) => state.user);
  const { socket } = props;
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [attendedOrders, setAttendedOrders] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (userInfo.isAdmin) {
      const fetchWaitingListAndOrder = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8080/api/waitinglist/awaitingorders/${userInfo._id}`,
            {
              headers: {
                Authorization: `Bearer ${userInfo?._id}`,
              },
            }
          );
          setList(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchWaitingListAndOrder();
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate('/');
    }
  });

  const singleAttendantOrders = async (attendantId) => {
    try {
      if (section !== 'history') {
        const { data } = await axios.get(
          `http://localhost:8080/api/waitinglist/attendantorders/${attendantId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setAttendedOrders(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSection('history');
    }
  };

  const [section, setSection] = useState(null);
  const handleclickedSection = () => {
    setSection((prevSection) => (prevSection === 'history' ? null : 'history'));
  };

  return (
    <div
      className="scroll-container"
      style={{ position: 'relative', overflowX: 'hidden', width: '100%' }}
    >
      <div className="bg-secondary p-3">
        <Container className="d-flex  align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: '50px', height: '50px' }}>
              <img
                src={
                  userInfo.avatar
                    ? userInfo?.avatar
                    : '/images/custommersinline2.jpg'
                }
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
            <strong className="text-white d-none d-md-flex align-items-center gap-2">
              Admin {userInfo?.username}{' '}
              <Spinner
                style={{ width: '18px', height: '18px' }}
                animation="grow"
                variant="success"
                className="shadowOnline custom-blink"
              />
            </strong>
            <strong className="text-white  d-md-none align-items-center gap-1">
              {userInfo?.username?.length > 5
                ? `${userInfo.username.slice(0, 4)}...`
                : userInfo.username}

              <Spinner
                style={{ width: '18px', height: '18px' }}
                animation="grow"
                variant="success"
                className="shadowOnline custom-blink"
              />
            </strong>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div title="Customers Waiting" style={{ position: 'relative' }}>
              <Groups2Icon className="fw-bold text-white fs-1" />
              {list?.length > 0 && (
                <Badge
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: 0,
                    borderRadius: '20px',
                  }}
                  className="bg-danger"
                >
                  {list?.length}
                </Badge>
              )}
            </div>
            <Button
              onClick={() => {
                singleAttendantOrders(userInfo?._id);
                handleclickedSection('history');
              }}
              title="History"
              variant="lighter"
              className={section === 'history' ? 'bg-danger' : 'bg-secondary'}
            >
              <PaymentsIcon className="fw-bold text-white fs-1" />
            </Button>
            <Button
              title="Settings"
              variant="lighter"
              className="bg-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {' '}
              <SettingsIcon className="fw-bold text-white fs-1" />
            </Button>
          </div>
        </Container>
      </div>
      <div className="">
        <WaitingList
          singleAttendantOrders={singleAttendantOrders}
          setList={setList}
          socket={socket}
          list={list}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      {section === 'history' && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 80,
            width: 'fit-content',
            border: '1px solid grey',
          }}
        >
          {attendedOrders?.ordersAndCustomers?.length === 0 && (
            <div
              style={{
                width: '100%',
                height: '60vh',
                border: '1px solid grey',
                borderRadius: '5px',
              }}
              className="bg-white"
            >
              <div className="text-center ">
                <h3 style={{ borderBottom: '1px solid grey' }}>
                  Order History
                </h3>
              </div>
              <div
                style={{ height: '60%' }}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <h4 style={{ opacity: '0.5' }}>No orders available</h4>
              </div>
            </div>
          )}
          {attendedOrders?.ordersAndCustomers?.length > 0 && (
            <div className="">
              <div className="p-2  BG1 d-flex gap-4 justify-content-between">
                {' '}
                <strong className="fw-bold d-none d-md-flex">
                  Today History{' '}
                </strong>
                <strong className="fw-bold d-md-none"> Today History</strong>
                <strong>
                  Total:{`N${attendedOrders?.totalPrice?.toFixed(2)}`}
                </strong>
              </div>
              <div
                className="bg-white px-3"
                style={{ overflow: 'scroll', height: '85vh' }}
              >
                {attendedOrders?.ordersAndCustomers?.map((item) => (
                  <div key={item._id} className='mb-3'>
                    <div
                      style={{ borderBottom: '1px grey solid ', width: '100%' }}
                      className="d-flex align-items-center pb-2 flex-wrap gap-2 "
                    >
                      <img
                        style={{
                          width: '40px',
                          border: '1px solid grey',
                          height: '40px',
                          borderRadius: '50%',
                        }}
                        src={item?.avatar ? item?.avatar : '/images/user.png'}
                        alt=""
                      />
                      <div className="">
                        {item?.requestType === 'waiter' ? (
                          <div
                            style={{ }}
                            className="d-flex flex-wrap gap-2"
                          >
                            Requested for a
                            <span className={'bg-danger text-white'}>
                              {item?.requestType}
                            </span>
                            <span className="fw-bold">
                              and ({item.orders - 1}) orders
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div
                            style={{ }}
                            className="d-flex flex-wrap gap-2"
                          >
                            Requested for a
                            <span className={'bg-success text-white'}>Meal</span>
                            <span className="fw-bold">
                              and ({item.orders - 1}) orders
                            </span>
                          </div>
 
                          </div>
                         
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashBoard;
