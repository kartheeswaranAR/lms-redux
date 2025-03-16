import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { renewBook } from "../redux/studentsSlice"; // Import renew action
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  const students = useSelector((state) => state.students.registeredStudents);
  const student = students.find((s) => s.id === user);

  if (role !== "student") {
    navigate("/dashboard");
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleRenewBook = (bookId) => {
    dispatch(renewBook({ studentId: user, bookId }));
    alert("Book renewed for 7 more days!");
  };

  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>
      <h3>Welcome, {student?.name} (ID: {user})</h3>

      <h3>Your Borrowed Books</h3>
      {student?.borrowedBooks.length > 0 ? (
        <table className="borrowed-books-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {student.borrowedBooks.map((book) => (
              <tr key={book.id}>
                <td>
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className="book-cover" />
                  ) : (
                    "No Cover"
                  )}
                </td>
                <td>{book.title}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>
                  <button className="renew-btn" onClick={() => handleRenewBook(book.id)}>
                    Renew
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books borrowed</p>
      )}

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default StudentDashboard;
