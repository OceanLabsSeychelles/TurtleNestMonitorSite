import { configureStore } from "@reduxjs/toolkit";
import todoSlide from "./features/todoSlice";

export default configureStore({
  reducer: {
    todo: todoSlide
  }
});
