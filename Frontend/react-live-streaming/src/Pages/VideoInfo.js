import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";
import Guest from '../imgs/guest.png';
import ThreePieChats from '../charts/ThreePieChats';
import SevenPieChats from '../charts/PieChats';
import { formatDistanceToNow, parseISO } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { ClipLoader } from 'react-spinners';
import { useInView } from 'react-intersection-observer';
import styles from '../VideoInfo.module.css';

const VideoInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { video } = location.state;
    const [comment, setComment] = useState([]);
    const [emotion3Data, setEmotion3Data] = useState([]);
    const [emotion7Data, setEmotion7Data] = useState([]);
    const [nextPageToken, setNextPageToken] = useState("");
    const [initialLoading, setInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const videoTitle = video.title.length > 25 ? video.title.substring(0, 25) + "..." : video.title;

    const { ref, inView } = useInView({
      threshold: 1.0,
    });

    const backButton = () => {
        navigate('/videosetiment');
    }

    useEffect(() => {
      fetchComments(true);
    }, []);

    useEffect(() => {
        if (inView && !isLoading) {
            fetchComments(false);
        }
    }, [inView]);

    const fetchComments = (initial = false) => {
      if (initial) {
        setInitialLoading(true); // 처음 로딩 상태를 true로 설정
      } else {
        setIsLoading(true); // 추가 로딩 상태를 true로 설정
      }
        const serverIP = process.env.REACT_APP_FLASK_IP;
        axios.get(`http://${serverIP}:8801/comment/${video.videoId}`, {
            params: {
                nextPageToken: nextPageToken
            }
        }).then((res) => {
            setComment(prevComments => [...prevComments, ...res.data.comments]);
            setNextPageToken(res.data.nextPageToken);
            updateEmotionData(res.data.comments);
            setInitialLoading(false); // 처음 로딩 상태를 false로 설정
            setIsLoading(false); // 추가 로딩 상태를 false로 설정
        }).catch((error) => {
            console.error(error);
            setInitialLoading(false);
            setIsLoading(false);
        });
    };

    const updateEmotionData = (newComments) => {
      // emotion3 카운트 집계
      const emotion3Counts = newComments.reduce((acc, item) => {
          acc[item.emotion3] = (acc[item.emotion3] || 0) + 1;
          return acc;
      }, {});

      // emotion7 카운트 집계
      const emotion7Counts = newComments.reduce((acc, item) => {
          acc[item.emotion7] = (acc[item.emotion7] || 0) + 1;
          return acc;
      }, {});

      // Emotion3 데이터 매핑
      setEmotion3Data(prevData => [
          { name: 'positive', value: (prevData[0]?.value || 0) + (emotion3Counts[0] || 0) },
          { name: 'neutrality', value: (prevData[1]?.value || 0) + (emotion3Counts[1] || 0) },
          { name: 'negative', value: (prevData[2]?.value || 0) + (emotion3Counts[2] || 0) }
      ]);

      // Emotion7 데이터 매핑
      setEmotion7Data(prevData => [
          { name: 'Nervous', value: (prevData[0]?.value || 0) + (emotion7Counts[0] || 0) },
          { name: 'Embarrassed', value: (prevData[1]?.value || 0) + (emotion7Counts[1] || 0) },
          { name: 'Angry', value: (prevData[2]?.value || 0) + (emotion7Counts[2] || 0) },
          { name: 'Sadness', value: (prevData[3]?.value || 0) + (emotion7Counts[3] || 0) },
          { name: 'Neutral', value: (prevData[4]?.value || 0) + (emotion7Counts[4] || 0) },
          { name: 'Happiness', value: (prevData[5]?.value || 0) + (emotion7Counts[5] || 0) },
          { name: 'Disgust', value: (prevData[6]?.value || 0) + (emotion7Counts[6] || 0) }
      ]);
  };

    //7가지 감정 이모티콘 이미지
    const renderEmotionImage = (emotionIndex) => {
        const emotionImages = [
        "/emoticons/불안.png",
        "/emoticons/당황.png",
        "/emoticons/화남.png",
        "/emoticons/슬픔.png",
        "/emoticons/중립.png",
        "/emoticons/행복.png",
        "/emoticons/역겨움.png"
        ];
        return (
        <img 
            style={{width:"40px",height:"40px",marginLeft:"3%"}} 
            src={emotionImages[emotionIndex]} 
            alt={`Emotion ${emotionIndex}`} 
        />
        );
    };

    //3가지[부정,긍정,중립] 이모티콘
    const renderEmotionIcon = (emotionIndex) => {
        const emotionIcons = [
            "/emoticons/Bad.K.png",
            "/emoticons/Good.K.png",
            "/emoticons/JungRip.K.png",
        ];
        return (
            <img
            style={{width:"40px",height:"40px",marginLeft:"1%"}} 
            src={emotionIcons[emotionIndex]}
            alt={`Emotion ${emotionIndex}`} 
            />
        );
    };

    // 링크를 감지하여 a 태그로 감싸기
    const createMarkup = (content) => {
      const urlRegex = /<a href="(https?:\/\/[^\s]+)">([^<]+)<\/a>/g;
      
      // content를 urlRegex에 맞게 파싱
      const parts = [];
      let lastIndex = 0;
      let match;
  
      while ((match = urlRegex.exec(content)) !== null) {
          // 매칭된 부분 이전의 텍스트를 추가
          if (lastIndex < match.index) {
              parts.push(content.substring(lastIndex, match.index));
          }
  
          // 매칭된 링크를 추가
          parts.push(
              `<a key=${parts.length} href="${match[1]}" target="_blank" rel="noopener noreferrer">${match[2]}</a>`
          );
  
          lastIndex = match.index + match[0].length;
      }
  
      // 마지막 매칭 이후의 텍스트를 추가
      if (lastIndex < content.length) {
          parts.push(content.substring(lastIndex));
      }
  
      return { __html: parts.join('') };
    };

    // 날짜 형식 변환 함수
    const formatPublishedTime = (dateStr) => {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: ko });
    };

    const LoadingSpinner = () => (
      <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ClipLoader color="#FF8199" size={150} />
        
      </div>
      <strong>잠시만 기다려주세요. 영상의 감정 분석 중입니다.</strong>
      </>
  );
    
    return (
        <Container>
          <TopContainer>
            <Title>{videoTitle}</Title>
          </TopContainer>
          <BackContainer>
            <button onClick={backButton}>나가기</button>
          </BackContainer>
          <Header>
            <iframe
                width="610"
                height="365"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                title="YouTube video player"
            ></iframe>
            <Stats>
              <ThreePieChats data={emotion3Data} />
              <SevenPieChats data={emotion7Data} />
            </Stats>
          </Header>
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
          <Content>
            {comment.map((item, index) => {
              return (
                <CommentItem key={index}>
                  <CommentLeft>
                    <a href={`https://youtube.com/${item.authorDisplayName}`} target="_blank" rel="noopener noreferrer">
                      <img src={Guest}/>
                    </a>
                  </CommentLeft>
                  <CommentMid>
                    <a href={`https://youtube.com/${item.authorDisplayName}`} target="_blank" rel="noopener noreferrer">
                      <h5>{item.authorDisplayName}&nbsp;&nbsp;&nbsp;{formatPublishedTime(item.publishedAt)}</h5>
                    </a>
                    <h5 dangerouslySetInnerHTML={createMarkup(item.textDisplay)}></h5>
                  </CommentMid>
                  <CommentRight>
                    {renderEmotionIcon(item.emotion3)}
                    {renderEmotionImage(item.emotion7)}
                  </CommentRight>
                </CommentItem>
              )
            })}
            <div ref={ref} style={{ height: "20px" }} />
          </Content>
          {initialLoading && (
            <ModalOverlay>
              <ModalContent>
                <LoadingSpinner />
              </ModalContent>
            </ModalOverlay>
          )}
          {isLoading && !initialLoading && (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
            </div>
          )}
        </Container>
      );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BackContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;

  button {
    width: 70px;
    background-color: white;
    border: 1px solid black;
    border-radius: 15px;
  }
`;

const Title = styled.h1`
  color: #333;
`;

const EmotionExplain = styled.div`
  display: flex;
  height: 60px;
  margin-left: 2rem;
  width: 500px;
  border-radius: 10px;
  background-color: white;
  flex-direction: column;
`;

const ThreeEmotion = styled.div`
  display: flex;
  flex: 4;
  align-items: center;
  justify-content: space-around;
  margin-top: 3px;
  h6 {
    margin-left: 1.5rem;
    font-size: 18px;
    color: black;
  }
`;

const SevenEmotion = styled.div`
  display: flex;
  flex: 6;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const Header = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Stats = styled.div`
  display: flex;
  align-items: start;
  width: 610px;
  height: 365px;
  background-color: white;
`;

const Content = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 20px;
  // border-bottom: 1px solid black;
`

const CommentLeft = styled.div`
  width: 10%;
  margin-left: 1rem;

  a {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    img {
      width: 60px;
      height: 60px;
    }
  }
`

const CommentMid = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;

  a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    color: #333;
  }
`

const CommentRight = styled.div`
  width: 10%;
  display: flex;
  flex-direction: row;

  img {
    width: 30px;
    height: 30px;
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
`;

export default VideoInfo;