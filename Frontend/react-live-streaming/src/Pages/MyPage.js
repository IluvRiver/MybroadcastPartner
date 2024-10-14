import LineChats from '../charts/LineChats';
import PieChats from '../charts/PieChats';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';

const MyPage = () =>  {
  const [broadCasts, setBroadCasts] = useState([]); // 서버에서 받아온 방송별 데이터
  const [yearsData, setYearsData] = useState([]); // 서버에서 받아온 연도별 데이터
  const [tabButtonKey, setTebButtonKey] = useState([]); // 연도별, 월별, 일별 데이터 구별
  const [yearsValue, setYearsValue] = useState([]); // 연도별 value
  const [monthsValue, setMonthsValue] = useState([]); // 월별 value
  const [dayValue, setDaysValue] = useState([]);  // 일별 value
  const [broadsValue, setBroadsValue] = useState([]); // 방송별 value
  const [yearSelected, setYearSelected] = useState(false);  // 연도별
  const [monthSelected, setMonthSelected] = useState(false);  // 월별
  const [selectedYear, setSelectedYear] = useState(null); // 연도별 조건
  const [selectedMonth, setSelectedMonth] = useState(null); // 일별 조건
  const [yearSelectValue, setYearSelectValue] = useState(""); // select value값
  const [monthSelectValue, setMonthSelectValue] = useState(""); // select value값
  const [daySelectValue, setDaySelectValue] = useState(""); // select value값
  const [broadSelectValue, setBroadSelectValue] = useState("");  // select value값
  const [modal, setModal] = useState(false);  // modal창
  const [isLoading, setIsLoading] = useState(false);

  const isLeapYear = (year) => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));  // 연도에 따라 일별이 달라짐(28, 29, 30, 31)
  let shouldSetModal = false; // 정보 없음 modal창

  useEffect(() => { // 서버
    setIsLoading(true); // 로딩 상태를 true로 설정
    const serverIP = process.env.REACT_APP_GITHUB_IP;
    const port = process.env.REACT_APP_PORT;
    axios.get(`http://${serverIP}:${port}/mypage/getInfo`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
    })
    .then((res) => {
      setBroadCasts(res.data.broadCasts)  // 방송별 데이터
      setYearsData(res.data.years); // 연도별 데이터
      if(res.data.years === undefined || res.data.years.length === 0) {
        setModal(true);
      }
      setIsLoading(false); // 로딩 상태를 false로 설정
    })
    .catch((Error) => { console.log(Error) });
  }, []);

  const handleEntireButton = (e) => { // 전체 데이터 Select
    setModal(false);
    setYearSelectValue(""); // 연도 선택 상자 초기화
    setMonthSelectValue(""); // 월 선택 상자 초기화
    setDaySelectValue(""); // 일 선택 상자 초기화
    setBroadSelectValue(""); // 방송 선택 상자 초기화
    setYearSelected(false) // 월별 select문 활성화 초기화
    setMonthSelected(false); // 일별 select문 활성화 초기화
    setTebButtonKey("entires", 1); // KeyButton 함수에 Parameters (EntireButton slect key)
  };

  const handleYearSelect = (e) => { // 연도별 Select
    const year = e.target.value;  // year select value
    let a = 0;
    
    for(let i = 0; i < yearsData.length; i++) {
      a = i;
      if(yearsData[i]._id.substring(0,4) == year) {
        setYearsValue(i);
        setModal(false);
        setTebButtonKey("years");// tebButtonKey years slect key
        setYearSelected(true);
        setSelectedYear(year === "" ? null : parseInt(year, 10)); // 연도별을 클릭하지 않으면 월별은 null 클릭하면 1월 ~ 12월 띄움
        setMonthSelectValue(""); // 월 선택 상자 초기화
        setDaySelectValue(""); // 일 선택 상자 초기화
        setBroadSelectValue(""); // 방송 선택 상자 초기화
        setMonthSelected(false); // 일별 select문 활성화 초기화
        break;
      }
    }
    if(yearsData[a]._id.substring(0,4) != year) {
      setModal(true);
      setYearSelected(false);
      setYearSelectValue(""); // 연도 선택 상자 초기화
      setMonthSelectValue(""); // 월 선택 상자 초기화
      setDaySelectValue(""); // 일 선택 상자 초기화
      setBroadSelectValue(""); // 방송 선택 상자 초기화
      setMonthSelected(false); // 일별 select문 활성화 초기화
    }
  };

  const handleMonthSelect = (e) => {  // 월별 Select
    const monthBasic = e.target.value;  // month select value
    const month = parseInt(monthBasic.split("월")); // value에서 "월" 빼고 정수형
    if (yearsData[yearsValue].monthTotalData[month - 1] == null && yearsData[yearsValue].monthTotalData[month - 1] == undefined) {
      setModal(true);
      setMonthSelected(false);
    }
    else {
      setModal(false);
      setMonthSelected(true);
      setMonthsValue(month - 1);  // value - 1
      setTebButtonKey("months"); // tebButtonKey months slect key
      setSelectedMonth(parseInt(month, 10));  // 월별을 클릭하지 않으면 일별은 null, 클릭하면 1일 ~ 31일
      setDaySelectValue(""); // 일 선택 상자 초기화
      setBroadSelectValue(""); // 방송 선택 상자 초기화
    }
  };

  const handleDaySelect = (e) => {  // 일별 Select
    const dayBasic = e.target.value;  // day select value
    const day = parseInt(dayBasic.split("일")); // value에서 "일" 빼고 정수형
    if (yearsData[yearsValue].monthTotalData[monthsValue].day_total_data[day - 1] == null) {
      setModal(true);
    } else {
      setModal(false);
      setDaysValue(day - 1);  // value - 1
      setTebButtonKey("days"); // tebButtonKey days
      setBroadSelectValue(""); // 방송 선택 상자 초기화
    }
  };

  const handleBroadSelect = (e) => {  // 방송별 Select
    const broad = e.target.value; // broad select value
    setBroadsValue(broad);  // value
    setTebButtonKey("broadcasts"); // tebButtonKey broadcasts
    setYearSelectValue(""); // 연도 선택 상자 초기화
    setMonthSelectValue(""); // 월 선택 상자 초기화
    setDaySelectValue(""); // 일 선택 상자 초기화
    setBroadSelectValue(""); // 방송 선택 상자 초기화
    setYearSelected(false) // 월별 select문 활성화 초기화
    setMonthSelected(false); // 일별 select문 활성화 초기화
  };

  const getDaysInMonth = (month) => { // 연도별과 월별에 따른 일별
    if (!month || !selectedYear) return 0;
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(selectedYear)) {
      return 29;
    }
    return daysInMonth[month - 1];
  };

  const getCurrentData = (tabButtonKey, yearsData, broadCasts) => {
    // 서버에서 받아온 데이터를 각각의 select의 Emotion3, Emotion7을 차트화
    let allEmotion3Data = [];
    let allEmotion7Data = [];

    switch (tabButtonKey) { // 연도별, 월별, 일별, 방송별 key 비교
      case "entires": // 전체인 경우
        if (yearsData[0] !== undefined) {
          allEmotion3Data = yearsData.map((yearItam) => { // 연도별 3가지 감정
            return {
              name: parseInt(yearItam._id.split(JSON.parse(sessionStorage.getItem('userInfo')).email)),
              negative: yearItam.All_Emotion3[0],
              positive: yearItam.All_Emotion3[1],
              neutrality: yearItam.All_Emotion3[2],
            };
          });

          allEmotion7Data = yearsData.map((yearItem) => {
            // 연도별 7가지 감정
            return [
              { name: "Nervous", value: yearItem ? yearItem.All_Emotion7[0] : 0 },
              { name: "Embrrassed", value: yearItem ? yearItem.All_Emotion7[1] : 0 },
              { name: "Angry", value: yearItem ? yearItem.All_Emotion7[2] : 0 },
              { name: "Sadness", value: yearItem ? yearItem.All_Emotion7[3] : 0 },
              { name: "Neutral", value: yearItem ? yearItem.All_Emotion7[4] : 0 },
              { name: "Happiness", value: yearItem ? yearItem.All_Emotion7[5] : 0 },
              { name: "Disgust", value: yearItem ? yearItem.All_Emotion7[6] : 0 }

            ];
          }).flat() // 중첩 배열을 단일 배열로 변환
        } else {
          shouldSetModal = true;
        }
        break;

      case "years": // 연도별인 경우
        if (yearsData[yearsValue] !== undefined) {
          // id가 value와 같지 않다면 데이터 X 모달창
          allEmotion3Data = yearsData[yearsValue].monthTotalData.map((monthItam, index) => { // 월별의 3가지 감정

            return {
              name: `${index + 1}월`,
              negative: monthItam ? monthItam.All_Emotion3[0] : 0,
              positive: monthItam ? monthItam.All_Emotion3[1] : 0,
              neutrality: monthItam ? monthItam.All_Emotion3[2] : 0,
            };
          });

          allEmotion7Data = yearsData[yearsValue].monthTotalData.map((monthItam) => {  // 월별의 7가지 감정
            return [
              { name: "Nervous", value: monthItam ? monthItam.All_Emotion7[0] : 0 },
              { name: "Embrrassed", value: monthItam ? monthItam.All_Emotion7[1] : 0 },
              { name: "Angry", value: monthItam ? monthItam.All_Emotion7[2] : 0 },
              { name: "Sadness", value: monthItam ? monthItam.All_Emotion7[3] : 0 },
              { name: "Neutral", value: monthItam ? monthItam.All_Emotion7[4] : 0 },
              { name: "Happiness", value: monthItam ? monthItam.All_Emotion7[5] : 0 },
              { name: "Disgust", value: monthItam ? monthItam.All_Emotion7[6] : 0 }
            ];
          }).flat() // 중첩 배열을 단일 배열로 변환
        } else {
          shouldSetModal = true;
        }
        break;

      case "months":  // 월별인 경우
        if (yearsData[yearsValue].monthTotalData[monthsValue] != null && yearsData[yearsValue].monthTotalData[monthsValue] != undefined) { // 사용자가 클릭한 month select value가 null이 아니라면 3가지 감정과 7가지 감정을 차트화
          allEmotion3Data = yearsData[yearsValue].monthTotalData[monthsValue].day_total_data.map((dayItam, index) => {  // 일별의 3가지 감정
            return {
              name: `${index + 1}일`,
              negative: dayItam ? dayItam.All_Emotion3[0] : 0,
              positive: dayItam ? dayItam.All_Emotion3[1] : 0,
              neutrality: dayItam ? dayItam.All_Emotion3[2] : 0,
            }
          });

          allEmotion7Data = yearsData[yearsValue].monthTotalData[monthsValue].day_total_data.map((dayItam, index) => { // 일별의 7가지 감정
            return [
              { name: "Nervous", value: dayItam ? dayItam.All_Emotion7[0] : 0 },
              { name: "Embrrassed", value: dayItam ? dayItam.All_Emotion7[1] : 0 },
              { name: "Angry", value: dayItam ? dayItam.All_Emotion7[2] : 0 },
              { name: "Sadness", value: dayItam ? dayItam.All_Emotion7[3] : 0 },
              { name: "Neutral", value: dayItam ? dayItam.All_Emotion7[4] : 0 },
              { name: "Happiness", value: dayItam ? dayItam.All_Emotion7[5] : 0 },
              { name: "Disgust", value: dayItam ? dayItam.All_Emotion7[6] : 0 },
            ];
          }).flat() // 중첩 배열을 단일 배열로 변환
        } else { // 사용자가 클릭한 month select value가 null이라면 motal창 띄움
          shouldSetModal = true;
        }
        break;

      case "days":  // 일별인 경우 
        if (yearsData[yearsValue].monthTotalData[monthsValue].day_total_data != null) { // 사용자가 클릭한 day select value가 null이 아니라면 3가지 감정과 7가지 감정을 차트화
          allEmotion3Data = yearsData[yearsValue].monthTotalData[monthsValue].day_total_data[dayValue].one_Hour_Emotion.map((timeItam, index) => { // 시간대 3가지 감정
            return {
              name: `${index + 1}시`,
              negative: timeItam ? timeItam.All_Emotion3[0] : 0,
              positive: timeItam ? timeItam.All_Emotion3[1] : 0,
              neutrality: timeItam ? timeItam.All_Emotion3[2] : 0,
            };
          });

          allEmotion7Data = yearsData[yearsValue].monthTotalData[monthsValue].day_total_data[dayValue].one_Hour_Emotion.map((timeItam) => { // 시간대 7가지 감정
            return [
              { name: "Nervous", value: timeItam ? timeItam.All_Emotion7[0] : 0 },
              { name: "Embrrassed", value: timeItam ? timeItam.All_Emotion7[1] : 0 },
              { name: "Angry", value: timeItam ? timeItam.All_Emotion7[2] : 0 },
              { name: "Sadness", value: timeItam ? timeItam.All_Emotion7[3] : 0 },
              { name: "Neutral", value: timeItam ? timeItam.All_Emotion7[4] : 0 },
              { name: "Happiness", value: timeItam ? timeItam.All_Emotion7[5] : 0 },
              { name: "Disgust", value: timeItam ? timeItam.All_Emotion7[6] : 0 },
            ];
          }).flat() // 중첩 배열을 단일 배열로 변환
        } else {  // 사용자가 클릭한 day select value가 null이라면 motal창 띄움
          shouldSetModal = true;
        }
        break;

      case "broadcasts":  // 방송별인 경우
        if (broadCasts[broadsValue] != undefined) {
          const broadItem = broadCasts[broadsValue];
          allEmotion3Data = [
            {
              name: '감정',
              negative: broadItem ? broadItem.All_Emotion3[0] : 0,
              positive: broadItem ? broadItem.All_Emotion3[1] : 0,
              neutrality: broadItem ? broadItem.All_Emotion3[2] : 0,
            }
          ];
          allEmotion7Data = [
            { name: 'Nervous', value: broadItem ? broadItem.All_Emotion7[0] : 0 },
            { name: 'Embrrassed', value: broadItem ? broadItem.All_Emotion7[1] : 0 },
            { name: 'Angry', value: broadItem ? broadItem.All_Emotion7[2] : 0 },
            { name: 'Sadness', value: broadItem ? broadItem.All_Emotion7[3] : 0 },
            { name: 'Neutral', value: broadItem ? broadItem.All_Emotion7[4] : 0 },
            { name: 'Happiness', value: broadItem ? broadItem.All_Emotion7[5] : 0 },
            { name: 'Disgust', value: broadItem ? broadItem.All_Emotion7[6] : 0 },
          ].flat();
          break;
        } else {  // 사용자가 클릭한 day select value가 null이라면 motal창 띄움
          shouldSetModal = true;
        }
      default:

        if (yearsData !== undefined) {
          allEmotion3Data = yearsData.map((yearItam) => { // 연도별 3가지 감정
            return {
              name: parseInt(yearItam._id.split(JSON.parse(sessionStorage.getItem('userInfo'))._id)),
              negative: yearItam.All_Emotion3[0],
              positive: yearItam.All_Emotion3[1],
              neutrality: yearItam.All_Emotion3[2],
            };
          });

          allEmotion7Data = yearsData.map((yearItem) => {
            // 연도별 7가지 감정

            return [
              { name: "Nervous", value: yearItem ? yearItem.All_Emotion7[0] : 0 },
              { name: "Embrrassed", value: yearItem ? yearItem.All_Emotion7[1] : 0 },
              { name: "Angry", value: yearItem ? yearItem.All_Emotion7[2] : 0 },
              { name: "Sadness", value: yearItem ? yearItem.All_Emotion7[3] : 0 },
              { name: "Neutral", value: yearItem ? yearItem.All_Emotion7[4] : 0 },
              { name: "Happiness", value: yearItem ? yearItem.All_Emotion7[5] : 0 },
              { name: "Disgust", value: yearItem ? yearItem.All_Emotion7[6] : 0 }
            ];
          }).flat() // 중첩 배열을 단일 배열로 변환
        } else {
          shouldSetModal = true;
        }
        break;
    }
    return { allEmotion3Data, allEmotion7Data };
  };

  const { allEmotion3Data, allEmotion7Data } = getCurrentData(  // getCurrentData 함수 불러오기
    tabButtonKey,
    yearsData,
    broadCasts
  );

  const groupedAllEmotion7Data = allEmotion7Data.reduce((groups, item) => {
    const key = item.name;
    if (!groups[key]) {
      groups[key] = { name: key, value: 0 };
    }
    groups[key].value += item.value;
    return groups;
  }, {});

  // 객체를 배열로 변환
  const combinedAllEmotion7Data = Object.values(groupedAllEmotion7Data);
  
  const LoadingSpinner = () => (
    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ClipLoader color="#FF8199" size={150} />
      
    </div>
    <strong>잠시만 기다려주세요. 내 방송 정보를 가져오는 중입니다.</strong>
    </>
  );

  return (
    <InfoContainer>
      <TopChart>
        <h2>방송 분석 차트</h2>
      </TopChart>
      {/* <Divider/> */}
      <ChartSty>
        <TopContainer>
          <FontAll>
          <h5>시간대/감정</h5>
          <h6>연도별,월별,일별,방송별 시간대 및 감정을 조회할 수 있습니다.</h6>
          </FontAll>
          <SelectAll>
          <EntireButton onClick={handleEntireButton}>
            전체
          </EntireButton>
          <YearSelect
            value={yearSelectValue}
            onChange={(e) => {
              setYearSelectValue(e.target.value);
              handleYearSelect(e);
            }}
          >
            <option value="">연도별</option>
            {yearsData.map((year, i) => {
              const years = year._id.substring(0,4);
              return <option key={years}>{years}</option>
            })}
          </YearSelect>
          <MonthSelect
            value={monthSelectValue}
            onChange={(e) => {
              setMonthSelectValue(e.target.value);
              handleMonthSelect(e);
            }}
          >
            <option value="">월별</option>
            {yearSelected && Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month}>{month}월</option>
            ))}
          </MonthSelect>
          <DaySelect
            value={daySelectValue}
            onChange={(e) => {
              setDaySelectValue(e.target.value);
              handleDaySelect(e);
            }}
          >
            <option value="">일별</option>
            {monthSelected && Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map((day) => (
              <option key={day}>{day}일</option>
            ))}
          </DaySelect>
          <BroadSelct
            value={broadSelectValue}
            onChange={(e) => {
              setBroadSelectValue(e.target.value);
              handleBroadSelect(e);
            }}
          >
            <option value="">방송별</option>
            {broadCasts.map((broadCastItem, index) => (
              <option key={index} value={index}>
                {broadCastItem.title}
              </option>
            ))}
          </BroadSelct>
        </SelectAll>
        </TopContainer>
        <div style={{display: "flex", flexDirection: "row"}}>
        <LineSty>
          <h5>3 Emotion</h5>
          <LineChats data={allEmotion3Data}/>
        </LineSty>
        <PieSty>
          <h5>7 Emotion</h5>
          <PieChats data={combinedAllEmotion7Data} />
        </PieSty>
        </div>
        {modal? (
          <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
            <Nav_modal>
              <h3>해당 날짜의 데이터가 없습니다.</h3>
            </Nav_modal>
            <Navi_modal>
              <h3>해당 날짜의 데이터가 없습니다.</h3>
            </Navi_modal>
          </div>
        ):null}
      </ChartSty>
      {isLoading ? (
        <ModalOverlay>
          <ModalContent>
            <LoadingSpinner />
          </ModalContent>
        </ModalOverlay>
      ) : (
        null    
      )}
    </InfoContainer>
  );
}

