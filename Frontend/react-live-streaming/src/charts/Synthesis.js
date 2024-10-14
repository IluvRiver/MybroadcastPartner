import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import React, { useState } from 'react';

const data = [
    {
      name: "Page A",
      uv: 40,
      pv: 24,
      amt: 24
    },
    {
      name: "Page B",
      uv: 30,
      pv: 13.98,
      amt: 22.1
    },
    {
      name: "Page C",
      uv: 20,
      pv: 98,
      amt: 22.9
    },
    {
      name: "Page D",
      uv: 27.8,
      pv: 39.08,
      amt: 20
    },
    {
      name: "Page E",
      uv: 18.90,
      pv: 48,
      amt: 21.81
    },
    {
      name: "Page F",
      uv: 23.90,
      pv: 38,
      amt: 25
    },
    {
      name: "Page G",
      uv: 34.90,
      pv: 43,
      amt: 21
    }
];
const data1 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 300 },
    { name: 'Group F', value: 300 },
    { name: 'Group G', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FFF0F8FF', '#FF3CB371', '#FFCD5C5C'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
};

const Synthesis = () => {
    const [inputData, setInputData] = useState([{
        idx: '',
        title: '',
        content: '',
        writer: '',
        write_date: ''
    }])

    /*// await 를 사용하기 위해 async선언
    useEffect(async() => {
        try{
        // 데이터를 받아오는 동안 시간이 소요됨으로 await 로 대기
            const res = await axios.get('/api/test')
        // 받아온 데이터로 다음 작업을 진행하기 위해 await 로 대기
        // 받아온 데이터를 map 해주어 rowData 별로 _inputData 선언
            const _inputData = await res.data.map((rowData) => ({
                idx: rowData.idx,
                title: rowData.title,
                content: rowData.content,
                writer: rowData.writer,
                write_date: rowData.write_date
            })
            )
            // 선언된 _inputData 를 최초 선언한 inputData 에 concat 으로 추가
            setInputData(inputData.concat(_inputData))
        } catch(e){
            console.error(e.message)
        }
    },[])*/

    return(
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        <Line type="monotone" dataKey="amt" stroke="#82ca9d" />
        </LineChart>
    );
}

export default Synthesis;