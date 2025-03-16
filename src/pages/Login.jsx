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
      // Ensure the student is registered
      const studentExists = students.some((student) => student.id === studentId);
      if (!studentExists) {
        alert("Student ID not found! Please ask the admin to register you.");
        return;
      }
      dispatch(login({ user: studentId, role: "student" }));
      navigate("/student-dashboard");
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="user">User</option>
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

// In the above code, we have created a Login component that allows users to select their role (student, user, or admin) and enter their student ID (if they are a student). Upon clicking the Login button, the user is redirected to the appropriate dashboard based on their role. The student ID is validated against the list of registered students before allowing the user to log in as a student.