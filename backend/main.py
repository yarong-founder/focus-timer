import json
from flask import Flask, request
from flask_cors import CORS
from datetime import datetime, timedelta
from collections import defaultdict
import os

app = Flask(__name__)
CORS(app)
DATA_FILE = os.environ.get("DATA_FILE", "data.json")

def load_data():
    if not os.path.exists(DATA_FILE):
        return {
            "subjects": [],
            "sessions": [],
            "next_subject_id": 1,
            "next_session_id": 1
        }

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

@app.get("/")
def home ():
    return {"status":"ok"}

@app.get("/subjects")
def get_subjects():
    data = load_data()
    return data["subjects"]

@app.post("/subjects")
def create_subjects():
    data = load_data()
    request_data = request.get_json()
    subject_name = request_data["name"].strip()

    new_subject = {
        "id" : data["next_subject_id"],
        "name" : subject_name
    }

    data["subjects"].append(new_subject)
    data["next_subject_id"] += 1
    save_data(data)

    return new_subject, 201

@app.post("/sessions")
def create_sessions():
    data = load_data()
    request_data = request.get_json()

    new_session = {
        "id": data["next_session_id"],
        "subject_id": request_data["subject_id"],
        "duration": request_data["duration"],
        "created_at": datetime.now().isoformat(timespec="seconds")
    }

    data["sessions"].append(new_session)
    data["next_session_id"] +=1
    save_data(data)

    return new_session, 201

@app.get("/sessions")
def get_sessions():
    data = load_data()
    subject_id = request.args.get("subject_id", type=int)
    selected_range = request.args.get("range","all")
    sessions_with_names = []

    now= datetime.now()

    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    for session in data ["sessions"]:
        if subject_id is not None and session["subject_id"] != subject_id:
            continue

        session_date = datetime.fromisoformat(session["created_at"])
        
        if selected_range == "week" and session_date < start_of_week:
            continue

        if selected_range == "month":
            is_same_year = session_date.year == now.year
            is_same_month = session_date.month == now.month

            if not (is_same_year and is_same_month):
                continue

        subject_name = "Unknown subject"

        for subject in data ["subjects"]:
            if subject["id"] == session ["subject_id"]:
                subject_name = subject["name"]
                break

        session_with_name = session.copy()
        session_with_name["subject_name"] = subject_name
        sessions_with_names.append(session_with_name)

    return sessions_with_names

@app.delete("/sessions/<int:session_id>")
def delete_session(session_id):
    data = load_data()

    for session in data["sessions"]:
        if session["id"] == session_id:
            data["sessions"].remove(session)
            save_data(data)
            return {"success": True}

    return{
        "success" : False,
        "message" : "No record found"
    }, 404

@app.delete ("/subjects/<int:subject_id>")
def delete_subject(subject_id):
    data = load_data()

    for subject in data["subjects"]:
        if subject["id"] == subject_id:
            data["subjects"].remove(subject)
            save_data(data)
            return {"success": True}

    return{
        "success":False ,
        "message": "No subject found"
    }, 404


@app.get("/stats")
def get_stats():
    data=load_data()

    total_minutes = 0

    now=datetime.now()

    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    sessions_this_week = 0
    minutes_by_subject = defaultdict(int)

    weekday_names = [
        "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
    ]

    minutes_by_weekday = defaultdict(int)

    focus_dates = set()

    for session in data["sessions"]:
        total_minutes += session["duration"]
        session_date = datetime.fromisoformat(session["created_at"])
        minutes_by_subject[session["subject_id"]] += session["duration"]
        weekday = weekday_names[session_date.weekday()]
        minutes_by_weekday[weekday] += session["duration"]
        focus_dates.add(session_date.date())

        if session_date >= start_of_week:
            sessions_this_week += 1

    streak = 0
    day_to_check = now.date()

    while day_to_check in focus_dates:
        streak += 1
        day_to_check -= timedelta(days=1)

    by_subject= []

    for subject in data["subjects"]:
        by_subject.append({
        "name": subject["name"],
        "minutes": minutes_by_subject[subject["id"]],
    })

    by_weekday = {}

    for day in weekday_names:
        by_weekday[day] = minutes_by_weekday[day]

    return {
        "total_hours": total_minutes / 60 ,
        "sessions_this_week" : sessions_this_week ,
        "by_subject" : by_subject ,
        "by_weekday": by_weekday ,
        "streak": streak ,
    }

if __name__ == "__main__" :
    app.run(debug=True)
