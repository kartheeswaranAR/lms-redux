import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import StudentDashboard from "./pages/StudentDashboard";
import { useSelector } from "react-redux";

const App = () => {
  const { role } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {role === "admin" && <Route path="/admin" element={<AdminPanel />} />}
        {role === "student" && <Route path="/student-dashboard" element={<StudentDashboard />} />}
      </Routes>
    </Router>
  );
};

export default App;
