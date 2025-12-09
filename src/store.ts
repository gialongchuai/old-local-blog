import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./pages/blog/blog.slice";

export const store = configureStore({
    reducer: {
        blog: blogReducer
    }
})

// Các dòng dưới phục vụ cho ts
// Lấy RootState và Appdispacth từ store
export type RootState = ReturnType<typeof store.getState>;

export type Appdispacth = typeof store.dispatch; 