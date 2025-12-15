import { createSlice } from "@reduxjs/toolkit";

interface BlogState {}

const initialState: BlogState = {
  postId: "",
};

const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {},
});

const blogReducer = blogSlice.reducer;

export default blogReducer;
