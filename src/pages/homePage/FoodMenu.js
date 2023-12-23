import React from 'react'
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import HomeItems from '../../components/HomeItems';
import Row from 'react-bootstrap/Row';

function FoodMenu(props) {
    const {dishes}=props;
  return (
    <div>
       <Row style={{}}>
                {' '}
                <Col md={6} className='mb-4'>
                  <h3>Native Dishes</h3>
                  {dishes.length > 0 ? (
                    <div>
                      {dishes.filter(item=>item.isIntercontinental === false).map((dish) => (
                        <Link  className='text-decoration-none mb-3' key={dish._id}>
                          {' '}
                          <HomeItems  dish={dish}/>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    'No Posts'
                  )}
                </Col>
                <Col md={6}>
                  <h3>Inter-Continental Dishes</h3>
                  {dishes?.length > 0 ? (
                    <div>
                      {dishes?.filter(item=>item.isIntercontinental === true)?.map((dish) => (
                        <Link  className='text-decoration-none ' key={dish._id}>
                          {' '}
                          <HomeItems  dish={dish}/>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    'No Posts'
                  )}
                </Col>
              </Row>
    </div>
  )
}

export default FoodMenu
