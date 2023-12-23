import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {  useNavigate } from 'react-router-dom';

function SearchBar(props) {
  const {query, setQuery}=props
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      navigate(query ? `/search?query=${query}` : '/search');
    }
  };

  
  return (
    <div
      className="bg-danger mb-3"
      style={{
        width: '100%',
        margin: 'auto',
        borderRadius: '20px 0px 0px 20px',
        border: '1px solid grey',
      }}
    >
      <Form onSubmit={handleSearch}>
        <InputGroup>
          <Form.Control
            placeholder="What do you want to buy..."
            aria-label="search"
            id="search"
            autoComplete="off" 
            type="text"
            style={{ borderRadius: '20px 0px 0px 20px' }}
            aria-describedby="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
         
           
          />

          <Button
            type="submit"
            variant="danger"
            id="search "
            className="bg-danger"
          >
            Search
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default SearchBar;
