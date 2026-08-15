import { useEffect, useState } from "react";
import API_URL from "../api";
import "./HistoryPage.css";

function HistoryPage() {
    const [sessions, setSessions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectSubjectId, setSelectSubjectId] = useState("");
    const [selectRange, setSelectRange] = useState("all");
    
    const getSessions = async () => {
        const response = await fetch (`${API_URL}/sessions?subject_id=${selectSubjectId}&range=${selectRange}`);
        const data = await response.json();
        setSessions(data);
    }

    const getSubjects = async () => {
        const response = await fetch (`${API_URL}/subjects`);
        const data = await response.json();
        setSubjects(data);
    }

    useEffect(()=>{
        getSessions();
    }, [selectSubjectId, selectRange])

    useEffect(()=>{
        getSubjects();
    },[])
    
    async function handleDeleteSession(sessionId) {
        const response = await fetch (
            `${API_URL}/sessions/${sessionId}`, {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if(result.success) {
            getSessions();
        } else {
            alert(result.message)
        }
    }

    return (
        <section className="history-page">
            <h2>History</h2>
            <div className="history-page__filters">
            <select
                id="subject-select"
                value={selectSubjectId}
                onChange={(event)=> setSelectSubjectId(event.target.value)}
            >
                <option value="">All subjects</option>

                {subjects.map((subject)=>(
                    <option 
                        key={(subject.id)}
                        value={(subject.id)}
                    >
                        {subject.name}
                    </option>
                ))}
            </select>
            <select
                value={selectRange}
                onChange={(event)=>setSelectRange(event.target.value)}
            >
                <option value="all">All dates</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
            </select>
            {sessions.length ===0 ? (
                <p>No sessions match the current filters.</p>
            ) : (
                <ul className="history-page__list">
                    {sessions.map((session)=>(
                        <li className="history-page__item" key={session.id}>
                            <div className="history-page__session">
                                <strong>{session.subject_name}</strong>
                                <span>
                                    {Number(session.duration).toFixed(1)} minutes ·{" "}
                                    {new Date(session.created_at).toLocaleString("ko-KR")}
                                </span>
                            </div>
                            <button 
                                className="history-page__delete-button" 
                                onClick={()=> handleDeleteSession(session.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </section>
    );
}

export default HistoryPage;