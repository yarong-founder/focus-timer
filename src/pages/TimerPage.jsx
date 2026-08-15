import { useEffect, useState } from "react";
import API_URL from "../api";
import "./TimerPage.css";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const TIMER_STORAGE_KEY = "focus-timer";

function TimerPage() {
    const[subjects, setSubjects] = useState([]);
    const[newSubjectName, setNewSubjectName] = useState("");
    const[selectSubjectId, setselectSubjectId] = useState("");
    const[remainingSeconds, setremainingSeconds] = useState(FOCUS_SECONDS);
    const[isRunning, setisRunning] = useState(false);
    const[mode, setMode] = useState("focus");
    const[isTimerLoaded, setIsTimerLoaded] = useState(false);

    const getSubjects = async () => {
        const response = await fetch (`${API_URL}/subjects`);
        const data = await response.json();
        setSubjects(data);
    }

    async function handleSubjectSubmit (event) {
        event.preventDefault();

        const response = await fetch (`${API_URL}/subjects`, {
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name: newSubjectName
            })
        });

        const newSubject = await response.json();

        setSubjects((currentSubjects)=>[
            ...currentSubjects,
            newSubject
        ]);

        setNewSubjectName("");
    } 

    async function handleDeleteSubject(subjectId) {
        const response = await fetch(
            `${API_URL}/subjects/${subjectId}`,
            {method: "DELETE"}
        );

        const result =await response.json();

        if (result.success) {
            setSubjects((currentSubjects)=>
                currentSubjects.filter(
                    (subject) => subject.id !== subjectId
                )
            );

            if (Number(selectSubjectId)===subjectId) {
                setselectSubjectId("");
                setisRunning(false);
            }
        } else {
            alert(result.message);
        }
    }

    useEffect(() =>{
        getSubjects();
    },[])

    useEffect(()=>{
        if(!isRunning){
            return;
        }
        
        const intervalId = setInterval(()=>{
            setremainingSeconds((currentSeconds)=>Math.max(currentSeconds-1,0));
        },1000);

        return()=>{
            clearInterval(intervalId);
        };
    },[isRunning])

    useEffect(()=>{
        if((remainingSeconds)!== 0){
            return;
        }

        if (mode === "focus") {
            const completeFocusSession = async () => {
                const response = await fetch(`${API_URL}/sessions`,{
                    method:"POST",
                    headers:{
                        "Content-type":"application/json",
                    },
                    body: JSON.stringify({
                        subject_id:Number(selectSubjectId),
                        duration: FOCUS_SECONDS/60
                    })
                })
            
                await response.json();
                alert("Focus session complete! Break time starts now.")

                setMode("break");
                setremainingSeconds(BREAK_SECONDS);
                setisRunning(true)
            }
        
            completeFocusSession();
            return;
        }
        setMode("focus");
        setremainingSeconds(FOCUS_SECONDS);
        setisRunning(false);
        
    },[remainingSeconds,mode,selectSubjectId]);

    useEffect(()=>{
        const savedTimer = localStorage.getItem(TIMER_STORAGE_KEY);

        if(savedTimer !== null) {
            const timerData = JSON.parse(savedTimer);

            setremainingSeconds(timerData.remainingSeconds);
            setisRunning(timerData.isRunning);
            setMode(timerData.mode);
            setselectSubjectId(timerData.selectSubjectId);
        }
        setIsTimerLoaded(true);
    }, [])

    useEffect(()=>{
        if (!isTimerLoaded) {
            return;
        }

        const timerData={remainingSeconds, isRunning, mode, selectSubjectId};

        localStorage.setItem(
            TIMER_STORAGE_KEY,
            JSON.stringify(timerData)
        );
    }, [isTimerLoaded, remainingSeconds, isRunning, mode, selectSubjectId]);

    function handleReset(){
        setisRunning(false);
        setMode("focus");
        setremainingSeconds(FOCUS_SECONDS);
    }

    const minutes = String(Math.floor(remainingSeconds/60)).padStart(2,"0");
    const seconds = String(remainingSeconds%60).padStart(2,"0");
    const totalSeconds =
        mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS ;
    
    const progressPercent =
        ((totalSeconds-remainingSeconds)/totalSeconds)*100;

    return (
        <section className="timer-page">
            <h2>Timer</h2>
            
            <div
              className={`timer-page__circle timer-page__circle--${mode}`}
              style={{ "--progress": `${progressPercent * 3.6}deg` }}
            >
                <div className="timer-page__circle-center">
                    <p className="timer-page__time">
                        {minutes}:{seconds}
                    </p>
                    <p className={`timer-page__mode timer-page__mode--${mode}`}>
                        {mode === "focus" ? "Focus Session" : "Break Time"}
                    </p>
                </div>
                
            </div>
            <button
                onClick={()=> setisRunning((currentState)=>!currentState)}
                disabled={!selectSubjectId}
            >
                {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={handleReset}>Reset</button>
            <form onSubmit={handleSubjectSubmit}>
                <input
                    value={newSubjectName}
                    onChange={(event)=> setNewSubjectName(event.target.value)}
                    placeholder="Please add subject"
                    required
                />
                <button>Add</button>
            </form>

            <label htmlFor="subject-select">
                Subject
            </label>

            <select
                id="subject-select"
                value={selectSubjectId}
                onChange={(event)=> setselectSubjectId(event.target.value)}
                disabled={isRunning || remainingSeconds !== FOCUS_SECONDS}
            >
                <option value="">Choose a Subject</option>

                {subjects.map((subject)=>(
                    <option 
                        key={(subject.id)}
                        value={(subject.id)}
                    >
                        {subject.name}
                    </option>
                ))}
            </select>
            {subjects.length ===0?(
                <p>주제를 입력해주세요.</p>
            ):(
                <ul>
                    {subjects.map((subject)=>(
                        <li key={subject.id}>
                            {subject.name}
                            <button
                                type="button"
                                onClick={()=>handleDeleteSubject(subject.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default TimerPage;