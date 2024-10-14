import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactWordcloud from 'react-wordcloud';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import One from '../imgs/one.png';
import Two from '../imgs/two.png';
import Three from '../imgs/three.png';
import tag from '../imgs/tag.png';
import { ClipLoader } from 'react-spinners';

const Trendcontents = () => {
    const today = new Date();   // 현재 시간 가져오기
    
    const year = today.getFullYear();   // 현재 년도
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // 현재 월
    const day = ('0' + today.getDate()).slice(-2);  // 현재 일

    const dateString = year + '-' + month  + '-' + day; // 현재 년, 월, 일

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    const categories = userInfo && userInfo.category ? userInfo.category.map(String) : [];  // 사용자 카테고리
    const category = categories.length > 0 ? categories[0] : "1";    // session에 저장되어 있는 카테고리 Number
    const categoryList = [  // 카테고리 select array
        { key: "1", value: "영화/드라마" },
        { key: "2", value: "자동차/차량" },
        { key: "10", value: "음악" },
        { key: "15", value: "애완 동물/동물" },
        { key: "17", value: "스포츠" },
        { key: "20", value: "게임" },
        { key: "22", value: "Vlog" },
        { key: "23", value: "코미디" },
        { key: "24", value: "엔터테인먼트" },
        { key: "25", value: "뉴스/정치" },
        { key: "26", value: "Howto/Style" },
        { key: "28", value: "과학/기술" },]

    const initialCategory = categoryList.find(c => c.key === category); // 세션에 저장되어 있는 카테고리를 categoryList의 key와 비교 후 해당하는 객체 삽입
    const [categorySelectKey, setCategorySelectKey] = useState(initialCategory.key);   // 카테고리 select Key
    const [categorySelectValue, setCategorySelectValue] = useState(initialCategory.value);   // 카테고리 select Value
    const [trendList, setTrendList] = useState([]); // 카테고리 트랜드 리스트
    const [wordList, setWordList] = useState([]); // 카테고리 워드 클라우드 리스트
    const [categoryVideo, setCategoryVideo] = useState([]); // 카테고리 영상 리스트
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true); // 로딩 상태를 true로 설정
        const serverIP = process.env.REACT_APP_FLASK_IP;
        axios.get(`http://${serverIP}:8801/categoryTop10`, {    // 카테고리 키워드 순위
            params: {
                videoCategoryId: categorySelectKey
            }
        })
        .then((res) => {
          setWordList(res.data.Top10Tags.map((item) => ({ text: item[0], value: item[1] })));
          setTrendList(res.data.Top10Tags);
          setCategoryVideo(res.data.videos);
          setIsLoading(false); // 로딩 상태를 false로 설정
        })
        .catch((Error) => { console.log(Error) });
    }, [categorySelectKey]);

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

    const callbacks = {
        onWordClick: (word) => {
            window.open(`https://www.youtube.com/results?search_query=${word.text}`, "_blank");
        }
    };

    const options = {
        rotations: 2,
        rotationAngles: [0, 0],
        fontSizes: [30, 80],
        fontFamily: "Noto Sans KR"
    };

    const LoadingSpinner = () => (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ClipLoader color="#FF8199" size={150} />
          
        </div>
        <strong>잠시만 기다려주세요. 최신 트렌드를 찾는 중입니다.</strong>
        </>
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <FirstName>
                <h2>최신 트렌드 콘텐츠 제공</h2>
            </FirstName>
            <TopContainer>
                <TopTitle>
                    <span>{dateString} "{categorySelectValue}" 최신 트렌드</span>
                </TopTitle>
                <TopSelect>
                    <CategorySelect
                        value={categorySelectValue}
                        onChange={(e) => {
                            const selectedKey = e.target.selectedOptions[0].getAttribute('data-key');
                            setCategorySelectKey(selectedKey);
                            setCategorySelectValue(e.target.value);
                        }}
                    >
                        {categoryList.map(date => (
                            <option key={date.key} data-key={date.key} value={date.value}>{date.value}</option>
                        ))}
                    </CategorySelect>
                </TopSelect>
            </TopContainer>
            <MiddleContainer>
                <LeftContainer>
                    <LeftTitle>
                        <span>{dateString} 최신 트렌드</span>
                    </LeftTitle>
                    <LeftWordCloud>
                        <ReactWordcloud words={wordList} options={options} callbacks={callbacks} />
                    </LeftWordCloud>
                </LeftContainer>
                <RightContainer>
                    {trendList.map((item, index) => (
                        <ListItem key={index}>
                            <a href={`https://www.youtube.com/results?search_query=${item[0]}`} target="_blank" rel="noopener noreferrer">
                                {index === 0 && <span style={{ fontWeight: '600' }}><img src={One} alt="1위" />{" " + item[0]}</span>}
                                {index === 1 && <span style={{ fontWeight: '600' }}><img src={Two} alt="2위" />{" " + item[0]}</span>}
                                {index === 2 && <span style={{ fontWeight: '600' }}><img src={Three} alt="3위" />{" " + item[0]}</span>}
                                {index === 9 && <span>&nbsp;{(index + 1)}&nbsp;&nbsp;{item[0]}</span>}
                                {index > 2 && index < 9 && <span>&nbsp;{(index + 1)}&nbsp;&nbsp;&nbsp;{item[0]}</span>}
                                <span>{item[1]}&nbsp;<img src={tag} alt="tag"/></span>
                            </a>
                        </ListItem>
                    ))}
                </RightContainer>
            </MiddleContainer>
            <BottomContainer>
                <LeftTitle>
                    <span>"{categorySelectValue}" 트렌드 실시간 급상승 동영상</span>
                </LeftTitle>
                <BottomVideo>
                    <VideoDiv>
                    {categoryVideo.map((item, index) => {
                        const truncatedTitle = item.title.length > 23 ? item.title.substring(0, 23) + "..." : item.title
                        if(index < 4) {
                            return (
                                <VideoItem key={index}>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <img src={item.thumbnails_Url}/>
                                        <h6>{truncatedTitle}</h6>
                                        <p>조회수 {formatViews(item.views)}</p>
                                    </a>
                                    <a href={item.channelUrl} target="_blank" rel="noopener noreferrer">
                                        <Channel>
                                            <img src={item.channelImage}/>
                                            <span>{item.channelTitle}</span>
                                        </Channel>
                                    </a>
                                </VideoItem>
                            )
                        }
                    })}
                    </VideoDiv>
                </BottomVideo>
            </BottomContainer>
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
    )
}

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

