import React, { useState } from "react";
import AWS from "aws-sdk";
import axios from 'axios';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';
//숏폼 다운로드
const ShortformDownload = () => {
  const s3 = new AWS.S3();
  const serverIP = process.env.REACT_APP_GITHUB_IP;
  const flaskIP = process.env.REACT_APP_FLASK_IP;
  const port = process.env.REACT_APP_PORT;
  const flaskport = process.env.REACT_APP_FLASK_PORT;
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET
  // const channel = String(JSON.parse(sessionStorage.getItem("userInfo")).channels_Id); // 방송 이름
  const broadCastID = "20qntZ5FRFc";
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleYes = async () => {
    setIsLoading(true); // 로딩 상태를 true로 설정
    await mp4download(); // mp4download 함수 실행
    setIsLoading(false); // 로딩 상태를 false로 설정
    closeModal();
  };

  const LoadingSpinner = () => (
    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ClipLoader color="#FF8199" size={150} />
      
    </div>
    <strong>잠시만 기다려주세요. 숏츠를 생성 중입니다.</strong>
    </>
  );

  const handleNo = () => {
    closeModal();
  };
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  });
  const download=async(broadCastID)=> {
    const data = await s3
      .getObject({ 
              Bucket:S3_BUCKET, 
              Key:broadCastID //파일이름
            })
      .promise();

    const blob = new Blob([data.Body], { type: "video/mp4" });
    const urlCreator = window.URL || window.webkitURL;
    const vedioUrl = urlCreator.createObjectURL(blob);
    const url = window.URL.createObjectURL(blob) // 받아온 날 상태의 data를 현재 window에서만 사용하는 url로 바꾼다
    const a = document.createElement('a')
    a.href = url
    a.download =broadCastID // 원하는 이름으로 파일명 지정
    document.body.appendChild(a)
    a.click() // 자동으로 눌러버리기
    setTimeout((_) => {
      window.URL.revokeObjectURL(url) // 해당 url을 더 사용 못하게 날려버린다
    }, 1000)
    // s3.download("D:\create-react-app\nosanggwan\Client_Front\client\public\img",props.items.real_File_Name)
    a.remove() // a를 다 사용했으니 지워준다
    return vedioUrl;
  }

  const mp4download=async()=>{
    axios.defaults.withCredentials = true;
    //플라스크로 보내는 코드
    const startTime="00:10:38";
    const endTime="00:11:38";
    const response = await axios.get(
      `http://${flaskIP}:${flaskport}/saveshorts/${broadCastID}/${startTime}/${endTime}`,
      {}
    );
    
    // s3 편집된 영상 다운로드
    download(broadCastID+'.mp4');
  }
    return(
      <div>
        <ShortformButton onClick={openModal}><strong><div style={{color:'#FFC362'}}>행복 하이라이트</div>숏폼 자동 생성하기</strong></ShortformButton>
        {isOpen && (
          <ModalOverlay>
            <ModalContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <CloseButton onClick={closeModal}>&times;</CloseButton>
                  <ModalTitle>
                    <ModalText>행복 하이라이트</ModalText>숏폼을 만드시겠어요?
                  </ModalTitle>
                  <ButtonGroup>
                    <ModalButton onClick={handleYes}>예</ModalButton>
                    <ModalButton onClick={handleNo}>아니오</ModalButton>
                  </ButtonGroup>
                </>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </div>
      )
};


export default ShortformDownload;

const ShortformButton = styled.button`
  background-color: white;
  border-radius:10px;
  border: none;
  box-shadow: 5px 5px 5px #c8c8c8;
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

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #777;
  }
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: #333;
`;
const ModalText = styled.p`
  color: #FFC362;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border-radius: 5px;
  background-color: ${props => props.primary ? '#FF8199' : '#FF8199'};
  color: #fff;
  border: none;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: ${props => props.primary ? '#FF8199' : '#FF8199'};
  }
`;