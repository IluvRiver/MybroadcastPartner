import React, { useEffect,useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import ShortformButton from '../Components/ShortformDownload'
const Time1 = '01:37:20';
const Time2 = '01:42:20';
const Time3 = '00:53:05';
const Time4 = '00:58:05';
const Time5 = '00:24:38';
const Time6 = '00:29:38';

const serverIP = process.env.REACT_APP_GITHUB_IP;
const port = process.env.REACT_APP_PORT;
const flaskport = process.env.REACT_APP_FLASK_PORT;
// 시간 문자열을 Date 객체로 변환
const startTime1 = new Date('2023-10-07T' + Time1).getTime();
const endTime1 = new Date('2023-10-07T' + Time2).getTime();

const startTime2 = new Date('2023-10-07T' + Time3).getTime();
const endTime2 = new Date('2023-10-07T' + Time4).getTime();

const startTime3 = new Date('2023-10-07T' + Time5).getTime();
const endTime3 = new Date('2023-10-07T' + Time6).getTime();

const options = {
  chart: {
    height: 350,
    type: 'rangeBar',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '80%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    min: ('2023-10-07T00:00:00'), 
    max: ('2023-10-07T24:00:00')
  },
  colors: ['#066AD1', '#FF5DB0', '#FEB019'],
  yaxis: {
    labels: {
      show: false,
    },
  },
};

const series = [
  {
    name: 'Positive',
    data: [
      {
        x: 'Design',
        y: [startTime1, endTime1],
      },
    ],
  },
  {
    name: 'Negative',
    data: [
      {
        x: 'Design',
        y: [startTime2, endTime2], 
      },
    ],
  },
  {
    name: 'Happiness',
    data: [
      {
        x: 'Design',
        y: [startTime3, endTime3], 
      },
    ],
  },
];


const Feedback = () => {
  
  const [modal, setModal] = useState(false);
  const [broadCasts, setBroadCasts] = useState([]);
  const [selectedBroadcast, setSelectedBroadcast] = useState("방송명");
  const [broadCastsId, setBroadCastsId] = useState("");
  const handleSelectChange = (e) => {
    setModal(true);
    const broadCastValue = e.target.value;
    setSelectedBroadcast(broadCasts[broadCastValue].title);
    setBroadCastsId(broadCasts[broadCastValue]._id);
  };
  
useEffect(() => { // 서버
  const serverIP = process.env.REACT_APP_GITHUB_IP;
  const port = process.env.REACT_APP_PORT;
  axios.get(`http://${serverIP}:${port}/mypage/getInfo`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
  })
    .then((res) => {
      setBroadCasts(res.data.broadCasts)  // 방송별 데이터
    }
     )
     .catch((Error) => { console.log(Error) });
}, []);// useEffect의 두 번째 매개변수인 빈 배열을 닫아줘야 합니다.

    return (
      <Container>
        <FeedbackContainer>
          <TitleContainer>방송 피드백</TitleContainer>
        </FeedbackContainer>
        <MiddleContainer>
          <MiddleCoverContainer>
          <BroadCastContainer>
              <BradCastSmallContainer>
              <BroadCastNameContainer>
              <h5>[23.10.05 다시보기] - (최근 스케줄 이야기, 미래 가정 이야기, 연인들 취향 이야기, 질병 이야기)</h5>
              </BroadCastNameContainer>
              <BroadCastDropContainer>
              <YearSelect value={selectedBroadcast} onChange={handleSelectChange}>
              <option value="">방송 목록</option>
                {broadCasts.map((broadCastItem, index) => (
              <option key={index} value={index}>
                {broadCastItem.title}
              </option>
                ))}
            </YearSelect>
            </BroadCastDropContainer>
         </BradCastSmallContainer>
          </BroadCastContainer>
          <ChartContainer>
                <ChartDataContainer>
                    <div style={{width: '95.5%',marginTop:'-0.5rem'}}>
            <ApexCharts
              options={options}
              series={series}
              type="rangeBar"
              height={320}
            />
            </div>
                </ChartDataContainer>
          </ChartContainer>
          <EmotionContainer>
                      <Positive>
                        <EmotionDiv>
                        <EmotionName>
                          <img style = {{width:'30px',height:'30px',marginRight:'0.5rem'}} src='./emoticons/FeedBackHappiness.png'></img>
                          <EmotionName2>
                            <h6 style={{color: "#81C0FF"}}>Positive</h6>
                            <span>이 시간대에 시청자들이 가장 좋아해요</span>
                          </EmotionName2>
                        </EmotionName>
                        <a href='https://youtu.be/nAK6IWev38E?si=Gd9KXppY3kHOC_M3&t=5840' target='_blank'> 
                        <EmotionPicture><img style={{width:'300px',height:'170px',border:'3px solid pink',borderRadius:'10px'}} src='./img/오킹 1.png'></img></EmotionPicture>
                        </a>
                        <EmotionText>
                        <EmotionTime>
                          <h4>01:37:20~ 01:42:20</h4>
                        </EmotionTime>
                        <h5>긍정 토픽</h5>
                        <h6>상황, 상태, 판타지</h6>
                        </EmotionText>
                        <Button><strong><div style={{color:'#6CA7ED'}}>긍정 하이라이트</div>숏폼 자동 생성하기</strong></Button>

                        </EmotionDiv>
                        </Positive>
                      
                      <Negative>
                        <EmotionDiv>
                        <EmotionName>
                          <img style = {{width:'30px',height:'30px',marginRight:'0.5rem'}} src='./emoticons/FeedBackNegative.png'></img>
                          <EmotionName2>
                            <h6 style={{color: "#FF8199"}}>Negative</h6>
                            <span>이 시간대에 시청자들이 가장 실망해요</span>
                          </EmotionName2>
                        </EmotionName>
                        <a href='https://youtu.be/nAK6IWev38E?si=SwpyjGrXvGDZuvVM&t=3180' target='_blank'>
                        <EmotionPicture><img style={{width:'300px',height:'170px',border:'3px solid pink',borderRadius:'10px'}} src='./img/오킹 3.png'></img></EmotionPicture>
                        </a>
                        <EmotionText>
                          <EmotionTime>
                            <h4>53:05~ 58:05</h4>
                          </EmotionTime>
                        <h5>부정 토픽</h5>
                        <h6>요즘, 여친, 아빠</h6>
                        </EmotionText>
                        <Button><strong><div style={{color:'#F74E7B'}}>부정 하이라이트</div>숏폼 자동 생성하기</strong></Button>

                        </EmotionDiv>
                        </Negative>
                      <Happiness>
                        <EmotionDiv>
                        <EmotionName>
                        <img style = {{width:'30px',height:'30px',marginRight:'0.5rem'}} src='./emoticons/행복.png'></img>
                        <EmotionName2>
                        <h6 style={{color: "#FFCA75"}}>Happiness</h6>
                        <span>이 시간대에 시청자들이 가장 행복해요</span>
                        </EmotionName2>
                        </EmotionName>
                        <a href='https://youtu.be/nAK6IWev38E?si=4L8ltUsi7l2PaG8z&t=1478' target='_blank'>
                        <EmotionPicture><img style={{width:'300px',height:'170px',border:'3px solid pink',borderRadius:'10px'}} src='./img/오킹 2.png'></img></EmotionPicture>
                        </a>
                        <EmotionText>
                          <EmotionTime>
                            <h4>24:38~ 29:38</h4>
                          </EmotionTime>
                        <h5>행복 토픽</h5>
                        <h6>아버님, 형아, 아빠</h6>
                        </EmotionText>
                        {/*행복 숏폼 다운로드 버튼*/}
                           <ShortformButton/>
                        </EmotionDiv>
                      </Happiness>
          </EmotionContainer>
          </MiddleCoverContainer>
        </MiddleContainer>
      </Container>
    )
}
const Container = styled.div`
display: flex;
flex-direction: column;
height: 900px;
flex: 1;
margin: auto;
background-color: #FFF2F4;
border-radius: 10px;
`
const FeedbackContainer = styled.div`
display: flex;
align-items: center;
flex: 1;

`
const TitleContainer = styled.div`
width: 1200px;
height: 50px;
font-size: 32px;
font-weight: 700;
display: flex;
float: left;
margin-left: 5rem;
align-items: flex-end;

`
const MiddleContainer = styled.div`
display: flex;
flex: 9;
flex-direction: column;
align-items: center;

`
const MiddleCoverContainer = styled.div`
background-color: white;
width: 96%;
border-radius: 10px;
`
const BroadCastContainer = styled.div`
display: flex;
flex-direction: column;
flex: 1;
`
const BradCastSmallContainer = styled.div`
display: flex;
flex-direction: row;
flex: 1;
height: 60px;
`
const BroadCastNameContainer = styled.div`
display: flex;
flex: 9;
font-size: 24px;
font-weight: 600;
align-items: left;
margin-left: 2rem;
margin-bottom: 0.5rem;
align-items: flex-end;
h5 {
  margin-left: 2rem;
  font-weight: 700;
}
`

