import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';


import LoadingBox from '../../components/LoadingBox';

function HomeGrid(props) {
  const { dishes, loading, setMenu } = props;



  const carouseData = [
    '/images/download.jpg',
    '/images/madam.jpg',
    '/images/buyonegetone.jpg',
    '/images/woman.webp',
    '/images/bigsale.jpg',
  ];
  return (
    <div>
      {loading ? (
        <LoadingBox/>
      ) : (
        <Row>
          <Col md={7} className='mb-3'>
            <Card className="">
              <div className="px-2 d-none py-1 d-md-flex align-items-center justify-content-between" style={{width:"100%"}}>
                <Link
                  style={{ borderRadius: '2px' }}
                  className="fs-5 fw-bold text-whit pb-2  p-1"
                >
                  Discount sales is here... 50% OFF
                </Link>
                <Link onClick={()=> setMenu(true)} className='text-black-50 fw-bold'>
                See more
                </Link>
              </div>
              <div className="px-2 d-md-none py-1 d-flex align-items-center justify-content-between" style={{width:"100%"}}>
                <Link
                  style={{ borderRadius: '2px' }}
                  className=" fw-bold text-whit pb-2  p-1"
                >
                  Discount sales is here... 50% OFF
                </Link>
                <Link onClick={()=> setMenu(true)} className='text-black-50 fw-bold'>
                See more
                </Link>
              </div>
              <Carousel>
                {carouseData?.map((img, index) => (
                  <Carousel.Item
                    key={index}
                    style={{ height: '120px', width: '100%' }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>

              <Card.Body
                style={{}}
                className="d-flex bg-dange justify-content-between flex-wrap align-items-center"
              >
                {dishes?.map(
                  (item) =>
                    item?.price <= 2000 && (
                      <div
                        className="mb-3"
                        style={{ width: '23%' }}
                        key={item?._id}
                      >
                        <img
                          style={{
                            width: '100%',
                            height: '130px',
                            objectFit: 'cover',
                          }}
                          src={item?.foodImg}
                          alt=""
                        />

                        <strong className="text-whit">{`N${item?.price.toFixed(
                          2
                        )}`}</strong>
                      </div>
                    )
                )}
              </Card.Body>
            </Card>
          </Col>

     
          <Col md={5}>
            <Card>
              <Card.Body
                style={{ width: '100%', margin: 'auto' }}
                className="d-flex flex-wrap align-items-center justify-content-between"
              >
                {dishes?.map(
                  (item) =>
                    item?.price > 2000 && (
                      <div
                        style={{ width: '48%' }}
                        key={item?._id}
                        className="mb-3 d-flex flex-column"
                      >
                        <img
                          style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                          }}
                          src={item?.foodImg}
                          alt=""
                        />
                        <strong>{`N${item?.price.toFixed(2)}`}</strong>
                        {item?.dishName}
                      </div>
                    )
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default HomeGrid;
