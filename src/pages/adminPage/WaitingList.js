import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

import Items from './Items';
import { useDispatch, useSelector } from 'react-redux';
import { singleOrder } from '../../redux/userSlice';

function WaitingList(props) {
  const { list, socket, setList, singleAttendantOrders, mobileOpen, setMobileOpen, } = props;
  const [singlewaiter, setSingleWaiter] = useState({});
  const { userInfo, singleOrderId } = useSelector((state) => state.user);
  const [currentOrderId, setcurrentOrderId] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleWaiter = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/waitinglist/singlewaiting/${singleOrderId}`
        );
        setSingleWaiter(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (singleOrderId) {
      fetchSingleWaiter();
    }
  }, [userInfo, singleOrderId]);

  useEffect(() => {
    if (currentOrderId) {
      dispatch(singleOrder(currentOrderId));
    }
  }, [dispatch, currentOrderId]);

  useEffect(() => {
    socket?.current?.on('newOrder', (order) => {
      const existingItem = list?.find(
        (item) => item?.customerId === order?.customerId
      );

      if (existingItem) {
        setList((prevList) =>
          prevList
            ?.filter((item) => item.isPaid === false)
            ?.map((item) =>
              item?.customerId === order?.customerId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
        );
      } else {
        setList([...list, { ...order, quantity: 1 }]);
      }
    });
  }, [socket, list, setList]);

  return (
    <div>
      <div className="d-none d-md-flex flex-column">
        <Row style={{ overflow: 'hidden' }}>
          <Col
            className="scroll-container"
            style={{ height: '90vh', overflowY: 'scroll' }}
            md={8}
          >
            {list.length > 0 ? (
              <ListGroup variant="">
                <ListGroup.Item>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Name</th>
                        <th>Order ID</th>
                        <th>Request For</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list?.map((order, index) => (
                        <tr
                          key={index}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setcurrentOrderId(order?.customerId)}
                          className={
                            singleOrderId === order?.customerId ? 'BG' : ''
                          }
                        >
                          <td style={{ width: 'fit-content' }}> {index + 1}</td>
                          <td> {order?.customerName}</td>
                          <td> {`...${order?.orderId?.slice(15, 24)}`}</td>
                          <td
                            className={
                              order?.requestType === 'waiter'
                                ? 'bg-danger text-center text-white fw-bold'
                                : 'bg-warning text-center text-white fw-bold'
                            }
                          >
                            {order?.requestType}
                          </td>
                          <td
                            className={
                              order?.active
                                ? 'bg-success text-center text-white fw-bold d-flex align-items-center justify-content-between'
                                : 'bg-primary text-center text-white fw-bold '
                            }
                          >
                            {order?.active ? `Process...` : ' pending...'}
                            {order?.attendantId === userInfo?._id && (
                              <img
                                src={
                                  userInfo.avatar
                                    ? userInfo.avatar
                                    : '/images/customerservice.jpg'
                                }
                                alt=""
                                style={{
                                  width: '20px',
                                  borderRadius: '50%',
                                  height: '20px',
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ListGroup.Item>
              </ListGroup>
            ) : (
              <div
                className="scroll-container"
                style={{ height: '100vh', width: '100%', position: 'relative' }}
              >
                <img src="/images/customersservice.jpg" alt="" />
                
                <div
                  style={{ position: 'absolute', left: 0, bottom: 50 }}
                  className="p-2 d-flex mt-5 flex-column justify-content-center BG p-3"
                >
                  {' '}
                  <h3>No customers available yet</h3>
                  <strong>
                    Note: customer service is our priority. please ensure you
                    follow all the neccessary procedure to create a better
                    enviromemt for we and the customer.
                  </strong>
                  <span>
                    {' '}
                    for complains and inquiries: contact the sales department
                    manager at: quiloxcafemanagement@gmail.com
                  </span>
                </div>
              </div>
            )}
          </Col>
          <Col
            className="scroll-container"
            style={{ height: '90vh', overflowX: 'hidden', overflowY: 'scroll' }}
            md={4}
          >
            <div>
              <Items
                setList={setList}
                list={list}
                setSingleWaiter={setSingleWaiter}
                socket={socket}
                order={singlewaiter}
                singleAttendantOrders={singleAttendantOrders}
                mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* MOBILE FUNCTIONS */}

      <div className="d-md-none">
        <Row style={{ overflow: 'hidden' }}>
          {!mobileOpen && (
            <Col
              className="scroll-container"
              style={{ height: '90vh', overflowY: 'scroll' }}
              md={8}
            >
              {list.length > 0 ? (
                <ListGroup variant="">
                  <ListGroup.Item>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Order ID</th>
                          <th>Request For</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list?.map((order, index) => (
                          <tr
                            key={index}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setcurrentOrderId(order?.customerId);
                              setMobileOpen(true);
                            }}
                            className={
                              singleOrderId === order?.customerId ? 'BG' : ''
                            }
                          >
                            <td> {order?.customerName}</td>
                            <td> {`...${order?.orderId?.slice(15, 24)}`}</td>
                            <td
                              className={
                                order?.requestType === 'waiter'
                                  ? 'bg-danger text-center text-white fw-bold'
                                  : 'bg-warning text-center text-white fw-bold'
                              }
                            >
                              {order?.requestType}
                            </td>
                            <td
                              className={
                                order?.active
                                  ? 'bg-success text-center text-white fw-bold d-flex align-items-center justify-content-between'
                                  : 'bg-primary text-center text-white fw-bold '
                              }
                            >
                              {order?.active ? `Process...` : ' pending...'}
                              {order?.attendantId === userInfo?._id && (
                                <img
                                  src={
                                    userInfo.avatar
                                      ? userInfo.avatar
                                      : '/images/customerservice.jpg'
                                  }
                                  alt=""
                                  style={{
                                    width: '20px',
                                    borderRadius: '50%',
                                    height: '20px',
                                  }}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ListGroup.Item>
                </ListGroup>
              ) : (
                <div
                  className="scroll-container"
                  style={{
                    height: '100vh',
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <img src="/images/customersservice.jpg" alt="" />
                  <div
                    style={{ position: 'absolute', left: 0, bottom: 50 }}
                    className="p-2 d-flex mt-5 flex-column justify-content-center BG p-3"
                  >
                    {' '}
                    <h3>No customers available yet</h3>
                    <strong>
                      Note: customer service is our priority. please ensure you
                      follow all the neccessary procedure to create a better
                      enviromemt for we and the customer.
                    </strong>
                    <span>
                      {' '}
                      for complains and inquiries: contact the sales department
                      manager at: quiloxcafemanagement@gmail.com
                    </span>
                  </div>
                </div>
              )}
            </Col>
          )}
          {mobileOpen && (
            <Col
              className="scroll-container"
              style={{
                height: '90vh',
                overflowX: 'hidden',
                overflowY: 'scroll',
              }}
              md={4}
            >
              <div>
                <Items
                  setList={setList}
                  list={list}
                  setSingleWaiter={setSingleWaiter}
                  socket={socket}
                  order={singlewaiter}
                  singleAttendantOrders={singleAttendantOrders}
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}

export default WaitingList;
