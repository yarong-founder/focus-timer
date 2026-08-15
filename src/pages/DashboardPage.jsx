import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API_URL from "../api";

function DashboardPage() {
    const [stats,setStats] = useState(null);

    const getStats = async()=> {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();

        setStats(data);
    }

    useEffect(()=>{
        getStats();
    }, [])

    if (stats === null) {
        return <h2>Loading...</h2>;
    }

    const weekdayOrder = [
        "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
    ]

    const weekdayChartData = weekdayOrder.map((day) => ({
            name: day,
            minutes: stats.by_weekday[day],
        })
    );

    return (
        <section>
            <h2>Dashboard</h2>
            <p>Current Streak: {stats.streak} days</p>
            <p>Total Focus Time: {stats.total_hours.toFixed(1)} hours</p>
            <p>Sessions this week: {stats.sessions_this_week}</p>
            <h3> Focus time by Subject</h3>
            <div style={{width: "50%", height: 300}}>
                <ResponsiveContainer>
                    <BarChart data={stats.by_subject}>
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="minutes" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <h3> Weekly Focus Pattern</h3>
            <div style={{width: "50%", height: 300}}>
                <ResponsiveContainer>
                    <BarChart data={weekdayChartData}>
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="minutes" fill="#ec4899"/> 
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
        
    );
}

export default DashboardPage;