import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { animateScroll } from 'react-scroll';
import "../fonts/Font.css";
import axios from 'axios';

//LivePage에서 props로 채팅데이터르 받음
const FaceChatting = ({ data: {filteredMessages, platform} }) => {
  const chatContainerRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChattingModalVisible, setIsChattingModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  let wrapperRef = useRef();  //모달창 가장 바깥쪽 태그를 감싸주는 역할

  const handleClickOutside=(event)=>{ // 바깥 윈도우 클릭시 modal창 초기화
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      setIsModalVisible(false);
      setIsChattingModalVisible(false);
    }
  }

  useEffect(()=>{ // 모달창 밖을 클릭하면 모달창 꺼짐
    document.addEventListener('mousedown', handleClickOutside);
    return()=>{
      document.removeEventListener('mousedown', handleClickOutside);
    }
  },[])

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight-1);
    }
  };

  
  // 채팅이 들어와도 스크롤은 바닥 고정
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [filteredMessages, isAtBottom]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => {
        chatContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  
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

  const renderImgLogo = ({platform}) => {
      if (platform === 0) {
        return <img src='img/유튜브 1.png' alt="유튜브 아이콘" style={{height:'30px', width: '30px', marginLeft: '1rem'}}/> }
        else if (platform === 1) {
          return <img src='img/치지직 1.png' alt="치지직 아이콘" style={{height:'30px', width: '30px', marginLeft: '1rem'}}/> }
          else {
            return <img src='img/아프리카 1.png' alt="아프리카 아이콘" style={{height:'40px', width: '40px', marginLeft: '0.5rem'}}/>
          }
        };

  // 마우스 오른쪽 클릭 이벤트 핸들러
  const handleRightClick = (event, filteredMessages, index) => {
    event.preventDefault(); // 기본 컨텍스트 메뉴를 방지
    setIsModalVisible(true);
    setUserName(filteredMessages.author);

    setSelectedChat(filteredMessages);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setIsModalVisible(false);
    setIsChattingModalVisible(false);
  };

  const userChatting = (chatData) => {
    setIsModalVisible(false);
    setIsChattingModalVisible(true);
  }

  const userBlack = () => {
    const serverIP = process.env.REACT_APP_GITHUB_IP;
    const port = process.env.REACT_APP_PORT;
    axios.get(`http://${serverIP}:${port}/blackList`, {
      params: {
        userId: userId,
        platform: selectedChat.platform
      }
    }).then((res) => {
      if(res.status == "200") {
        alert(`${userName}(${userId})님을 차단하셨습니다.`);
      } else {
        alert("서버와 접속이 실패하셨습니다.");
      }
    }).catch((error) => {
      alert("서버와 접속이 실패하셨습니다.");
    })
  }

  return (
    <div>
      <MessengerContainer ref={chatContainerRef} id="chat-container" >
        <div className="chat-messages">
          {filteredMessages.map((data, index) => (
            <ChatMessage
              key={index}
              author={data.author}
              onContextMenu={(event) => handleRightClick(event, data, index)}
            >
              <ChatMessage1>
              <AuthorImage>
              {renderImgLogo({ platform: data.platform })}
              <h1 className="author">{data.author}</h1>
              </AuthorImage>
              <p className="message">'{data.message}'</p>
              </ChatMessage1>
              <ChatMessage2>
              <ChatMessage3>
              {renderEmotionIcon(data["emotion3"])}
              {renderEmotionImage(data["emotion7"])}
              </ChatMessage3>
              </ChatMessage2>
            </ChatMessage>
          ))}
        </div>
      </MessengerContainer>
      <div ref={wrapperRef}>
      {isModalVisible && (
        <ModalStyle>
          <FirstLine>
          <h2 className="userName" style={{fontSize:'24px',fontWeight:'600',marginLeft:'1.2rem'}}>{userName}</h2>
          <button style={{fontSize:'24px',marginLeft:'1rem',background:'none',border:'none',marginRight:'1rem'}} onClick={closeModal} title='닫기'>X</button>
          </FirstLine>
          <button style={{width:'100%', textAlign:'left',fontSize:'20px',background:'none',border:'none',marginTop:'1rem',marginLeft:'1rem',marginBottom:'1rem'}} onClick={userChatting} title='채팅 보기'>채팅 보기</button>
          <button style={{width:'100%', textAlign:'left',fontSize:'20px',marginLeft:'1rem',background:'none',border:'none'}} onClick={userBlack} title='블랙리스트 추가'>블랙리스트 추가</button>
          </ModalStyle>
      )}
      {isChattingModalVisible && (
        <ChattingModal>
          <FirstLine>
          <h2 className="userName" style={{fontSize:'24px',fontWeight:'600',marginLeft:'1.2rem',marginTop:'1rem'}}>{userName}</h2>
          <button style={{fontSize:'24px',marginLeft:'1rem',background:'none',border:'none',marginRight:'1rem'}} onClick={closeModal} title='닫기'>X</button>
          </FirstLine>
          <ChattingData>
  {filteredMessages
    .filter(chat => chat.author === userName)
    .map((chat, index) => (
      <ChatMessageContent key={index}>
        <ChatMessageText>{chat.message}</ChatMessageText>
        <ChatMessageTime>{chat.dateTime}</ChatMessageTime>
      </ChatMessageContent>
    ))}
</ChattingData>      
        </ChattingModal>
      )}
      </div>
    </div>
  );
};

