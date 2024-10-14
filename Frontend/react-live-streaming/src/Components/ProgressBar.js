import React from "react";
import styled from "styled-components";

const ProgressBar = (props) => {

  var positivePercentage = props.total !== 0 ? parseInt((props.positive / props.total) * 100) : 50;
  var negativePercentage = 100 - positivePercentage;
  
  return (
    <Container>
    <ProgressBarContainer>
      <PositiveFiller percentage={positivePercentage} >
        <h5>{positivePercentage}%</h5>
      </PositiveFiller>
      <NegativeFiller percentage={negativePercentage} >
        <h5>{negativePercentage}%</h5>   
      </NegativeFiller>
    </ProgressBarContainer>
    </Container>
  );
};

const Container = styled.div`
width: 90%;
`
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 35px;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  `;

const PositiveFiller = styled.div`
  height: 100%;
  width: ${({ percentage }) => `${percentage}%`};
  background: #81C0FF;
  border-radius: inherit;
  text-align: left;
  h5 {
    color: white;
    font-family: "Noto Sans AO";
    font-size: 1.2rem;
    margin-left: 5%;
    margin-top: 0.5rem;
  }

`;

const NegativeFiller = styled.div`
  height: 100%;
  width: ${({ percentage }) => `${percentage}%`};
  background:  #FF8199;
  border-radius: inherit;
  text-align: right;
  h5 {
    color: white;
    font-family: "Noto Sans AO";
    font-size: 1.2rem;
    margin-right: 5%;
    margin-top: 0.5rem;
  }

`;



export default ProgressBar;