const Divider = styled.div`
  position: relative;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  left: 2rem;
  bottom: 4rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid lightgray;
  }

`;

const TopChart = styled.div`
width: 100%;
height: 18%;
display: flex;
flex-direction: row;
align-items: center;

h2 {
  margin-left: 5rem;
  font-size: 30px;
  font-weight: 700;
}
`

const InfoContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Navi_modal = styled.div`
  width: 370px;
  height: 410px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: 0.9; 
  z-index: 1;
  border-radius:10px;
  margin-top: -25.6rem;
  margin-left: 1.45rem;
`

const Nav_modal = styled.div`
  width: 800px;
  height: 410px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: 0.9; 
  z-index: 1;
  border-radius:10px;
  margin-top: -25.6rem;
  margin-left: 0.15rem;
`

const SelectAll = styled.div`
  width: 30%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.2rem;
`

const EntireButton = styled.button`
  border: none;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;
`

const YearSelect = styled.select`
  border:none;
  outline:none
  box-shadow:none;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;

  &:focus {
    outline: none; /* 포커스 테두리 제거 */
    color: black;
  }
`

const MonthSelect = styled.select`
  border: none;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;

  &:focus {
    outline: none; /* 포커스 테두리 제거 */
    color: black;
  }
`

const DaySelect = styled.select`
  border: none;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;

  option {
    min-width: 30rem;
  }

  &:focus {
    outline: none; /* 포커스 테두리 제거 */
    color: black;
  }
`

