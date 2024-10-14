import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { animateScroll } from "react-scroll";
import ProgressBar from "../Components/ProgressBar"; // ProgressBar 컴포넌트의 import 문 위치 수정
import SevenEmoticon from "../Components/SevenEmotion";
import LiveChatting from "../Components/LiveChatting";
import FaceChatting from "../Components/FaceChatting";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../fonts/Font.css";
import livelogo from "../imgs/livelogo.svg";
import ApexChart from "../Components/ApexChart";
import ChatLine from "../Components/ChatLine";
import styles from '../ApexChart.module.css';
import facestyles from '../Face.module.css';

const LivePage = (props) => {
  const [data, setData] = useState([]); //초깃값은 빈 배열, data 상태변수는 채팅데이터 저장
  const [platform, setPlatform] = useState([]); //0 유튜브, 1 치지직, 2 아프리카 변수
  const [blockedUsers, setBlockedUsers] = useState([]); //차단된 시청자 목록
  const [blackData, setBlackData] = useState([]); //차단된 시청자를 뺀 채팅 데이터
  const [positive, setPositive] = useState(0);
  const [faceAnalysis, setFaceAnalysis] = useState(true); //채팅분석, 얼굴분석페이지 state
  const [total, setTotal] = useState(0);
  const [concurrent, setConcurrent] = useState([]); // 시청자 수
  const BroadCastID = JSON.parse(sessionStorage.getItem("BroadCastID"));
  const user = JSON.parse(sessionStorage.getItem('userInfo')).user;
  const userEmail = String(JSON.parse(sessionStorage.getItem("userInfo")).email); // 사용자 Email
  const channel = String(JSON.parse(sessionStorage.getItem("userInfo")).channels_Id); // 채널 이름
  const youtubeBCID = String(BroadCastID.broadCastID.youtubeBCID); // 사용자 방송 주소
  const chzzkBCID = String(BroadCastID.broadCastID.chzzk);
  const afreecaBID = String(BroadCastID.broadCastID.afreecaBID);
  const afreecaBND = String(BroadCastID.broadCastID.afreecaBND);
  const serverIP = process.env.REACT_APP_FLASK_IP;
  const emotions = ['Nervous', 'Embarrassed', 'Angry', 'Sadness', 'Neutral', 'Happiness', 'Disgust']; //7가지 감정
  const [imageSrc, setImageSrc] = useState(""); //영상분석 이미지
  const [surpriseSeries, setSurpriseSeries] = useState([]);   
  const [fearSeries, setFearSeries] = useState([]);
  const [angrySeries, setAngrySeries] = useState([]);  
  const [sadSeries, setSadSeries] = useState([]);    
  const [neutralSeries, setNeutralSeries] = useState([]); 
  const [happySeries, setHappySeries] = useState([]);   
  const [disgustSeries, setDisgustSeries] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [emotionData, setEmotionData] = useState([]); //영상분석 7가지 감정 데이터
  const [isLoading, setIsLoading] = useState(true);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [platformMappingData, setPlatformMappingData] = useState([]); //플랫폼 매핑 데이터
  const [previousData, setPreviousData] = useState([]); //차트에 표시될 과거 시간 데이터
  const [timeCategories, setTimeCategories] = useState([]); //x축 시간 배열
  const [checkPlatforms, setCheckPlatforms] = useState({    //플랫폼 체크박스 변수
    youchiaf: true,
    youtube: false,
    chizizic: false,
    afreeca: false
  });
  useEffect(() => {
    // 플랫폼 매핑
    const platformMapping = {
      youtube: [0],
      chizizic: [1],
      afreeca: [2],
      youchiaf: [0, 1, 2]
    };

    const activePlatforms = Object.keys(checkPlatforms).filter(platform => checkPlatforms[platform]);
    const activePlatformValues = activePlatforms.flatMap(platform => platformMapping[platform]);

    // 활성화된 플랫폼의 데이터만 필터링
    const filteredData = filteredMessages.filter(message => activePlatformValues.includes(message.platform));

    // updateTotal 함수에서 필터링된 데이터를 사용하여 감정 데이터 업데이트
    const emotionCounts = {
      positive: filteredData.filter(message => message.emotion3 === 1).length,
      negative: filteredData.filter(message => message.emotion3 === 0).length,
      total: filteredData.length
    };

    setBlackData(filteredMessages);
    setPositive(emotionCounts.positive);
    setTotal(emotionCounts.total);
    setPlatformMappingData(filteredData);
  }, [data, checkPlatforms]);

  let intervalId = useRef(null);
  // 사용자 타입에 따른 접근 제한
  const isRestricted = user === "시청자";

  const navigate = useNavigate(); // 페이지이동
  const closebutton = () => {
    //나가기버튼
    clearInterval(intervalId.current);
    sessionStorage.removeItem("BroadCastID");
    if(isRestricted){
      navigate("/");
    } else {
      navigate("/mypage");
    }
  };

  const chatAnalybutton = () => {
    //채팅 분석
    setFaceAnalysis(true);
  };

  const positiveRatio = total === 0 ? 0.5 : positive / total;
  const negativeRatio = 1 - positiveRatio;

  useEffect(() => {
    const springIP = process.env.REACT_APP_GITHUB_IP;
    const port = process.env.REACT_APP_PORT;
    axios.get(`http://${springIP}:${port}/broadcast/getBlackList`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
    })
    .then((res) => {
      setBlockedUsers(res.data);
    })
    .catch((err) => {
      console.error(err);
    })
  }, [])

  useEffect(() => {
    //유튜브 채팅
    // youtubeBCID랑 userEmail을 파라미터로 엔드포인트 접속
    const eventSource = new EventSource(
      `http://${serverIP}:8801/live/${youtubeBCID}/${userEmail}`
    );
    // 채팅이 올라올때마다 이벤트가 발생
    eventSource.addEventListener("message", (event) => {
      try {
        //받아온 데이터 json으로 파싱
        const newData = JSON.parse(event.data.replaceAll("'", '"'));
        // emotion3 필드의 값을 가져와 updateTotal 함수에 전달
        const index = newData["emotion3"];
        setData((prevData) => [...prevData, newData]);
      } catch {
        console.log("error"); 
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    //치지직 채팅
    // userBroadCastAddress랑 userEmail을 파라미터로 엔드포인트 접속
    const eventSource = new EventSource(`http://${serverIP}:8801/Chlive/${chzzkBCID}`);
    // 채팅이 올라올때마다 이벤트가 발생
    eventSource.addEventListener("message", (event) => {
      try {
        //받아온 데이터 json으로 파싱
        const newData = JSON.parse(event.data.replaceAll("'", '"'));
        // emotion3 필드의 값을 가져와 updateTotal 함수에 전달
        const index = newData["emotion3"];
        setData((prevData) => [...prevData, newData]);
      } catch {
        console.log("error");
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    // 아프리카 채팅
    const eventSource = new EventSource(
      `http://${serverIP}:8801/afreecaTV/${afreecaBID}/${afreecaBND}`
    );
    // 채팅이 올라올 때마다 이벤트가 발생
    eventSource.addEventListener("message", (event) => {
      try {
        const newData = JSON.parse(event.data.replaceAll("'", '"'));
        // emotion3 필드의 값을 가져와 updateTotal 함수에 전달
        const index = newData["emotion3"];
        setData((prevData) => [...prevData, newData]);
      } catch {
        console.log("error");
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    // 시청자 수
    const eventSource = new EventSource(
      `http://${serverIP}:8801/concurrentViewers/${youtubeBCID}`
    );

    // 시청자 수가 올라올때마다 이벤트가 발생
    eventSource.addEventListener("message", (event) => {
      try {
        setConcurrent(event.data);
      } catch {
        console.log("error");
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);
  
  // 차단된 시청자와 일치하는 댓글 필터링
  const filteredMessages = data.filter(message => {
    return !blockedUsers.some(user => 
      user.user_id === message.user_id && user.platform === message.platform
    );
  });

  // 채팅 데이터 업데이트 호출
  useEffect(() => {
    updateChartData(data);
  }, [timeCategories]);

  // 채팅분석 라인차트
  const updateChartData = (chatData) => {
    const currentTime = new Date();
    const tenSecondsAgo = new Date(currentTime.getTime() - 10000);

    // 10초 동안의 감정 데이터를 종합
    const filteredChat = chatData.filter(message => {
      return !blockedUsers.some(user => 
        user.user_id === message.user_id && user.platform === message.platform
      );
    });

    // 10초 동안의 감정 데이터를 종합
    const aggregatedData = filteredChat.filter(chat => {
      const chatTime = new Date(chat.dateTime);
      return chatTime >= tenSecondsAgo && chatTime <= currentTime;
    });

    // 감정 확률 합계 및 카운트 초기화
    const emotionSum = {};
    const emotionCount = {};
    emotions.forEach(emotion => {
      emotionSum[emotion] = 0;
      emotionCount[emotion] = 0;
    });

    // 채팅 데이터 반복하여 합계와 카운트 업데이트
    aggregatedData.forEach(chat => {
      Object.keys(chat.emotion7P).forEach(emotion => {
        emotionSum[emotion] += chat.emotion7P[emotion];
        emotionCount[emotion]++;
      });
    });

    // 각 감정의 평균 확률 계산
    const newData = {};
    emotions.forEach(emotion => {
      const probability = emotionCount[emotion] === 0 ? 0 : emotionSum[emotion] / emotionCount[emotion];
      newData[emotion] = Number((probability / 100).toFixed(2));
    });

    // 새로운 시간대 데이터를 추가하고 이전 데이터 관리
    setPreviousData(prev => {
      const updatedData = [...prev, newData];
      if (updatedData.length > 9) {
        updatedData.shift(); // 최대 9개 시간대 유지
      }
      return updatedData;
    });
  };

    // 시간대 카테고리 배열 생성
    useEffect(() => {
      const generateTimeCategories = () => {
        const categories = [];
        const currentTime = new Date();
        for (let i = 0; i < 9; i++) {
          const time = new Date(currentTime.getTime() - i * 10000); // 10초 간격으로 시간대 생성
          const formattedTime = `${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}:${('0' + time.getSeconds()).slice(-2)}`;
          categories.unshift(formattedTime); // 역순으로 추가
        }
        setTimeCategories(categories);
      };
      generateTimeCategories();
      const intervalId = setInterval(generateTimeCategories, 10000); // 10초마다 실행
  
      // 컴포넌트가 언마운트되면 인터벌 제거
      return () => clearInterval(intervalId); 
   }, []);

  //얼굴분석 버튼
  const faceAnalybutton = () => {
    setFaceAnalysis(false);
    setIsStreamLoading(true);
    const facename = String(JSON.parse(sessionStorage.getItem("userInfo")).email);
    const username = facename.substring(0, facename.indexOf('@'));
    // S3에서 이미지 요청
    axios.get(`http://faceflask.iptime.org:1234/img/${username}`)
      .then(response => {
        // 얼굴 분석 시작 요청
        axios.get(`http://faceflask.iptime.org:1234/open/${youtubeBCID}`)
          .then(response => {
            setIsStreamLoading(false);
          })
          .catch(error => {
            console.error('비디오 분석을 시작하는 동안 오류가 발생했습니다:', error);
            alert('비디오 분석을 시작하는 동안 오류가 발생했습니다.');
          });
      })
      .catch(error => {
        console.error('이미지를 요청하는 동안 오류가 발생했습니다:', error);
        alert('얼굴을 찾을 수 없습니다.');
      });
      startFaceAnal();
  };
  
// 얼굴 분석 시작
const startFaceAnal = () => {
  axios.get(
    "http://faceflask.iptime.org:1234/stream"
  )
  .then(response => {
    setEmotionData(response.data);
  })
  .catch(error => {
    console.error("Error fetching image:", error);
  });
};

// 찐데이터
useEffect(() => {
  //영상 분석 시작
  const fetchImage1 = async () => {
    try {
      const response = await axios.get(
        `http://faceflask.iptime.org:1234/emotion_text`,
      );
      setEmotionData(response.data);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
const intervalId = setInterval(fetchImage1, 1000);
fetchImage1();
return () => {
  clearInterval(intervalId);
};
},[]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(prevTime => prevTime + 1000);

      // 'angry' 감정 데이터 업데이트
      const newDataAngry = Object.entries(emotionData)
        .filter(([emotion, value]) => emotion === 'angry')
        .map(([emotion, value], index) => ({
          x: currentTime + index * 1000,
          y: value
        }));
      setAngrySeries(prevData => [...prevData.slice(-9), ...newDataAngry]);

      // 'happy' 감정 데이터 업데이트
      const newDataHappy = Object.entries(emotionData)
        .filter(([emotion, value]) => emotion === 'happy')
        .map(([emotion, value], index) => ({
          x: currentTime + index * 1000,
          y: value
        }));
      setHappySeries(prevData => [...prevData.slice(-9), ...newDataHappy]);

      // 'neutral' 감정 데이터 업데이트
      const newDataNeutral = Object.entries(emotionData)
        .filter(([emotion, value]) => emotion === 'neutral')
        .map(([emotion, value], index) => ({
          x: currentTime + index * 1000,
          y: value
        }));
      setNeutralSeries(prevData => [...prevData.slice(-9), ...newDataNeutral]);

      // 'sad' 감정 데이터 업데이트
      const newDataSad = Object.entries(emotionData)
        .filter(([emotion, value]) => emotion === 'sad')
        .map(([emotion, value], index) => ({
          x: currentTime + index * 1000,
          y: value
        }));
      setSadSeries(prevData => [...prevData.slice(-9), ...newDataSad]);

      // 'surprise' 감정 데이터 업데이트
      const newDataSurprise = Object.entries(emotionData)
        .filter(([emotion, value]) => emotion === 'surprise')
        .map(([emotion, value], index) => ({
          x: currentTime + index * 1000,
          y: value
        }));
        setSurpriseSeries(prevData => [...prevData.slice(-9), ...newDataSurprise]);

      // 'fearseries' 감정 데이터 업데이트
      const newDataFear = Object.entries(emotionData)
      .filter(([emotion, value]) => emotion === 'fear')
      .map(([emotion, value], index) => ({
        x: currentTime + index * 1000,
        y: value
      }));
    setFearSeries(prevData => [...prevData.slice(-9), ...newDataFear]);

      // 'disgust' 감정 데이터 업데이트
      const newDataDisgust = Object.entries(emotionData)
      .filter(([emotion, value]) => emotion === 'disgust')
      .map(([emotion, value], index) => ({
        x: currentTime + index * 1000,
        y: value
      }));
    setDisgustSeries(prevData => [...prevData.slice(-9), ...newDataDisgust]);   
        setIsLoading(false);
          } ,1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [emotionData]);
 

  //체크 박스
  const Checkbox = ({ label, isChecked, onChange }) => (
    <label style={{ marginRight: '1rem' }}>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {label}
    </label>
  );

  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = platform => {
    const updatedCheckPlatforms = {
      youchiaf: false,
      youtube: false,
      chizizic: false,
      afreeca: false
    }
    updatedCheckPlatforms[platform] = true;
    setCheckPlatforms(updatedCheckPlatforms);
    
    if (platform === 'youtube') {
      setPlatform(0);
    } else if (platform === 'chizizic') {
      setPlatform(1);
    } else if (platform === 'afreeca') {
      setPlatform(2);
    } else {
      setPlatform('youchiaf');
    }
  };

  const filterChatByPlatform = chatData => {
    // 선택된 플랫폼에 해당하는 채팅만 필터링하여 반환
    return chatData.filter(chat => {
      if (checkPlatforms.youchiaf) {
        // 통합 체크 시 모든 채팅 표시
        return true;
      } else if (chat.platform === 0 && checkPlatforms.youtube) {
        // 유튜브 체크 시 유튜브 채팅만 표시
        return true;
      } else if (chat.platform === 1 && checkPlatforms.chizizic) {
        // 치지직 체크 시 치지직 채팅만 표시
        return true;
      } else if (chat.platform === 2 && checkPlatforms.afreeca) {
        // 아프리카 체크 시 아프리카 채팅만 표시
        return true;
      } else {
        return false; // 선택된 플랫폼에 해당하지 않는 채팅은 필터링
      }
    });
  }; 


      let progressLogo;
      if (checkPlatforms.youchiaf) {
      progressLogo = null;
      } else if (checkPlatforms.youtube) {
      progressLogo = './img/유튜브 1.png';
      } else if (checkPlatforms.chizizic) {
      progressLogo = './img/치지직 1.png';
      } else if (checkPlatforms.afreeca) {
      progressLogo = './img/아프리카 1.png';
      }

      return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {faceAnalysis && (
        <ChatContainer>
          <ChattitleContainer>
            <TitleDiv>
              <Chattitle>라이브 스트리밍</Chattitle>
            </TitleDiv>
            <ButtonDiv>
              {user === "크리에이터" && (
                <>
                  <ChatAnalyButton onClick={chatAnalybutton}>
                    <strong>채팅 분석</strong>
                  </ChatAnalyButton>
                  <FaceAnalyButton onClick={faceAnalybutton}>
                    <strong>얼굴 분석</strong>
                  </FaceAnalyButton>
                </>
              )}
              {user === "시청자" && (
                <ChatAnalyButton onClick={chatAnalybutton}>
                  <strong>채팅 분석</strong>
                </ChatAnalyButton>
              )}
              <ExitButton onClick={closebutton}>
                <strong>나가기</strong>
              </ExitButton>
            </ButtonDiv>
          </ChattitleContainer>
          <MiddleContainer>
            <LeftContainer>
              <LiveChattingContainer>
                <LiveStreamingTitle>
                  <LiveStreamingThree>
                    <img
                      src={livelogo}
                      style={{ display: "flex", width: "70px", height: "50px" }}
                    />
                    <LiveTitle>실시간 채팅</LiveTitle>
                    <LiveHumanCount>시청자수 : {concurrent}명</LiveHumanCount>
                  </LiveStreamingThree>
                </LiveStreamingTitle>
                <LiveChatting data={{ data: filterChatByPlatform(filteredMessages), platform }} />
                <EmotionExplain>
                  <ThreeEmotion>
                    <div>
                      <img
                        style={{ width: "25px", height: "25px" }}
                        src="./emoticons/Good.K.png"
                      ></img>
                      긍정
                    </div>
                    <div>
                      <img
                        style={{ width: "25px", height: "25px" }}
                        src="./emoticons/JungRip.K.png"
                      ></img>
                      중립
                    </div>
                    <div>
                      <img
                        style={{ width: "25px", height: "25px" }}
                        src="./emoticons/Bad.K.png"
                      ></img>
                      부정
                    </div>
                  </ThreeEmotion>
                  <SevenEmotion>
                    <img
                      style={{ width: "25px", height: "25px" }}
                      src="./emoticons/불안.png"
                    ></img>
                    불안
                    <img
                      style={{ width: "25px", height: "25px" }}
                      src="./emoticons/당황.png"
                    ></img>
                    당황
                    <img
                      style={{ width: "25px", height: "25px" }}
                      src="./emoticons/화남.png"
                    ></img>
                    화남
                    <img
                      style={{ width: "25px", height: "25px" }}
                      src="./emoticons/슬픔.png"
                    ></img>
                    슬픔
                    <img
                      style={{ width: "25px", height: "25px" }}
                      src="./emoticons/중립.png"
                    ></img>
                    중립
                    <img
                      style={{ width: "25px", height: "25px" }}
                      src="./emoticons/행복.png"
                    ></img>
                    행복
                    <img
                      style={{ width: "25px", height: "25px" }}
                      src="./emoticons/역겨움.png"
                    ></img>
                    역겨움
                  </SevenEmotion>
                </EmotionExplain>
              </LiveChattingContainer>
            </LeftContainer>
            <RightContainer>
              <UserTextContainer>
                <UserText>
                  USER {JSON.parse(sessionStorage.getItem("userInfo")).name}님
                </UserText>
                <CheckBoxContainer>
                <Checkbox label="통합" isChecked={checkPlatforms.youchiaf} onChange={() => handleCheckboxChange('youchiaf')} />
                <Checkbox label="유튜브" isChecked={checkPlatforms.youtube} onChange={() => handleCheckboxChange('youtube')} />
                <Checkbox label="치지직" isChecked={checkPlatforms.chizizic} onChange={() => handleCheckboxChange('chizizic')} />
                <Checkbox label="아프리카TV" isChecked={checkPlatforms.afreeca} onChange={() => handleCheckboxChange('afreeca')} />
                </CheckBoxContainer>
              </UserTextContainer>
              <ProgressBarContainer>
                <ProgressBarEmoticon>
                  <ProgressBarSmallEmoticon>
                    <img
                      className="Positive"
                      alt="Positive"
                      src="emoticons/Good.K.png"
                      style={{
                        width: "35px",
                        height: "35px",
                        filter: `opacity(${positiveRatio})`,
                        transition: "filter 0.1s",
                      }}
                    />
                    {progressLogo && (
                    <img src={progressLogo} alt="Platform Logo" style={{ width: '30px', height: '30px', alignSelf: 'center' }} /> )}
                    <img
                      className="Angry"
                      alt="Title"
                      src="emoticons/Bad.K.png"
                      style={{
                        width: "35px",
                        height: "35px",
                        filter: `opacity(${negativeRatio})`,
                        transition: "filter 0.1s",
                      }}
                    />
                  </ProgressBarSmallEmoticon>
                </ProgressBarEmoticon>
                <ProgressBarSmallContainer>
                <ProgressBar
  positive={platformMappingData.filter(chat => chat.emotion3 === 1).length}
  total={platformMappingData.length}
/>
                  <ProgressBarTextContainer>
                    <PositiveText>Positive</PositiveText>
                    <NegativeText>Negative</NegativeText>
                  </ProgressBarTextContainer>
                </ProgressBarSmallContainer>
              </ProgressBarContainer>
              <SevenEmoticonContainer>
                <SevenEmoticon data={platformMappingData} />
              </SevenEmoticonContainer>
              <ChatLineContainer>
              <ChatLine timeCategories={timeCategories} previousData={previousData} />
              </ChatLineContainer>
            </RightContainer>
          </MiddleContainer>
        </ChatContainer>
      )}
        {!faceAnalysis && ( //여기서부터 얼굴분석 컴포넌트
          <ChatContainer>
            <ChattitleContainer>
              <TitleDiv>
                <Chattitle>라이브 스트리밍</Chattitle>
                <StartAnalyDiv>
                {/* <StartAnalyButton onClick={startFaceAnal}><strong>분석 시작</strong></StartAnalyButton> */}
                </StartAnalyDiv>
              </TitleDiv>
              <ButtonDiv>
                {user === '크리에이터' && (
                <>
                <ChatAnalyButton onClick={chatAnalybutton}><strong>채팅 분석</strong></ChatAnalyButton>
                <FaceAnalyButton onClick={faceAnalybutton}><strong>얼굴 분석</strong></FaceAnalyButton>
                </>
                )}
                {user === '시청자' && (
                <ChatAnalyButton onClick={chatAnalybutton}><strong>채팅 분석</strong></ChatAnalyButton>
                )}
                <ExitButton onClick={closebutton}><strong>나가기</strong></ExitButton>
              </ButtonDiv>
            </ChattitleContainer>
            <MiddleContainer>
              <LeftContainer>
                <LiveChattingContainer>
                
        <FaceMedia>
        <div id="chart">
      {isStreamLoading ? (
        <div className={facestyles.loadingContainer}>
          <div className={facestyles.loader}></div>
        </div>
      ) : (
          <img
            src={"http://faceflask.iptime.org:1234/stream"}
            width="500"
            height="280"
          />
        )}
    </div>
        </FaceMedia>
                  <LiveStreamingTitle>
                    <LiveStreamingThree>
                      <img
                        src={livelogo}
                        style={{
                          display: "flex",
                          width: "70px",
                          height: "50px",
                        }}
                      />
                      <LiveTitle>실시간 채팅</LiveTitle>
                      <LiveHumanCount>시청자수 : {concurrent}명</LiveHumanCount>
                    </LiveStreamingThree>
                  </LiveStreamingTitle>
                  <FaceChatting data={{filteredMessages, platform}} />
                </LiveChattingContainer>
              </LeftContainer>
              <RightContainer>
                <ApexChart data={{isLoading, happySeries, sadSeries, angrySeries, surpriseSeries, disgustSeries, fearSeries, neutralSeries}} />
              </RightContainer>
            </MiddleContainer>
          </ChatContainer>
        )}
      </div>
  );
};

const ChatContainer = styled.div`
display: flex;
flex-direction: column;
flex: 1;
height: 800px;
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
flex: 5;
align-items: flex-end;
justify-content: left;
`
const Chattitle = styled.div`
color: black;
text-align: left;
margin-left: 5rem;
font-size: 40px;
font-weight: 700;
font-family: "Noto Sans chat";
`

const StartAnalyDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 240px;
`
const StartAnalyButton = styled.button`
color: black;
border-radius: 5px;
height: 30px;
width: 80px;
margin-left: 3px;
background-color: white;
border: 3px solid white;
&:hover {
  background-color: #e9ecef;
}
`
const ButtonDiv = styled.div`
display: flex;
flex: 5;
justify-content: flex-end;
align-items: flex-end;
margin-right: 3rem;
`

//채팅 분석 버튼
const ChatAnalyButton = styled.button`
  color: black;
  border-radius: 5px;
  height: 30px;
  width: 80px;
  background-color: white;
  border: 3px solid white;
  &:hover {
    background-color: #e9ecef;
  }
`;

//얼굴 분석 버튼
const FaceAnalyButton = styled.button`
  display: flex;
  justify-content: space-between;
  color: black;
  border-radius: 5px;
  height: 30px;
  width: 80px;
  background-color: white;
  margin-left: 0.5rem;
  border: 3px solid white;
  &:hover {
    background-color: #e9ecef;
  }
`;
//나가기 버튼  
  const ExitButton = styled.button`
  color: black;
  border-radius: 5px;
  height: 30px;
  width: 80px;
  margin-left: 0.5rem;
  background-color: white;
  border: 3px solid white;
  &:hover {
    background-color:#e9ecef; 
  }
  `

  const MiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  `
  const LeftContainer = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin-right: 2rem;
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
  flex: 5;
  height: 630px;
  background-color: white;
  border-radius: 5px;
  justify-content: center;
  margin: auto;
  margin-right: 3rem;
  overflow-y: auto;
  `

const ChatLineContainer = styled.div`
display: flex;
align-items: center;
width: 680px;
margin: 0 auto;
margin-top: 1rem;
flex: 7;
`;
const UserTextContainer = styled.div`
display: flex;
height: 50px;
margin-top: 15rem;
justify-content: space-between;
`
const UserText = styled.div`
font-size: 24px;
margin-left: 3.2rem;
font-family: "Noto Sans chat";
font-weight: 700;
`
const ProgressBarContainer = styled.div`
  flex:1;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 0.5rem;
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
const AfreecaContainer = styled.div`
display: flex;
flex-direction: column;
background-color: orange;
width: 210px;
height: 100px;
align-items: center;
justify-content: center;
`
const SevenEmoticonContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 700px;
margin: 0 auto;
flex: 7;
`

const FaceMedia = styled.div`
  display: flex;
  height: 280px;
  width: 500px;
  margin-top: 0.6rem;
  justify-content: center;
  border-radius: 5px;
  margin-left: 2rem;
  background-color: white;
  font-size: 40px;
  margin-bottom: 0.5rem;
`;

const StyledFaceLiveChatting = styled.div`
background-color: white;
width: 500px;
height: 290px;
border-radius: 5px;
margin-top: 0.2rem;
margin-left: 2rem;
`;

const SmallChatContainer = styled.div`
  overflow-y: auto;
  height: 100%;
`;
const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem; // 여백 조정 가능
`;


export default LivePage;