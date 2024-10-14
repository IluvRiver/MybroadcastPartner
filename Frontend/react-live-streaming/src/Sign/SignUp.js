import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Logo from '../imgs/logo2.svg';
import CheckSignUp from './CheckSignUp';
import axios from 'axios';

const SignUp = () => {
    const [idInput, setIdInput] = useState("아이디");
    const [pwInput, setPwInput] = useState("비밀번호");
    const [rePwInput, setRePwInput] = useState("비밀번호 확인");
    const [nameInput, setNameInput] = useState("이름");
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [days, setDays] = useState([]);
    const [day, setDay] = useState('');
    const [selectedSex, setSelectedSex] = useState("");
    const [emailInput, setEmailInput] = useState("예) ex@gmail.com");
    const [disabled, setDisabled] = useState(true);
    const [exId, setExId] = useState('중복 확인 버튼을 클릭하세요.');
    const [exName, setExName] = useState('영어 또는 한글 2글자 이상 12글자 이하.');
    const navigate = useNavigate();

    // 정규 표현식 패턴들
    const checkId = /^[a-zA-Z0-9]{4,12}$/;
    const checkPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,12}$/;
    const checkName = /^[a-zA-Z가-힣]{2,12}$/;
    const checkEmail = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
  
    // 아이디 입력과정
    const idChange = (e) => {
        const length = e.target.value; 
        setIdInput(length); 
        if (length.length >= 1) { 
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    // ID 중복 확인  
    const checkButton = () => {
        const serverIP = process.env.REACT_APP_GITHUB_IP;
        const port = process.env.REACT_APP_PORT;
        axios.get(`http://${serverIP}:${port}/viewer/idCheck` , {
            params: {
                ID: idInput,
            }
        })
        .then((res) => {
          if (res.data != true) {
            alert('사용 불가능한 아이디 입니다.\n다시 입력해주세요.');
          } else {
            alert('사용가능한 아이디 입니다');
            setExId("성공");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // 비밀번호 입력과정
    const pwChange = (e) => {
        const length = e.target.value;
        setPwInput(length);
    }

    // 비밀번호 확인 입력과정
    const rePwChange = (e) => {
        const length = e.target.value;
        setRePwInput(length);
    }

    // 이름 입력과정
    const nameChange = (e) => {
        const length = e.target.value;
        setNameInput(length);
    }

    // 남자 버튼 클릭 핸들러
    const handleManClick = () => {
        setSelectedSex(true);
    };

    // 여자 버튼 클릭 핸들러
    const handleWomanClick = () => {
        setSelectedSex(false);
    };

    // 이메일 입력과정
    const emailChange = (e) => {
        const length = e.target.value;
        setEmailInput(length);
    }

    // 연도가 변경될 때 실행될 함수
    const handleYearChange = e => {
        const newYear = e.target.value;
        setYear(newYear);
        updateDays(newYear, month); // 일수 업데이트 함수 호출
    };

    // 월이 변경될 때 실행될 함수
    const handleMonthChange = e => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        updateDays(year, newMonth); // 일수 업데이트 함수 호출
    };

    // 일이 변경될 때 실행될 함수
    const handleDayChange = e => {
        const newDay = e.target.value;
        setDay(newDay);
    }

    // 연도와 월에 맞는 일수를 설정하는 함수
    const updateDays = (year, month) => {
        if (!year || !month) {
        setDays([]);
        return;
        }
        const daysInMonth = new Date(year, month, 0).getDate();
        setDays([...Array(daysInMonth).keys()].map(day => day + 1));
    };

    // 회원 가입 버튼 -> 유효성 검사 -> true 로그인 페이지로 이동
    const handleSignUp = () => {
        const isValid = CheckSignUp({ // CheckSignUp 함수에 사용자 입력 정보 전달
          id: idInput,
          exId: exId,
          pw: pwInput,
          pw2: rePwInput,
          name: nameInput,
          year: year,
          month: month,
          day: day,
          sex: selectedSex,
          email: emailInput
        });
      
        if (isValid) { // 유효성 검사가 통과했을 경우
          signUp();
        } else { // 유효성 검사가 통과하지 못했을 경우
        }
      };
      
      const signUp = async () => {
        const serverIP = process.env.REACT_APP_GITHUB_IP;
        const port = process.env.REACT_APP_PORT;
        const monthChange = parseInt(month, 10) < 10 ? `${month}` : `${month}`;
        try {
          let response = await axios.post(`http://${serverIP}:${port}/viewer/signup`, {
            id: idInput,
            pw: pwInput,
            name: nameInput,
            birth: `${year}-${monthChange}-${day}`,
            sex: selectedSex,
            email: emailInput
          });
          if (response.status === 200) { // 성공적으로 회원가입이 되었을 때
            alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다.');
            navigate('/'); // 메인페이지 페이지로 이동
          } else {
            alert('회원가입 실패', '회원가입에 실패하였습니다. 다시 시도해주세요.');
          }
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LogoContainer>
                <img src={Logo}/>
                <span><br/>AI 기반 실시간 채팅 및 영상 댓글 감정 분석 기능을 통해 시청자의 반응을 쉽게 파악할 수 있고<br/>분석된 데이터들을 확인할 수 있는 크리에이터 매니저 서비스입니다.</span>
            </LogoContainer>
            <InputContainer>
                <h2>회원가입</h2>
                <TextDiv style={{ marginTop: '1rem' }} isValidId={idInput !== '' && idInput != '아이디' && checkId.test(idInput)} isValidId2={exId == '성공'}>
                    <span>아이디</span>
                    <div style={{ width: '100%', height: '40px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <IdInput
                            type="text"
                            value={idInput}
                            onChange={idChange}
                            onFocus={() => setIdInput("")}
                            isValidId={idInput != '아이디'}
                        />
                        <button style={{ width: '80px', background: 'none', border: '1px solid', fontWeight: 'bold', fontSize: '15px' }} disabled={disabled} onClick={checkButton}>중복확인</button>
                    </div>
                    <h6>영어, 숫자 4글자 이상 12글자 이하.</h6>
                    <h5>{exId}</h5>
                </TextDiv>
                <PwDiv isValidPw1={checkPw.test(pwInput)} isValidPw2={pwInput.length > 5 && pwInput.length < 13 && idInput !== pwInput} isValidPw3={pwInput.length > 5 && pwInput.length < 13}>
                    <span>비밀번호</span>
                    <PwInput
                        type="password"
                        value={pwInput}
                        onChange={pwChange}
                        onFocus={() => setPwInput("")}
                        minLength={8}
                        maxLength={14}
                        isValidPw={pwInput != '비밀번호'}
                    />
                    <h4>영어, 특수문자 (!@$%^*+-=), 숫자를 모두 하나 이상 포함<br/></h4>
                    <h5>아이디와 일치하면 안됩니다.<br/></h5>
                    <h6>비밀번호는 최소 6글자, 최대 12글자 입니다.</h6>
                </PwDiv>
                <TextDiv isValidId={rePwInput !== '' && rePwInput != '비밀번호 확인' && pwInput == rePwInput}>
                    <span>비밀번호 확인</span>
                    <PwInput
                        type="password"
                        value={rePwInput}
                        onChange={rePwChange}
                        onFocus={() => setRePwInput("")}
                        isValidPw={rePwInput != '비밀번호 확인'}
                    />
                    <h6>비밀번호 확인이 필요합니다.</h6>
                </TextDiv>
                <TextDiv isValidId={nameInput !== '' && nameInput != '이름' && checkName.test(nameInput)}>
                    <span>이름</span>
                    <TextInput
                        type="text"
                        value={nameInput}
                        onChange={nameChange}
                        onFocus={() => setNameInput("")}
                        isValidText={nameInput != '이름'}
                    />
                    <h6>{exName}</h6>
                </TextDiv>
                <TextDiv>
                    <span>생년월일</span>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <YearSelect value={year} onChange={handleYearChange} isValidYear={year != ''}>
                            {[...Array(121).keys()].map(i => {
                                const yearOption = new Date().getFullYear() - i;
                                return (
                                <option key={yearOption} value={yearOption}>
                                    {yearOption}
                                </option>
                                );
                            })}
                        </YearSelect>
                        <MonthSelect value={month} onChange={handleMonthChange} isValidMonth={month != ''}>
                            {[...Array(12).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>
                                {i + 1}월
                                </option>
                            ))}
                        </MonthSelect>  
                        <DaySelect isValidDay={days != ''} onChange={handleDayChange}>
                            {days.map(day => (
                                <option key={day} value={day}>
                                {day}일
                                </option>
                            ))}
                        </DaySelect>
                    </div>
                </TextDiv>
                <TextDiv>
                    <span>성별</span>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ManButton
                        onClick={handleManClick}
                        selected={selectedSex === true}
                    >
                        <span>남자</span>
                    </ManButton>
                    <WomanButton
                        onClick={handleWomanClick}
                        selected={selectedSex === false}
                    >
                        <span>여자</span>
                    </WomanButton>
                    </div>
                </TextDiv>
                <TextDiv isValidId={emailInput !== '' && emailInput != '예) ex@gmail.com' && checkEmail.test(emailInput)}>
                    <span>이메일</span>
                    <TextInput
                        type="email"
                        value={emailInput}
                        onChange={emailChange}
                        onFocus={() => setEmailInput("")}
                        isValidText={emailInput != '예) ex@gmail.com'}
                    />
                    <h6>이메일 기준에 적합한지 확인합니다.</h6>
                </TextDiv>
                <SignUpButton onClick={handleSignUp}>
                    <span>회원가입</span>
                </SignUpButton>
            </InputContainer>
        </div>
    )
}

const LogoContainer = styled.div`
    display: flex;
    width: 800px;
    height: 180px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
`

const InputContainer = styled.div`
    width: 800px;
    height: 800px;
    border: 1px solid #D9D9D9;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;

    h2 {
        margin-top: 1rem;
        font-weight: bold;
    }
`

const TextDiv = styled.div`
    width: 600px;
    height: 100px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    span {
        font-weight: bold;
    }

    h5 {
        font-size: 12px;
        color: ${props => (props.isValidId2 ? '#00ff7f' : 'red')};
    }

    h6 {
        font-size: 12px;
        color: ${props => (props.isValidId ? '#00ff7f' : 'red')};
    }
`

const PwDiv = styled.div`
    width: 600px;
    height: 120px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    span {
        font-weight: bold;
    }

    h4 {
        font-size: 12px;
        color: ${props => (props.isValidPw1 ? '#00ff7f' : 'red')};
    }

    h5 {
        font-size: 12px;
        color: ${props => (props.isValidPw2 ? '#00ff7f' : 'red')};
    }

    h6 {
        font-size: 12px;
        color: ${props => (props.isValidPw3 ? '#00ff7f' : 'red')};
    }
`

const IdInput = styled.input`
    width: 80%;
    height: 40px;
    border: 1px solid #D9D9D9;
    padding-left: 1rem;
    color: ${props => (props.isValidId ? 'black' : '#C4C4C4')};

    :focus {
        outline: none;
    }
`

const TextInput = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #D9D9D9;
    padding-left: 1rem;
    color: ${props => (props.isValidText ? 'black' : '#C4C4C4')};

    :focus {
        outline: none;
    }
`

const PwInput = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #D9D9D9;
    padding-left: 1rem;
    color: ${props => (props.isValidPw ? 'black' : '#C4C4C4')};

    :focus {
        outline: none;
    }
`

const YearSelect = styled.select`
    width: 28%;
    height: 40px;
    border: 1px solid #D9D9D9;
    padding-left: 3.5rem;
    color: ${props => (props.isValidYear ? 'black' : '#C4C4C4')};

    :focus {
        outline: none;
    }
`

const MonthSelect = styled.select`
    width: 28%;
    height: 40px;
    border: 1px solid #D9D9D9;
    padding-left: 4rem;
    color: ${props => (props.isValidMonth ? 'black' : '#C4C4C4')};

    :focus {
        outline: none;
    }
`

const DaySelect = styled.select`
    width: 28%;
    height: 40px;
    border: 1px solid #D9D9D9;
    padding-left: 4rem;
    color: ${props => (props.isValidDay ? 'black' : '#C4C4C4')};

    :focus {
        outline: none;
    }
`

const ManButton = styled.button`
    width: 49%;
    height: 40px;
    border: 1px solid #81C0FF;
    background-color: ${({ selected }) => (selected ? '#81C0FF' : 'white')};
    color: ${({ selected }) => (selected ? 'white' : '#C4C4C4')};

    &:hover {
        background: #81C0FF 0% 0% no-repeat padding-box;
        color: white;
    }
`

const WomanButton = styled.button`
    width: 49%;
    height: 40px;
    border: 1px solid #FF8199;
    background-color: ${({ selected }) => (selected ? '#FF8199' : 'white')};
    color: ${({ selected }) => (selected ? 'white' : '#C4C4C4')};

    &:hover {
        background: #FF8199 0% 0% no-repeat padding-box;
        color: white;
    }
`

const SignUpButton = styled.button`
    width: 600px;
    height: 40px;
    background-color: pink;
    border: 1px solid pink;
    margin-top: 2rem;
    margin-bottom: 2rem;

    span {
        font-size: 15px;
        font-weight: bold;
        color: white;
    }
`

export default SignUp;