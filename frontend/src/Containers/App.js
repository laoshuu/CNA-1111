import React from 'react'
import styled from 'styled-components';
import { Routes, Route, Link } from "react-router-dom";
import Register from './Register';
import Login from './Login';
import UserPage from './UserPage'
import MainPage from './MainPage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 600px;
  margin: auto;
`;


export default function App() {
  return (
    <Wrapper>
      <Routes>
        <Route>
          {/* <Route index element={<TestPage />} /> */}
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="main" element={<MainPage />} />
          <Route path="user" element={<UserPage />} />
          {/* <Route path="chat" element={<MainPage />} /> */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </Wrapper>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Oops!</h2>
      <p>
        <Link to="/">Go to the <b>My Chat Room</b> login page</Link>
      </p>
    </div>
  );
}