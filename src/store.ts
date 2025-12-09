import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./pages/blog/blog.slice";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        blog: blogReducer
    }
})

// Các dòng dưới phục vụ cho ts
// Lấy RootState và Appdispacth từ store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispacth = typeof store.dispatch;
export const useAppDispacth = () => useDispatch<typeof store.dispatch>();