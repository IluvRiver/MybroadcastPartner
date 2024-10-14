import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import SubScriptionPage from './SubscriptionPage';
import InfoPage from './InfoPage';
import BlackList from './BlackList';
import Category from './Category';
import NotFound from './NotFound';

const InfonavPage = () => {
    const location = useLocation();
    const navigate = useNavigate(); // 페이지이동
    const user = String(JSON.parse(sessionStorage.getItem("userInfo")).user);
    const showNotFound = !['/infonav/info', '/infonav/subscript', '/infonav/blacklist', '/infonav/category'].includes(location.pathname);

    // 사용자 타입에 따른 접근 제한
    const isRestricted = user === "시청자";

    useEffect(() => {
      if (isRestricted && (location.pathname === "/infonav/subscript" || location.pathname === "/infonav/blacklist" || location.pathname === "/infonav/category")) {
          alert("크리에이터만 가능한 서비스입니다.");
          navigate("/infonav/info");
      }
    }, [isRestricted, location.pathname, navigate]);

    return ( 
        <Container>  
          <TopContainer>
            <NavStr>
              <UserInfo1 active={location.pathname === "/infonav/info"}><Link to ="/infonav/info" style={{color: 'gray', textDecoration: 'none'}}>내 정보</Link></UserInfo1>
              <Subscript active={location.pathname === "/infonav/subscript"}><Link to="/infonav/subscript" style={{color: 'gray', textDecoration: 'none'}}>결제 관리</Link></Subscript>
              <UserBlack active={location.pathname === "/infonav/blacklist"}><Link to="/infonav/blacklist" style={{color: 'gray', textDecoration: 'none'}}>블랙리스트</Link></UserBlack>
              <UserCategory active={location.pathname === "/infonav/category"}><Link to="/infonav/category" style={{color: 'gray', textDecoration: 'none'}}>카테고리</Link></UserCategory>
            </NavStr>
          </TopContainer>
            <Divider/>
            <Routes>
                <Route path="/info" element={<InfoPage />} />
                <Route path="/subscript" element={<SubScriptionPage />} />
                <Route path="/blacklist" element={<BlackList />} />
                <Route path="/category" element={<Category />} />
                {showNotFound && <Route path="*" element={<NotFound />} />}
            </Routes>
        </Container>

    )
}

const Container = styled.div`
height: 100%;
width: 100%;
display: flex;
flex-direction: column;

@media (max-width: 992px) {
  width: 750px;
}

@media (min-width: 1408px) {
  width: 100%;
}
`
const TopContainer = styled.div`
height: 115px;
width: 100%;
display: flex;
`

const Button = styled.button`
  position:relative;
  width:120px;
  height:50px;
  border:none;
  background-color:white;

&::after {
   content:"";
   position:absolute;
   bottom:-10px; // adjust as needed
   left:0;
   width:${props => props.active ? "100%" : "0"};
   height: 8px; // adjust as needed
   background-color:pink; 
   transition : width .3s ease-in-out ;
}
`;

const UserInfo1 = styled(Button)``

const Subscript = styled(Button)``

const UserBlack = styled(Button)``

const UserCategory = styled(Button)``

const NavStr = styled.div`
display: flex;
flex-direction: row;

font-size: 24px;
width: 100%;
margin-left: 2rem;
margin-top: 5rem;
`

const Divider = styled.div`
  position: relative;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  left: 2rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid lightgray;
  }

`;
    
export default InfonavPage;

