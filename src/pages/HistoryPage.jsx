import { useEffect, useState } from "react";
import API_URL from "../api";

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
        <section>
            <h2>History</h2>
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
                onChange={(event)=>setSelectRange(event.target.valur)}
            >
                <option value="all">All dates</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
            </select>
            {sessions.length ===0 ? (
                <p>No sessions match the current filters.</p>
            ) : (
                <ul>
                    {sessions.map((session)=>(
                        <li key={session.id}>
                            Subject : {session.subject_name} / {session.duration} minutes / {" "} {new Date(session.created_at).toLocaleString("ko-KR")}
                            <button onClick={()=> handleDeleteSession(session.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default HistoryPage;