import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const SubScriptionPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const serverIP = process.env.REACT_APP_GITHUB_IP;
    const port = process.env.REACT_APP_PORT;

    // 구매 내역 요청 보내기
    axios.get(`http://${serverIP}:${port}/pay/getPurchaseHistory`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
    })
      .then((response) => {
        setData(response.data); // 응답 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error('서버에 요청하는 동안 오류 발생', error);
      });
  }, []);

  return (
      <div style={{width: "100%", display: "flex", alignItems: "center", marginTop: "1.5rem"}}>
          <Container>
            <div className='1' style={{flex:'1'}}></div>
            <PaymentContainer>
              <PaymentSmallContainer>
                <FirstContainer>
                  <h4 style={{fontSize:'22px',fontWeight:'700',marginTop:'1.2em'}}>결제 내역</h4>
                  <BuyPay>구독내역</BuyPay>
                </FirstContainer>
                <PayInfoContainer>
                  <PayTopContainer>
                    <h4 style={{flex: '0.3'}}></h4>
                    <h4 style={{flex: '1.9', marginTop: "1rem",fontSize:'18px',fontWeight:'700', display: "flex", float: "left", color: "#747474"}}>시작 날짜</h4>
                    <h4 style={{flex: '1.25', marginTop: "1rem",fontSize:'18px',fontWeight:'700', display: "flex", float: "left", color: "#747474"}}>만료 날짜</h4>
                    <h4 style={{flex: '1.7', marginTop: "1rem",fontSize:'18px',fontWeight:'700', color: "#747474"}}>상품 정보</h4>
                    <h4 style={{flex: '1.5', marginTop: "1rem",fontSize:'18px',fontWeight:'700', display: "flex", float: "left", color: "#747474"}}>주문 번호</h4>
                    <h4 style={{flex: '1.2', marginTop: "1rem",fontSize:'18px',fontWeight:'700', color: "#747474"}}>금액</h4>      
                  </PayTopContainer>
                  {data.length === 0 ? (
                <NoSubcript>
                 구독내역이 없습니다.
                </NoSubcript>
                   ) : (
                  <>
                  <PayBottomContainer>
                    <PayList>
                    {[...data].reverse().map((purchase) => (
                  <div key={purchase._id} style={{display: 'flex', flexDirection: 'row',height:'50px',alignItems:'center',borderBottom: '2px solid pink'}}>
                  <h5 style={{flex: '2.5',fontSize:'18px'}}>{new Date(purchase.start_date).toLocaleString().slice(0, -3)}</h5>
                  <h5 style={{flex: '2.5',fontSize:'18px'}}>{new Date(purchase.end_date).toLocaleString().slice(0, -3)}</h5>
                  <h5 style={{flex: '1.5',fontSize:'18px'}}>{purchase.name}</h5>
                  <h5 style={{flex: '2.5',fontSize:'18px'}}>{purchase.merchant_uid}</h5>
                  <h5 style={{flex: '1.5',fontSize:'18px'}}>₩{purchase.amount}</h5>
                </div>
                ))}
                </PayList>
                  </PayBottomContainer>       
                {data.length > 0 && (<PayTotalContainer>TOTAL : {data.length}</PayTotalContainer>)}
             </>
        )}
                </PayInfoContainer>
              </PaymentSmallContainer>
            </PaymentContainer>
            <div className='2' style={{flex:'4'}}></div>
          </Container>
          </div>
    
  
  );
};

const NoSubcript = styled.div`

font-size: 40px;
align-items: center;
display: flex;
height: 200px;
width: 1100px;
margin: auto;
justify-content: center;
`
const Container = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height: 600px;
`

const PaymentContainer = styled.div`
display: flex;
flex: 5;
flex-direction: column;
`
const PaymentSmallContainer = styled.div`
display: flex;
flex-direction: column;
background-color: #FFF2F4;
border-radius: 10px;
align-items: center;
width: 1235px;
height: 470px;
margin: auto;
`
const FirstContainer = styled.div`
width: 1100px;
height: 60px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`
const BuyPay = styled.button`
color: white;
font-size: 16px;
width: 90px;
height: 32px;
border: none;
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
margin-top: 1rem;
background-color: #FF8199;

&:hover {
  background: #F74E7B; /* 호버 시 테두리 스타일 변경 */
 }

&:focus {
  outline: none; /* 포커스 테두리 제거 */
  border-color: #F74E7B;
}
`

const PayInfoContainer = styled.div`
width: 1100px;
height: 380px;
border-radius: 8px;
display: flex;
flex-direction: column;
background-color: white;
`
const PayTopContainer = styled.div`
display: flex;
flex-direction: row;
margin-top: 0.5rem;
border-bottom: 2px solid hotpink;
height: 60px;
align-items: center;
justify-content: left;
`

const PayBottomContainer = styled.div`
display: flex;
border-radius: 5px;
margin-top: 0.5rem; 
width: 1100px;
height: 300px;
`
const PayList = styled.div`
display: flex;
flex-direction: column;
width: 1100px;
`
const PayTotalContainer = styled.div`
display: flex;
justify-content: right;
width:1050px;
font-size: 19px;
margin-bottom: 2rem;
font-weight: 600;
color: gray;
`

export default SubScriptionPage;