//채팅창 컨테이너
const MessengerContainer = styled.div`
  border: 1px solid white;
  border-radius: 5px;
  margin-left: 2rem;
  width: 500px;
  height: 290px;
  margin-bottom: 0.2rem;
  background-color: white;
  overflow-y: auto;     
  &::-webkit-scrollbar {
    width: 8px; 
  }
  &::-webkit-scrollbar-thumb {
    background: #D3D3D3; 
    border-radius: 5px; 
  }

`;

//채팅창 안에서 사용자들의 채팅
const ChatMessage = styled.div`
  margin-top: 1%;
  display: flex;
  flex: 1;
  flex-direction: row;
  img {
    margin-right: 3%;
    width: 3vw;
    height: 3vw;
  }
  
 
  p {
    margin-right: 2%;
    display: flex;
    line-height: 1.3;
    margin-left: 1rem;
    word-break: break-word; 
    align-items: flex-start;
  }

  .author {
    font-weight: bold;
    flex-shrink: 1; /* author 영역이 메시지 영역을 밀어내지 않도록 설정 */
    margin-bottom: 0.5rem; /* author 영역과 다음 메시지 사이의 간격 설정 */
    hyphens: auto; /* 긴 단어를 분리하여 줄바꿈되도록 설정 */
    flex-basis: 30%;
  }
  
  .dateTime {
    font-family: "Noto Sans B0";
    color: blue;
    flex-shrink: 3; /* author 영역이 메시지 영역을 밀어내지 않도록 설정 */
    margin-bottom: 0.1rem; /* author 영역과 다음 메시지 사이의 간격 설정 */
    flex-shrink: 1; 
    white-space: pre-wrap; /* 줄 바꿈을 유지하면서 공백도 유지하도록 설정 */
    word-wrap: break-word; /* 긴 단어를 줄바꿈하여 영역에 맞게 나누도록 설정 */
    hyphens: auto; /* 긴 단어를 분리하여 줄바꿈되도록 설정 */
    flex-basis: 20%;
  }
  .message {
    font-family: "Noto Sans Chat";
    white-space: pre-wrap; /* 줄 바꿈을 유지하면서 공백도 유지하도록 설정 */
    word-wrap: break-word; /* 긴 단어를 줄바꿈하여 영역에 맞게 나누도록 설정 */
    hyphens: auto; /* 긴 단어를 분리하여 줄바꿈되도록 설정 */
    flex-basis: 40%;
  }
`;
const ChatMessage1 = styled.div`
display: flex;
flex-direction: column;
flex: 7.7;
`
const AuthorImage = styled.div`
display: flex;
flex-direction: row;
align-items: center;
 h1 {
    display: flex;
    margin-right: 2%;
    font-size: 20px;
    font-weight: 700;
    margin-top: 8px;
  }
`
const ChatMessage2 = styled.div`
display: flex;
flex: 2.3;
height: 64px;


`
const ChatMessage3 = styled.div`
display: flex;
flex-direction: row;
align-items: center; 
justify-content: space-between; 
padding: 10px; 
`
// 마우스 이벤트 모달
const ModalStyle = styled.div`
  position: absolute;
  width: 400px;
  height: 180px;
  top: 35%; // 상단에서 50% 위치
  left: 25%; // 좌측에서 50% 위치
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  transform: translate(50%, 50%);
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

// 채팅창 모달
const ChattingModal  = styled.div`
  position: absolute;
  width: 400px;
  height: 500px;
  top: -10%; // 상단에서 50% 위치
  left: 28%; // 좌측에서 50% 위치
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1000;
  transform: translate(50%, 50%);
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
`
const FirstLine = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
width: 100%;
`

const ChattingData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  width: 100%;
`;

const ChatMessageContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ChatMessageText = styled.div`
  font-family: "Noto Sans Chat";
  white-space: pre-wrap;
  word-wrap: break-word;
  hyphens: auto;
  margin-left: 1rem;
  padding: 10px;
`;

const ChatMessageTime = styled.div`
  font-family: "Noto Sans B0";
  color: blue;
  margin-right: 1rem;
`;

const ChattingSmall = styled.div`
  display: flex;
  flex-direction: column;
  background: gray;

  max-height: 300px;
  padding: 10px;
`;

export default FaceChatting;