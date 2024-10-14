import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { animateScroll } from 'react-scroll';
import { ResponsiveRadar } from '@nivo/radar' //오각형 차트
import ProgressBar from '../Components/ProgressBar'; // ProgressBar 컴포넌트의 import 문 위치 수정
import SevenEmoticon from '../Components/SevenEmotion';
import LiveChatting from '../Components/LiveChatting';
import { useNavigate } from 'react-router-dom';
import "../fonts/Font.css";
import livelogo from '../imgs/livelogo.svg'

const generateDummyChatData = (count) => {
  const emoticonIndices = [0, 1, 2, 3, 4, 5, 6];
  const newchats = [];

  for (let i = 0; i < count; i++) {
    const randomAuthor = `User${Math.floor(Math.random() * 3) + 1}`;
    const randomDateTime = new Date().toLocaleTimeString();
    const randomMessage = `This is message ${i + 1}`;
    const randomEmotion3 = emoticonIndices[Math.floor(Math.random() * emoticonIndices.length)];
    const randomEmotion7 = emoticonIndices[Math.floor(Math.random() * emoticonIndices.length)];

    const chat = {
      author: randomAuthor,
      dateTime: randomDateTime,
      message: randomMessage,
      emotion3: randomEmotion3,
      emotion7: randomEmotion7,
    };

    newchats.push(chat);
  }

  return newchats;
};

