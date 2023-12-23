import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AdminOrderedItems from './AdminOrderedItems';
import { singleOrder } from '../../redux/userSlice';
import AttendantInfo from './AttendantInfo';

function Items(props) {
  const {
    order,
    socket,
    setSingleWaiter,
    list,
    setList,
    singleAttendantOrders,
    mobileOpen,
    setMobileOpen,
  } = props;
  const { userInfo, singleOrderId } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState({});

  const handleProcessing = async (attendantId, customerId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/waitinglist/proccess/${attendantId}/${customerId}`
      );

      const proces = {
        attendantId: data?.attendantId,
        active: data?.active,
        attendantName: data?.attendantName,
        customerId: data?.customerId,
        customerName: data?.customerName,
        orders: data?.orders,
        totalPrice: data?.totalPrice,
        isPaid: data?.isPaid,
      };
      socket?.current.emit('process', { process: proces });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.current?.on('processData', (process) => {
      if (process.attendantId) {
        setList((prevList) =>
          prevList?.map((item) => {
            if (item?.customerId === process.customerId) {
              return {
                ...item,
                attendantId: userInfo?._id,
                active: process?.active,
                orders: process?.orders,
                attendantName: process?.attendantName,
                customerId: process?.customerId,
              };
            }
            return item;
          })
        );
        dispatch(singleOrder(process.customerId));
      }
      setProcessing(process);
      setSingleWaiter(process);
    });
  }, [userInfo, dispatch, setSingleWaiter, setList, socket, list]);

  const handleIsPaid = async (attendantId, customerId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/waitinglist/markPaid/${attendantId}/${customerId}`
      );

      dispatch(singleOrder(null));

      const markPaidData = {
        active: data?.active,
        attendantId: data?.attendantId,
        attendantName: data?.attendantName,
        customerId: data?.customerId,
        customerName: data?.customerName,
        isAttendedTo: data?.isAttendedTo,
        isPaid: data?.isPaid,
        orders: data?.orders,
        totalPrice: data?.totalPrice,
      };
      socket?.current?.emit('markPaid', { markPaid: markPaidData });

      socket?.current?.on('markPaidData', (markpaidData) => {
        if (markpaidData) {
          setList((prevList) =>
            prevList?.filter((item) => item?.isPaid === false)
          );
        }
        dispatch(singleOrder(null));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMobileSwitch = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <div>
      <Card>
        <Card.Body>
          {singleOrderId && order?.orders?.length > 0 ? (
            <div>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-md-none"
                  onClick={handleMobileSwitch}
                  style={{ cursor: 'pointer' }}
                >
                  <ArrowBackIosIcon />
                </div>
                <div style={{ width: '70px', height: '70px' }}>
                  <img
                    src={
                      order.customerImg
                        ? order?.customerImg
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
                <strong className=" fw-bold text-capitalize d-flex align-items-center gap-2">
                  {`Customer ${order?.customerName}`}{' '}
                </strong>
              </div>
              {}
              {order?.orders?.length > 0 && (
                <div>
                  <h3>History</h3>
                  <div className="p-2 d-flex flex-column justify-content-center BG">
                    {' '}
                    <span>request: {order?.orders?.length} orders</span>
                    <strong>
                      This customer is Requesting for ({order?.orders?.length})
                      orders
                    </strong>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center my-2">
                      {order.totalPrice > 0 && (
                        <h5 style={{ borderBottom: '1px solid grey' }}>
                          Total: {`N${order?.totalPrice.toFixed(2)}`}
                        </h5>
                      )}
                      {!order.active && (
                        <Button
                          onClick={() =>
                            handleProcessing(userInfo?._id, order?.customerId)
                          }
                          variant="light"
                          className="bg-success fw-bold  text-white"
                        >
                          Process Order
                        </Button>
                      )}
                      {order.active && order.attendantId === userInfo._id && (
                        <Button
                          onClick={() =>
                            handleIsPaid(userInfo?._id, order?.customerId)
                          }
                          variant="light"
                          className="bg-secondary fw-bold  text-white"
                        >
                          {order.orders.length === 1 &&
                          order.orders[0]?.requestType === 'waiter'
                            ? 'Mark As Read'
                            : 'Mark As Paid'}
                        </Button>
                      )}
                    </div>
                    <div>
                      <div className="mx-2">
                        {order?.orders?.map((order, index) => (
                          <div
                            key={order?._id}
                            className="mb-5 "
                            style={{ borderTop: '1px grey solid' }}
                          >
                            <Button
                              variant="light"
                              className="bg-danger text-white my-3"
                            >
                              Order {index + 1}
                            </Button>
                            <div className="d-flex flex-wrap gap-1 pb-5">
                              {order?.orderedItems?.length > 0 ? (
                                order?.orderedItems?.map((item) => (
                                  <div style={{width:"49%"}} key={item._id}>
                                    {' '}
                                    <AdminOrderedItems item={item} />
                                  </div>
                                ))
                              ) : (
                                <strong
                                  variant="light"
                                  className="d-flex flex-column "
                                >
                                  This customer requested for a Waiter
                                </strong>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={order?.active ? 'BG p-2 my-4' : 'my-2'}>
                    {order?.attendantId === userInfo?._id && (
                      <strong
                        className="text-capitalize"
                        style={{ fontSize: '13px' }}
                      >
                        You are attending to this customer!
                      </strong>
                    )}{' '}
                    {order.attendantId !== userInfo?._id && (
                      <strong
                        className="text-capitalize"
                        style={{ fontSize: '13px' }}
                      >
                        {' '}
                        {order.active
                          ? `${order?.attendantName} is attending to this customer!`
                          : ''}
                      </strong>
                    )}
                    {!order.active && (
                      <div className="d-flex gap-2 align-items-center ">
                        <Button
                          onClick={() =>
                            handleProcessing(userInfo?._id, order?.customerId)
                          }
                          variant="light"
                          className="bg-success text-white"
                        >
                          Process
                        </Button>

                        <Button
                          variant="light"
                          className="bg-secondary text-white"
                        >
                          Transfer
                        </Button>
                        <Button
                          variant="light"
                          className="bg-danger text-white"
                        >
                          Cancel Order
                        </Button>
                      </div>
                    )}
                    {order.active && order.attendantId === userInfo._id && (
                      <div className="d-flex gap-2 align-items-center ">
                        <Button
                          variant="light"
                          className="bg-secondary text-white"
                        >
                          Transfer
                        </Button>
                        <Button
                          variant="light"
                          className="bg-danger text-white"
                        >
                          Cancel Order
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <AttendantInfo
                handleMobileSwitch={handleMobileSwitch}
                singleAttendantOrders={singleAttendantOrders}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Items;
