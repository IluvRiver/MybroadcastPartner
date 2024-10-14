import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from '../ApexChart.module.css';

const ApexChart = ({ data }) => {
  const colors = ['#FFEF67', '#6CA7ED', '#FFA3A3', '#A2A2A2', '#C597E6', '#FFC362', '#EF6A6A']; //7가지 색

  const options = {
    chart: {
      id: 'realtime',
      height: 600,  
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
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
      type: 'datetime',
      labels: {
        formatter: function(val) {
          const date = new Date(val);
          return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
        }
      }
    },
    yaxis: {
      max: 1 // y축 최대값 설정
    },
    colors: colors,
    legend: {
      show: true
    }
  };

  return (
    <div id="chart">
      {data.isLoading ? (
        <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <div>Loading...</div>
      </div>
      ) : (
      <ReactApexChart style={{marginTop:'1rem'}} options={options} series={[{ name: 'angry', data: data.angrySeries },
       { name: 'happy', data: data.happySeries }, { name: 'sad', data: data.sadSeries },{ name: 'surprise', data: data.surpriseSeries },
       { name: 'neutral', data: data.neutralSeries },{ name: 'fear', data: data.fearSeries },{ name: 'disgust', data: data.disgustSeries }]} 
        type="line" height={600} />
      )}
    </div>
  );
};

export default ApexChart;
