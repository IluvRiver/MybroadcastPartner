import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import MainPage from './Pages/MainPage';
import Navigate from './Components/Navigate';
import SideNav from './Components/SideNavigate';
import AppRoutes from './Components/AppRoutes';
import SignUp from './Sign/SignUp';

function App() {
  
  return (
    <div className='App'>
    <BrowserRouter>
    <Navigate/>
    <Routes>
      <Route path = "/" element={<MainPage/>}></Route>
      <Route path = "/signup" element={<SignUp />}></Route>
    </Routes>
    <LayoutContainer>
      <SideNav/>
    <ContentContainer>
      <AppRoutes />
    </ContentContainer>
    </LayoutContainer>
    </BrowserRouter>
    </div>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: auto;
`;

export default App;