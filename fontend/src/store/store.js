import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authManager";
import commentReducer from "./commentManager";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    comments: commentReducer,
  },
});
