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
    startEditingPost: (state, action: PayloadAction<string>) => { // kiểm tra đang trạng thái edit
      state.postId = action.payload;
    },
    resetEditingPost: (state, ation: PayloadAction<void>) => {
      state.postId = "";
    }
  },
});

export const { startEditingPost, resetEditingPost} = blogSlice.actions;

const blogReducer = blogSlice.reducer;

export default blogReducer;
