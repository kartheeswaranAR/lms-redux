import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerStudent, borrowBook, renewBook } from "../redux/studentsSlice";
import { logout } from "../redux/authSlice";
import "../styles/AdminPanel.css";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const students = useSelector((state) => state.students.registeredStudents);
  const books = useSelector((state) => state.books.list);
  const { user, role } = useSelector((state) => state.auth);

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [selectedBook, setSelectedBook] = useState("");  

  if (role !== "admin") {
    navigate("/dashboard");
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleRegisterStudent = () => {
    if (studentName && studentId) {
      dispatch(registerStudent({ id: studentId, name: studentName }));
      setStudentName("");
      setStudentId("");
    }
  };

  const handleBorrowBook = () => {
    if (!selectedStudent || !selectedBook) {
      alert("Please select a student and a book.");
      return;
    }
    const book = books.find((b) => b.id === selectedBook);
    if (book) {
      dispatch(borrowBook({ studentId: selectedStudent, book }));
      alert(`Book "${book.title}" borrowed by Student ID: ${selectedStudent}`);
    }
  };

  const handleRenewBook = (studentId, bookId) => {
    dispatch(renewBook({ studentId, bookId }));
    alert("Book renewed for 7 more days!");
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <h3>Welcome, {user} (Admin)</h3>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <div className="student-registration">
        <h3>Register Student</h3>
        <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <button className="register-btn" onClick={handleRegisterStudent}>Register</button>
      </div>

      <h3>Borrow Books</h3>
      <select className="select-box" onChange={(e) => setSelectedStudent(e.target.value)}>
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} (ID: {student.id})
          </option>
        ))}
      </select>

      <select className="select-box" onChange={(e) => setSelectedBook(e.target.value)}>
        <option value="">Select Book</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.title}
          </option>
        ))}
      </select>

      <button className="borrow-btn" onClick={handleBorrowBook}>Borrow Book</button>

      <h3>Registered Students & Borrowed Books</h3>
      <table className="student-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Borrowed Books</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            student.borrowedBooks.length > 0 ? (
              student.borrowedBooks.map((book, index) => (
                <tr key={`${student.id}-${book.id}-${index}`}>
                  {index === 0 && (
                    <>
                      <td rowSpan={student.borrowedBooks.length}>{student.name}</td>
                      <td rowSpan={student.borrowedBooks.length}>{student.id}</td>
                    </>
                  )}
                  <td>{book.title}</td>
                  <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                  <td>
                    <button className="renew-btn" onClick={() => handleRenewBook(student.id, book.id)}>
                      Renew
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                <td colSpan="3">No books borrowed</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
