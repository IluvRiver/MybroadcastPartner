import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const BlackList = () => {
  // 블랙리스트 데이터를 상태로 관리
  const [blackList, setBlackList] = useState([]);
  const serverIP = process.env.REACT_APP_GITHUB_IP;
  const port = process.env.REACT_APP_PORT;

  useEffect(() => {
    axios.get(`http://${serverIP}:${port}/broadcast/getBlackList`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
    })
    .then((res) => {
      setBlackList(res.data);
    })
    .catch((Error) => { console.log(Error) });
  }, [])

  const renderImgLogo = ({platform}) => {
    if (platform === 0) {
      return <img src='/img/유튜브 1.png' alt="유튜브 아이콘" style={{height:'30px', width: '30px', marginLeft: '1rem'}}/> }
      else if (platform === 1) {
        return <img src='/img/치지직 1.png' alt="치지직 아이콘" style={{height:'30px', width: '30px', marginLeft: '1rem'}}/> }
        else {
          return <img src='/img/아프리카 1.png' alt="아프리카 아이콘" style={{height:'40px', width: '40px', marginLeft: '0.5rem'}}/>
        }
  };

  const deleteButton = (userId) => {
    axios.delete(`http://${serverIP}:${port}/broadcast/removeBlackList`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
      params: {
        user_id: userId
      }
    }).then((res) => {
      alert(`${userId}를 삭제했습니다.`);
      window.location.reload();
    }).catch((err) => {
      console.error(err);
    })
  }

  return (
    <div style={{width: "100%", display: "flex", alignItems: "center", marginTop: "-1rem"}}>
      <Container>
      <ListContainer>
        <ListSmallContainer>
          <FirstContainer>
            <h4 style={{fontSize:'22px',fontWeight:'700',marginTop:'1.2em'}}>차단 명단</h4>
          </FirstContainer>
          <ListInfoContainer>
            <ListTopContainer>
              <h4 style={{flex: '0.3'}}></h4>
              <h4 style={{flex: '1.3', marginTop: "1rem",fontSize:'18px',fontWeight:'700', display: "flex", float: "left", color: "#747474"}}>플랫폼</h4>
              <h4 style={{flex: '1', marginTop: "1rem",fontSize:'18px',fontWeight:'700', display: "flex", float: "left", color: "#747474"}}>아이디</h4>
              <h4 style={{flex: '1', marginTop: "1rem",fontSize:'18px',fontWeight:'700', color: "#747474"}}></h4>   
            </ListTopContainer>
              {blackList.length === 0 ? (
                <NoSubcript>
                 차단된 시청자가 없습니다.
                </NoSubcript>
                   ) : (
                  <>
                  <ListBottomContainer>
                    <BList>
                      {blackList.map((user, index) =>  (
                        <div key={index} style={{display: 'flex', flexDirection: 'row',height:'50px',alignItems:'center',borderBottom: '2px solid pink'}}>
                          <div style={{flex: '0.78',fontSize:'18px'}}>{renderImgLogo({ platform: user.platform })}</div>
                          <h5 style={{flex: '2',fontSize:'18px'}}>{user.user_id}</h5>
                          <h5 style={{flex: '1',fontSize:'18px'}}><button style={{ border: 'none', backgroundColor: 'white' }} onClick={() => deleteButton(user.user_id)}>삭제</button></h5>
                        </div>
                      ))}
                    </BList>
                  </ListBottomContainer>       
                {blackList.length > 0 && (<ListTotalContainer>TOTAL : {blackList.length}</ListTotalContainer>)}
             </>
            )}
          </ListInfoContainer>
        </ListSmallContainer>
      </ListContainer>
      </Container>
    </div>
  );
};

const Container = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height: 600px;
`

const ListContainer = styled.div`
display: flex;
flex: 5;
flex-direction: column;
`

const ListSmallContainer = styled.div`
display: flex;
flex-direction: column;
background-color: #FFF2F4;
border-radius: 10px;
align-items: center;
width: 1235px;
height: 470px;
margin: auto;
`

const FirstContainer = styled.div`
width: 1100px;
height: 60px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`

const ListInfoContainer = styled.div`
width: 1100px;
height: 380px;
border-radius: 8px;
display: flex;
flex-direction: column;
background-color: white;
`

const ListTopContainer = styled.div`
display: flex;
flex-direction: row;
margin-top: 0.5rem;
border-bottom: 2px solid hotpink;
height: 60px;
align-items: center;
justify-content: left;
`

const ListBottomContainer = styled.div`
display: flex;
border-radius: 5px;
margin-top: 0.5rem; 
width: 1100px;
height: 300px;
`

const NoSubcript = styled.div`

font-size: 40px;
align-items: center;
display: flex;
height: 200px;
width: 1100px;
margin: auto;
justify-content: center;
`

const BList = styled.div`
display: flex;
flex-direction: column;
width: 1100px;
`

const ListTotalContainer = styled.div`
display: flex;
justify-content: right;
width:1050px;
font-size: 19px;
margin-bottom: 2rem;
font-weight: 600;
color: gray;
`

export default BlackList;
