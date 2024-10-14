import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { ClipLoader } from 'react-spinners';

const Videosetiment = () => {
    const [channelInfo, setChannelInfo] = useState([]);
    const [videos, setVideos] = useState([]);
    const [sequence, setSequence] = useState("date");
    const [channelDescription, setChannelDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [medium, setMedium] = useState(true);
    const [isOn, setIsOn] = useState(false);
    const [showAllTags, setShowAllTags] = useState(false);
    const channel_id = "@ChimChakMan_Official";//String(JSON.parse(sessionStorage.getItem("userInfo"))?.channels_Id);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true); // 로딩 상태를 true로 설정
        const serverIP = process.env.REACT_APP_FLASK_IP;
        axios.get(`http://${serverIP}:8801/myVideo`, {
            params: {
                channel_id: channel_id,
                sequence: sequence,
                videoType: medium ? 'medium' : 'short'
            }
        }).then((res) => {
            setChannelInfo(res.data.channel_info);
            setVideos(res.data.videos);
            setChannelDescription(res.data.channel_info.channelDescription.length > 55 ? res.data.channel_info.channelDescription.substring(0, 55) + "..." : res.data.channel_info.channelDescription);
            setIsLoading(false); // 로딩 상태를 false로 설정
        }).catch((error) => {
            console.error(error);
        })
    }, [sequence, medium]);

    const videoButton = (video) => {
        navigate('/videoinfo', { state: { video } });
    }

    const toggleSwitch = () => {    // 토글 버튼
        setIsOn(!isOn);
        setMedium(!medium);
    };

    const handleShowMore = () => {  // 더보기 버튼
        setShowAllTags(!showAllTags);
    };

    // 회수 형식 변환 함수
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

    // 명수 형식 변환 함수
    const formatPeoples = (number) => {
        const num = parseInt(number);
        if (num >= 100000000) {
          return `${Math.floor(num / 100000000)}억명`;
        } else if (num >= 10000) {
          return `${Math.floor(num / 10000)}만명`;
        } else {
          return `${num}명`;
        }
    }

    // 날짜 형식 변환 함수
    const formatPublishedTime = (dateStr) => {
        return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: ko });
    }

    const LoadingSpinner = () => (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ClipLoader color="#FF8199" size={150} />
          
        </div>
        <strong>잠시만 기다려주세요. 채널 정보를 가져오는 중입니다.</strong>
        </>
    );

    return (
        <div>
            <div style={{ width: '171vh', height: '100vh' }}>
                <TopContainer>
                    <TopLeftContainer>
                        <img src={channelInfo.channelImage}/>
                    </TopLeftContainer>
                    <TopMidContainer>
                        <h3>{channelInfo.channelTitle}</h3>
                        <h5>{formatPeoples(channelInfo.subscriberCount)}</h5>
                        <h5>{channelInfo.videoCount}개</h5>
                        <h6>{channel_id}</h6>
                        {channelDescription != "" ? 
                            <h6 style={{ color: '#808080' }}>{channelDescription}</h6>
                        :
                            <h6 style={{ color: '#808080' }}>소개하는 글이 없습니다.</h6>
                        }
                    </TopMidContainer>
                    <TopRightContainer>
                        <TextContainer>
                            <span>동영상&ensp;</span>
                            <ToggleContainer onClick={toggleSwitch} isOn={isOn}>
                                <ToggleKnob isOn={isOn} />
                            </ToggleContainer>
                            <span>&ensp;숏폼</span>
                        </TextContainer>
                        <ButtonContainer>
                            <DateButton onClick={() => setSequence("date")} isValid={sequence == "date"}>최신순</DateButton>
                            <RatingButton onClick={() => setSequence("rating")} isValid={sequence == "rating"}>인기순</RatingButton>
                        </ButtonContainer>
                    </TopRightContainer>
                </TopContainer>
                <FontContainer>
                    {sequence == "date" ?
                    <h4>{channelInfo.channelTitle} 최신 동영상</h4>
                    :
                    <h4>{channelInfo.channelTitle} 인기 동영상</h4>
                    }
                </FontContainer>
                <ButtomContainer>
                    <VideoDiv>
                        {videos.map((item, index) => {
                            const truncatedTitle = item.title.length > 70 ? item.title.substring(0, 70) + "..." : item.title
                            return (
                            <VideoItem key={index}>
                                <VideoLeft>
                                    <button onClick={() => videoButton(item)}>
                                        <img src={item.thumbnails_Url}/>
                                    </button>
                                </VideoLeft>
                                <VideoRight>
                                    <button onClick={() => videoButton(item)}>
                                        <span>{truncatedTitle}</span>
                                        <span>조회수 {formatViews(item.views)} · {formatPublishedTime(item.publishedAt)}</span>
                                    </button>
                                    <a href={`https://youhttps://www.youtube.com/channel/${channel_id}`} target="_blank" rel="noopener noreferrer">
                                        <Channel>
                                            <img src={channelInfo.channelImage}/>
                                            <span>{channelInfo.channelTitle}</span>
                                        </Channel>
                                    </a>
                                    <TagContainer>
                                        {item.tags.slice(0, showAllTags ? item.tags.length : 15).map((tag, index) => (
                                            <TagItem key={index}>{tag}</TagItem>
                                        ))}
                                        {item.tags.length > 15 && (
                                        <ShowMoreButton onClick={handleShowMore}>
                                            {showAllTags ? '숨기기' : '...더보기'}
                                        </ShowMoreButton>
                                        )}
                                        {item.tags.length <= 0 && (
                                            <h5>해시태그가 없습니다.</h5>
                                        )}
                                    </TagContainer>
                                </VideoRight>
                            </VideoItem>
                            )
                        })}
                    </VideoDiv>
                </ButtomContainer>
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
        </div>
    )
}

