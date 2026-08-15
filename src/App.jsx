import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import TimerPage from "./pages/TimerPage";
import HistoryPage from "./pages/HistoryPage";
import DashboardPage from "./pages/DashboardPage";
import NavigationBar from './components/NavigationBar';
import "./App.css";

function App() {
  return (
    <Router>
      <NavigationBar />
        <Routes>
            <Route path="/" element={<TimerPage />} />
            <Route path="/History" element={<HistoryPage />} />
            <Route path="/Dashboard" element={<DashboardPage />} />
        </Routes>
    </Router>
  );
}

export default App
