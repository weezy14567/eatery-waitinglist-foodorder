import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbarPage/Navbar';
import SearchBar from './SearchBar';
import LoadingBox from '../../components/LoadingBox';
import Container from 'react-bootstrap/esm/Container';
import { Link } from 'react-router-dom';
import AdminOrderedItems from '../adminPage/AdminOrderedItems';

function SearchScreen(props) {
  const { query, setQuery } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/dishes/search?query=${query}`
        );
        setData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    handleSearch();
  }, [query]);
  return (
    <div>
      <div>
        {' '}
        <Navbar />
        <div style={{width:"60%", margin:"auto"}} className='d-none d-md-flex'>
        <SearchBar query={query} setQuery={setQuery}/>
        </div>
        <div style={{width:"95%", margin:"auto"}} className='d-md-none'>
        <SearchBar query={query} setQuery={setQuery}/>
        </div>
        <Container>
          {' '}
          <div>
            <h3>Search Result:</h3>
            {data.length > 0 ? (
              <strong>
                {' '}
                {data?.length} {query} found
              </strong>
            ) : (
              <strong>
                Nothing found. <Link>Browse our menu list here</Link>
              </strong>
            )}
          </div>
          <div style={{margin:"auto", width:"100%", }} className='d-flex align-items-center flex-wrap'>
            {data.length > 0 && data?.map((item) => (
              <div key={item._id} style={{width:"16%",  }}>
                <AdminOrderedItems own={true} item={item} />
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default SearchScreen;
