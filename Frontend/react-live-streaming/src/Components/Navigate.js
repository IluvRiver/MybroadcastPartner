import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { Navbar, Nav, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';  // 외부 css에서 네비바 가져옴
import Login from '../Sign/Login';
import UserGoogle from '../Sign/UserGoogle';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import YouTube_Login from '../Sign/Youtube_Login';
import Logo from '../imgs/logo2.svg';
import Close from '../imgs/close.png';
import Return from '../imgs/return.png'
import CheckImg from '../imgs/CheckIcon.png';
import Url from './Url';
import axios from 'axios';

const Navigate = () => {
  const [modal, setModal] = useState(false);
  const [size, setSize] = useState("12");
  const [userLogin, setUserLogin] = useState(true);
  const [idInput, setIdInput] = useState("아이디");
  const [pwInput, setPwInput] = useState("비밀번호");
  const [isImageLoaded, setImageLoaded] = useState(false);  // 이미지 로딩 상태 관리
  const navigate = useNavigate();
  const location = window.location.pathname;
  const userInfo = sessionStorage.getItem('userInfo');
  const inputRef = useRef(null);  // useRef 추가
  const user = String(JSON.parse(sessionStorage.getItem("userInfo"))?.user);

  // 사용자 타입에 따른 접근 제한
  const isRestricted = user === "시청자";

  const handleImageLoad = () => { // 이미지 로딩 상태
    setImageLoaded(true);
  };

  const openModal = (event) => {  // 모달창 활성화
    setModal(true);
  }
  const closeModal = () => {  // 모달창 비활성화
    setModal(false);
    setUserLogin(true);
  }
  const MainButton = () => {  // 로고 클릭시 메인페이지 이동
    navigate("/");
  }

  const MyPageButton = () => {  // 로고 클릭시 내 정보페이지 이동
    if(userInfo) {  // userInfo가 존재하는지 확인
      navigate("infonav/info");
    } else {
      alert("로그인이 필요합니다.");
    }
  }

  const ChartButton = () => {  // 로고 클릭시 방송 차트 페이지 이동
    if(userInfo) {  // userInfo가 존재하는지 확인
      if(!isRestricted) {
        navigate("/mypage");
      } else {
        alert("크리에이터만 사용 가능한 기능입니다.");
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  }

  const FeedbackButton = () => {  // 로고 클릭시 피드백페이지 이동
    if(userInfo) {  // userInfo가 존재하는지 확인
      if(!isRestricted) {
        navigate("/feedback");
      } else {
        alert("크리에이터만 사용 가능한 기능입니다.");
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  }

  const PayButton = () => { // 결제 버튼 클릭시 PayPage 이동
    if (userInfo?.user != "사용자") {
      navigate("/paypage");
    } else {
      alert("크리에이터만 사용 가능한 기능입니다.");
    }
  }

  const UserLoginButton = () => { // 일반 로그인 버튼 클릭시 모달창 바뀜
    setUserLogin(false);
  }

  const ReturnButton = () => { // 되돌아가기 버튼 클릭시 모달창 바뀜
    setUserLogin(true);
  }

  const SignUpButton = () => {  // 회원가입 버튼 클릭시 회원가입페이지 이동
    setModal(false);
    setUserLogin(true);
    navigate("/signup");
  }

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const updateRightSize = () => {
    if(userInfo) {
      setSize("17");
    } else {
      setSize("10");
    }
  }

  useEffect(() => {
    updateRightSize();
  }, []);

  // id 입력과정
  const idChange = (e) => {
    const length = e.target.value;
    setIdInput(length);
  }

  // pw 입력과정
  const pwChange = (e) => {
    const length = e.target.value;
    setPwInput(length);
  }

  const handleSubmit = (event) => {
    const serverIP = process.env.REACT_APP_GITHUB_IP;
    const port = process.env.REACT_APP_PORT;
    event.preventDefault(); // 폼 제출될 때 기본 동작 막음

    axios.get(`http://${serverIP}:${port}/viewer/login`, {
      params: {
        ID: idInput,
        password: pwInput,
      }
    }).then((res) => {
      if((res.data != "")) {
        const userInfo = {
          ...res.data.viewer, // 응답에서 user 데이터를 펼침
           user: "시청자" // 'user' 객체를 추가함
         };
        sessionStorage.setItem('accessToken', res.data.accessToken);
        sessionStorage.setItem('refreshToken', res.data.refreshToken);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo)); // 세션 저장
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    }).catch((Error) => {
      alert("서버와 접속이 실패하셨습니다.");
      window.location.replace("/");
    })
  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      handleSubmit(event);
      inputRef.current.blur();
    }
  }

    return (
        <TopNav>
            <Navbar style={{position: "fixed", backgroundColor : "white", boxShadow : "1.5px 1.5px 1.5px 1.5px #F3F4F6", width: "100vw", height: "7.6vh", zIndex: "1000"}} >
                <Navbar.Brand>
                  <Nav_Str>
                  <UserImg onClick={MainButton}>  
                    <img className="RogoImage" alt="Live_Logo" src={Logo} />
                  </UserImg>
                  {location !== "/" ?
                    <PageNav>
                      <Url/>
                    </PageNav>
                    : 
                    <PageNav style={{marginRight: `${size}rem`}}>
                      <Info onClick={MyPageButton}>마이페이지
                        <img className="CheckIcon" alt="CheckIcon" src={CheckImg} onLoad={handleImageLoad} style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
                      </Info>
                      <Chart onClick={ChartButton}>방송차트
                        <img className="CheckIcon" alt="CheckIcon" src={CheckImg} onLoad={handleImageLoad} style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
                      </Chart>
                      <Feed onClick={FeedbackButton}>피드백
                        <img className="CheckIcon" alt="CheckIcon" src={CheckImg} onLoad={handleImageLoad} style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
                      </Feed>
                    </PageNav>}
                    <Nav className="mr-auto">
                    {sessionStorage.getItem('userInfo') ? (
                      <div style={{display: "flex", lignItems: "center", justifyContent: "center"}}>
                        <DropdownMenu/>
                      </div>
                    ) : (
                        <Form>
                            <Pay_button onClick={PayButton}>요금안내</Pay_button>
                            <ModalButton type="button" onClick={openModal}>로그인</ModalButton>
                        </Form>
                    )}
                  </Nav>
                  </Nav_Str>
                </Navbar.Brand>
                {modal? (
                <div>
                    <Nav_modal onClick={closeModal}>
                        <Nav_modalin onClick={stopPropagation}>
                        <img className="RogoImage" alt="Live_Logo" src={Logo} />
                        {userLogin? (
                          <div>
                            <h4>나의 방송 파트너는 Google or YouTube 계정으로<br/> 로그인이 가능합니다.</h4>
                            <CreateLogo>
                              <PinkDivider/>
                              <span>&nbsp;크리에이터&nbsp;</span>
                              <PinkDivider/>
                            </CreateLogo>
                            <Login />
                            <YouTube_Login />
                            <UserLogo>
                              <Divider/>
                              <span>&emsp;시청자&emsp;</span>
                              <Divider/>
                            </UserLogo>
                            <UserGoogle/>
                            <UserLogin onClick={UserLoginButton}>
                              <span>일반 로그인</span>
                            </UserLogin>
                            <XButton onClick={closeModal}><img src={Close} style={{ position: 'absolute', width: '20px', height: '20px', top: '0.4rem', right: '0.2rem' }}/></XButton>
                          </div>
                        ): 
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <h4 style={{ position: 'relative', fontSize: '15px', top: '4rem' }}>시청자 로그인</h4>
                            <IdDiv>
                              <span>&nbsp;&nbsp;아이디(이메일)</span>
                              <IdInput
                                type="text"
                                value={idInput}
                                onChange={idChange}
                                onFocus={() => setIdInput("")}
                                isValidId={idInput != '아이디'}
                              />
                            </IdDiv>
                            <PwDiv>
                              <span>&nbsp;&nbsp;비밀번호(8~14)</span>
                              <PwInput
                                ref={inputRef}
                                type="password"
                                value={pwInput}
                                onChange={pwChange}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setPwInput("")}
                                minLength={8}
                                maxLength={14}
                                isValidPw={pwInput != '비밀번호'}
                              />
                            </PwDiv>
                            <Login_btn onClick={handleSubmit}>
                              <span>로그인</span>
                            </Login_btn>
                            <ReButton onClick={ReturnButton}><img src={Return} style={{ position: 'absolute', width: '20px', height: '20px', top: '0.4rem', right: '0.2rem' }}/></ReButton>
                          </div>
                        }
                        <h5>계정이 없으신가요? <button onClick={SignUpButton} style={{ backgroundColor: 'white', border: '1px solid white', color: '#0D6EFD' }}>회원가입</button></h5>
                        </Nav_modalin>
                    </Nav_modal>
                </div>
            ):null}
            </Navbar>
          </TopNav>
    );
}

const Nav_Str = styled.div`
  display: flex;
  flexDirection: row;
  width: 100vw;
  justifyContent: space-between;
  align-items: center;
`

const PageNav = styled.div`
  display: flex;
  flex: 8;
  align-items: center;
  justify-content: center;
  margin-right: 15rem;
  margin-left: 3rem;
`

const Info = styled.button`
  margin-right: 3rem;
  border: none;
  background-color: white;
  font-weight: 600;
  
  img {
    margin-bottom: 0.5rem;
  }
`

const Chart = styled.button`
  border: none;
  background-color: white;
  font-weight: 600;

  img {
    margin-bottom: 0.5rem;
  }
`

const Feed = styled.button`
  margin-left: 3rem;
  border: none;
  background-color: white;
  font-weight: 600;

  img {
    margin-bottom: 0.5rem;
  }
`

const Pay_button = styled.button`
  width: 85px;
  position: relative;
  right: 4rem;
  background-color: pink;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 4px 15px;
  font-size: 1rem;

  // &:hover {
  //   background-color: hotpink;
  // }
`

const TopNav = styled.div`
  height: 7.6vh;
`

const ModalButton = styled.button`
  padding: 3px 13px;
  font-size: 1rem;
  line-height: 1.5;
  border: 1.7px solid black;
  border-radius: 20px;
  position: relative;
  right: 3rem;
  background-color: white;
  font-weight: 600;
  // &:hover {
  //   background-color: hotpink;
  // }
`;

const XButton = styled.button`
  border: none;
  position: absolute;
  top: 0.8rem;
  right: 1rem;

  background: ${(props) => props.background || 'white'};
`

const ReButton = styled.button`
  border: none;
  position: absolute;
  top: 0.8rem;
  right: 1rem;

  background: ${(props) => props.background || 'white'};
`

const UserImg = styled.button`
  background: none;
  border: none;
  position: relative;
  left: 2rem;

  img {
    border: none;
  }
`


const Nav_modalin = styled.div`
  width: 400px;
  height: 520px;
  background-color: white;
  padding: 20px; // 내부 패딩 추가
  border-radius: 8px; // 둥근 모서리
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); // 그림자 효과 추가
  background: #FFFFFF 0% 0% no-repeat padding-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  img {
    position: relative;
    top: 3rem;
  }

  h4 {
    position: relative;
    top: 5rem;
    font-size: 15px;
  }

  h5 {
    position: relative;
    font-size: 13px;
    top: 6.3rem;
    left: 4.8rem;
    color: #747474;
  }
`

const Nav_modal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); // 어두운 반투명 배경
  position: fixed;
  top: 0; // 화면 상단부터 시작
  left: 0; // 화면 왼쪽부터 시작
  z-index: 999; // 다른 요소들 위에 나타나도록 z-index 설정
`

const CreateLogo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content:center;
  align-items: center;
  position: relative;
  top: 4.5rem;

  span {
    color: #F74E7B;
  }
`

const PinkDivider = styled.div`
  position: relative;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 115px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #F74E7B;
  }

`;

const UserLogo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content:center;
  align-items: center;
  position: relative;
  top: 4.5rem;
  margin-top: 1rem;
`

const Divider = styled.div`
  position: relative;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 115px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid black;
  }

