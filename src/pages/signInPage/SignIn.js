import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginFail, loginStart, loginSuccess } from '../../redux/userSlice';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const formData = {
        email: email,
        password: password,
      };
      const { data } = await axios.post(
        `http://localhost:8080/api/users/signin`,
        formData
      );
      dispatch(loginSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(loginFail(error));
      console.log(error);
    }
  };

  return (
    <div>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <img
          src="/images/5234.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: '100%' }}
          >
            <h3>Welcome! </h3>
            <Form
              onSubmit={handleSignin}
              style={{}}
              className="d-flex flex-column gap-3"
            >
              <InputGroup>
                <InputGroup.Text>Email</InputGroup.Text>
                <Form.Control
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>Password</InputGroup.Text>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
              <Button type="submit">Sign In</Button>
            </Form>

            <strong className=" bg-white mt-2 p-2">
              New Customer? <Link to="/signup">Sign Up Here</Link>
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
