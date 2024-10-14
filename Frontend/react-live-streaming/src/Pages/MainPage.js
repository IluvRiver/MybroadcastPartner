import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import "swiper/css/pagination";
import 'swiper/css';
import Url from '../Components/Url';

const MainPage = (props) => {
    
  return (
    <Container>
      <UserLabel> 
            {/* 컨테이너 1 */}
            <MainBanner> 
              <MainText>
              <div style={{color:'black', fontSize: '45px'}}>
                <strong style={{color:'#ff0045'}}>실시간 시청자수 1만 콘텐츠!</strong><br/> 어떻게 만들지?
              </div><br/>
              <div style={{color:'gray', fontSize: '20px',marginBottom:'2rem'}}>실시간으로 시청자들의 감정을 알고싶다면 <br/>지금바로 방송의 주소를 입력해주세요!</div>
              <Url setLiveData={props.setLiveData} />
              </MainText>  
              <TitleBanner>
                <img  style={{marginTop:40,marginLeft:100,height: '80%'}} className="title_logo2" alt="Title" src="img/main.png" />
              </TitleBanner>
            </MainBanner>
      </UserLabel>
            {/*컨테이너 2 */}
            <UserContainer>
              <Banner>
                <h1><strong>나의 방송 파트너에 오신것을 환영합니다.</strong></h1><br/>
                <h5>스트리머들을 위한 실시간 채팅 관리, 방송 감정 데이터 관리, 방송피드백 등</h5>
                <h5>다양한 기능이 제공되고 있습니다.</h5>
                <h5>크리에이터들의 시간과 노력을 절약 할 수 있습니다.</h5>
                <div style={{width:'30px', height:'80px'}}></div>
                <h2><strong>나의 방송 파트너</strong>  소개</h2>
                {/* <div className="line" style={{color:'pink'}}></div> */}
                <FeaturesContainer>
                  <FeatureSmallContainer>
                  <FeatureItem>
                    <DataImg>
                      <img src='img/그룹1.jpg' style={{height:'40px'}}/>
                    </DataImg>
                    <h4><strong>감정분석 AI</strong></h4>
                    <MidTextDiv>
                      <h6>실시간으로 시청자들의 채팅을 </h6>
                      <h6>AI가 3가지와 7가지의 감정을 </h6> 
                      <h6>분석합니다.</h6>
                    </MidTextDiv>
                  </FeatureItem>
                  <FeatureItem>
                    <DataImg>
                    <img src='img/그룹2.jpg' style={{height:'40px'}}/> 
                    </DataImg>
                    <h4 style={{textAlign:'center',height: '30px'}}><strong>방송 흐름 분석</strong></h4>
                    {/* <div className='BroadCast Flow' style={{textAlign:'center'}}> */}
                      <MidTextDiv>
                        <h6>방송에 종료된 후 종합된 </h6>
                        <h6>감정 데이터를 통해 </h6>
                        <h6>방송의 방향성을 정할 수 있습니다.</h6>
                      </MidTextDiv>
                    {/* </div> */}
                  </FeatureItem>
                  <FeatureItem>
                    <DataImg>
                      <img src='img/그룹3.jpg' style={{height:'40px'}}/>   
                    </DataImg>
                    <h4 style={{textAlign:'center'}}><strong>유튜브 플랫폼</strong></h4>
                    <MidTextDiv>
                      <h6>저희 플랫폼은 유튜브 스트리머를</h6>
                      <h6>대상으로 지원하고 있습니다.</h6>
                    </MidTextDiv>
                  </FeatureItem>
                  </FeatureSmallContainer>
                </FeaturesContainer>
                </Banner>
              </UserContainer> 
                <MyContainer>
                  <MyContainerLeft>
                    <br>
                    </br>
                    <br>
                    </br>
                    <br>
                    </br>   
                    <br>
                    </br>
                    <LeftSmallConatiner>
                  <h4 style={{color:'#F74E7B'}}>마이페이지</h4>
                    <div style={{width:'30px', height:'30px'}}></div>
                    <h3><strong>데이터 분석으로</strong></h3>
                    <h3><strong>방송 품질과 콘텐츠를</strong></h3>
                    <h3><strong>향상하세요</strong></h3>
                    <div style={{width:'30px', height:'70px'}}></div>
                    <div className='text' style={{marginTop:'-40px'}}>
                    <h6>데이터 분석을 통해 시청자들의 감정을</h6>
                    <h6>연 도, 월, 일, 방송별로 시각화했습니다.</h6>
                    <h6>이 정보는 스트리머에게 시청자 반응을</h6>
                    <h6>이해 하고,방송 품질과 콘텐츠를</h6>
                    <h6>향상시키는데 도움을 줍니다.</h6>
                    </div>
                    </LeftSmallConatiner>
                  </MyContainerLeft>
                  <MyContainerRight>
                    {/*마이페이지 소개 부분 안쪽 왼쪽 오른쪽*/}
                    <TotalContainerDiv>
                      <MyContainerRightIn>
                      <MyContainerRightInSideDiv>
                      <TotalContainerDiv2>
                        <img src='img/그룹4.png' style={{height:'210px',width:'370px',borderRadius:'8px'}}/>
                      </TotalContainerDiv2>
                      <TotalContainerDiv3>
                        <h3>3가지 감정 데이터</h3>
                        <h6 style={{color: '#747474'}}>3가지 감정 분석을 기반으로</h6>
                        <h6 style={{color: '#747474'}}>사용자가 선택한 시간대에 따라</h6>
                        <h6 style={{color: '#747474'}}>해당 기간의 전체 데이터를 시각화 합니다.</h6>
                      </TotalContainerDiv3>
                      </MyContainerRightInSideDiv>
                      </MyContainerRightIn>
                    </TotalContainerDiv>
                    <TotalContainerDiv>
                    <MyContainerRightIn>
                      <MyContainerRightInSideDiv>
                        <TotalContainerDiv2>
                          <img src='img/그룹5.png' style={{height:'210px',width:'370px', borderRadius:'8px'}}/>
                        </TotalContainerDiv2>
                        <TotalContainerDiv3>
                          <h3>7가지 감정 데이터</h3>
                          <h6 style={{color: '#747474'}}>7가지 감정 분석을 기반으로</h6>
                          <h6 style={{color: '#747474'}}>사용자가 선택한 시간대에 따라</h6>
                          <h6 style={{color: '#747474'}}>해당 기간의 전체 데이터를 시각화합니다.</h6>
                        </TotalContainerDiv3>
                      </MyContainerRightInSideDiv>
                      </MyContainerRightIn>
                    </TotalContainerDiv>
                  </MyContainerRight>
                </MyContainer>
                {/*컨테이너 4 */}
                {/*실시간페이지 소개 부분 안쪽 왼쪽 오른쪽*/}
                <LifeContainer>
                  <LifeContainerLeft>
                    <TotalContainerDiv>
                     <LifeContainerLeftInSideDiv>
                      <TotalContainerDiv2>
                        <img src='img/그룹6.png' style={{height:'210px', width:'370px'}}/>
                      </TotalContainerDiv2>
                      <TotalContainerDiv3>
                        <h3>감정 이모티콘</h3>
                        <h6 style={{color: '#747474'}}>감정을 이모티콘으로 표현해 시청자 채팅 옆에</h6>
                        <h6 style={{color: '#747474'}}>위치시켜 실시간으로 보여줍니다.</h6>
                      </TotalContainerDiv3>
                     </LifeContainerLeftInSideDiv>
                    </TotalContainerDiv>
                    <TotalContainerDiv>
                      <LifeContainerLeftInSideDiv>
                        <TotalContainerDiv2>
                          <img src='img/그룹7.png' style={{height:'210px', width:'370px',borderRadius:'8px'}}/>
                        </TotalContainerDiv2>
                        <TotalContainerDiv3>
                          <h3>프로그래스바</h3>
                          <h6 style={{color: '#747474'}}>감정을 프로그래스바 청대로 채팅방 옆에</h6>
                          <h6 style={{color: '#747474'}}>배치하여 한눈에 쉽게 보여줍니다.</h6>
                        </TotalContainerDiv3>
                      </LifeContainerLeftInSideDiv>
                    </TotalContainerDiv>
                  </LifeContainerLeft>
                  
                  <LifeContainerRight>
                  <RightSmallContainer>
                    <h4 style={{color:'#F74E7B'}}>실시간 페이지</h4>
                    <div style={{width:'30px', height:'30px'}}></div>
                    <h3><strong>실시간으로 시청자들의</strong></h3>
                    <h3><strong>감정을 확인하세요</strong></h3>
                    <div style={{width:'30px', height:'80px'}}></div>
                    <div className='text' style={{marginTop:'-40px'}}>
                    <h5>방송 중에는 시청자들의 채팅과 함께</h5>
                    <h5>3가지 기본 감정(긍정, 부정, 중립)</h5>
                    <h6>7가지 상세 감정(행복, 분노, 혐오, 공포, </h6>
                    <h6>중립, 슬픔, 놀람)을 실시간으로 프로그래스바와 </h6>
                    <h6>감정 이모티콘으로 사용자에게 시각화합니다.</h6>
                    </div>
                    </RightSmallContainer>
                  </LifeContainerRight>
                </LifeContainer>
              <br />
              
            
    </Container>
      
  );
}
// 방송 중에는 시청자들의 채팅과 함께
// 3가지 기본 감정(긍정, 부정, 중립) 및
// 7가지 상세 감정(행복, 분노, 혐오, 공포, 중립, 슬쯤, 놀람)을 실시간으로 프로그래스바와 감정 이모티콘으로 사용자에게 시각화합니다
//메인페이지 전체 컨테이너
const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    margin: auto;
`;
//메인페이지 방송화면 이미지
const TitleBanner = styled.div`
    height: 400px;
    margin-left : 30px;
