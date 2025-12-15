import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: "",
};

const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    }
  },
});

export const { startEditingPost} = blogSlice.actions;

const blogReducer = blogSlice.reducer;

export default blogReducer;
