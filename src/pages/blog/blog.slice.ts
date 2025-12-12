import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Post } from "../../types/blog.type";
import http from "../../utils/http";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

interface BlogState {
  postList: Post[];
  editingPost: Post | null; // lưu ý rằng 1 xẹt là nhận 1 trong 2 thì ok
  // còn 2 xẹt thì tìm falsely
  loading: boolean;
  currentRequestId: undefined | string;
}

const initialState: BlogState = {
  postList: [], // hiển thị danh sách các bài post lên màn hình
  editingPost: null, // kiểm tra nếu đang bấm vào edit 1 item bất kì thì hiển thị post đó lên form
  loading: false, // kiểm tra trạng thái khi gọi api để hiển thị Skeleton
  currentRequestId: undefined, // cái này kiểm tra việc click nhiều lần nếu người dùng gọi api cho 3 trạng thái với createThunkApi
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
    try {
      const response = await http.post<Post>("posts", body, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_BAD_REQUEST" && error.name === "AxiosError") {
        return thunkApi.rejectWithValue(error.response.data);
      }
      throw error;
    }
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

export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async (body: Post, thunkAPI) => {
    try {
      const idPost = body.id;
      const response = await http.put<Post>(`posts/${idPost}`, body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_BAD_REQUEST" && error.name === "AxiosError") {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const editingPost = createAsyncThunk(
  "blog/editingPost",
  async (idPost: string, thunkAPI) => {
    const response = await http.get<Post>(`posts/${idPost}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    cancelEditingPost: (state) => {
      state.editingPost = null;
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
        // const idPost = action.payload.id; // trời ơi delete thành công trả {} : 200
        // vầy là đói vì là undefined
        // vẫn xóa thành công post nhưng mà không reset state gì cả

        const idPost = action.meta.arg; // lấy id như này thành công nè!!
        const foundIdPost = state.postList.findIndex(
          (post) => post.id === idPost
        );
        if (foundIdPost !== -1) {
          state.postList.splice(foundIdPost, 1);
          state.editingPost = null; // ví dụ bấm vào edit sao đó
          // post hiện lên form mà lúc này bấm vào delete -> clear form
        }
      })
      .addCase(editingPost.fulfilled, (state, action) => {
        const idPost = action.payload.id;
        const foundPost =
          state.postList.find((post) => post.id === idPost) || null;
        state.editingPost = foundPost;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idPost = action.payload.id;
        state.postList.find((post, index) => {
          if (post.id === idPost) {
            state.postList[index] = action.payload;
            state.editingPost = null; // thêm để khi update xong reload lại form hiện publish post
            return true;
          }
          return false;
        });
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.loading = true;

          // nghe nói đâu mỗi lần request 1 cái thì action này có id trả về
          // không thể nào trung cái này được
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      );
  },
  // extraReducers : có thể tim hiểu cho addMatcher và defaultmathc gì gì đó.
  // hình như là nó có builder như useReduce nhưng nó không gợi ý action hay sao đó
  // lên doc đọc thêm nha :()
});

export const { cancelEditingPost } = blogSlice.actions;

const blogReducer = blogSlice.reducer;
export default blogReducer;
