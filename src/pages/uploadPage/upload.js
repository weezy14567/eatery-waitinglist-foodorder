import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFail, loginStart, loginSuccess } from '../../redux/userSlice';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

function Upload() {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [foodImg, setFoodImg] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isIntercontinental, setIsIntercontinental] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = imageRef.current.files[0];
    const storageRef = ref(storage, Date.now() + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadPercentage(progress);
        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          try {
            const formData = {
              dishName: dishName,
              foodImg: downloadURL,
              price: price,
              isAvailable: isAvailable,
              isIntercontinental: isIntercontinental,
            };
            axios
              .post(
                `http://localhost:8080/api/dishes/upload/${userInfo?._id}`,
                formData
              )
              .then((response) => {
              });
            navigate('/');
          } catch (error) {
            console.log(error);
          }
        });
      }
    );
  };

  return (
    <div>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <img
          src="/images/customersservice.jpg"
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
            <h3 className="text-capitalize">Upload Dish! </h3>

            <Form
              onSubmit={handleUpload}
              style={{}}
              className="d-flex flex-column gap-3"
            >
              <InputGroup>
                <InputGroup.Text className="fw-bold">Name</InputGroup.Text>
                <Form.Control
                  type="text"
                  onChange={(e) => setDishName(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text className="fw-bold">Price</InputGroup.Text>
                <Form.Control
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <Form.Check
                  type="checkbox"
                  id="isAvailable"
                  label="Available"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  style={{ fontWeight: 'bold' }}
                />
              </InputGroup>
              <InputGroup>
                <Form.Check
                  type="checkbox"
                  id="isIntercontinental"
                  label="Intercontinental"
                  checked={isIntercontinental}
                  onChange={(e) => setIsIntercontinental(e.target.checked)}
                  style={{ fontWeight: 'bold' }}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text className="fw-bold">Image</InputGroup.Text>
                <Form.Control type="file" id="isAvailable" ref={imageRef} />
              </InputGroup>
              <Button type="submit">
                {uploadPercentage > 0
                  ? `Uploading ${uploadPercentage}%`
                  : 'Post'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
