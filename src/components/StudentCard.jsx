import React from "react";
import "../styles/BookCard.css";

const BookCard = ({ book, onBorrow }) => {
  return (
    <div className="book-card">
      {book.cover && <img src={book.cover} alt={book.title} className="book-cover" />}
      <h4>{book.title}</h4>
      <p>By: {book.author}</p>
      <p>Available: {book.availableCopies}</p>
      <button className="borrow-btn" onClick={onBorrow}>Borrow</button>
    </div>
  );
};

export default BookCard;
