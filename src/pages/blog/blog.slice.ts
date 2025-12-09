import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../types/blog.type";
import http from "../../utils/http";

interface BlogState {
  postList: Post[];
  editingPost: Post | null; // lưu ý rằng 1 xẹt là nhận 1 trong 2 thì ok
  // còn 2 xẹt thì tìm falsely
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
};

export const getPostList = createAsyncThunk(
  "blog/getPostList",
  async (_, thunkAPI) => {
    // signal giống bên kia là loại bỏ cái abort của React Trict Mode hay gì đó :vv
    // bên kia nhớ hứng promise rồi abort nha!
    const response = await http.get<Post[]>("posts", {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const addPost = createAsyncThunk(
  "blog/addPost",
  async (body: Post, thunkApi) => {
    const response = await http.post<Post>("posts", body, {
      signal: thunkApi.signal,
    });
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (idPost: string, thunkAPI) => {
    const response = await http.delete<Post>(`posts/${idPost}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

// export const editingPost = createAsyncThunk(
//   "blog/editingPost",
//   async (idPost: string, thunkAPI) => {
//     const response = 
//   }
// );

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    editingPost: (state, action: PayloadAction<string>) => {
      const idPost = action.payload;
      const foundPost =
        state.postList.find((post) => post.id === idPost) || null;
      state.editingPost = foundPost;
    },
    cacelEditingPost: (state) => {
      state.editingPost = null;
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const idPost = action.payload.id;
      state.postList.some((post, index) => {
        if (post.id === idPost) {
          state.postList[index] = action.payload;
          state.editingPost = null;
          return true;
        }
        return false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const idPost = action.payload.id;
        const foundIdPost = state.postList.findIndex(
          (post) => post.id === idPost
        );
        if (foundIdPost !== -1) {
          state.postList.splice(foundIdPost, 1);
        }
      });
  },
  // extraReducers : có thể tim hiểu cho addMatcher và defaultmathc gì gì đó.
  // hình như là nó có builder như useReduce nhưng nó không gợi ý action hay sao đó
  // lên doc đọc thêm nha :()
});

export const { cacelEditingPost, editingPost, updatePost } = blogSlice.actions;

const blogReducer = blogSlice.reducer;
export default blogReducer;

// export const addPost = createAction<Post>("blog/addPost");
// export const deletePost = createAction<string>("blog/deletePost");
// export const editingPost = createAction<string>("blog/editingPost");
// export const cacelEditingPost = createAction("blog/cacelEditingPost");
// export const updatePost = createAction<Post>("blog/updatePost");

// const blogReducer = createReducer(initialState, (builder) => {
//   // Immutable an toàn nhờ Immer. Hình như là không ...pre nó vẫn hiểu
//   builder
//     .addCase(addPost, (state, action) => {
//       const post = action.payload;
//       state.postList.push(post);
//     })
//     .addCase(deletePost, (state, action) => {
//       const idPost = action.payload;
//       const foundIdPost = state.postList.findIndex(
//         (post) => post.id === idPost
//       );
//       if (foundIdPost !== -1) {
//         // ảo thật để if(foud..) là bị lỗi không xóa được item số 1
//         state.postList.splice(foundIdPost, 1);
//       }
//     })
//     .addCase(editingPost, (state, action) => {
//       const idPost = action.payload;
//       const foundPost =
//         state.postList.find((post) => post.id === idPost) || null;
//       state.editingPost = foundPost;
//     })
//     .addCase(cacelEditingPost, (state) => {
//       state.editingPost = null;
//     })
//     .addCase(updatePost, (state, action) => {
//         const idPost = action.payload.id;
//         state.postList.some((post, index) => {
//             if(post.id === idPost) {
//                 state.postList[index] = action.payload;
//                 return true;
//             }
//             return false;
//         })
//     })
// });

// export default blogReducer;
