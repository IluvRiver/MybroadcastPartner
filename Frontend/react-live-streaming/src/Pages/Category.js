import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Img_plus from '../imgs/img_plus.png';
import Close from '../imgs/close.png';
import axios from 'axios';
import AWS from "aws-sdk";
import { ClipLoader } from 'react-spinners';

const Category = () => {
    const categoryList = [  // 카테고리 select array
        { key: "1", value: "영화/드라마" },
        { key: "2", value: "자동차/차량" },
        { key: "10", value: "음악" },
        { key: "15", value: "애완 동물/동물" },
        { key: "17", value: "스포츠" },
        { key: "20", value: "게임" },
        { key: "22", value: "Vlog" },
        { key: "23", value: "코미디" },
        { key: "24", value: "엔터테인먼트" },
        { key: "25", value: "뉴스/정치" },
        { key: "26", value: "Howto/Style" },
        { key: "28", value: "과학/기술" },]
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const categories = userInfo && userInfo.category ? userInfo.category.map(String) : [];  // 사용자 카테고리
    const userImages = JSON.parse(sessionStorage.getItem("userInfo"))?.image || []; // 사용자 이미지
    const [selectedCategories, setSelectedCategories] = useState(categories);
    const [uploadedImages, setUploadedImages] = useState([...userImages]);
    const [imageLength, setImageLength] = useState(userImages.length); // imageLength를 상태로 관리
    const [uploadedFiles, setUploadedFiles] = useState([]); //aws에 업로드하기 위한 변수
    const [removedImages, setRemovedImages] = useState([]); // 삭제된 이미지를 추적하기 위한 변수
    const [removedNumbers, setRemovedNumbers] = useState([]); // 삭제된 이미지 번호를 추적하기 위한 변수
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);  // input 태그를 참조하기 위한 ref 생성
    const navigate = useNavigate();
    const s3 = new AWS.S3();
    //aws 접근 지역이름, 버킷 이름
    const REGION = process.env.REACT_APP_REGION;
    const S3_BUCKET =  process.env.REACT_APP_S3_BUCKET;
    //aws 접근 키
    AWS.config.update({
        region: REGION,
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });
    
    const toggleCategory = (category) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(category)) {
                return prevSelected.filter((c) => c !== category);
            } else {
                return [...prevSelected, category];
            }
        });
    };

    // 드래그 오버 이벤트가 발생했을 때의 핸들러
    const handleDragOver = useCallback((e) => {
        e.preventDefault(); // 기본 이벤트를 막아줍니다.
    }, []);

    // 드롭 이벤트가 발생했을 때의 핸들러
    const handleDrop = useCallback((e) => {
        e.preventDefault(); // 기본 이벤트를 막아줍니다.
        const files = e.dataTransfer.files; // 드롭된 파일들을 가져옵니다.
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                //웹상에서 보여지기 위함
                setUploadedImages((prevImages) => [...prevImages, e.target.result]);
                // 파일을 object형태로 리스트에 저장
                setUploadedFiles((prevImages) => [...prevImages, file]);
            };
            reader.readAsDataURL(file); // 파일을 Data URL 형태로 읽어옵니다.
        }
    }, []);

    // 클릭 이벤트 핸들러
    const handleImageUploadClick = () => {
        fileInputRef.current.click(); // 프로그래매틱하게 input 클릭 이벤트를 호출합니다.
    };

    // 파일 선택 후의 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                //웹상에서 보여지기 위함
                setUploadedImages((prevImages) => [...prevImages, reader.result]);
                // 파일을 object형태로 리스트에 저장
                setUploadedFiles((prevImages) => [...prevImages, file]);
            };
            reader.readAsDataURL(file);
        }

    };

    // 파일 삭제 핸들러
    const handleFileRemove = useCallback((indexToRemove) => {
        const imageToRemove = uploadedImages[indexToRemove];
        if (userImages.includes(imageToRemove)) {
            const removedNumber = imageToRemove.match(/_(\d+)\.jpg$/)[1];
            setRemovedImages((prevRemoved) => [...prevRemoved, imageToRemove]);
            setRemovedNumbers((prevNumbers) => [...prevNumbers, removedNumber]);
            setImageLength(prevLength => prevLength - 1);
        }
        
        setUploadedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
        setUploadedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    }, [userImages, uploadedImages]);

    // 삭제된 배열에서 숫자 추출 핸들러
    const extractNumbers = (urls) => {
        return urls.map(url => {
            const match = url.match(/_(\d+)\.jpg$/);
            return match ? match[1] : null;
        }).filter(number => number !== null);
    };

    // 저장 버튼
    const saveButton = async (e) => {
        const serverIP = process.env.REACT_APP_GITHUB_IP;
        const port = process.env.REACT_APP_PORT;
    
        if (selectedCategories.length === 0) {
            alert("최소 하나 이상의 카테고리를 선택해야 합니다.");
            return;
        }
        if (selectedCategories.length > 5) {
            alert("5개 이상의 카테고리를 선택하셨습니다.\n다시 선택해주세요");
            return;
        }
        if (uploadedImages.length === 0) {
            alert("최소 한 장 이상의 얼굴 이미지를 첨부해야 합니다.");
            return;
        }
        if (uploadedImages.length > 3) {
            alert("세 장 이상의 얼굴 이미지를 첨부하셨습니다.\n다시 선택해주세요");
            return;
        }
    
        setIsLoading(true);
    
        // // 기존 이미지에서 삭제된 이미지를 제외한 배열 생성
        const remainingImages = userImages.filter(image => !removedImages.includes(image));

        // aws sdk upload
        const uploadedUrls = await Promise.all(
            uploadedFiles.map(async (file, index) => {
                const userInfoString = sessionStorage.getItem('userInfo');
                const userInfo = JSON.parse(userInfoString);
                const userId = userInfo.email.split('@')[0];
                let fileNumber;
    
                if (index < removedNumbers.length) {
                    fileNumber = removedNumbers[index];
                } else {
                    fileNumber = imageLength + index;
                }
                
                const fileName = `${userId}_${fileNumber}.jpg`;
                
                const params = {
                    Bucket: S3_BUCKET,
                    Key: fileName,
                    Body: file
                };
                const uploadResult = await s3.upload(params).promise();
                return uploadResult.Location;
            })
        );
    
        // 카테고리 저장
        await axios.get(`http://${serverIP}:${port}/user/saveCategory`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
            params: {
                category: selectedCategories.join(',')
            }
        });
    
        // 모든 업로드된 이미지를 결합하여 최종 이미지 배열 생성
        const allUploadedImages = Array.from(new Set(remainingImages.concat(uploadedUrls))); // 중복 제거 및 이미지 배열 합치기
        
        // s3 이미지 저장
        await axios.post(`http://${serverIP}:${port}/user/saveImage`,
        null,
        {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
            params: {
                values: allUploadedImages.join(','),
            }
        }).then((res) => {
            
        }).catch((err) => {
            console.error(err);
        });
    
        // 유저 정보 다시 받기
        await axios.get(`http://${serverIP}:${port}/user/reget`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` },
        })
        .then((res) => {
            sessionStorage.removeItem("userInfo");
            const userInfo = {
                ...res.data,
                user: "크리에이터"
            };
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        })
        .catch((error) => {
            console.error(error);
        });
    
        setIsLoading(false);
        alert("정보가 최신화되었습니다.");
        window.location.replace("/infonav/category");
    }    

    const LoadingSpinner = () => (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ClipLoader color="#FF8199" size={150} />
          
        </div>
        <strong>잠시만 기다려주세요. 내 정보를 최신화하는 중입니다.</strong>
        </>
    );

    return (
        <Container>
            <TopContainer>
                <h3>1. 내가 주로 방송하는 카테고리</h3>
                <span>최소 1개 선택 / 최대 5개 선택 가능</span>
                <CategoryContainer>
                    {categoryList.map((category, index) => (
                        <CategoryButton
                            key={index}
                            selected={selectedCategories.includes(category.key)}
                            onClick={() => toggleCategory(category.key)}
                        >
                            {category.value}
                        </CategoryButton>
                    ))}
                </CategoryContainer>
            </TopContainer>
            <BottomContainer>
                <h3>2. 크리에이터 얼굴 이미지</h3>
                <ImgContainer>
                    <ImgDiv
                        onClick={handleImageUploadClick}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <img src={Img_plus} alt="Plus icon" />
                    </ImgDiv>
                    <TextDiv>
                        <p>최소 n장 이상의 사진을<br/>첨부해야 합니다.</p>
                        <p>사진이 여러장일수록<br/>정확도가 높아집니다.</p>
                    </TextDiv>
                </ImgContainer>
                <Img2Container>
                {uploadedImages.map((imageSrc, index) => (
                    <ImageWrapper key={index}>
                    <UploadedImage src={imageSrc} alt={`Uploaded ${index}`} />
                    <RemoveButton onClick={() => handleFileRemove(index)}>
                        <img src={Close} alt="Remove icon" />
                    </RemoveButton>
                    </ImageWrapper>
                ))}
                </Img2Container>
                <SaveButton onClick={saveButton} multiple>
                    <span>저장</span>
                </SaveButton>
            </BottomContainer>
            {isLoading ? (
                <ModalOverlay>
                <ModalContent>
                    <LoadingSpinner />
                </ModalContent>
                </ModalOverlay>
            ) : (
                null    
            )}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 992px) {
        width: 750px;
      }
      
      @media (min-width: 1408px) {
        width: 100%;
      }
`;

const TopContainer = styled.div`
    width: 700px;
    height: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 2rem;
    
    span {
        font-size: 14px;
        color: #808080;
        margin-left: 1.5rem;
    }
`

const CategoryContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const CategoryButton = styled.button`
    width: 140px;
    height: 50px;
    background-color: ${({ selected }) => (selected ? '#81C0FF' : 'white')};
    border: 1px solid #81C0FF;
    border-radius: 20px;
    box-shadow: 0 4px 4px -2px #808080;
    padding: 10px 20px;
    margin: 0.5rem;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #81C0FF; // 호버 시 버튼의 배경 색상 변경
    }
`;

const BottomContainer = styled.div`
    width: 700px;
    height: 1600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4rem;

    h3 {
        margin-right: 25.6rem;
    }
`

const ImgContainer = styled.div`
    width: 90%;
    height: 280px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2rem;
`

const ImgDiv = styled.div`
    width: 200px;
    height: 100%;
    background-color: #D9D9D9;
    display: flex;
    justify-content: center;
    align-items: center;
    border-style: dashed; // 드래그 앤 드롭 영역에 대시 스타일을 적용
    border-width: 2px;
    border-color: #A3A3A3;

    &:hover {
        border-color: #81C0FF;
    }

    img {
        width: 20px;
        height: 20px;
    }
`

const TextDiv = styled.div`
    width: 350px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    p {
        font-size: 20px;
        color: #A3A3A3;
    }
`

const Img2Container = styled.div`
    width: 90%;
    height: 250px;
    margin-top: 3rem;
    margin-bottom: 3rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    overflow: auto;
    background-color: #D9D9D9;

    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: #81C0FF;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
        background: #ffffff;
    }
`

const ImageWrapper = styled.div`
    position: relative;
    width: 180px;
    height: 220px;
    
    button {
        display: block;
    }
`;

const RemoveButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    display: none;
    cursor: pointer;

    img {
        width: 20px;
        height: 20px;
    }
`;

const UploadedImage = styled.img`
    width: 180px;
    height: 220px;
    background-color: white;
`;

const SaveButton = styled.button`
    width: 30%;
    height: 50px;
    background-color: #81C0FF;
    border: 1px solid #81C0FF;
    margin-bottom: 3rem;

    span {
        font-size: 20px;
        font-weight: bold;
        color: white;
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

export default Category;