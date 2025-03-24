import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks , borrowBook} from "../redux/booksSlice";
import { borrowBook as borrowForStudent } from "../redux/studentsSlice";
import { logout } from "../redux/authSlice";
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector((state) => state.books.list);
  const students = useSelector((state) => state.students.registeredStudents);
  // const { user, role } = useSelector((state) => state.auth);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search State
  const [selectedBook, setSelectedBook] = useState(null);
  const [previewPages, setPreviewPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState("");

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
    if (book.availableCopies > 0) {
      dispatch(borrowBook({ bookId: book.id })); // Reduce count in Redux
      dispatch(borrowForStudent({ studentId: selectedStudent, book }));
      alert(`Book "${book.title}" borrowed by Student ID: ${selectedStudent}`);
    } else {
      alert("Book is out of stock!");
    }
  };

  const fetchBookPreview = async (book) => {
    setLoadingPreview(true);
    setError("");
    setPreviewPages([]);
    setCurrentPage(0);

    try {
      const response = await axios.get(`https://openlibrary.org/works/${book.id}.json`
        , Headers = {
          // "Access-Control-Allow-Origin": "https://cors-anywhere.herokuapp.com",
          // "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          // "Access-Control-Allow-Headers": "Content-Type, Authorization",
          // "Cross-Origin-Opener-Policy": "same-origin",
        }
      );
      if (response.status !== 200) throw new Error("Book preview not available.");

      const data = await response.json();

      if (data?.excerpts) {
        const pages = data.excerpts.map((excerpt) => excerpt.text).slice(0, 5);
        setPreviewPages(pages.length ? pages : ["Preview not available."]);
      } else if (data?.description) {
        const pages = data.description.value.split(". ").slice(0, 5);
        setPreviewPages(pages.length ? pages : ["Preview not available."]);
      } else {
        setPreviewPages(["Preview not available."]);
      }
    } catch (error) {
      setError("Failed to load preview.");
      setPreviewPages(["Preview not available."]);
    } finally {
      setLoadingPreview(false);
    }

    setSelectedBook(book);
  };



  // Filter Books Based on Search Term
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Library Dashboard</h2>
        {/* <p>Logged in as: <strong>{user} ({role})</strong></p> */}
        <p>Logged in as: <strong>Librarian </strong></p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Search Bar */}
      <h3>Search Books</h3>
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
      {/* <h3>Available Books</h3>
      <div className="book-container">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} onBorrow={() => handleBorrowBook(book)} />
        ))}
      </div> */}

<h3>Available Books</h3>
      <div className="book-container">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onBorrow={() => handleBorrowBook(book)}
              onPreview={() => fetchBookPreview(book)}
            />
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>

      {/* Book Preview Modal */}
      {selectedBook && (
        <div className="book-preview-modal" onClick={(e) => e.target.classList.contains("book-preview-modal") && setSelectedBook(null)}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setSelectedBook(null)}>&times;</span>
            <img src={selectedBook.cover || "https://via.placeholder.com/100x140"} alt={selectedBook.title} className="preview-cover" />
            <h3>{selectedBook.title}</h3>
            <p><strong>Author:</strong> {selectedBook.author}</p>

            {/* Loading Indicator */}
            {loadingPreview && <p>Loading preview...</p>}

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Page Navigation */}
            {previewPages.length > 0 && !loadingPreview && !error && (
              <>
                <p className="book-content">{previewPages[currentPage]}</p>
                <div className="page-navigation">
                  <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                  <span>Page {currentPage + 1} of {previewPages.length}</span>
                  <button disabled={currentPage === previewPages.length - 1} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
