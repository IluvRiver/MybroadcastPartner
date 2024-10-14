import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';
import axios from 'axios';
import styled from 'styled-components';

const API_KEY = process.env.REACT_APP_API_KEY;
const CLIENT_ID = process.env.REACT_APP_CLIENT_KEY;

const loadClient = async () => {  // gapi 클라이언트 초기화
  try {
    await gapi.client.init({
      api_key: API_KEY,
      client_id: CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      scope: 'https://www.googleapis.com/auth/youtube.readonly'
    });
  } catch (error) {
    console.error('API에 대한 GAPI 클라이언트 로드 중 오류 발생', error);
  }
};

const authenticate = async () => {  // 사용자 인증 후 YouTube API에 접근할 수 있는 권한 부여
  try {
    await loadClient(); // 성공적으로 인증 후 loadClient 함수 호출
    const options = {
      prompt: 'select_account' // 계정 강제 선택
    };
    const auth2 = gapi.auth2.getAuthInstance();
      if (auth2 != null) {
        await auth2.signIn(options);
  
        const user = gapi.auth2.getAuthInstance().currentUser.get();  // 유저 정보
        const serverIP = process.env.REACT_APP_GITHUB_IP;
        const port = process.env.REACT_APP_PORT;
        axios.get(`http://${serverIP}:${port}/user/login`,{    // 액세스 토큰을 받아오는 HTTP 요청을 보냅니다.
          params:{
            id_token: String(user.xc.id_token),
            access_token: String(user.xc.access_token),
          }
        }).then((res)=>{
          if((res.status == "200")){
            sessionStorage.setItem('accessToken', res.data.accessToken);
            sessionStorage.setItem('refreshToken', res.data.refreshToken);
            sessionStorage.setItem('userInfo', JSON.stringify(res.data.user));  // 세션 저장
            setTimeout(() => {
              window.location.replace("/");
            }, 500); 
          } else {
            alert("서버와 접속이 실패하셨습니다.");
            window.location.replace("/");
          }
        })
        .catch((Error)=>{
          alert("서버와 접속이 실패하셨습니다.");
          window.location.replace("/");
        })
      } else {
        console.error('gapi.auth2 인스턴스를 가져오는 데 실패했습니다.');
      }
  } catch (error) {
    console.error('로그인에 실패했습니다.', error);
  }
};

const YouTubeVideoInfo = () => {
  useEffect(() => { // client:auth2를 비동기적으로 로드 후 초기화
    gapi.load('client:auth2', () => {
      try {
        loadClient();
      } catch (error) {
        console.error('인증을 초기화하는 중 오류가 발생했습니다.', error);
      }
    });
  }, []);

  const execute = async () => { // 특정 비디오의 정보를 가져오는 역할
    try {
      const response = await gapi.client.youtube.videos.list({  // id에 지정된 비디오의 정보를 가져옴
        part: ['snippet'],
        id: ['imKQT1qS_A4'],
      });
      console.log('Response', response);
    } catch (error) {
      console.error('실행오류', error);
    }
  };

  return (
    <Login_button onClick={authenticate}>
      <Login_str>
        <img src="img/youtubeLogo.png" alt="YouTube Logo" style={{width: "30px", top: "-1px", right: "0.5rem"}}/>
        Continew with YouTube
      </Login_str>
    </Login_button>
  );
};

const Login_button = styled.button`
  position: relative;
  width: 300px;
  height: 50px;
  background-color: white;
  padding: 4px;
  border: 0.5px solid #747474;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  top: 5rem;
`

const Login_str = styled.div`
  margin-top: 0rem;
  margin-left: 0.7rem;
`

export default YouTubeVideoInfo;
