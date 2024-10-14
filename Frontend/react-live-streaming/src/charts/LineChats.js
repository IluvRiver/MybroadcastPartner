import {
    LineChart,
    Line,
    BarChart, 
    Bar, 
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

const LineChats = (props) => {
    return (
        props.data.length > 1 ? 
        (
            <LineChart
                width={810}
                height={320}
                data={props.data}
                margin={{
                    top: 25,
                    right: 45,
                    left: 10,
                    bottom: -20
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#81C0FF"
                    activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="neutrality" stroke="#A2A2A2" />
                <Line type="monotone" dataKey="negative" stroke="#FF8199" />
            </LineChart>
        ) : 
        (
            <BarChart 
                width={810} 
                height={350} 
                data={props.data}
                margin={{
                    top: 25,
                    right: 45,
                    left: 10,
                    bottom: 0
                }}
                barGap={100}
                barCategoryGap={100}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" fill="#81C0FF" barSize={100}/>
                <Bar dataKey="neutrality" fill="#A2A2A2" barSize={100}/>
                <Bar dataKey="negative" fill="#FF8199" barSize={100}/>
            </BarChart>
        )
    );
}

export default LineChats;