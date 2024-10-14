import React, {useEffect,useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const RankingPage = () => {
    const [data , setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true); // 로딩 상태를 true로 설정
        const serverIP = process.env.REACT_APP_FLASK_IP;
        //` 이거 사용
        axios.get(`http://${serverIP}:8801/po`,{
        })
            .then((res) => {
                setData(res.data);
                setIsLoading(false); // 로딩 상태를 false로 설정
            })
            .catch((Error) => {console.log(Error)});
    },[]);

    const LoadingSpinner = () => (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ClipLoader color="#FF8199" size={150} />
          
        </div>
        <strong>잠시만 기다려주세요. 영상을 가져오는 중입니다.</strong>
        </>
      );

return (
    <RankingBox>
        <div style={{width: "1200px", height: "780px"}}>
        <ChannelBox>
            <h3><img src="img/Ranking_img.png"></img>인기 급상승 10위</h3>
            <Divider style={{top: "0rem"}}/>
            {data.data && data.data.map((item, index) => {
                const truncatedTitle = item.title.length > 45 ? item.title.substring(0, 45) + "..." : item.title

                if(index == 5) {
                    return (
                        <React.Fragment key={index}>
                        <Divider style={{top: "1rem"}}/>
                        <Channel key={index}>
                            <h5>{index + 1}위</h5>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <img src={item.thumbnails_Url}/>
                                <h6>{truncatedTitle}</h6>
                                <p>조회수: {item.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                            </a>
                        </Channel>
                        </React.Fragment>
                    );
                } else {
                    return (
                        <Channel key={index}>
                            <h5>{index + 1}위</h5>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <img src={item.thumbnails_Url}/>
                                <h6>{truncatedTitle}</h6>
                                <p>조회수: {item.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                            </a>
                        </Channel>
                    )
                }
                
            })}
        </ChannelBox> 
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
    </RankingBox>
    
)
}

const RankingBox =styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
`

const ChannelBox = styled.div`
    width: 1200px;
    height: auto;
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;  // 채널들 사이에 동일한 간격을 만듭니다.

    h3 {
        position: relative;
        top: 1.7rem;
        font-size: 20px;
        
        img {
            width: 35px;
            height: 35px;
            margin-top: -3px;
        }
    }
`
const Channel = styled.div`
    width: 219px;
    height: 250px;

    img {
        width: 220px;
        height: 123px;
    }

    h5 {
        font-size: 18px;
        float: left;
    }

    h6 {
        height: 40px;
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
        font-size: 12px;
        display: flex;
        align-items: flex-start;
        font-weight: 600;
        color: gray;
    }
`

const Divider = styled.div`
  position: relative;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5vh;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid gray;
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

export default RankingPage;