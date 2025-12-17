import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import blogReducer from "./page/blog/blog.slice";
import { blogApi } from "./page/blog/blog.service";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { rtkQueryErrorLogger } from "./middleware";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogApi.middleware, rtkQueryErrorLogger),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type Appdispacth = typeof store.dispatch;
