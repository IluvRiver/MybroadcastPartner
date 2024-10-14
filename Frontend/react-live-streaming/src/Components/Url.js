import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "swiper/css/pagination";
import 'swiper/css';
import styled from 'styled-components';
import url_logo from '../imgs/ggg.png';

const Url = (props) => {
  //전송하기 버튼 클릭여부
  const [buttonClicked, setButtonClicked] = useState(false);
  //url입력창
  const [url, setUrl] = useState("방송 주소를 입력하세요.");
  const [firstFocus, setFirstFocus] = useState(true);
  //live 페이지로 이동 변수
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef(null);  // useRef 추가

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            if (url !== "방송 주소를 입력하세요.") {
                setUrl("방송 주소를 입력하세요.");
            }
        }
    };

    //url창에 주소입력과정
    const urlChange = (e) => {
        const length = e.target.value; 
        setUrl(length);   
        if (length.length >= 1) { 
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    // url 전송과정
    const handleSubmit = (event) => {
      const serverIP = process.env.REACT_APP_GITHUB_IP;
      const port = process.env.REACT_APP_PORT;
      event.preventDefault(); // 폼 제출될 때 기본 동작 막음
      if (sessionStorage.getItem('userInfo') == null) {  // sessionStorage에 userInfo라는 키값으로 저장된 값이 없으면 로그인알림
          alert('로그인이 필요한 서비스입니다.');
          window.location.reload();
      }
      
      if (!url.startsWith("https://")) {
        alert("해당 URL은 올바른 형식이 아닙니다.");
        window.location.reload();
      }

      setButtonClicked(true);
          axios.get(  //아래 서버에 요청 함
              `http://${serverIP}:${port}/broadcast/identification`,
              {
                  headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` }, 
                  params: { 
                    URI: String(url)   //URI 라는 쿼리로 url값을 전달함
                  },
              }
          ).then((res) => {
              if (res.status !== "400") { //성공했다면 live창으로 이동
                const UrlChannelID = {"broadCastID": res.data}
                sessionStorage.setItem('BroadCastID', JSON.stringify(UrlChannelID));
                inputRef.current.blur();
                if(location != "/live"){
                    navigate('/live');
                } else {
                    window.location.reload();
                }
              } else {
                  alert("해당 URI는 사용자 정보와 맞지 않습니다.");
              } 
          })
          .catch((err) => {
             alert("해당 URI는 사용자 정보와 맞지 않습니다.");
            navigate("/");
            });
      
  };

    //enter로도 버튼기능을 쓸 수 있음
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {   
            setUrl("방송 주소를 입력하세요."); 
            handleSubmit(event);
            inputRef.current.blur();
        }
    };

    return (  //url입력창과 버튼을 urlContainer로 묶었음
    <UrlContainer>
                <InputText
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={urlChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => {
                        if (firstFocus) {
                            setUrl("");
                            setFirstFocus(false);
                        }
                    }}
                />
                <PinkButton disabled={disabled} onClick={handleSubmit}>
                 <img src={url_logo}/>
                </PinkButton>
        </UrlContainer>
    );
}

// InputText랑 button 컨테이너
const UrlContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

//url 입력css
const InputText = styled.input`
padding: 10px;
border-radius: 8px;
border: 2px solid #DBDBDB;
width: 400px;
height: 45px;
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
background-color: #FF8199;
color: white;
border: none;
border-radius: 8px;
font-size: 16px;
width:60px;
height: 43.5px;
cursor: pointer;
margin-left: 10px;

img {
    width: 25px;
    height: 25px;
}

&:hover {
    background: #FF8199 0% 0% no-repeat padding-box;
}
`;
export default Url;