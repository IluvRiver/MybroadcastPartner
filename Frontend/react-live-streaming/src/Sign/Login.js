import React from 'react';
import { gapi } from 'gapi-script';
import axios from 'axios';
import styled from 'styled-components';

const client_id = process.env.REACT_APP_CLIENT_KEY;

const authenticate = async () => {  // 사용자 인증 후 YouTube API에 접근할 수 있는 권한 부여
    try {
      const options = {
        prompt: 'select_account' // 계정 강제 선택
      };
      await gapi.client.init({
        client_id: client_id
      });
      await gapi.auth2.getAuthInstance().signIn(options);
  
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
          const userInfo = {
            ...res.data.user, // 응답에서 user 데이터를 펼침
             user: "크리에이터" // 'user' 객체를 추가함
           };
          sessionStorage.setItem('accessToken', res.data.accessToken);
          sessionStorage.setItem('refreshToken', res.data.refreshToken);
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));  // 세션 저장
          setTimeout(() => {
            window.location.replace("/");
          }, 500); 
        } else {
          alert("서버와 접속이 실패하셨습니다.");
          window.location.replace("/");
        }
      })
      .catch((Error)=>{
        // alert("서버와 접속이 실패하셨습니다.");
        window.location.replace("/");
      })
    } catch (error) {
      console.error('로그인에 실패했습니다.', error);
    }
  };

const Login = () => {
    return (
      <GoogleLogin onClick={authenticate}>
        <Login_str>
          <img src="img/GoogleLogo.png" alt="Google Logo" style={{width: "45px", top: "-1px"}}/>
          Continue with Google
        </Login_str>
      </GoogleLogin>
    );
}

const GoogleLogin = styled.button`
  position: relative;
  width: 300px;
  height: 50px;
  background-color: white;
  padding: 4px;
  border: 0.5px solid #747474;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  top: 4.5rem;
`

const Login_str = styled.div`
  margin-top: -1px;
  margin-right: 1rem;
`

export default Login;