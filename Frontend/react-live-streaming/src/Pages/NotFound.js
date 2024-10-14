import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import error from '../imgs/error.svg';

const NotFound = () => {
    const navigate = useNavigate();

    const backButton = () => {
        navigate("/");
    }

    return(
        <Container>
            <Emoji><img style={{ width: '80%', height: 'auto' }} src={error}/></Emoji>
            <Title>죄송합니다. 페이지를 찾을 수 없습니다.</Title>
            <Message>존재하지 않는 주소를 입력하셨거나,<br/>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</Message>
            <BackHome to="/">홈으로 이동</BackHome>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
`

const Emoji = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    background-size: cover;
    background-position: center;
    z-index: -1;
`

const Title = styled.h1`
    font-size: 36px;
    color: #333;
    z-index: 1;
`

const Message = styled.p`
    font-size: 18px;
    color: #666;
    margin: 10px 0;
    z-index: 1;
`

const BackHome = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: white;
    color: black;
    font-weight: bold;
    border-radius: 5px;
    border: 1px solid #FF007F;
    text-decoration: none;
    z-index: 1;

    &:hover {
        background-color: #FF007F;
    }
`

export default NotFound;
