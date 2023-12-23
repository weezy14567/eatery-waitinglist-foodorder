import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import HomeItems from '../../components/HomeItems';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../navbarPage/Navbar';
import HomeGrid from './HomeGrid';
import FoodMenu from './FoodMenu';
import Button from 'react-bootstrap/esm/Button';
import SearchBar from '../searchPage/SearchBar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


function HomeScreen(props) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(false);
  const { socket, query, setQuery } = props;
  useEffect(() => {
    const allDishes = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/dishes/all`
        );
        setDishes(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    allDishes();
  }, []);
  return (
    <div>
      <Navbar socket={socket} />
      <div>
        <div
          style={{ width: '60%', margin: 'auto' }}
          className="d-none d-md-flex"
        >
          <SearchBar query={query} setQuery={setQuery} />
        </div>
        <div style={{ width: '95%', margin: 'auto' }} className="d-md-none">
          <SearchBar query={query} setQuery={setQuery} />
        </div>

        <div style={{ width: '100%', height: '90vh', position: 'relative' }}>
          <img
            style={{
              width: '100%',
              height: '100%',
              opacity: '0.1',
              objectFit: 'cover',
            }}
            src="/images/customer.jpg"
            alt=""
          />
          <div></div>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              top: 0,
              left: 0,
            }}
          >
            {menu && (
              <Container>
                <Button
                  variant="light"
                  className="bg-info text-white"
                  onClick={() => setMenu(false)}
                >
                  <ArrowBackIosIcon/>Go Back
                </Button>
                <FoodMenu setMenu={setMenu} dishes={dishes} />
              </Container>
            )}
            {!menu && (
              <div
                onClick={() => setMenu(true)}
                style={{ width: '95%', margin: 'auto' }}
              >
                {' '}
                <HomeGrid setMenu={setMenu} dishes={dishes} loading={loading} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
