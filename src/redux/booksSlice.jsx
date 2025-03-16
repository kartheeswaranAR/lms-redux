import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch books from Open Library API
export const fetchBooks = createAsyncThunk("books/fetchBooks", async (query = "javascript") => {
  const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=50`);
  return response.data.docs.map((book) => ({
    id: book.key,
    title: book.title,
    author: book.author_name ? book.author_name[0] : "Unknown",
    availableCopies: Math.floor(Math.random() * 10) + 1, // Simulating stock count
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
    returnBook: (state, action) => {
      state.rentedBooks = state.rentedBooks.filter((b) => b.id !== action.payload);
      const originalBook = state.list.find((b) => b.id === action.payload);
      if (originalBook) originalBook.availableCopies += 1;
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

export const { rentBook, returnBook } = booksSlice.actions;
export default booksSlice.reducer;
