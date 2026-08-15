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
      <div className="app-shell">
        <NavigationBar />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<TimerPage />} />
            <Route path="/History" element={<HistoryPage />} />
            <Route path="/Dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <span>AI fundamentals Club - Final assignment</span>
          <span>Built by YARONG</span>
        </footer>
      </div>
    </Router>
  );
}

export default App