`;

const UserLogin = styled.div`
  position: relative;
  width: 300px;
  height: 50px;
  background-color: #6CA7ED;
  padding: 4px;
  border: 0.5px solid #6CA7ED;
  border-radius: 8px;
  box-shadow: 0 4px 4px -2px #808080;
  cursor: pointer;
  font-size: 0.85rem;
  left: 1.85rem;
  top: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 17px;
    font-weight: bold;
    color: white;
  }
`

const IdDiv = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 5rem;

  span {
    font-size: 12px;
    color: #808080;
  }
`

const IdInput = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #FFFFFF;
  box-shadow: 0 4px 4px -2px #808080;
  font-size: 15px;
  padding-left: 5px;
  color: ${props => (props.isValidId ? 'black' : '#C4C4C4')};

  :focus {
    outline: none;
  }
`

const PwDiv = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
  color: ${props => (props.isValidPw ? 'black' : '#C4C4C4')};

  span {
    font-size: 12px;
    color: #808080;
  }
`

const PwInput = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #FFFFFF;
  box-shadow: 0 4px 4px -2px #808080;
  font-size: 15px;
  padding-left: 5px;

  :focus {
    outline: none;
  }
`

const Login_btn = styled.button`
  width: 250px;
  height: 40px;
  background-color: #6CA7ED;
  padding: 4px;
  border: 0.5px solid #6CA7ED;
  border-radius: 8px;
  box-shadow: 0 4px 4px -2px #808080;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4rem;

  span {
    font-size: 17px;
    font-weight: bold;
    color: white;
  }
`

export default Navigate;