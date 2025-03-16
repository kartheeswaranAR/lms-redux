import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";
import studentsReducer from "./studentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    students: studentsReducer,
  },
});

export default store;