const Facesetiment = (props) => {
  const [data, setData] = useState(generateDummyChatData(20));   //초깃값은 빈 배열, data 상태변수는 채팅데이터 저장
  const [positive, setPositive] = useState(0);
  const [faceAnalysis, setFaceAnalysis] = useState(true);   //채팅분석, 얼굴분석페이지 state
  const [total, setTotal] = useState(0);
  const [subcnt, setSubcnt] = useState([]); // 구독자 수
  const [concurrent, setConcurrent] = useState([]); // 시청자 수
  const BroadCastID = JSON.parse(sessionStorage.getItem('BroadCastID'));
  const userEmail = String(JSON.parse(sessionStorage.getItem('userInfo'))._id); // 사용자 Email
  const channel = String(JSON.parse(sessionStorage.getItem('userInfo')).channels_Id); // 채널 이름
  const userBroadCastAddress = String(BroadCastID.broadCastID); // 사용자 방송 주소
  const serverIP = process.env.REACT_APP_GITHUB_IP;
  let intervalId = useRef(null);
  const navigate = useNavigate(); // 페이지이동
  const positiveRatio = total === 0? 0.5 : positive / total;
  const negativeRatio = 1 - positiveRatio;

  const closebutton = () => {   //나가기버튼
    clearInterval(intervalId.current);
    sessionStorage.removeItem('BroadCastID');
    navigate("/mypage");
  }

  const chatAnalybutton = () => { //채팅 분석 
    setFaceAnalysis(true);
  }

  const faceAnalybutton = () => { //얼굴 분석
    setFaceAnalysis(false);
  }

  const updateTotal = (index) => {
    if (index === 0 || index === 1) {   //감정인덱스가 부정이거나 긍정이면 SetTotal에 +1
      setTotal((prevTotal) => prevTotal + 1);
      if (index === 1) {    //감정인덱스가 긍정이면 긍정 +1
        setPositive((prevPositive) => prevPositive + 1);
      }
    }
  };

useEffect(() => {
  // userBroadCastAddress랑 userEmail을 파라미터로 엔드포인트 접속
  const eventSource = new EventSource(`http://${serverIP}:8801/live/${userBroadCastAddress}/${userEmail}`);

  // 채팅이 올라올때마다 이벤트가 발생
  eventSource.addEventListener('message', (event) => {
    try {
      //받아온 데이터 json으로 파싱
      const newData = JSON.parse(event.data.replaceAll("'", '"'));
      // emotion3 필드의 값을 가져와 updateTotal 함수에 전달
      const index = newData["emotion3"];
      updateTotal(index);
      setData((prevData) => [...prevData, newData]);
    } catch {
        console.log("error") 
    }
  });

  return () => {
    eventSource.close();   
  };

}, []); 

useEffect(() => {
  // 시청자 수
  const eventSource = new EventSource(`http://${serverIP}:8801/concurrentViewers/${userBroadCastAddress}`);

  // 시청자 수가 올라올때마다 이벤트가 발생
  eventSource.addEventListener('message', (event) => {
    try {
      setConcurrent(event.data);
    } catch {
        console.log("error") 
    }
  });

  return () => {
    eventSource.close();   
  };

}, []); 

useEffect(() => {
  const intervalId = setInterval(() => {
    setData((prevData) => [...prevData, ...generateDummyChatData(20)]);
  }, 20000);

  return () => {
    clearInterval(intervalId);
  };
}, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행

useEffect(() => { // 서버
  intervalId.current = setInterval(async () => {
      try{
      const response = await fetch(`http://${serverIP}:8801/subcnt/${channel}`);  // 구독자 수
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      const responseData = await response.json();

      setSubcnt(responseData);
      } catch (error) {
      console.error(error);
      }
  }, 5000); // 5초마다 실시간 구독자 수 가져오기
  return () => {
    clearInterval(intervalId.current);
  };
}, []);

const MyResponsiveRadar = ({ data /* see data tab */ }) => (        //오각형 차트
    <ResponsiveRadar
        data={data}
        keys={[ 'Surprised', 'Sadness', 'Angry', 'Neutrality', 'Happiness' ]}
        indexBy="taste"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)

return (  
    <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
      <ChatContainer>
        <ChattitleContainer>
          <TitleDiv>
            <Chattitle>라이브 스트리밍</Chattitle>
          </TitleDiv>
          <ButtonDiv>
            <ChatAnalyButton onClick={chatAnalybutton}><strong>채팅 분석</strong></ChatAnalyButton>
            <FaceAnalyButton onClick={faceAnalybutton}><strong>얼굴 분석</strong></FaceAnalyButton>
            <ExitButton onClick={closebutton}><strong>나가기</strong></ExitButton>
          </ButtonDiv>
        </ChattitleContainer>
        <MiddleContainer>
          <LeftContainer>
            <LiveChattingContainer>
              <LiveStreamingTitle>
                <LiveStreamingThree>
                  <img src={livelogo} style={{display:'flex', width:'70px',height:'50px'}}/>
                  <LiveTitle>실시간 채팅</LiveTitle>
                  <LiveHumanCount>시청자수 : {concurrent}명</LiveHumanCount>
                </LiveStreamingThree>
              </LiveStreamingTitle> 
              <LiveChatting data={data}/>
              <EmotionExplain>
                <ThreeEmotion>
                  <div><img style={{width:'25px',height:'25px'}} src='./emoticons/Good.K.png'></img>긍정</div>
                  <div><img style={{width:'25px',height:'25px'}} src='./emoticons/JungRip.K.png'></img>중립</div>
                  <div><img style={{width:'25px',height:'25px'}} src='./emoticons/Bad.K.png'></img>부정</div>
                </ThreeEmotion>
                <SevenEmotion>
                  <img style={{width:'25px',height:'25px'}} src='./emoticons/불안.png'></img>불안
                  <img style={{width:'25px',height:'25px'}} src='./emoticons/당황.png'></img>당황
                  <img style={{width:'25px',height:'25px'}} src='./emoticons/화남.png'></img>화남
                  <img style={{width:'25px',height:'25px'}} src='./emoticons/슬픔.png'></img>슬픔
                  <img style={{width:'25px',height:'25px'}} src='./emoticons/중립.png'></img>중립
                  <img style={{width:'25px',height:'25px'}} src='./emoticons/행복.png'></img>행복
                  <img style={{width:'25px',height:'25px'}} src='./emoticons/역겨움.png'></img>역겨움  
                </SevenEmotion>
              </EmotionExplain>
            </LiveChattingContainer>
          </LeftContainer>
          {faceAnalysis ? ( // faceAnalysis가 false 경우
            <RightContainer>
              <UserTextContainer>
                <UserText>USER {JSON.parse(sessionStorage.getItem('userInfo')).name}님</UserText>
              </UserTextContainer>
              <ProgressBarContainer>
                <ProgressBarEmoticon>
                  <ProgressBarSmallEmoticon>  
                    <img className="Positive" alt="Positive" src="emoticons/Good.K.png" 
                      style={{ width: '35px', height: '35px', filter: `opacity(${positiveRatio})`, transition: 'filter 0.1s' }}/>
                    <img className="Angry" alt="Title" src="emoticons/Bad.K.png" 
                      style={{ width: '35px', height: '35px', filter: `opacity(${negativeRatio})`, transition: 'filter 0.1s' }}/>
                  </ProgressBarSmallEmoticon>
                </ProgressBarEmoticon>
                <ProgressBarSmallContainer>
                  <ProgressBar positive={positive} total={total} />
                  <ProgressBarTextContainer>
                    <PositiveText>Positive</PositiveText>
                    <NegativeText>Negative</NegativeText>
                  </ProgressBarTextContainer>
                </ProgressBarSmallContainer>
              </ProgressBarContainer>
              <SevenEmoticonContainer>
                <SevenEmoticon data={data} /> 
              </SevenEmoticonContainer>
            </RightContainer>
          ) : (
            <RightContainer>
              <UserTextContainer>
                <UserText>USER {JSON.parse(sessionStorage.getItem('userInfo')).name}님</UserText>
              </UserTextContainer>
              <MyResponsiveRadar data={data} />
            </RightContainer>
          )}
        </MiddleContainer>
      </ChatContainer>
    </div>
  );
}
  const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 750px;
  background-color:#FFF2F4;
  `

  // #e9ecef
  const ChattitleContainer = styled.div`
  height: 100px;
  display: flex;
  flex-direction: row;
  `
  const TitleDiv = styled.div`
  display: flex;
  flex: 4.5;
  align-items: flex-end;
  justify-content: left;
  `
  const Chattitle = styled.div`
  color: black;
  text-align: left;
  margin-left: 5rem;
  font-size: 40px;
  font-weight: 500;
  `
  const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex: 5.5;
  justify-content: flex-end;
  align-items: flex-end;
  margin-right: 3rem;
  `
  const ChatAnalyButton = styled.button`
  color: black;
  border-radius: 5px;
  height: 30px;
  width: 80px;
  background-color: white;
  border: 3px solid white;
  &:hover {
    background-color:#e9ecef; 
  }
  `

  const FaceAnalyButton = styled.button`
  display : flex;
  justify-content: space-between;
  color: black;
  border-radius: 5px;
  height: 30px;
  width: 80px;
  background-color: white;
  margin-left: 5px;
  border: 3px solid white;
  &:hover {
    background-color:#e9ecef; 
  }
  `

  const ExitButton = styled.button`
  color: black;
  border-radius: 5px;
  height: 30px;
  width: 80px;
  background-color: white;
  border: 3px solid white;
  margin-left: auto;
  &:hover {
    background-color:#e9ecef; 
  }
  `
 
  const MiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 650px;
  `
  const LeftContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin-left: 1rem;
  margin-right: 1rem;
  align-items:center; 
  justify-content:center;
  `
  const LiveStreamingTitle = styled.div`
  height: 45px;
  width: 500px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  margin-left: 2rem;
  background-color: white;
  margin-bottom: 0.2rem;
  `
  const LiveTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans chat";
  `
  const LiveStreamingThree = styled.div`
  width: 500px;
  display: flex;
  justify-content: space-around;
  `
  const LiveChattingContainer = styled.div`
  flex: 9;
  display: flex;
  align-items:center;
  justify-content: center;
  flex-direction: column;
  `
  const EmotionExplain = styled.div`
  display: flex;
  height: 60px;
  margin-left: 2rem;
  width: 500px;
  border-radius: 10px;
  background-color: white;
  flex-direction: column;
  `
  const ThreeEmotion = styled.div`
  display: flex;
  flex: 4;
  align-items: center;
  justify-content: space-around;
  margin-top: 3px;
  h6 {
    margin-left: 1.5rem;
    font-size: 18px;
    color: black  ;
  }
  `
  const SevenEmotion = styled.div`
  display: flex;
  flex: 6;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
  `
  const LiveHumanCount = styled.div`
  display: flex;
  color: gray;
  align-items: flex-end;
  margin-bottom: 0.5rem;

  `
  const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  height: 630px;
  background-color: white;
  border-radius: 5px;
  justify-content: center;
  margin: auto;
  margin-right: 3rem;
  `
  const UserTextContainer = styled.div`
  flex:1;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  `
  const UserText = styled.div`
  font-size: 20px;
  margin-left: 2.5rem;
  font-family: "Noto Sans chat";
  font-weight: 700;
  `
  const ProgressBarContainer = styled.div`
  flex:2;
  display: flex;
  align-items: center;
  flex-direction: column;
  `
  const ProgressBarEmoticon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: 90%;
  flex: 4;
  `
  const ProgressBarSmallEmoticon = styled.div`
  display: flex;
  width: 90%;
  margin: 0 auto;
  flex: 4;
  justify-content: space-between;
  `
  const ProgressBarSmallContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex: 8;
  `
  const ProgressBarTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%; 
  margin: 0 auto; 
  font-size: 24px;
  color: gray;
  font-weight: 600;
  font-family: "Noto Sans chat";
  `
  const PositiveText = styled.div`
  `;

  const NegativeText = styled.div`
  
  `;
  
  const SevenEmoticonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 700px;
  margin: auto;
  flex: 7;
  `
export default Facesetiment;