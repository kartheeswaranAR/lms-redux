import { createSlice } from "@reduxjs/toolkit";

const studentsSlice = createSlice({
  name: "students",
  initialState: { registeredStudents: [] },
  reducers: {
    registerStudent: (state, action) => {
      state.registeredStudents.push({
        id: action.payload.id,
        name: action.payload.name,
        dept: action.payload.dept,
        borrowedBooks: [],
      });
    },
    borrowBook: (state, action) => {
      const { studentId, book } = action.payload;
      const student = state.registeredStudents.find((s) => s.id === studentId);
      if (student) {
        student.borrowedBooks.push({
          ...book,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          renewCount: 0,
        });
      }
    },
    returnBook: (state, action) => {
      const { studentId, bookId } = action.payload;
      const student = state.registeredStudents.find((s) => s.id === studentId);
      if (student) {
        student.borrowedBooks = student.borrowedBooks.filter((b) => b.id !== bookId);
      }
    },
    renewBook: (state, action) => {
      const { studentId, bookId } = action.payload;
      const student = state.registeredStudents.find((s) => s.id === studentId);
      if (student) {
        const book = student.borrowedBooks.find((b) => b.id === bookId);
        if (book && book.renewCount < 2) {
          const newDueDate = new Date(book.dueDate);
          newDueDate.setDate(newDueDate.getDate() + 7);
          book.dueDate = newDueDate.toISOString();
          book.renewCount += 1;
        }
      }
    },
  },
});

export const { registerStudent, borrowBook, returnBook, renewBook } = studentsSlice.actions;
export default studentsSlice.reducer;
