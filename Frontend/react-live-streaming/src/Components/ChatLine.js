import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ChatLine = ({ timeCategories, previousData }) => {
  const emotions = ['Nervous', 'Embarrassed', 'Angry', 'Sadness', 'Neutral', 'Happiness', 'Disgust']; //7가지 감정
  const colors = ['#FFEF67', '#6CA7ED', '#FFA3A3', '#A2A2A2', '#C597E6', '#FFC362', '#EF6A6A']; //7가지 색

  const options = {
    chart: {
      id: 'realtime',
      height: 400,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1500
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: '7 Types Of Facial Emotion Analysis',
      align: 'left'
    },
    markers: {
      size: 0
    },
    xaxis: {
      categories: timeCategories, // 시간대 카테고리 설정
    },
    yaxis: {
      max: 1 // y축 최대값 설정
    },
    colors: colors,
    legend: {
      show: true
    }
  };

  // 시리즈 데이터 배열 생성
  const seriesData = emotions.map((emotion) => {
    return {
      name: emotion,
      data: previousData.map(data => data[emotion] || 0),
    };
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={seriesData}
        type="line"
        height={330}
        width={680}
        />
    </div>
  );
};

export default ChatLine;