import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../redux/booksSlice";
import { borrowBook } from "../redux/studentsSlice";
import { logout } from "../redux/authSlice";
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector((state) => state.books.list);
  const students = useSelector((state) => state.students.registeredStudents);
  const { user, role } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Handle Borrow Book
  const handleBorrowBook = (book) => {
    if (!selectedStudent) {
      alert("Please select a student before borrowing.");
      return;
    }
    dispatch(borrowBook({ studentId: selectedStudent, book }));
    alert(`Book "${book.title}" borrowed by Student ID: ${selectedStudent}`);
  };

  // Filter Books Based on Search Term
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Library Dashboard</h2>
        <p>Logged in as: <strong>{user} ({role})</strong></p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search Books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Student Selection */}
      <select className="select-box" onChange={(e) => setSelectedStudent(e.target.value)}>
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} (ID: {student.id})
          </option>
        ))}
      </select>

      {/* Book List */}
      <h3>Available Books</h3>
      <div className="book-container">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} onBorrow={() => handleBorrowBook(book)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