const TopContainer = styled.div`
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const TopLeftContainer = styled.div`
    width: 33%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }
`

const TopMidContainer = styled.div`
    width: 28%;
    height: 100%;
    text-align: left;
    display: flex;
    flex-direction: column;
    aligin-items: between-around;
`

const TopRightContainer = styled.div`
    width: 33%;
    height: 95%;
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: end;
`

const TextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.5rem;
`

const ToggleContainer = styled.div`
    position: relative;
    width: 60px;
    height: 34px;
    background-color: ${props => props.isOn ? '#F74E7B' : '#ccc'};
    border-radius: 34px;
    cursor: pointer;
    transition: background-color 0.2s;
`;

const ToggleKnob = styled.div`
    position: absolute;
    top: 2px;
    left: ${props => props.isOn ? '26px' : '2px'};
    width: 30px;
    height: 30px;
    background-color: #fff;
    border-radius: 50%;
    transition: left 0.2s;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 0.8rem;
`

const DateButton = styled.button`
    border: none;
    border-radius: 15px;
    background-color: white;
    background: ${props => (props.isValid ? '#f0f0f0' : 'white')};

    &:hover {
        background: #f0f0f0 0% 0% no-repeat padding-box;
    }
`

const RatingButton = styled.button`
    border: none;
    border-radius: 15px;
    background-color: white;
    background: ${props => (props.isValid ? '#f0f0f0' : 'white')};

    &:hover {
        background: #f0f0f0 0% 0% no-repeat padding-box;
    }
`

const FontContainer = styled.div`
    width: 100%;
    height: 50px;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: start;
    align-items: center;

    h4 {
        color: #615B5B;
        font-weight: bold;
        margin-left: 3rem;
    }
`

const ButtomContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    display: flex;
    flex-direction: row;
    margin-left: 1rem;
    border-bottom: 1px solid black;
`

const VideoLeft = styled.div`
    margin-left: 3rem;
    display: flex;
    justify-content: center;
    
    img {
        width: 320px;
        height: 180px;
        border-radius: 30px;
    }

    button {
        border: none;
        border-radius: 30px;
        background-color: white;
    }
`

const VideoRight = styled.div`
    margin-top: 1rem;
    margin-left: 3rem;
    text-align: left;

    h5 {
        font-size: 18px;
        float: left;
    }

    span {
        color: #4D4949;
        font-size: 23px;
        display: flex;
        align-items: flex-start;
    }

    a {
        text-decoration: none;
        color: black;
    }

    button {
        border: none;
        border-radius: 30px;
        background-color: white;
    }

    p {
        font-size: 23px;
        display: flex;
        align-items: flex-start;
        color: #4D4949;
    }
`

const Channel = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 0.5rem;

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

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    h5 {
        color: #adb5bd;
        margin-top: 0.6rem;
    }
`

const TagItem = styled.div`
    background-color: #f0f0f0;
    color: #333;
    border-radius: 20px;
    padding: 5px 10px;
    margin-right: 10px;
    margin-bottom: 5px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #e0e0e0;
    }
`

const ShowMoreButton = styled.button`
    background: none;
    border: none;
    color: #ccc;
    cursor: pointer;
    margin-top: 2px;

    &:hover {
        color: #333;
        text-decoration: underline;
    }
`;

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

export default Videosetiment;