import React ,{useState}from "react";
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
  const [selectedBook, setSelectedBook] = useState(null);
  const [previewPages, setPreviewPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState("");

  if (role !== "student") {
    navigate("/dashboard");
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleRenewBook = (bookId) => {
    const book = student.borrowedBooks.find((b) => b.id === bookId);
    
    if (book && book.renewCount < 2) {
      dispatch(renewBook({ studentId: user, bookId }));
      alert("Book renewed for 7 more days!");
    }
  };

  const closeModal = (e) => {
    if (e.target.classList.contains("book-preview-modal")) {
      setSelectedBook(null);
    }
  }

  const fetchBookPreview = async (book) => {
    setLoadingPreview(true);
    setError("");
    setPreviewPages([]);
    setCurrentPage(0);

    try {
      const response = await fetch(`https://openlibrary.org/works/${book.id}.json`);
      if (!response.ok) throw new Error("Book preview not available.");

      const data = await response.json();

      if (data?.excerpts) {
        const pages = data.excerpts.map((excerpt) => excerpt.text).slice(0, 5);
        setPreviewPages(pages.length ? pages : ["Preview not available."]);
      } else if (data?.description) {
        const pages = data.description.value.split(". ").slice(0, 9);
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
              <th>Renewals</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {student.borrowedBooks.map((book) => (
              <tr key={book.id}>
                <td>
                  <img
                    src={book.cover || "https://via.placeholder.com/50x70"}
                    alt={book.title}
                    className="book-cover"
                    onClick={() => fetchBookPreview(book)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td>{book.title}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>{book.renewCount} / 2</td>
                <td>
                  <button 
                    className="renew-btn" 
                    onClick={() => handleRenewBook(book.id)} 
                    disabled={book.renewCount >= 2}
                  >
                    {book.renewCount >= 2 ? "Max Renewed" : "Renew"}
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

      {/* Book Preview Modal */}
      {selectedBook && (
        <div className="book-preview-modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setSelectedBook(null)}>&times;</span>
            <img src={selectedBook.cover || "https://via.placeholder.com/100x140"} alt={selectedBook.title} className="preview-cover" />
            <h3>{selectedBook.title}</h3>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Description:</strong> {selectedBook.description || "No description available."}</p>

              {loadingPreview && <p>Loading preview...</p>}
              
              {error && <p className="error-message">{error}</p>}
        </div>
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
      )}
    </div>
  )
};

export default StudentDashboard;
