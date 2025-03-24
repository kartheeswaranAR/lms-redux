import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [role, setRole] = useState("student"); // Default to Student
  const [studentId, setStudentId] = useState(""); // Only required for students
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const students = useSelector((state) => state.students.registeredStudents);

  const handleLogin = () => {
    if (role === "student") {
      //! Ensure the student is registered
      const studentExists = students.some((student) => student.id === studentId);
      if (!studentExists) {
        alert("Student ID not found! Please ask the admin to register you.");
        return;
      }
      dispatch(login({ user: studentId, role: "student" }));
      navigate("/student/" + studentId);
    } else if (role === "admin") {
      dispatch(login({ user: "Admin", role: "admin" }));
      navigate("/admin");
    } else if (role === "user") {
      dispatch(login({ user: "User", role: "user" }));
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <h2>Library Login</h2>

      {/* Role Selection */}
      <label>Select Role:</label>
      <br />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="user">librarian</option>
        <option value="admin">Admin</option>
      </select>

      {/* Show Student ID Input Only if Student is Selected */}
      {role === "student" && (
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      )}

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;