import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./page/blog/blog.slice";

export const store = configureStore({reducer: {
    blog: blogReducer
}})

export type RootState = ReturnType<typeof store.getState>;

export type Appdispacth = typeof store.dispatch;