`

//position : relative가 자식 , absolute가 부모 flex
const UserLabel = styled.div`
  
`
// url입력창과 스트리머이미지가 들어가있는 메인배너
const MainBanner = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 500px;
  margin: 0 auto;
  background-color: #FFBFCB;
  justify-content: center; 
  align-items: center;
  margin-top: 1%;
  
`;
// 메인배너 안에 우리 웹을 설명해주는 텍스트
const MainText = styled.div`
  justify-content: center; 
  flex-direction: column;
  display: flex;
  align-items: center;
`;

//환영글 부분
const UserContainer = styled.div`
    width:100%;
    height: 600px;
`;
// 우리 플랫폼의 주 기술 3가지
const FeaturesContainer = styled.div`
  margin-top: 4rem; 
  display: flex;
  width: 100%;
  height: 230px;
  justify-content: space-between; // 각 항목들 사이에 공간을 균등하게 배분
  justify-content: space-around; /* 가로 방향 중앙 정렬 */
  padding: 0 12rem; /* 왼쪽과 오른쪽에 좀 더 간격을 주기 위해 padding 추가 */
`;
const FeatureSmallContainer = styled.div`

width: 1000px;
margin: auto;
justify-content: center;
display: flex;
flex-direction: row;
`
// FeaturesContainer안에 주 기술 3가지의에 대한 css
const FeatureItem = styled.div`
  width: 20rem;
  border-radius: 8px;
  text-align: left;
  margin: 1rem;
  img {
    width: 3rem;
    height: 3rem;
  }
  h4 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #333;
    text-align:center
  }
  h6 {
    font-size: 16px;
    color: #666;
  }
`;
//하단 배너
const Banner = styled.div`
    right: 0;
    left: 0;
    text-align: center;
    position: absolute;
    width: 100%;
    height: 614px;
    margin-top: 60px; /* 위쪽 간격 조절 */
`;