const BroadCastDropContainer = styled.div`
display: flex;
flex: 1;
justify-content: right;
align-items: center;
margin-bottom: 1rem;
margin-top: 1rem;
margin-right: 5rem;
`
const YearSelect = styled.select`
  display:flex;
  border: 1px solid #DBDBDB;
  border-radius: 8px;
  width: 100px;
  height: 35px;
  font-size: 13px;
  background-color: white;
  text-align: center;

  &:hover {
    border: 1px solid #B7B7B7; /* 호버 시 테두리 스타일 변경 */
   }

  &:focus {
    outline: none; /* 포커스 테두리 제거 */
    border-color: #F74E7B;
    color: black;
  }
`
const ChartContainer = styled.div`
display: flex;
flex: 5;
justify-content: center;
align-items: center;
margin-left: 2.5rem;
`
const ChartDataContainer = styled.div`
justify-content: center;
width:100%;
height:330px;
`
const EmotionContainer = styled.div`
display: flex;
flex: 4;
flex-direction: row;
align-items: center;
justify-content: center;
margin-top: 1rem;
margin-bottom: 2rem;
`
const Positive = styled.div`
display: flex;
height: 400px;
flex-direction: column;
align-items: center;
flex: 4.2; // 여기에 원하는 flex 값 설정
`;

