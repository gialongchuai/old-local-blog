import { createAction, createReducer } from "@reduxjs/toolkit";
import { Post } from "../../types/blog.type";
import { initialPostList } from "../../constants/blog";

interface BlogState {
  postList: Post[];
  editingPost: Post | null; // lưu ý rằng 1 xẹt là nhận 1 trong 2 thì ok
  // còn 2 xẹt thì tìm falsely
}

const initialState: BlogState = {
  postList: initialPostList,
  editingPost: null,
};

export const addPost = createAction<Post>("blog/addPost");
export const deletePost = createAction<string>("blog/deletePost");
export const editingPost = createAction<string>("blog/editingPost");
export const cacelEditingPost = createAction("blog/cacelEditingPost");
export const updatePost = createAction<Post>("blog/updatePost");

const blogReducer = createReducer(initialState, (builder) => {
  // Immutable an toàn nhờ Immer. Hình như là không ...pre nó vẫn hiểu
  builder
    .addCase(addPost, (state, action) => {
      const post = action.payload;
      state.postList.push(post);
    })
    .addCase(deletePost, (state, action) => {
      const idPost = action.payload;
      const foundIdPost = state.postList.findIndex(
        (post) => post.id === idPost
      );
      if (foundIdPost !== -1) {
        // ảo thật để if(foud..) là bị lỗi không xóa được item số 1
        state.postList.splice(foundIdPost, 1);
      }
    })
    .addCase(editingPost, (state, action) => {
      const idPost = action.payload;
      const foundPost =
        state.postList.find((post) => post.id === idPost) || null;
      state.editingPost = foundPost;
    })
    .addCase(cacelEditingPost, (state) => {
      state.editingPost = null;
    })
    .addCase(updatePost, (state, action) => {
        const idPost = action.payload.id;
        state.postList.some((post, index) => {
            if(post.id === idPost) {
                state.postList[index] = action.payload;
                return true;
            }
            return false;
        })
    })
});

export default blogReducer;
