import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './pages/signUpPage/SignUp';
import SignIn from './pages/signInPage/SignIn';

import HomeScreen from './pages/homePage/HomeScreen';
import Upload from './pages/uploadPage/upload';

import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AdminDashBoard from './pages/adminPage/AdminDashBoard';
import { io } from 'socket.io-client';
import SearchScreen from './pages/searchPage/SearchScreen';

function App() {
  const { userInfo } = useSelector((state) => state.user);
  const [waitingList, setWaitingList] = useState([]);
  const [query, setQuery] = useState('');
  const socket = useRef();

  useEffect(() => {
    socket.current = io('http://localhost:8090');
    
  }, []);

  useEffect(() => {
    socket.current.emit('addUser', { user: userInfo });
    socket.current.on("getUsers", (data) =>{
    })
  }, [userInfo]);

  useEffect(() => {
    const fetchWaitingList = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/users/waitinglist`
        );

        setWaitingList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWaitingList();
  }, []);

  const handleLogOut = ()=>{
    localStorage.clear();
  }
  return (
    <BrowserRouter>
      <div>
        <header>
          <div></div>
        </header>
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <HomeScreen
                  waitingList={waitingList}
                  setWaitingList={setWaitingList}
                  socket={socket}
                  query={query} setQuery={setQuery}
                />
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/search" element={<SearchScreen query={query} setQuery={setQuery} />} />
            <Route
              path="/admin/dashboard/:id"
              element={<AdminDashBoard handleLogOut={handleLogOut} socket={socket} waitingList={waitingList} />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