const EmotionDiv = styled.div`
width: 350px;
height: 100%;
border: 1px solid #DBDBDB;
border-radius: 10px;
`

const Negative = styled.div`
display: flex;
height: 400px;
flex-direction: column;
align-items: center;
flex: 3.3; // 여기에 원하는 flex 값 설정
`;

const Happiness = styled.div`
display: flex;
height: 400px;
flex-direction: column;
align-items: center;
flex: 4.5; // 여기에 원하는 flex 값 설정
`;

const EmotionName = styled.div`
flex: 3;
font-size: 24px;
margin-top: 0.5rem;
margin-bottom: 0.5rem;
margin-right: 6rem;
display: flex;
flex-direction: row;
justify-content: center;
`

const EmotionName2 = styled.div`
display: flex;
flex-direction: column;

h6 {
  display: flex;
  float: left;
}

span {
  font-size: 11px;
  color: #747474;
  margin-top: -0.5rem;
}
`

const EmotionPicture = styled.div`
flex: 3;
`
const EmotionText = styled.div`
flex: 2;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
h5 {
  margin-top: 10px;
  width: 270px;
  display: flex;
  float: left;
  font-weight: 600;
}
h6 {
  width: 270px;
  display: flex;
  float: left;
}
`

const EmotionTime = styled.div`
width:300px;
height: 40px;
border-radius: 8px;
border: 1px solid #DBDBDB;
display: flex;
align-items: center;
justify-content: center;
margin-top: 0.5rem;

h4 {
  font-size: 21px;
  color: #747474;
}
`
const Button = styled.button`
  background-color: white;
  border-radius:10px;
  border: none;
  box-shadow: 5px 5px 5px #c8c8c8;
`

export default Feedback;