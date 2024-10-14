import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import url_logo from '../imgs/ggg.png';
import copy_img from '../imgs/copy.png';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const Aicontents = () => {
    const category = "예시) 코딩";
    //전송하기 버튼 클릭여부
    const [buttonClicked, setButtonClicked] = useState(false);
    const [url, setUrl] = useState(category);
    const [firstFocus, setFirstFocus] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [categoryInputKey, setCategoryInputKey] = useState(category);   // 카테고리 input Key
    const [categoryVideo, setCategoryVideo] = useState([{'url': 'https://www.youtube.com/watch?v=utRReYFhRYY', 'title': '초등학생 진로에 코딩이 도움된다', 'thumbnails_Url': 'https://i.ytimg.com/vi/utRReYFhRYY/mqdefault.jpg', 'channelTitle': '해달에듀 haedaledu', 'channelImage': 'https://yt3.ggpht.com/ScEjtO7tB9Bx5nWIxREpn6Vy4l6DNOMUJ-CUXbVm9L7ES9QfEH6Ol3ROWgA9k3vUB30nLBMXhf0=s88-c-k-c0x00ffffff-no-rj', 'channelUrl': 'https://www.youtube.com/@haedaledu', 'views': '61'}, {'url': 'https://www.youtube.com/watch?v=bcLp3khM4mM', 'title': '코딩으로 서울대 보내는 코딩학원', 'thumbnails_Url': 'https://i.ytimg.com/vi/bcLp3khM4mM/mqdefault.jpg', 'channelTitle': '해달에듀 haedaledu', 'channelImage': 'https://yt3.ggpht.com/ScEjtO7tB9Bx5nWIxREpn6Vy4l6DNOMUJ-CUXbVm9L7ES9QfEH6Ol3ROWgA9k3vUB30nLBMXhf0=s88-c-k-c0x00ffffff-no-rj', 'channelUrl': 'https://www.youtube.com/@haedaledu', 'views': '75'}, {'url': 'https://www.youtube.com/watch?v=3KVPMiab7rs', 'title': '딱, 1시간 여유있어요? 블로그보다 쉽게 무코딩으로 웹사이트 만들어 하루만에 수익화 하는 방법 무료 공개합니다.', 'thumbnails_Url': 'https://i.ytimg.com/vi/3KVPMiab7rs/mqdefault.jpg', 'channelTitle': '공간대여 김선달(공간으로 돈버는 사람들)', 'channelImage': 'https://yt3.ggpht.com/Y7IBYQYDOcig3NOubBJgeujEt2o6qsB4CnWS-frRlgHHQTum1_qhXCA9un-ZSso3CeFQxeHNHg=s88-c-k-c0x00ffffff-no-rj', 'channelUrl': 'https://www.youtube.com/@김선달', 'views': '1090'}, {'url': 'https://www.youtube.com/watch?v=Jvnd1nNJ4UY', 'title': '[마감꿀팁🔥] 엑셀 남은 기간, 자동으로 강조하는 방법 #직장인엑셀 #shorts', 'thumbnails_Url': 'https://i.ytimg.com/vi/Jvnd1nNJ4UY/mqdefault.jpg', 'channelTitle': '오빠두엑셀 l 엑셀 강의 대표채널', 'channelImage': 'https://yt3.ggpht.com/LhSbId1mYfR-X_Osu1kWiHHZITrd12nu_bBR8mJZlRN15cePr0ySehG2N72Bl6BIw7T1eZ1P=s88-c-k-c0x00ffffff-no-rj', 'channelUrl': 'https://www.youtube.com/@oppadu', 'views': '95818'}]); // 카테고리 영상 리스트
    const [categoryContent, setCategoryContent] = useState({'new_titles': '"웹사이트 제작부터 엑셀 자동화까지: 코딩, 게임 이론, 보고서 개선 방법까지 배우기"', 'hashtags': '#웹사이트제작 #코딩교육 #게임이론 #엑셀자동화 #프로그래밍 #기술스킬', 'summary': '이 영상들은 웹사이트 제작, 코딩 교육, 게임 이론, 그리고 엑셀 자동화 기능을 사용하여 보고서를 개선하는 방법을 설명합니다.', 'content_ideas': '제목: 웹사이트 제작부터 엑셀 자동화까지: 당신의 기술을 업그레이드하는 완벽 가이드\n\n1. **소개**\n   - 호스트가 인사하며 오늘의 주제인 웹사이트 제작, 코딩 교육, 게임 이론, 엑셀 자동화 기능에 대해서 소개한다.\n   - 각 주제가 어떻게 서로 연관되어 있고, 이러한 기술들이 일상생활과 직업에서 어떻게 유용하게 쓰일 수 있는지 개괄적으로 설명한다.\n\n2. **웹사이트 제작**\n   - 웹사이트의 기본 구조와 필요한 도구들을 소개한다 (HTML, CSS, JavaScript).\n   - 심플한 웹사이트 프로젝트를 시작하여 기본적인 페이지를 만드는 과정을 실시간으로 보여준다.\n   - 관련된 최신 기술 트렌드와 유용한 리소스를 공유한다.\n\n3. **코딩 교육**\n   - 코딩이 왜 중요한지, 어떻게 시작하는지에 대해 설명한다.\n   - 파이썬 같은 접근하기 쉬운 프로그래밍 언어를 예로 들며, 간단한 코드를 작성하고 실행하는 방법을 보여준다.\n   - 코딩을 배움으로써 얻을 수 있는 이득과 진로 가능성에 대해 논의한다.\n\n4. **게임 이론**\n   - 게임 이론의 기본 개념과 게임 설계에 있어서의 중요성을 설명한다.\n   - 실생활에서 게임 이론이 적용된 사례를 소개하고, 간단한 게임을 통해 이론을 설명한다.\n   - 게임 개발과 관련된 유용한 플랫폼과 도구들을 추천한다.\n\n5. **엑셀 자동화 기능**\n   - 엑셀의 기본 사용법과 자동화 기능의 필요성에 대해 설명한다.\n   - VBA 스크립팅 및 매크로를 활용하여 보고서 작성을 자동화하는 방법을 단계별로 실습한다.\n   - 데이터 가공에서부터 보고서 완성에 이르는 과정을 보여주며, 실무에서의 응용 예를 들어 설명한다.\n\n6. **결론 및 리소스 공유**\n   - 오늘 다룬 모든 주제들을 잠시 복습하멀로서 시청자들이 어떻게 각 기술을 활용할 수 있는지 최종 정리한다.\n   - 추가 학습을 위한 온라인 무료 리소스, 도서, 그리고 커뮤니티를 소개한다.\n   - 시청자의 피드백을 요청하고, 궁금한 점이 있으면 코멘트로 남기라고 격려한다.\n\n7. **마무리 인사**\n   - 시청해 주셔서 감사하다는 말과 함께 다음 비디오에서 더 유익한 정보를 공유할 것을 약속한다.\n   - 구독, 좋아요, 알림 설정을 할 것을 재차 상기시키며 비디오를 마친다.'}); // 카테고리 맞춤형 리스트
    const inputRef = useRef(null);  // useRef 추가
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            if (categoryInputKey !== category) {
                setCategoryInputKey(category);
            }
        }
    };

    // 입력창에 카테고리 입력 과정
    const urlChange = (e) => {
        const length = e.target.value; 
        setCategoryInputKey(length);
        if (length.length >= 1) { 
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    // 입력 전송 과정
    const handleSubmit = (event) => {
        event.preventDefault(); // 폼 제출될 때 기본 동작 막음
        setButtonClicked(true);
        contentButton();
    };

    //enter로도 버튼기능을 쓸 수 있음
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
            inputRef.current.blur();
        }
    };

    const contentButton = () => {
        setIsLoading(true); // 로딩 상태를 true로 설정
        const serverIP = process.env.REACT_APP_FLASK_IP;
        axios.get(`http://${serverIP}:8801/content`, {    // 카테고리 영상
            params: {
                videoTitle: categoryInputKey
            }
        })
        .then((res) => {
          setCategoryVideo(res.data.videos);
          setCategoryContent(res.data.analysis);
          setIsLoading(false); // 로딩 상태를 false로 설정
        })
        .catch((Error) => { 
            console.log(Error);
            alert("해당 카테고리는 검색되지 않습니다.\n예시) 축구, 게임, 등");
            window.location.replace("/aicontents");
        });
    };

    const handleCopyClipBoard = (title, text) => {
        const $textarea = document.createElement("textarea"); // 임시요소 생성해서 부착하고
        document.body.appendChild($textarea);
        $textarea.value = text;
        $textarea.select(); // 선택해서
        document.execCommand("copy"); // 복사하고
        document.body.removeChild($textarea); // 임시 요소 제거까지
        alert(`${title} 복사되었습니다.`);
    };

    const formatViews = (number) => {
        const num = parseInt(number);
        if (num >= 100000000) {
          return `${Math.floor(num / 100000000)}억회`;
        } else if (num >= 10000) {
          return `${Math.floor(num / 10000)}만회`;
        } else {
          return `${num}회`;
        }
    }

    const LoadingSpinner = () => (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ClipLoader color="#FF8199" size={150} />
        </div>
        <strong>약 40초정도 소요될 예정입니다.<br/>잠시만 기다려주세요. 콘텐츠 생성 중입니다.</strong>
        </>
    );

    return (
        <Container>
            <FirstName>
                <h2>맞춤형 콘텐츠 제공</h2>
            </FirstName>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <LeftContainer>
                    <LeftTop>
                        <span>카테고리 검색</span>
                        <InputText
                            ref={inputRef}
                            type="text"
                            value={categoryInputKey}
                            onChange={urlChange}
                            onKeyPress={handleKeyPress}
                            onFocus={() => {
                                if (firstFocus) {
                                    setCategoryInputKey("");
                                    setFirstFocus(false);
                                }
                            }}
                        />
                        <PinkButton disabled={disabled} onClick={handleSubmit}>
                        <img src={url_logo}/>
                        </PinkButton>
                    </LeftTop>
                    <LeftBottom>
                        <VideoDiv>
                        {categoryVideo.map((item, index) => {
                            const truncatedTitle = item.title.length > 70 ? item.title.substring(0, 70) + "..." : item.title
                            return (
                            <VideoItem key={index}>
                                <VideoLeft>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <img src={item.thumbnails_Url}/>
                                    </a>
                                </VideoLeft>
                                <VideoRight>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <h6>{truncatedTitle}</h6>
                                        <p>조회수 {formatViews(item.views)}</p>
                                    </a>
                                    <a href={item.channelUrl} target="_blank" rel="noopener noreferrer">
                                        <Channel>
                                            <img src={item.channelImage}/>
                                            <span>{item.channelTitle}</span>
                                        </Channel>
                                    </a>
                                </VideoRight>
                            </VideoItem>
                            )
                        })}
                        </VideoDiv>
                    </LeftBottom>
                </LeftContainer>
                <RightContainer>
                    <Title>
                        <TopTitle>
                            <span>콘텐츠 제목</span>
                            <button onClick={() => handleCopyClipBoard("콘텐츠 제목이", categoryContent.new_titles)}><img src={copy_img}/></button>
                        </TopTitle>
                        <BottomValue>
                            <pre>{categoryContent.new_titles}</pre>
                        </BottomValue>
                    </Title>
                    <Hashtag>
                        <TopTitle>
                            <span>해시태그</span>
                            <button onClick={() => handleCopyClipBoard("해시태그가", categoryContent.hashtags)}><img src={copy_img}/></button>
                        </TopTitle>
                        <BottomValue>
                            <pre>{categoryContent.hashtags}</pre>
                        </BottomValue>
                    </Hashtag>
                    <Summary>
                        <TopTitle>
                            <span>요약</span>
                            <button onClick={() => handleCopyClipBoard("요약이", categoryContent.summary)}><img src={copy_img}/></button>
                        </TopTitle>
                        <BottomValue>
                            <pre>{categoryContent.summary}</pre>
                        </BottomValue>
                    </Summary>
                    <Sinalio>
                        <TopTitle>
                            <span>시나리오</span>
                            <button onClick={() => handleCopyClipBoard("시나리오가", categoryContent.content_ideas)}><img src={copy_img}/></button>
                        </TopTitle>
                        <BottomValue>
                            <pre>{categoryContent.content_ideas}</pre>
                        </BottomValue>
                    </Sinalio>
                </RightContainer>
                {isLoading ? (
                    <ModalOverlay>
                        <ModalContent>
                            <LoadingSpinner />
                        </ModalContent>
                    </ModalOverlay>
                ) : (
                    null
                )}
            </div>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
`;

const FirstName = styled.div`
    width: 100%;
    height: 10%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 2rem;

    h2 {
    margin-left: 5rem;
    font-size: 30px;
    font-weight: 700;
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

const LeftContainer = styled.div`
    width: 63%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;

    @media (min-width: 352px) {
        width: 800px;
    }

    @media (max-width: 1408px) {
        width: 800px;
    }

    @media (min-width: 1616px) {
        width: 63%;
    }

    @media (min-height: 352px) {
        height: 740px;
    }
`

const LeftTop = styled.div`
    width: 100%;
    height: 50px;
    margin-top: 0.8rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    span {
        font-size: 17px;
        font-weight: bold;
    }
`

const InputText = styled.input`
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #DBDBDB;
    width: 520px;
    height: 35px;
    text-align: center;
    color: #A3A3A3;

    &:hover {
    border-color: hotpink; /* 호버 시 테두리 스타일 변경 */
    }
    &:focus {
    outline: none; /* 포커스 테두리 제거 */
    border-color: hotpink;
    color: black;
    }
`;

//전송하기 버튼
const PinkButton = styled.button`
    width: 60px;
    height: 33.5px;
    background-color: #FF8199;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-left: 10px;

    img {
        width: 23px;
        height: 23px;
    }

    &:hover {
        background: #FF8199 0% 0% no-repeat padding-box;
    }
`;

const LeftBottom = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
`

const VideoDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`

const VideoItem = styled.div`
    width: 100%;
    height: 160px;
    display: flex;
    flex-direction: row;
    margin-left: 1rem;
`

const VideoLeft = styled.div`
    img {
        width: 290px;
        height: 160px;
        border-radius: 8px;
    }
`

const VideoRight = styled.div`
    margin-left: 1rem;

    h5 {
        font-size: 18px;
        float: left;
    }

    h6 {
        font-size: 14px;
        font-weight: 700;
        margin-top: 10px;
        display: flex;
        align-items: flex-start;
    }

    a {
        text-decoration: none;
        color: black;
    }

    p {
        font-size: 15px;
        display: flex;
        align-items: flex-start;
        font-weight: 600;
        color: #747474;
    }
`

const Channel = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: -0.5rem;

    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    span {
        font-size: 14px;
        margin-left: 0.5rem;
    }
`

const RightContainer = styled.div`
    width: 35%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 1000px) {
        width: 0px;
    }

    @media (min-width: 1050px) {
        width: 16%;
    }

    @media (min-width: 1200px) {
        width: 30%;
    }

    @media (min-width: 1408px) {
        width: 35%;
    }

    @media (min-height: 352px) {
        height: 740px;
    }
`

const Title = styled.div`
    width: 90%;
    height: 85px;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Hashtag = styled.div`
    width: 90%;
    height: 110px;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Summary = styled.div`
    width: 90%;
    height: 190px;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Sinalio = styled.div`
    width: 90%;
    height: 265px;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const TopTitle = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #D9D9D9;

    span {
        font-size: 17px;
        font-weight: bold;
        margin-left: 1rem;
    }

    button {
        width: 25px;
        margin-right: 1rem;
        border: none;
        background-color: white;
    }

    img {
        width: 25px;
        height: 25px;
    }
`

const BottomValue = styled.div`
    width: 95%;
    height: calc(100% - 45px);
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 0.4rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    pre {
        white-space: pre-wrap;
        text-align: left;
        font-size: 14px;
    }
`

export default Aicontents;