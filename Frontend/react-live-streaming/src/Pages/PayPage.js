import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PayPage = (props) => {
  //결제 등급
  const levels = [
    {name: "베이직", price: 0, order: 1},
    {name: "스탠다드", price: 100, order: 2},
    {name: "스타트업", price: 49000, order: 3},
    {name: "프로페셔널", price: 129000, order: 4},
    {name: "엔터프라이즈", price: 390000, order: 5}
  ]
      
  const [selectedLevel, setSelectedLevel] = useState(null);   //결제 등급
  const navigate = useNavigate();
  const [IMP, setIMP] = useState(null); //결제 화면
  const [paymentData, setPaymentData] = useState(null); // 결제 데이터 상태 변수 추가

  const handlePayment = (level) => {
      // sessionStorage에서 userInfo 가져오기
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (userInfo) {
        // 사용자의 상품이름
        const currentLevelName = userInfo.class_name;
        // 현재 사용자의 멤버십 등급 순서를 찾습니다.
        const currentLevelOrder = levels.find(lv => lv.name === currentLevelName)?.order;
        
        if (level.order <= currentLevelOrder) {
          alert('이 상품은 구매 불가합니다.');
          return;
        }
      } else {
        alert('로그인해주세요.');
        return;
      }
      setSelectedLevel(level);
  
      //결제에 사용되는 정보
      const data = {
        pg: 'html5_inicis', // PG사
        pay_method: 'card', //결제수단
        merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
        name: level.name,   //상품이름
        amount: level.price,  //상품가격
        buyer_name: userInfo.name, // 구매자 이름
        buyer_email: userInfo.email, // 구매자 이메일   
      };
      setPaymentData(data);
      IMP.request_pay(data, (response) => callback(response, data));
  }

  //결제창 띄우는 기능
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js';
    script.async = true;
    
    script.onload = () => {
      setIMP(window.IMP);
      window.IMP.init('imp64486410');
    };

    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
     }; 
     
   }, []);

//결제 성공여부
const callback = async (response, paymentData) => {
  const { success, error_msg } = response;
  if (success) {
    alert("결제 성공");
    if (paymentData) {
      try {
        const serverIP = process.env.REACT_APP_GITHUB_IP;
        const port = process.env.REACT_APP_PORT;
        await axios.post(`http://${serverIP}:${port}/pay/saveClass`, {
          apply_num: String(response.apply_num),
          name: String(paymentData.name),
          amount: String(paymentData.amount),
          merchant_uid: String(paymentData.merchant_uid)
        }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` }
        })
        .then((res)=> {
               if (res.data !== "400") { //성공했다면 live창으로 이동
                 navigate('/infonav/subscript');

                 // Update user info in sessionStorage
                 const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                 userInfo.class_name = paymentData.name;
                 sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                 
                } else {
                 alert("해당 URI는 사용자 정보와 맞지 않습니다.");
                }
        });
      } catch (error){
        console.error('서버에 요청하는 동안 오류 발생', error);
      }
    } else {
      console.error('결제 정보가 부족합니다');
    }
  } else {
    alert(`결제 실패: ${error_msg}`);
  }
}

  return (
    <PayContainer>
        <Text_div>
            <h1>더 많은 기능이 필요하신가요?</h1>
            <h6>적합한 멤버십으로 효율적인 마케팅을 시작해 보세요. 구독해지는 언제든 가능합니다.</h6>
        </Text_div>
        <Scroll_div>
            <Card>
                <h4>베이직</h4>
                <h6>무료 제공 솔루션</h6>
                <h2>무료</h2>
                <h5>✓ 월 광고 제안 5회</h5>
                <h5>✓ 즐겨찾기 제공(채널, 영상)</h5>
                <button onClick={() => handlePayment(levels[0])}>시작하기</button>
            </Card>
            <Card>
                <h4>스탠다드</h4>
                <h6>광고 제안의 첫걸음</h6>
                <h2>₩19,000</h2>
                <h5>✓ 월 광고 제안 10회</h5>
                <h5>✓ 시청자 분석 기능 20회</h5>
                <h5>✓ 광고 단가 기능 20회</h5>
                <h5>✓ 즐겨찾기 제공(채널, 영상)</h5>
                <h5>✓ 유튜브 채널 비교</h5>
                <button onClick={() => handlePayment(levels[1])}>시작하기</button>
            </Card>
            <Card>
                <h4>스타트업</h4>
                <h6>유튜버 매칭을 위한 솔루션</h6>
                <h2>₩49,000</h2>
                <h5>✓ 월 광고 제안 100회</h5>
                <h5>✓ 시청자 분석 기능 100회</h5>
                <h5>✓ 광고 단가 기능 100회</h5>
                <h5>✓ 즐겨찾기 제공(채널, 영상)</h5>
                <h5>✓ 유튜브 채널 비교</h5>
                <h5>✓ 데이터 다운로드</h5>
                <button onClick={() => handlePayment(levels[2])}>시작하기</button>
            </Card>
            <Card>
                <h4>프로페셔널</h4>
                <h6>효율적인 마케팅을 위한 솔루션</h6>
                <h2>₩129,000</h2>
                <h5>✓ 월 광고 제안 500회</h5>
                <h5>✓ 시청자 분석 기능 무제한</h5>
                <h5>✓ 광고 단가 기능 무제한</h5>
                <h5>✓ 즐겨찾기 제공(채널, 영상)</h5>
                <h5>✓ 유튜브 채널 비교</h5>
                <h5>✓ 데이터 다운로드</h5>
                <button onClick={() => handlePayment(levels[3])}>시작하기</button>
            </Card>
            <Card>
                <h4>엔터프라이즈</h4>
                <h6>데이터 분석을 위한 모든 솔루션</h6>
                <h2>₩390,000</h2>
                <h5>✓ 월 광고 제안 3000회</h5>
                <h5>✓ 프로페셔널 모든 기능</h5>
                <h5>✓ 맞춤 페이지 제작</h5>
                <button onClick={() => handlePayment(levels[4])}>시작하기</button>
            </Card>
        </Scroll_div>
    </PayContainer>
)
}

const PayContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Text_div = styled.div`
margin-top: 2rem;
h1 {
font-weight: 600;
}
h6 {
margin-top: 1rem;
}
`

const Scroll_div = styled.div`
width: 100%;
display: flex;
overflow: auto;
margin-top: 4rem;
justify-content: center;
`

const Card = styled.div`
width: 250px;
height: 400px;
background-color: #f4f4f4;
display: inline-block;
padding: 1rem;
margin-right: 20px;
text-align: center;
box-sizing: border-box;
position: relative;

h2 {
margin-top: 1.5rem;
margin-bottom: 1.5rem;  
font-size: 35px;
}

h4 {
font-size: 18px;
color: pink;
font-weight: bold;
}

h5 {
font-size: 13px;
text-align: left;
margin-left: 1rem;
margin-bottom: 0.75rem;
}

h6 {
font-size: 16px;
}

button {
width: 80%;
height: 50px;
background-color: pink;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 18px;
font-weight: 600;
position: absolute;  // 버튼의 위치를 절대적으로 설정
bottom: 1rem;  // div의 맨 아래에서 1rem 위로 올림
left: 50%;  // div의 가운데로 50% 이동
transform: translateX(-50%);  // div의 가운데로 50% 이동
&:hover {
  background-color: hotpink;
}
}
`


export default PayPage;