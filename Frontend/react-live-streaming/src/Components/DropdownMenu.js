import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdLogout } from "react-icons/md";
import info from '../imgs/info_nav.svg';
import info_nav2 from '../imgs/info_nav2.svg';
import Guest from '../imgs/guest.png';
import axios from 'axios';

const DropdownMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);   //false로 초기화
  const [modal, setModal] = useState(false);  //false로 초기화
  const [showInfo, setShowInfo] = useState(false);
  const [isImageLoaded, setImageLoaded] = useState(false);  // 이미지 로딩 상태 관리
  const [isListHoverMyPage, setIsListHoverMyPage] = useState(true); //배너 이미지 변경
  const navigate = useNavigate();
  let wrapperRef = useRef(); //모달창 가장 바깥쪽 태그를 감싸주는 역할
  let imageUrl;
  try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      imageUrl = userInfo && userInfo.picture;
  } catch (error) {
      console.error('Error parsing userInfo from sessionStorage', error);
  }
  
  const toggleDropdown = () => {    // isOpen상태값을 반전시켜줌
    setIsOpen(!isOpen);   // isOpen값이 true면 드롭다운메뉴(마이페이지)가 열리고 false면 메뉴가 닫힘
  };
  const outDropdown = () => {    // SetisOpen값을 초기화
    setIsOpen(false);   //SetisOpen값을 초기화
  };
  const handleClick = () => {
    setModal(true);
  }
  const handleClickOutside=(event)=>{ // 바깥 윈도우 클릭시 modal창 초기화
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      setModal(false);
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const UserInfoButton = () => {  // 마이페이지 이동
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if(userInfo !== undefined){
        delete userInfo.new_Id;
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    navigate("/infonav/info");
    setModal(false);
  }
  
  const logoutButton = () => {  // 로그아웃
    const serverIP = process.env.REACT_APP_GITHUB_IP;
    const port = process.env.REACT_APP_PORT;
    axios.delete(`http://${serverIP}:${port}/user/logout`, {
      data: {
        refreshToken: String(sessionStorage.getItem('refreshToken'))
      }
    })
    .then((res) => {
      sessionStorage.clear();
      window.location.replace("/");
    })
    .catch((Error) => { console.log(Error) });
  }

  useEffect(()=>{ // 모달창 밖을 클릭하면 모달창 꺼짐
    document.addEventListener('mousedown', handleClickOutside);
    return()=>{
      document.removeEventListener('mousedown', handleClickOutside);
    }
  })

  useEffect(() => { // 사용자 정보에 마우스 0.5초 이동 시 DropdownMene 활성화
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowInfo(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowInfo(false);
    }
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="Drop" >
      <Button onMouseEnter={toggleDropdown} onMouseLeave={outDropdown} onClick={handleClick}>
        {JSON.parse(sessionStorage.getItem('userInfo')).picture != null ? (
          <img src={imageUrl} onLoad={handleImageLoad} alt="User" style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
        ) : <img src={Guest} />}
      </Button>
      {isOpen && (
         <>
         {showInfo ? (
        <LinkWrapper>
          <h2>Google 계정</h2>
          <h3>{JSON.parse(sessionStorage.getItem('userInfo')).name}</h3>
          <h4>{JSON.parse(sessionStorage.getItem('userInfo')).email}</h4>
        </LinkWrapper>
         ) : null}
         </>
      )}
      {modal? (
        <div>
          <Nav_modal>
              <Nav_modalin>
                <UserInfomation>
                  <UserImg>
                    {JSON.parse(sessionStorage.getItem('userInfo')).picture != null ? (
                      <img src={imageUrl} onLoad={handleImageLoad} alt="User" style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
                    ) : <img src={Guest} />}
                  </UserImg>
                  <UserInfos>
                    <h6>{JSON.parse(sessionStorage.getItem('userInfo')).name}</h6>
                    <PayName>
                      {JSON.parse(sessionStorage.getItem('userInfo')).class_name != null ? (
                        <h4>{JSON.parse(sessionStorage.getItem('userInfo')).class_name}</h4>
                      ) : <h4>시청자</h4>}
                    </PayName>
                  </UserInfos>
                </UserInfomation>
                
                  
                
                
                <LinkButton 
                onClick={UserInfoButton}
                onMouseOver={() => setIsListHoverMyPage(false)}
                onMouseOut={() => setIsListHoverMyPage(true)}
                >
                  <img src={isListHoverMyPage ? info : info_nav2}/>
                  <h6 >마이페이지</h6>
                </LinkButton>
                
              </Nav_modalin>
              <UserButton onClick={logoutButton}>
                <h5><MdLogout /></h5>
                <h6>로그아웃</h6>
                </UserButton>
          </Nav_modal>
        </div>
      ):null}
    </div>
  );
}

const PayName = styled.div`
  width: 70%;
  height: 15%;
  background-color: pink;
  border-radius: 30px;

  h4 {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 13px;
    font-weight: 600;
  }
`

const UserImg = styled.div`
  width: 35%;
  display: flex;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`

const UserInfos = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  
  h6 {
    display: flex;
    float: left;
    font-size: 15px;
    font-weight: 600;
  }
`

const UserInfomation = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
`

const Nav_modalin = styled.div`
  width: 220px;
  height: 140px;
  background-color: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  border-radius: 30px;
  font-family: "Jalnan";
  top: 0.3rem;
`

const Nav_modal = styled.div`
  background-color: white;
  width: 236px;
  height: 216px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  z-index: 1;
  border-radius: 8px;
  border: 1px solid #7C7C7C26;
  font-family: "Jalnan";
  right: 2rem;
  top: 4rem;
`

const LinkWrapper = styled.div`
  background-color: #3C4043;
  border-radius: 4px;
  color: #fff;
  padding-right: 3px;
  padding-left: 3px;
  position: absolute;
  z-index: 1;
  right: 50px;
  top: 3.5rem;
  transition: 3s ease-in;

  h2 {
    font-size: 12px;
    position: relative;
    bottom: -6px;
    text-align: left;
  }

  h3 {
    position: relative;
    font-size: 12px;
    color: #A5C1BB;
    bottom: -4px;
    text-align: left;
  }

  h4 {
    position: relative;
    font-size: 12px;
    color: #A5C1BB;
  }
`;

const UserButton = styled.button`
  position : absolute;
  background-color: white;
  width: 220px;
  height: 60px;
  bottom: 9px;
  border: none;
  font-family: "Jalnan";
  &:hover {
    font-weight: 800;
    background-color : #FFF2F4;
    color : #f74e7b;
  }

  h5{
    position : absolute;
    left: 1rem;
    bottom: 11px;
  }

  h6 {
    position : absolute;
    left: 3rem;
    bottom: 13px;
  }
`

const LinkButton = styled.button`
  position : absolute;
  background-color: white;
  width: 100%;
  height: 60px;
  bottom: 0rem;
  border: none;
  
  img {
    width: 20px;
    height: 20px;
    position : absolute;
    left: 1rem;
    bottom: 18px;
  }

  h6 {
    position : absolute;
    left: 3rem;
    bottom: 12px;
  }

  &:hover {
    text-decoration: none;
    font-weight: 800;
    background-color : #FFF2F4;
    color : #F74E7B;
  }
`

const Button = styled.button`
  background: none;
  color: black;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  right: 3rem;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: absolute;
    right: 0px;
    top: 0px;
  }
`;

const Divider = styled.div`
  position: relative;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10vh;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid gray;
  }

`;

export default DropdownMenu;