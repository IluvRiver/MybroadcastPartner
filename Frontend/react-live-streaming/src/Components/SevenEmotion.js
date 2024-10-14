import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
);

function SevenEmoticon({ data }) {
// 감정명 크기
const emotionStyle = {fontSize: '.5rem'};
// 7가지 감정
const emotions = ['Nervous', 'Embrrassed', 'Angry', 'Sadness', 'Neutral', 
                  'Happiness','Disgust'];
// uv는 차트 초깃값
const initialData = emotions.map(emotion => ({ name: emotion , uv: 0 , style: emotionStyle }));
const [chartData, setChartData] = useState(initialData); 
  useEffect(() => {
    const emotionCounts = {
      Nervous: data.filter((message) => message.emotion7 === 0).length,
      Embrrassed: data.filter((message) => message.emotion7 === 1).length,
      Angry: data.filter((message) => message.emotion7 === 2).length,
      Sadness: data.filter((message) => message.emotion7 === 3).length,
      Neutral :data.filter((message) => message.emotion7 === 4).length ,
      Happiness:data.filter((message) => message.emotion7 ===5 ).length ,
      Disgust :data.filter((message) => message.emotion7 ===6 ).length
    }

    setChartData(prevData =>
       prevData.map(item =>
         ({...item , uv : emotionCounts[item.name]}))
     ); 
}, [data]);

 const chartOptions = {
   responsive:true 
 };

 const barChartData ={
   labels : emotions, // 각각의 감정을 라벨로 설정합니다.
   datasets:[
     {
       label:'Count of Emotions',
       data : chartData.map(item=>item.uv), // 업데이트된 차트 데이터 사용
       backgroundColor: [
      '#FFEF67',
      '#6CA7ED',
      '#FFA3A3',
      '#A2A2A2',
      '#C597E6',
      '#FFC362',
      '#EF6A6A'
       ]
     }
   ]
 };

 return (
   <Bar options={chartOptions} data={barChartData}/>
 );
}

export default SevenEmoticon;