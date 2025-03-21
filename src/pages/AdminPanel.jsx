import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerStudent, borrowBook, renewBook } from "../redux/studentsSlice";
import { logout } from "../redux/authSlice";
import { addBook, updateBook, deleteBook } from "../redux/booksSlice";
import "../styles/AdminPanel.css";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const students = useSelector((state) => state.students.registeredStudents);
  const books = useSelector((state) => state.books.list);
  const { user, role } = useSelector((state) => state.auth);

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentDept, setStudentDept] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [selectedBook, setSelectedBook] = useState("");  
  const [newBook, setNewBook] = useState({ title: "", author: "", availableCopies: "", cover: "" });
  const [editingBook, setEditingBook] = useState(null); 

  if (role !== "admin") {
    navigate("/dashboard");
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleRegisterStudent = () => {
    if (studentName && studentId) {
      dispatch(registerStudent({ id: studentId, name: studentName, dept: studentDept }));
      setStudentName("");
      setStudentId("");
      setStudentDept("");
    }
  };

  // const handleAddBook = () => {
  //   if (newBook.title && newBook.author && newBook.availableCopies) {
  //     dispatch(addBook(newBook));
  //     setNewBook({ title: "", author: "", availableCopies: "", cover: "" });
  //   }
  // };

  // const handleUpdateBook = () => {
  //   if (editingBook && editingBook.title && editingBook.author && editingBook.availableCopies) {
  //     dispatch(updateBook(editingBook));
  //     setEditingBook(null);
  //   }
  // };

  // const handleDeleteBook = (bookId) => {
  //   dispatch(deleteBook(bookId));
  // };
  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.availableCopies) {
      alert("Please fill all book details.");
      return;
    }
    dispatch(addBook({ id: Date.now().toString(), ...newBook }));
    setNewBook({ title: "", author: "", availableCopies: "", cover: "" });
  };


  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook(book);
  };


  const handleUpdateBook = () => {
    if (!newBook.title || !newBook.author || !newBook.availableCopies) {
      alert("Please fill all book details.");
      return;
    }
    dispatch(updateBook(newBook));
    setEditingBook(null);
    setNewBook({ title: "", author: "", availableCopies: "", cover: "" });
  };


  const handleDeleteBook = (bookId) => {
    dispatch(deleteBook(bookId));
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
        
        <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        <input type="text" placeholder="Student Department" value={studentDept} onChange={(e) => setStudentDept(e.target.value)} />
        <br />
        <button className="register-btn" onClick={handleRegisterStudent}>Register</button>
      </div>

    {/*add the book and update the book */}
      <h3>{editingBook ? "Edit Book" : "Add New Book"}</h3>
      <div className="book-form">
        <input type="text" placeholder="Book Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
        <input type="text" placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
        <input type="number" placeholder="Available Copies" value={newBook.availableCopies} onChange={(e) => setNewBook({ ...newBook, availableCopies: e.target.value })} />
        <input type="text" placeholder="Cover Image URL" value={newBook.cover} onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })} />
        {editingBook ? (
          <button className="update-btn" onClick={handleUpdateBook}>Update Book</button>
        ) : (
          <button className="add-btn" onClick={handleAddBook}>Add Book</button>
        )}
      </div>

      <h3>Library Books</h3>
      <table className="book-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Available Copies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                {book.cover ? <img src={book.cover} alt={book.title} className="book-cover" /> : "No Cover"}
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.availableCopies}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditBook(book)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


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
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Student Department</th>
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
                      <td rowSpan={student.borrowedBooks.length}>{student.id}</td>
                      <td rowSpan={student.borrowedBooks.length}>{student.name}</td>
                      <td rowSpan={student.borrowedBooks.length}>{student.dept}</td>
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
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.dept}</td>
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