//마이페이지 컨테이너
const MyContainer = styled.div`
  margin-top: 5rem; 
  background-color : #FFF2F4;
  width: 100%;
  height:500px;
  display: flex;
  flex-direction: row;
  border-radius: 8px;
`;
const MyContainerLeft = styled.div`
  width: 500px;
  display: flex;
  flex: 3;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  h4 {
    text-align:left;
  },
  h3 {
    text-align:left;
    
  }
`
const LeftSmallConatiner = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
width: 300px;
height: 500px;

`
const MyContainerRight = styled.div`
  width:1200px;
  height: 500px;
  display: flex;
  flex: 7;
`
const MyContainerRightIn = styled.div`
display: flex;
`
const MyContainerRightInSideDiv = styled.div`
  width: 370px;
  height:420px;
  background-color: white;
  padding:0px;
  border-radius: 8px;
  h4 {
    text-align:left;
  },
  h3 {
    text-align:left;
    
  }
`
//asdasdsad

const RightSmallContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
width: 300px;
height: 500px;

`
const LifeContainerRight = styled.div`
width: 500px;
display: flex;
flex: 3;
flex-direction: row;
justify-content: center;
align-items: center;

  h4 {
    text-align:right;
  },
  h3 {
    text-align:right;
    
  }
`
const MyContainer2 = styled.div`
  width: 500px;
  height: 500px;

  padding: 50px;
  h4 {
    text-align:right;
  },
  h3 {
    text-align:right;
    
  }
`

const LifeContainerLeft = styled.div`
  width:1200px;
  height: 500px;
  display: flex;
  flex: 7;
`
const TotalContainerDiv = styled.div`
width:400px;
height:500px;
margin: 0 auto;
display: flex;
justify-content: center;
align-items: center;
`
const LifeContainerLeftInSideDiv = styled.div`
  width: 370px;
  height:420px;
  background-color : #FFF2F4;
  border-radius:8px;
  h4 {
    text-align:left;
  },
  h3 {
    text-align:left;
    
  }

`
const TotalContainerDiv2 = styled.div`
  width:auto;
  height:auto;
  background-color:white;
  border-radius: 8px;

`
const TotalContainerDiv3 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width:96%;
  height:50%;
  margin : 0 auto;
  padding : 20px;
`

const DataImg = styled.div`
  width: 3rem;
  height: 3rem;
  margin: 0 auto;
`

//메인페이지 실시간페이지에 관한 설명
const LifeContainer = styled.div`
margin-top: 5rem; 
width: 100%;
height:500px;
display: flex;
flex-direction: row;
border-radius: 8px;

`;

//메인페이지 실시간페이지에 관한 설명
const LifeLeft = styled.div`
  flex: 1; // 전체 공간의 1/3을 차지하도록 설정
  padding: 2rem; // 내부 요소와의 거리
  border-radius: 15px;
  text-align: left;
  margin-left: 3rem;
  
`;

//실시간 페이지 우측 7가지 감정을 원형 이미지로 설명한 부분
const LifeRight = styled.div`
  flex: 1; // 전체 공간의 1/3을 차지하도록 설정
  padding: 2rem; // 내부 요소와의 거리
  background-color: #f3f4f6; // 배경색
  border-radius: 15px;
  img {
    width: 26rem;
    height: 26rem;
    margin-top: 7rem;
  }
`;

const MidTextDiv = styled.div`
display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  `



export default MainPage;