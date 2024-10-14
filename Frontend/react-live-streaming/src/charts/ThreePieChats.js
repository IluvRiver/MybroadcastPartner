import {
    PieChart,
    Pie,
    Legend,
    Cell,
    ResponsiveContainer,
    Label
  } from "recharts";
  
  const COLORS = ['#FF2424', '#A2A2A2', '#6CA7ED'];
  
  const Bullet = ({ backgroundColor, size }) => {
    return (
      <div
        className="CirecleBullet"
        style={{
          display: "flex",
          backgroundColor,
          width: size,
          height: size,
          marginTop: "0.3rem",
          borderRadius: "50px"
        }}
      ></div>
    );
  };
  
  const CustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="LegendList" 
      style={{ marginBottom: "8.9rem", marginLeft: "-0.5rem"}}>
        {payload.map((entry, index) => (
          
          <li key={`item-${index}`} style={{
            width: "280px",
            display: "flex",
            // borderTop: '1px solid #ccc',    // 위쪽 경계선 추가
            //   borderBottom: '1px solid #ccc', // 아래쪽 경계선 추가
          }}>
            <div className="BulletLabel">
              <Bullet backgroundColor={entry.payload.fill} size="10px"/>
              <div className="BulletLabelText" style={{position: "absolute", marginLeft: "1.0rem", marginTop: "-0.95rem", fontSize: "13px"}}>{entry.value}</div>
            </div>
            <div style={{ display: "flex", marginLeft: "12.5rem", fontSize: "13px"}}> {entry.payload.value}</div>
          </li>
        ))}
      </ul>
    );
  };
  
  const CustomLabel = ({ viewBox, labelText, value }) => {
    const { cx, cy } = viewBox;
    return (
      <g>
        <text
          x={cx}
          y={cy}
          className="recharts-text recharts-label"
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="middle"
          fontSize="15"
        >
          {labelText}
        </text>
        <text
          x={cx}
          y={cy + 20}
          className="recharts-text recharts-label"
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="middle"
          fill="#0088FE"
          fontSize="26"
          fontWeight="600"
        >
          {value}
        </text>
      </g>
    );
  };
  
  const ThreePieChats = (props) => {
    return (
      <div style={{ width: "100vw", height: 420 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={props.data}
              dataKey="value"
              cx={140}
              cy={100}
              innerRadius={80}
              outerRadius={100}
            >
              {props.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={<CustomLabel labelText="Emotion" value={3} />}
                position="center"
              />
            </Pie>
            <Legend content={<CustomizedLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  export default ThreePieChats;