const BroadSelct = styled.select`
  border: none;
  width: 60px;
  height: 30px;
  appearance: none;
  font-size: 11px;
  text-align: center;
  background-color: white;
  
  &:focus {
    outline: none; /* 포커스 테두리 제거 */
    color: black;
  }
`

const LineSty = styled.div`
  width: 800px;
  height: 410px;
  background-color: white;
  margin-top: 1rem;
  margin-left: 1.4rem;
  border-radius:10px;
  
  h5 {
    margin-right: 43rem;
    margin-top: 1rem;
    font-size: 15px;
    font-weight: 700;
  }
`

const PieSty = styled.div`
  width: 370px;
  height: 410px;
  background-color: white;
  font-size: 10px;
  margin-top: 1rem;
  margin-left: 1.4rem;

  border-radius:10px;
  
  h5 {
    margin-right: 15rem;
    margin-top: 1rem;
    font-size: 15px;
    font-weight: 700;
  }
`

const ChartSty = styled.div`
  border-radius:10px;
  width: 1235px;
  height: 520px;
  background-color: #FFF2F4;
  margin: auto;

  h4 {
    width: 400px;
    position: relative;
    bottom: 20.5rem;
    left: 59.85rem;
  }
`

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: between-sapce;
  align-items: center;
`

const FontAll = styled.div`
  width: 66.5%;
  margin-top: 1rem;
  margin-left: 1.5rem;

  h5 {
    font-size: 17px;
    font-weight: 700;
    text-align: left;
  }

  h6 {
    font-size: 13px;
    font-weight: 300;
    text-align: left;
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

export default MyPage;