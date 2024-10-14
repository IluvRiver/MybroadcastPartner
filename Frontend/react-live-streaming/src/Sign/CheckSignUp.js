import React from "react";

function CheckSignUp({
  id: initialId,
  exId: exId,
  pw: initialPw,
  pw2: initialPw2,
  name: initialName,
  year: initialYear,
  month: initialMonth,
  day: initialDay,
  sex: initialSex,
  email: initialEmail
}) {

  // 정규 표현식 패턴들
  const checkId = /^[a-zA-Z0-9]{4,12}$/;
  const checkPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,12}$/;
  const checkName = /^[a-zA-Z가-힣]{2,12}$/;
  const checkEmail = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

  const validateInput = () => {
    if (initialId === '' && initialId == '아이디') {
      alert('아이디를 입력해주세요.');
      return false;
    }
    if (!checkId.test(initialId)){      
      alert('아이디는 대소문자 또는 숫자로 시작하고 끝나며 4~12자리로 입력해야합니다.');
      return false;
    }
    if (exId != '성공'){
      alert('아이디 중복 확인을 해주세요.');
      return false;
    }
    if (initialPw === '' && initialPw == '비밀번호') {
      alert('비밀번호를 입력해주세요.');
      return false;   
    } 
    if (!checkPw.test(initialPw)) {
      alert('비밀번호가 조건에 맞지 않습니다.');
      return false;   
    } 
    if (initialId === initialPw) {
      alert('아이디와 비밀번호는 다르게해주세요.');
      return false;
    }
    if (initialPw2 === '' && initialPw2 == '비밀번호 확인') {
      alert('비밀번호 재확인이 비었습니다.');
      return false;   
    }
    if(initialPw != initialPw2) {
      alert('비밀번호와 비밀번호 재확인이 일치하지 않습니다.');
      return false;
    } 
    if (initialName === '' || initialName == '이름') {
      alert('이름이 비었습니다.');
      return false;
    }
    if (!checkName.test(initialName)) {
      alert('이름이 형식에 맞지 않습니다.');
      return false;   
    }
    if (initialYear === '' || initialMonth === '' || initialDay === '') {
      alert('생년월일이 입력되지 않았습니다.');
      return false;
    }
    if (initialSex === '') {
      alert('성별을 체크하지 않았습니다.');
      return false;
    }
    if (initialEmail === '' && initialEmail == '예) ex@gmail.com') {
      alert('이메일이 비었습니다.');
      return false;
    }
    if (!checkEmail.test(initialEmail)) {
      alert('이메일이 형식에 맞지 않습니다.')
      return false;
    }
    return true;
  };
  return validateInput();
}

export default CheckSignUp;