const TopContainer = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const TopTitle = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    margin-left: 1rem;

    span {
        font-size: 17px;
        font-weight: bold;
    }
`

const TopSelect = styled.div`
    width: 10%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-right: 1rem;
`

const CategorySelect = styled.select`
    width: 120px;
    height: 60%;

    &:focus {
        outline: none; /* 포커스 테두리 제거 */
        color: black;
    }
`

const MiddleContainer = styled.div`
    width: 98%;
    height: 300px;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const LeftContainer = styled.div`
    width: 64%;
    height: 100%;
`

const LeftTitle = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: start;
    margin-left: 1rem;

    span {
        font-size: 17px;
        font-weight: bold;
    }
`

const LeftWordCloud = styled.div`
    width: 100%;
    height: 90%;
`

const RightContainer = styled.div`
    width: 35%;
    height: 100%;
`

const ListItem = styled.div`
    border-bottom: 1px solid #F3F3F3;
    line-height: 17px;

    a {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        margin: 0.35rem;
        font-size: 16px;
        color: #333;
    }
    img {
        width: 20px;
        height: 20px;
    }
`;

const BottomContainer = styled.div`
    width: 100%;
    height: 300px;
    margin-top: 1rem;
`

const BottomVideo = styled.div`
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
`

const VideoDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
`

const VideoItem = styled.div`
    width: 290px;
    height: 250px;

    img {
        width: 290px;
        height: 160px;
        border-radius: 8px;
    }

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

export default Trendcontents;