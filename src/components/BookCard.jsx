import React from "react";
import "../styles/BookCard.css";

const BookCard = ({ book, onBorrow, onPreview }) => {
  return (
    <div className="book-card">
      <img 
        src={book.cover || "https://via.placeholder.com/100x140"} 
        alt={book.title} 
        className="book-cover"
        onClick={onPreview}
      />
      <h4>{book.title}</h4>
      <p>By: {book.author}</p>
      <p>Available: {book.availableCopies}</p>
      <button 
        className="borrow-btn" 
        onClick={onBorrow} 
        disabled={book.availableCopies === 0}
      >
        {book.availableCopies > 0 ? "Borrow" : "Out of Stock"}
      </button>
    </div>
  );
};


export default BookCard;
