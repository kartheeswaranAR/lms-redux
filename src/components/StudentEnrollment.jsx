import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerStudent } from "../redux/studentsSlice";
import "../styles/StudentEnrollment.css";  // Import CSS file

const StudentEnrollment = () => {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const dispatch = useDispatch();

  const handleRegister = () => {
    if (studentName && studentId) {
      dispatch(registerStudent({ id: studentId, name: studentName }));
      setStudentName("");
      setStudentId("");
    }
  };

  return (
    <div className="student-enrollment">
      <h3>Register Student</h3>
      <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
      <button onClick={handleRegister}>Enroll</button>
    </div>
  );
};

export default StudentEnrollment;
