import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import API_URL from "../api";
import "./DashboardPage.css";

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
        <section className="dashboard-page">
            <h2>Dashboard</h2>
            <div className="dashboard-page__summary">
                <div className="dashboard-page__stat">
                  <span>Current Streak</span>
                  <strong>{stats.streak} days</strong>
                </div>

                <div className="dashboard-page__stat">
                  <span>Total Focus Time</span>
                  <strong>{stats.total_hours.toFixed(1)} h</strong>
                </div>

                <div className="dashboard-page__stat">
                  <span>Sessions This Week</span>
                  <strong>{stats.sessions_this_week}</strong>
                </div>
            </div>
            <h3> Focus time by Subject</h3>
            <div className="dashboard-page__chart">
                <ResponsiveContainer>
                    <BarChart
                      data={stats.by_subject}
                      margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="rgba(60, 60, 67, 0.12)"
                      />

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#636366", fontSize: 14 }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#636366", fontSize: 14 }}
                      />

                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toFixed(1)} min`,
                          "Focus Time",
                        ]}
                        cursor={{ fill: "rgba(10, 132, 255, 0.08)" }}
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.88)",
                          border: "1px solid rgba(60, 60, 67, 0.12)",
                          borderRadius: "8px",
                          boxShadow: "0 10px 24px rgba(42, 58, 74, 0.14)",
                        }}
                      />

                      <Bar
                        dataKey="minutes"
                        fill="#0a84ff"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <h3> Weekly Focus Pattern</h3>
            <div className="dashboard-page__chart">
                <ResponsiveContainer>
                    <BarChart
                      data={weekdayChartData}
                      margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="rgba(60, 60, 67, 0.12)"
                      />
                    
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#636366", fontSize: 12 }}
                      />
                    
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#636366", fontSize: 12 }}
                      />
                    
                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toFixed(1)} min`,
                          "Focus Time",
                        ]}
                        cursor={{ fill: "rgba(10, 132, 255, 0.08)" }}
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.88)",
                          border: "1px solid rgba(60, 60, 67, 0.12)",
                          borderRadius: "8px",
                          boxShadow: "0 10px 24px rgba(42, 58, 74, 0.14)",
                        }}
                      />
                    
                      <Bar
                        dataKey="minutes"
                        fill="#0a84ff"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
        
    );
}

export default DashboardPage;