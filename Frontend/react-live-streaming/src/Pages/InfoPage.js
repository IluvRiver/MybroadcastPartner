import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {Routes,Route} from 'react-router-dom'
import MyPage from './MyPage';
import SubScriptionPage from './SubscriptionPage';
import info_icon from '../imgs/info_icon.png';
import Guest from '../imgs/guest.png';

const InfoPage = () => {
    const name = String(JSON.parse(sessionStorage.getItem('userInfo')).name);   // 이름
    const email = String(JSON.parse(sessionStorage.getItem('userInfo')).email);   // 이메일
    const class_name = String(JSON.parse(sessionStorage.getItem('userInfo')).class_name);   // 회원 등급
    const date = String(JSON.parse(sessionStorage.getItem('userInfo')).date);   // 서비스 이용 날짜(회원가입 날짜)
    const picture = String(JSON.parse(sessionStorage.getItem('userInfo')).picture);   // 이미지
    const channel = String(JSON.parse(sessionStorage.getItem('userInfo')).channels_Id); // 채널 이름
    const [isImageLoaded, setImageLoaded] = useState(false);  // 이미지 로딩 상태 관리
    const [data, setData] = useState([]); // 구독자 수
    let imageUrl;
    try {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        imageUrl = userInfo && userInfo.picture;
    } catch (error) {
        console.error('Error parsing userInfo from sessionStorage', error);
    }

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    useEffect(() => { // 구독자 수 가져오기
        const serverIP = process.env.REACT_APP_FLASK_IP;
        const port = process.env.REACT_APP_PORT;
        axios.get(`http://${serverIP}:8801/subcnt/${channel}`, {
        })
          .then((res) => {
            setData(res.data);
          })
          .catch((Error) => { console.log(Error) });
      }, []);

    return ( 
      
        <Container>  
          
        <BottomContainer>
            <InfoContainer>
            <InfoLeftContainer>
              <UserImgInfo>
                {JSON.parse(sessionStorage.getItem('userInfo')).picture != null ? (
                  <img src={imageUrl} onLoad={handleImageLoad} alt="User" style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }} />
                ) : <img src={Guest} />}
            </UserImgInfo>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <PayName>
                {JSON.parse(sessionStorage.getItem('userInfo')).class_name != null ? (
                  <h4>{JSON.parse(sessionStorage.getItem('userInfo')).class_name}</h4>
                ) : <h4>시청자</h4>}
              </PayName>
            </div>
            <LeftUserName>
              {name}
            </LeftUserName>
            <LeftUserEmail>
              {email}
            </LeftUserEmail>
            </InfoLeftContainer>
            <InfoRightContainer>
              <InfoLeft>
              <h4>이메일</h4>
              <h4>닉네임</h4>
              <h4>이용 기간</h4>
              <h4>구독자 수</h4>
              </InfoLeft>
              <InfoCenter>
              <h4>{email}</h4>
              <h4>{name}</h4>
              <h4>{date != "null" && date != "undefined" ? new Date(date).toLocaleString().slice(0, -3) : "결제 내역이 없습니다."}</h4>
              <h4>{data.length != 0 && data != 160000 && data != 161000 ? data + " 명": "정보가 없습니다."}</h4>
              </InfoCenter>
              <InfoRight>
              <img src={info_icon}/>
              <img src={info_icon}/>
              <img src={info_icon}/>
              </InfoRight>
            </InfoRightContainer>
         </InfoContainer>
        </BottomContainer>
      <Routes>
        <Route path="/mypage" element={<MyPage/>}></Route>
        <Route path="/info" element={<InfoPage/>}></Route>
        <Route path="/subscript" element={<SubScriptionPage/>}></Route>
      </Routes>
      </Container>

    )
}

const PayName = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  width: 25%;
  height: 60%;
  background-color: #FF8199;
  border-radius: 30px;
  display: flex;
  justify-content: center;

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

const InfoLeft = styled.div`
width: 360px;
height: 100%
backgroundColor: blue;
h4 {
  margin-top: 55px;
  display: flex;
  margin-left: 40px;
  color: #747474;
  font-size: 20px;
}
`

const InfoCenter = styled.div`
width: 360px;
height: 100%
backgroundColor: blue;
h4 {
  margin-top: 55px;
  display: flex;
  font-size: 20px;
}
`

const InfoRight = styled.div`
width: 360px;
height: 100%;
display: flex;
flex-direction: column;

img {
  width: 20px;
  height: 20px;
  margin-top: 58px;
  margin-left: 13rem;
}
`

const Container = styled.div`
  border-radius:10px;
  width: 1235px;
  height: 470px;
  background-color: #FFF2F4;
  margin: auto;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
`

const BottomContainer = styled.div`
flex: 8;
display: flex;
align-items: center;
`

const InfoContainer = styled.div`
height: 450px;
width: 95%;
margin: auto;
display: flex;
justify-content: center;
align-items: center;
flex-direction: row;
`
const InfoLeftContainer = styled.div`
background-color: white;
height: 370px;
border-radius: 10px;
width: 300px;
margin-right: 5rem;
display: flex;
flex-direction: column;
`
const UserImgInfo = styled.div`
display: flex;
flex: 3;
flex-direction: column;
align-items: center;

img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 60px;
}
`
const LeftUserName = styled.div`
font-size: 20px;
font-weight: bold;
flex: 1;
margin-top: 10px;
`
const LeftUserEmail = styled.div`
flex: 4;
color: gray;
`
const LeftUserdata = styled.div`
display: flex;
justify-content: center;
flex: 3;
h4 {
  font-size: 24px;
  font-weight: 600;
  margin-right: 2rem;
  color: black;
}
h5 {
  font-size: 24px;
  color: gray;
}

`
const InfoRightContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
font-size: 25px;
font-weight: bold;
height: 370px;
width: 750px;
background-color: white;
border-radius: 10px;
`
    
export default InfoPage;