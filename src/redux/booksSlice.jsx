import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//* Fetch books from Open Library API
export const fetchBooks = createAsyncThunk("books/fetchBooks", async (query = "library") => { //? This is the action creator
  const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=100`); //! It creates the promise lifecycle for us
  return response.data.docs.map((book) => ({
    id: book.key,
    title: book.title,
    author: book.author_name ? book.author_name[0] : "Unknown",
    availableCopies: Math.floor(Math.random() * 100) + 1, // Simulating stock count
    cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
  }));
});


const booksSlice = createSlice({
  name: "books",
  initialState: { list: [], status: "idle", rentedBooks: [] },
  reducers: {
    rentBook: (state, action) => {
      const book = state.list.find((b) => b.id === action.payload);
      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;
        state.rentedBooks.push(book);
      }
    },
    addBook: (state, action) => {
      // state.list.push(action.payload);
      state.list.unshift(action.payload);
    },
    updateBook: (state, action) => {
      const { id, title, author, availableCopies, cover } = action.payload;
      const book = state.list.find((b) => b.id === id);
      if (book) {
        book.title = title;
        book.author = author;
        book.availableCopies = availableCopies;
        book.cover = cover;
      }
    },
    deleteBook: (state, action) => {
      state.list = state.list.filter((b) => b.id !== action.payload);
    },
    returnBook: (state, action) => {
      state.rentedBooks = state.rentedBooks.filter((b) => b.id !== action.payload);
      const originalBook = state.list.find((b) => b.id === action.payload);
      if (originalBook) originalBook.availableCopies += 1;
    },
      setBooks: (state, action) => {
        state.list = action.payload;
      },
      borrowBook: (state, action) => {
        const book = state.list.find((b) => b.id === action.payload.bookId);
        if (book && book.availableCopies > 0) {
          book.availableCopies -= 1; //todo: Reduce available count
        }
      },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchBooks.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addBook, updateBook, deleteBook, rentBook, returnBook ,setBooks, borrowBook} = booksSlice.actions;
export default booksSlice.reducer;